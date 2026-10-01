// ComSoc Plugin Registry — Sistema de Módulos Externos
// Versão 1.0 | Uso: ComSocPlugin.register(config) em qualquer arquivo JS externo

(function(global) {
    'use strict';

    // ─── REGISTRY INTERNO ────────────────────────────────────────────────────
    const _registry = {};       // id → config
    const _loaded   = new Set(); // URLs já carregadas
    const _pending  = {};       // id → Promise (evita carregamento duplo)

    // ─── API PÚBLICA ─────────────────────────────────────────────────────────
    const ComSocPlugin = {

        /**
         * Registra um módulo na plataforma.
         * Chamado pelo arquivo JS externo do módulo.
         *
         * @param {Object} config
         * @param {string} config.id          - ID único do módulo (ex: 'relatorio-om')
         * @param {string} config.label        - Nome exibido na aba
         * @param {string} config.icon         - Nome do ícone Lucide (ex: 'file-bar-chart')
         * @param {string} [config.description] - Descrição curta
         * @param {string} [config.version]     - Versão do módulo (ex: '1.0.0')
         * @param {Function} config.render     - function(container, ctx) — renderiza o conteúdo
         */
        register(config) {
            if (!config || !config.id || !config.label || typeof config.render !== 'function') {
                console.error('[ComSocPlugin] Módulo inválido. Necessário: id, label, render.', config);
                return;
            }
            if (_registry[config.id]) {
                console.warn(`[ComSocPlugin] Módulo "${config.id}" já registrado. Sobrescrevendo.`);
            }
            _registry[config.id] = {
                id:          config.id,
                label:       config.label,
                icon:        config.icon         || 'puzzle',
                description: config.description  || '',
                version:     config.version      || '1.0.0',
                render:      config.render,
            };
            console.log(`[ComSocPlugin] ✅ Módulo registrado: ${config.id} v${config.version || '?'}`);

            // Notificar a aplicação principal para adicionar a aba
            if (typeof _onModuleRegistered === 'function') {
                _onModuleRegistered(_registry[config.id]);
            }
        },

        /**
         * Carrega e executa um arquivo JS externo de módulo.
         * @param {string} url - URL HTTPS do arquivo JS
         * @returns {Promise<void>}
         */
        load(url) {
            if (_loaded.has(url)) {
                return Promise.resolve();
            }
            if (_pending[url]) {
                return _pending[url];
            }

            _pending[url] = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src   = url;
                script.async = true;
                script.onload = () => {
                    _loaded.add(url);
                    delete _pending[url];
                    resolve();
                };
                script.onerror = () => {
                    delete _pending[url];
                    reject(new Error(`[ComSocPlugin] Falha ao carregar: ${url}`));
                };
                document.head.appendChild(script);
            });

            return _pending[url];
        },

        /**
         * Carrega todos os módulos de uma lista (modulos_externos da org).
         * @param {Array<{id, url, enabled}>} moduleList
         * @returns {Promise<void>}
         */
        async loadAll(moduleList) {
            if (!Array.isArray(moduleList) || moduleList.length === 0) return;
            const enabledModules = moduleList.filter(m => m.enabled !== false);
            const promises = enabledModules.map(m => {
                return ComSocPlugin.load(m.url).catch(e => {
                    console.error(`[ComSocPlugin] Erro ao carregar módulo "${m.id}":`, e.message);
                });
            });
            await Promise.allSettled(promises);
        },

        /**
         * Retorna um módulo registrado por ID.
         * @param {string} id
         * @returns {Object|null}
         */
        get(id) {
            return _registry[id] || null;
        },

        /**
         * Retorna todos os módulos registrados.
         * @returns {Object[]}
         */
        getAll() {
            return Object.values(_registry);
        },

        /**
         * Renderiza um módulo em um container HTML.
         * @param {string}      id        - ID do módulo
         * @param {HTMLElement} container - Elemento onde renderizar
         * @param {Object}      ctx       - Contexto da aplicação
         */
        render(id, container, ctx) {
            const mod = _registry[id];
            if (!mod) {
                container.innerHTML = `
                    <div class="text-center py-16 text-slate-400">
                        <i data-lucide="puzzle" class="w-12 h-12 mx-auto mb-2 opacity-40"></i>
                        <p class="font-bold text-sm">Módulo não encontrado: ${id}</p>
                        <p class="text-xs mt-1">Tente recarregar a página.</p>
                    </div>
                `;
                if (typeof lucide !== 'undefined') lucide.createIcons();
                return;
            }
            try {
                mod.render(container, ctx);
            } catch (e) {
                console.error(`[ComSocPlugin] Erro ao renderizar módulo "${id}":`, e);
                container.innerHTML = `
                    <div class="text-center py-16 text-rose-400">
                        <i data-lucide="alert-triangle" class="w-12 h-12 mx-auto mb-2"></i>
                        <p class="font-bold text-sm">Erro no módulo "${mod.label}"</p>
                        <p class="text-xs mt-1">${e.message}</p>
                    </div>
                `;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        },

        /**
         * Callback chamado quando um módulo é registrado.
         * Sobrescrito pela aplicação principal para adicionar abas dinamicamente.
         */
        onModuleRegistered: null,
    };

    // Hook interno
    function _onModuleRegistered(mod) {
        if (typeof ComSocPlugin.onModuleRegistered === 'function') {
            ComSocPlugin.onModuleRegistered(mod);
        }
    }

    // Expor globalmente
    global.ComSocPlugin = ComSocPlugin;

})(window);
