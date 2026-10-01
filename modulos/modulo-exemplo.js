/**
 * MÓDULO DE EXEMPLO — ComSoc Plugin Template
 * ============================================
 * Copie este arquivo, modifique o conteúdo e hospede-o em qualquer URL pública.
 *
 * Recomendado: GitHub Pages
 *   1. Crie um repositório: github.com/SEU_USUARIO/comsoc-modulo-NOME
 *   2. Coloque este arquivo como index.js ou NOME.js
 *   3. Ative GitHub Pages nas configurações do repositório
 *   4. URL ficará: https://SEU_USUARIO.github.io/comsoc-modulo-NOME/NOME.js
 *
 * Para instalar: Configurações → Gerenciar Módulos → Instalar Módulo Externo
 */

(function() {
    'use strict';

    // Aguarda o ComSocPlugin estar disponível
    function waitForRegistry(cb) {
        if (typeof ComSocPlugin !== 'undefined') {
            cb();
        } else {
            setTimeout(() => waitForRegistry(cb), 50);
        }
    }

    waitForRegistry(function() {
        ComSocPlugin.register({

            // ── Metadados ────────────────────────────────────────────────────
            id:          'modulo-exemplo',           // ALTERE: ID único, sem espaços
            label:       'Módulo Exemplo',           // ALTERE: Nome da aba
            icon:        'star',                     // ALTERE: Ícone Lucide (lucide.dev/icons)
            description: 'Template de módulo de demonstração',
            version:     '1.0.0',

            // ── Renderização da aba ──────────────────────────────────────────
            // container = <div> da aba onde seu HTML será injetado
            // ctx       = { currentOrg, currentUser, currentProfile, supabaseClient }
            render: function(container, ctx) {

                const org  = ctx.currentOrg  || {};
                const user = ctx.currentUser || {};

                // ── Injete seu HTML aqui ──────────────────────────────────
                container.innerHTML = `
                    <div class="space-y-6">

                        <!-- Header do módulo -->
                        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
                            <h2 class="text-2xl font-extrabold font-outfit">⭐ Módulo de Exemplo</h2>
                            <p class="text-indigo-200 text-sm mt-1">
                                Organização: <strong>${org.nome_curto || '—'}</strong>
                            </p>
                        </div>

                        <!-- Conteúdo -->
                        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 class="text-lg font-bold text-slate-800 mb-3">Como usar este template</h3>
                            <ol class="space-y-2 text-sm text-slate-600 list-decimal ml-4">
                                <li>Copie o arquivo <code class="bg-slate-100 px-1 rounded">modulo-exemplo.js</code></li>
                                <li>Altere o <code class="bg-slate-100 px-1 rounded">id</code>, <code class="bg-slate-100 px-1 rounded">label</code> e a função <code class="bg-slate-100 px-1 rounded">render</code></li>
                                <li>Hospede no GitHub Pages ou qualquer URL HTTPS</li>
                                <li>Instale via Configurações → Gerenciar Módulos</li>
                            </ol>
                        </div>

                        <!-- Exemplo de uso do Supabase no módulo -->
                        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 class="text-lg font-bold text-slate-800 mb-3">Informações da Sessão</h3>
                            <div class="space-y-1 text-sm font-mono bg-slate-50 p-3 rounded-lg">
                                <p><span class="text-slate-500">org.id:</span> ${org.id || '—'}</p>
                                <p><span class="text-slate-500">org.nome_curto:</span> ${org.nome_curto || '—'}</p>
                                <p><span class="text-slate-500">user.email:</span> ${user.email || '—'}</p>
                            </div>
                        </div>

                    </div>
                `;

                // ── Aqui você pode adicionar lógica JS extra ──────────────
                // ctx.supabaseClient está disponível para queries ao banco
                // Exemplo:
                // ctx.supabaseClient.from('minha_tabela').select('*').then(({data}) => {
                //     document.getElementById('minha-lista').innerHTML = data.map(d => `<li>${d.nome}</li>`).join('');
                // });
            }
        });
    });

})();
