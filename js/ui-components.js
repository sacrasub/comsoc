// Módulo de Componentes de UI e Controle de Telas (Fase 2)

// --- CONFIGURAÇÕES DE TELAS INICIAIS ---
function renderizarTelaLogin() {
    const authOverlay = document.getElementById('authOverlay');
    if (!authOverlay) return;

    authOverlay.innerHTML = `
        <div class="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-premium border border-slate-200/80 w-full max-w-md space-y-6 card-anim">
            <div class="text-center space-y-2">
                <div class="w-16 h-16 bg-naval-blue rounded-full flex items-center justify-center mx-auto text-white shadow-md">
                    <i data-lucide="anchor" class="w-8 h-8 text-naval-accent animate-pulse"></i>
                </div>
                <h2 class="text-2xl font-extrabold font-outfit text-slate-900 tracking-tight">ComSoc CFT - Login</h2>
                <p class="text-xs text-slate-500 font-medium">Diretório Institucional e Agenda Integrada</p>
            </div>

            <!-- Formulário de Login -->
            <form id="loginForm" class="space-y-4 font-sans" onsubmit="handleLoginSubmit(event)">
                <div class="space-y-1">
                    <label for="loginEmail" class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">E-mail</label>
                    <input type="email" id="loginEmail" required placeholder="exemplo@marinha.mil.br" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-naval-accent/50 focus:border-naval-blue focus:bg-white transition-all">
                </div>

                <div class="space-y-1">
                    <label for="loginPassword" class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Senha <span class="text-[10px] text-slate-400 font-normal lowercase">(opcional)</span></label>
                    <div class="relative">
                        <input type="password" id="loginPassword" placeholder="Digite sua senha (ou deixe em branco)" class="w-full px-3 py-2 pr-10 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-naval-accent/50 focus:border-naval-blue focus:bg-white transition-all">
                        <button type="button" onclick="toggleSenhaVisivel('loginPassword', 'iconLoginPwd')" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-naval-blue transition-colors p-0.5" title="Mostrar/Ocultar senha">
                            <i data-lucide="eye" id="iconLoginPwd" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>

                <button type="submit" class="w-full py-2.5 bg-naval-blue hover:bg-naval-light text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm text-sm">
                    <i data-lucide="log-in" class="w-4 h-4"></i> Entrar no Sistema
                </button>
            </form>

            <div class="relative flex py-1 items-center">
                <div class="flex-grow border-t border-slate-200"></div>
                <span class="flex-shrink mx-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">ou</span>
                <div class="flex-grow border-t border-slate-200"></div>
            </div>

            <button type="button" onclick="handleGoogleLoginSubmit()" class="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm text-sm">
                <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                Entrar com Conta Google
            </button>

            <div class="text-center pt-2 border-t border-slate-100 font-sans">
                <button type="button" onclick="renderizarTelaInstrucoesPrimeiroAcesso()" class="text-xs text-naval-blue hover:underline font-bold">
                    Primeiro acesso? Clique aqui
                </button>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderizarTelaInstrucoesPrimeiroAcesso() {
    const authOverlay = document.getElementById('authOverlay');
    if (!authOverlay) return;

    authOverlay.innerHTML = `
        <div class="bg-white/90 backdrop-blur-md rounded-2xl shadow-premium border border-slate-200/80 w-full max-w-sm card-anim font-sans overflow-hidden">

            <!-- Cabeçalho -->
            <div class="bg-naval-blue px-6 py-5 text-center">
                <div class="w-12 h-12 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i data-lucide="anchor" class="w-6 h-6 text-white"></i>
                </div>
                <h2 class="text-xl font-extrabold font-outfit text-white tracking-tight">Primeiro Acesso</h2>
                <p class="text-[11px] text-blue-200 mt-0.5">Sistema de Comunicação Social — CFT</p>
            </div>

            <!-- Instruções rápidas (colapsável no mobile) -->
            <div class="px-6 pt-4 pb-2">
                <div class="bg-blue-50 border border-blue-100 rounded-xl p-3 space-y-2 text-[12px] text-slate-600 leading-snug">
                    <div class="flex gap-2 items-start">
                        <span class="flex items-center justify-center bg-naval-blue text-white w-5 h-5 rounded-full text-[10px] font-bold shrink-0 mt-px">1</span>
                        <p>Use o <strong>e-mail corporativo</strong> fornecido pelo administrador da sua OM.</p>
                    </div>
                    <div class="flex gap-2 items-start">
                        <span class="flex items-center justify-center bg-naval-blue text-white w-5 h-5 rounded-full text-[10px] font-bold shrink-0 mt-px">2</span>
                        <p>Senha temporária padrão: <strong class="text-naval-blue">Marinha123</strong></p>
                    </div>
                    <div class="flex gap-2 items-start">
                        <span class="flex items-center justify-center bg-naval-blue text-white w-5 h-5 rounded-full text-[10px] font-bold shrink-0 mt-px">3</span>
                        <p>Ao entrar, crie sua <strong>senha definitiva</strong> pessoal.</p>
                    </div>
                </div>
            </div>

            <!-- Formulário de Login -->
            <form id="primeiroAcessoForm" class="px-6 pb-6 pt-3 space-y-3" onsubmit="handlePrimeiroAcessoSubmit(event)">
                <div class="space-y-1">
                    <label for="paEmail" class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">E-mail</label>
                    <input
                        type="email"
                        id="paEmail"
                        required
                        placeholder="seu.email@marinha.mil.br"
                        autocomplete="email"
                        inputmode="email"
                        class="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-naval-blue/40 focus:border-naval-blue focus:bg-white transition-all"
                    >
                </div>

                <div class="space-y-1">
                    <label for="paSenha" class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Senha</label>
                    <div class="relative">
                        <input
                            type="password"
                            id="paSenha"
                            required
                            placeholder="Marinha123"
                            autocomplete="current-password"
                            class="w-full px-3 py-3 pr-11 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-naval-blue/40 focus:border-naval-blue focus:bg-white transition-all"
                        >
                        <button type="button" onclick="toggleSenhaVisivel('paSenha','iconPaSenha')" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-naval-blue transition-colors" title="Mostrar/Ocultar">
                            <i data-lucide="eye" id="iconPaSenha" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>

                <div id="paErro" class="hidden text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center gap-2">
                    <i data-lucide="alert-circle" class="w-4 h-4 shrink-0"></i>
                    <span id="paErroMsg"></span>
                </div>

                <button type="submit" id="btnPrimeiroAcesso" class="w-full py-3 bg-naval-blue hover:bg-naval-light text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm active:scale-95">
                    <i data-lucide="log-in" class="w-4 h-4"></i>
                    Entrar no Sistema
                </button>

                <button type="button" onclick="renderizarTelaLogin()" class="w-full py-2.5 bg-transparent text-slate-400 hover:text-slate-600 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                    <i data-lucide="arrow-left" class="w-3 h-3"></i> Já tenho conta — Voltar ao Login
                </button>
            </form>

            <div class="text-center pb-3 px-6">
                <p class="text-[10px] text-slate-300 italic">* Novos operadores devem ser cadastrados pelo administrador da respectiva OM.</p>
            </div>
        </div>
    `;
    lucide.createIcons();
}

async function handlePrimeiroAcessoSubmit(event) {
    event.preventDefault();
    const email    = document.getElementById('paEmail').value.trim();
    const senha    = document.getElementById('paSenha').value;
    const btn      = document.getElementById('btnPrimeiroAcesso');
    const erroBox  = document.getElementById('paErro');
    const erroMsg  = document.getElementById('paErroMsg');

    // Estado de carregamento
    btn.disabled = true;
    btn.innerHTML = '<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> Entrando...';
    erroBox.classList.add('hidden');

    try {
        await signIn(email, senha);
        // Login bem-sucedido — o observer de autenticação cuidará do resto
    } catch (e) {
        btn.disabled = false;
        btn.innerHTML = '<i data-lucide="log-in" class="w-4 h-4"></i> Entrar no Sistema';
        erroMsg.textContent = e.message || 'Erro ao autenticar. Tente novamente.';
        erroBox.classList.remove('hidden');
        lucide.createIcons();
    }
}

function renderizarTelaRegistro() {
    const authOverlay = document.getElementById('authOverlay');
    if (!authOverlay) return;

    authOverlay.innerHTML = `
        <div class="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-premium border border-slate-200/80 w-full max-w-lg space-y-6 card-anim overflow-y-auto max-h-[90vh] custom-scrollbar">
            <div class="text-center space-y-2">
                <h2 class="text-2xl font-extrabold font-outfit text-slate-900 tracking-tight">Criar Novo ComSoc</h2>
                <p class="text-xs text-slate-500 font-medium">Cadastre sua instituição ou órgão na plataforma regional</p>
            </div>

            <form id="registerForm" class="space-y-4 font-sans" onsubmit="handleRegisterSubmit(event)">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="space-y-1">
                        <label for="orgShortName" class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sigla / Nome Curto *</label>
                        <input type="text" id="orgShortName" required placeholder="Ex: ComSoc CFT" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-naval-accent/50 focus:border-naval-blue focus:bg-white transition-all">
                    </div>

                    <div class="space-y-1">
                        <label for="orgParent" class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Órgão Superior / Vínculo *</label>
                        <input type="text" id="orgParent" required placeholder="Ex: Marinha do Brasil" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-naval-accent/50 focus:border-naval-blue focus:bg-white transition-all">
                    </div>
                </div>

                <div class="space-y-1">
                    <label for="orgFullName" class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nome Completo do ComSoc / Seção *</label>
                    <input type="text" id="orgFullName" required placeholder="Ex: Seção de Comunicação Social da Capitania" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-naval-accent/50 focus:border-naval-blue focus:bg-white transition-all">
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="space-y-1">
                        <label for="orgSlogan" class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lema / Slogan da Organização</label>
                        <input type="text" id="orgSlogan" placeholder="Ex: Protegendo nossas riquezas..." class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-naval-accent/50 focus:border-naval-blue focus:bg-white transition-all">
                    </div>

                    <div class="space-y-1">
                        <label for="orgTheme" class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tema de Cores *</label>
                        <select id="orgTheme" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-naval-accent/50 focus:border-naval-blue focus:bg-white transition-all">
                            <option value="naval">Naval (Azul Escuro)</option>
                            <option value="militar">Militar / Exército (Verde)</option>
                            <option value="aereo">Aéreo (Azul e Laranja)</option>
                            <option value="corporativo">Corporativo (Cinza)</option>
                        </select>
                    </div>
                </div>

                <div class="pt-3 border-t border-slate-100 space-y-3">
                    <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider">Dados do Administrador da Conta</h3>
                    
                    <div class="space-y-1">
                        <label for="adminName" class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nome Completo *</label>
                        <input type="text" id="adminName" required placeholder="Ex: Capitão-Tenente Silva" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-naval-accent/50 focus:border-naval-blue focus:bg-white transition-all">
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label for="adminEmail" class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">E-mail *</label>
                            <input type="email" id="adminEmail" required placeholder="admin@orgao.gov.br" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-naval-accent/50 focus:border-naval-blue focus:bg-white transition-all">
                        </div>

                        <div class="space-y-1">
                            <label for="adminPassword" class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Senha de Acesso *</label>
                            <input type="password" id="adminPassword" required minlength="6" placeholder="Mínimo 6 caracteres" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-naval-accent/50 focus:border-naval-blue focus:bg-white transition-all">
                        </div>
                    </div>
                </div>


                <div class="pt-3 border-t border-slate-100 space-y-3">
                    <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider">Módulos que deseja utilizar</h3>
                    <p class="text-[10px] text-slate-500">Selecione as funcionalidades que fazem sentido para sua organização. Você poderá ajustar isso depois.</p>
                    <div class="grid grid-cols-2 gap-2">
                        <label class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2 cursor-pointer hover:border-naval-blue/40 transition-colors">
                            <input type="checkbox" name="modulos" value="directory" checked class="accent-naval-blue">
                            <span class="text-[11px] font-semibold text-slate-700">📋 Diretório de Autoridades</span>
                        </label>
                        <label class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2 cursor-pointer hover:border-naval-blue/40 transition-colors">
                            <input type="checkbox" name="modulos" value="agenda" checked class="accent-naval-blue">
                            <span class="text-[11px] font-semibold text-slate-700">📅 Agenda de Eventos</span>
                        </label>
                        <label class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2 cursor-pointer hover:border-naval-blue/40 transition-colors">
                            <input type="checkbox" name="modulos" value="comsoc" checked class="accent-naval-blue">
                            <span class="text-[11px] font-semibold text-slate-700">✅ Gerenc. ComSoc</span>
                        </label>
                        <label class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2 cursor-pointer hover:border-naval-blue/40 transition-colors">
                            <input type="checkbox" name="modulos" value="comsoc-controles" checked class="accent-naval-blue">
                            <span class="text-[11px] font-semibold text-slate-700">🛡️ Gestão &amp; Controles</span>
                        </label>
                    </div>
                </div>

                <button type="submit" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm text-sm">
                    <i data-lucide="plus-circle" class="w-4 h-4"></i> Criar Organização e Usuário
                </button>
            </form>

            <div class="text-center pt-2 border-t border-slate-100 font-sans">
                <button onclick="renderizarTelaLogin()" class="text-xs text-naval-blue hover:underline font-bold">
                    Já possui um ComSoc? Voltar para o Login
                </button>
            </div>
        </div>
    `;
    lucide.createIcons();
}

// --- SUBMISSÃO DE FORMULÁRIOS DE AUTH ---
async function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    showToast("Efetuando login, aguarde...");
    try {
        await signIn(email, password);
        showToast("Login realizado com sucesso!");
        // A primeira página após autenticar DEVE ser o Hub
        if (typeof window.mostrarHub === 'function') {
            window.mostrarHub();
        } else if (typeof renderizarTelaSelecaoModulo === 'function') {
            const authOverlay = document.getElementById('authOverlay');
            if (authOverlay) authOverlay.classList.remove('hidden');
            renderizarTelaSelecaoModulo(typeof window.garantirHubCallbacks === 'function' ? window.garantirHubCallbacks() : (window._hubModuleConfig || {}));
        }
    } catch (e) {
        showToast(e.message || "Erro ao efetuar login. Verifique dados.", true);
    }
}

async function handleGoogleLoginSubmit() {
    showToast("Conectando ao Google...");
    try {
        await signInWithGoogle();
        showToast("Login com Google realizado com sucesso!");
        // A primeira página após autenticar DEVE ser o Hub
        if (typeof window.mostrarHub === 'function') {
            window.mostrarHub();
        } else if (typeof renderizarTelaSelecaoModulo === 'function') {
            const authOverlay = document.getElementById('authOverlay');
            if (authOverlay) authOverlay.classList.remove('hidden');
            renderizarTelaSelecaoModulo(typeof window.garantirHubCallbacks === 'function' ? window.garantirHubCallbacks() : (window._hubModuleConfig || {}));
        }
    } catch (e) {
        showToast(e.message || "Erro no login com Google.", true);
    }
}

async function handleRegisterSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const nomeAdmin = document.getElementById('adminName').value.trim();
    const nomeCurtoOrg = document.getElementById('orgShortName').value.trim();
    const nomeCompletoOrg = document.getElementById('orgFullName').value.trim();
    const orgaoSuperior = document.getElementById('orgParent').value.trim();
    const slogan = document.getElementById('orgSlogan').value.trim();
    const tema = document.getElementById('orgTheme').value;

    // Coletar módulos selecionados
    const modulosCheckboxes = document.querySelectorAll('input[name="modulos"]:checked');
    const modulosSelecionados = Array.from(modulosCheckboxes).map(cb => cb.value);
    // Garantir pelo menos Diretório
    if (modulosSelecionados.length === 0) modulosSelecionados.push('directory');

    showToast("Criando organização e administrador...");
    try {
        await signUpNewOrg(email, password, nomeAdmin, nomeCurtoOrg, nomeCompletoOrg, orgaoSuperior, slogan, tema, modulosSelecionados);
        showToast("ComSoc criado com sucesso! Faça login para começar.");
        renderizarTelaLogin();
    } catch (e) {
        showToast(e.message || "Erro no cadastro. Verifique os dados e tente novamente.", true);
    }
}


// --- DASHBOARD DE GERENCIAMENTO DE MEMBROS E CONTROLE DE ACESSOS (RBAC) ---
function openMembersManagerModal(abaInicial = 'membros') {
    const ehAdmin = (typeof isUsuarioAdmin === 'function')
        ? isUsuarioAdmin(currentUser, currentProfile)
        : ((typeof isSuperAdmin !== 'undefined' && isSuperAdmin) || (currentProfile?.role === 'admin' || currentProfile?.role === 'super_admin'));

    if (!ehAdmin) {
        showToast("Acesso restrito para Administradores do ComSoc.", true);
        return;
    }
    
    renderizarMembrosModal();
    const modal = document.getElementById('membersManagerModal');
    const content = document.getElementById('membersManagerModalContent');
    modal.classList.remove('hidden');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
    lucide.createIcons();
    switchAdminModalTab(abaInicial);
    atualizarTabelaMembros();
}
window.abrirPainelConfiguracoesAdmin = openMembersManagerModal;

function closeMembersManagerModal() {
    const modal = document.getElementById('membersManagerModal');
    const content = document.getElementById('membersManagerModalContent');
    if (!content || !modal) return;
    content.classList.add('scale-95', 'opacity-0');
    content.classList.remove('scale-100', 'opacity-100');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 250);
}

let editingMemberId = null;

function switchAdminModalTab(tabId) {
    const tabs = ['membros', 'identidade', 'modulos', 'auditoria'];
    tabs.forEach(t => {
        const btn = document.getElementById(`admin-tab-btn-${t}`);
        const pane = document.getElementById(`admin-tab-pane-${t}`);
        if (btn) {
            if (t === tabId) {
                btn.className = "flex items-center gap-1.5 py-2.5 px-3 border-b-2 border-naval-blue text-naval-blue font-bold text-xs whitespace-nowrap transition-all";
            } else {
                btn.className = "flex items-center gap-1.5 py-2.5 px-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 text-xs font-semibold whitespace-nowrap transition-all";
            }
        }
        if (pane) {
            if (t === tabId) pane.classList.remove('hidden');
            else pane.classList.add('hidden');
        }
    });

    if (tabId === 'membros') {
        atualizarTabelaMembros();
    } else if (tabId === 'identidade') {
        carregarDadosIdentidadeNoAdminModal();
    } else if (tabId === 'modulos') {
        carregarDadosModulosNoAdminModal();
    } else if (tabId === 'auditoria') {
        carregarDadosAuditoriaNoAdminModal();
    }
    lucide.createIcons();
}

function renderizarMembrosModal() {
    let modal = document.getElementById('membersManagerModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'membersManagerModal';
        // z-[350] para sobrepor o Hub de Módulos (authOverlay que é z-[300]) e todo o painel
        modal.className = 'fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[350] flex items-center justify-center p-3 sm:p-4 hidden';
        modal.innerHTML = `
            <div id="membersManagerModalContent" class="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-3xl overflow-hidden card-anim scale-95 opacity-0 flex flex-col max-h-[90vh]">
                <!-- Header Superior -->
                <div class="bg-gradient-to-r from-naval-blue via-naval-light to-naval-blue px-6 py-4 flex justify-between items-center text-white font-outfit shadow-sm">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xl shadow-inner border border-white/20">
                            ⚙️
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h3 class="text-base sm:text-lg font-extrabold uppercase tracking-tight text-white">Configurações &amp; Controle de Acessos</h3>
                                <span class="bg-amber-400 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-full shadow-sm tracking-wider">Admin</span>
                            </div>
                            <p class="text-xs text-blue-200/90 font-medium">Capitania Fluvial de Tabatinga · Gestão de E-mails Autorizados</p>
                        </div>
                    </div>
                    <button onclick="closeMembersManagerModal()" class="text-white/80 hover:text-white transition-colors p-1.5 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20" title="Fechar configurações">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>

                <!-- Sub-Menu de Abas Internas -->
                <div class="bg-slate-50 border-b border-slate-200 px-6 flex space-x-2 overflow-x-auto custom-scrollbar">
                    <button onclick="switchAdminModalTab('membros')" id="admin-tab-btn-membros" class="flex items-center gap-1.5 py-2.5 px-3 border-b-2 border-naval-blue text-naval-blue font-bold text-xs whitespace-nowrap transition-all">
                        <i data-lucide="users" class="w-4 h-4"></i>
                        <span>E-mails &amp; Acessos</span>
                    </button>
                    <button onclick="switchAdminModalTab('identidade')" id="admin-tab-btn-identidade" class="flex items-center gap-1.5 py-2.5 px-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 text-xs font-semibold whitespace-nowrap transition-all">
                        <i data-lucide="palette" class="w-4 h-4"></i>
                        <span>Identidade Visual</span>
                    </button>
                    <button onclick="switchAdminModalTab('modulos')" id="admin-tab-btn-modulos" class="flex items-center gap-1.5 py-2.5 px-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 text-xs font-semibold whitespace-nowrap transition-all">
                        <i data-lucide="layout-grid" class="w-4 h-4"></i>
                        <span>Gerenciar Módulos</span>
                    </button>
                    <button onclick="switchAdminModalTab('auditoria')" id="admin-tab-btn-auditoria" class="flex items-center gap-1.5 py-2.5 px-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 text-xs font-semibold whitespace-nowrap transition-all">
                        <i data-lucide="file-clock" class="w-4 h-4"></i>
                        <span>Auditoria &amp; Logs</span>
                    </button>
                </div>

                <!-- Conteúdo com Rolagem -->
                <div class="p-6 overflow-y-auto space-y-6 flex-grow custom-scrollbar font-sans bg-slate-50/40">

                    <!-- ABA 1: MEMBROS E E-MAILS CADASTRADOS -->
                    <div id="admin-tab-pane-membros" class="space-y-6">
                        
                        <!-- Banner Explicativo de Segurança -->
                        <div class="bg-blue-50/90 border border-blue-200/90 rounded-xl p-3.5 flex items-start gap-3">
                            <span class="text-xl">🔐</span>
                            <div class="text-xs text-slate-700 leading-relaxed">
                                <p class="font-bold text-slate-900">Controle Estrito de Acesso por E-mail</p>
                                <p>Somente os e-mails cadastrados nesta lista têm permissão de acesso aos 4 módulos.
                                Cadastre contas Google (<strong class="text-amber-800 font-mono">@gmail.com</strong>) para autenticação com Google, ou e-mails funcionais (<strong class="text-blue-800 font-mono">@marinha.mil.br</strong>).</p>
                            </div>
                        </div>

                        <!-- Formulário de Cadastro / Edição -->
                        <form id="addMemberForm" onsubmit="handleCadastrarMembroSubmit(event)" class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                            <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                                <span class="text-xs font-extrabold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                                    <i data-lucide="user-plus" class="w-4 h-4 text-naval-blue"></i>
                                    <span id="formMemberTitle">Autorizar Novo E-mail de Militar</span>
                                </span>
                                <span class="text-[11px] text-slate-400">Campos obrigatórios (*)</span>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                <div class="sm:col-span-4 space-y-1">
                                    <label class="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">Nome Completo / Posto *</label>
                                    <input type="text" id="memberNome" required placeholder="Ex: Cristiano Sacramento" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-naval-blue/30 focus:border-naval-blue transition-all">
                                </div>
                                <div class="sm:col-span-5 space-y-1">
                                    <label class="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">E-mail (@gmail.com ou @marinha.mil.br) *</label>
                                    <input type="email" id="memberEmail" required placeholder="exemplo@gmail.com ou @marinha.mil.br" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-naval-blue/30 focus:border-naval-blue transition-all">
                                </div>
                                <div class="sm:col-span-3 space-y-1">
                                    <label class="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">Nível de Permissão *</label>
                                    <select id="memberRole" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-naval-blue/30 focus:border-naval-blue transition-all">
                                        <option value="editor">Editor (4 módulos + edição)</option>
                                        <option value="visualizador">Visualizador (4 módulos + leitura)</option>
                                        <option value="admin">Administrador (Total + Configurações)</option>
                                    </select>
                                </div>
                            </div>

                            <div class="flex items-center justify-end gap-2 pt-2">
                                <button type="button" id="btnCancelEditMembro" onclick="cancelarEdicaoMembro()" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold text-xs hidden transition-colors">
                                    Cancelar Edição
                                </button>
                                <button type="submit" id="btnSubmitMembro" class="px-4 py-2 bg-naval-blue hover:bg-naval-light text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95">
                                    <i data-lucide="plus-circle" class="w-4 h-4"></i>
                                    <span>Cadastrar &amp; Autorizar Acesso</span>
                                </button>
                            </div>
                        </form>

                        <!-- Lista de Membros e E-mails Autorizados -->
                        <div class="space-y-2">
                            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <div>
                                    <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                        <span>E-mails Cadastrados com Acesso aos Módulos</span>
                                    </h4>
                                    <p class="text-[11px] text-slate-500">Militares ativos que podem efetuar login e utilizar os 4 módulos do sistema.</p>
                                </div>
                                <div class="relative w-full sm:w-60">
                                    <input type="text" id="filtroMembrosInput" oninput="filtrarTabelaMembros()" placeholder="Filtrar por nome ou e-mail..." class="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-naval-blue">
                                    <i data-lucide="search" class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                </div>
                            </div>

                            <div class="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                <table class="w-full border-collapse text-left">
                                    <thead>
                                        <tr class="bg-slate-100/80 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                                            <th class="px-4 py-2.5">Nome / Posto</th>
                                            <th class="px-4 py-2.5">E-mail &amp; Provedor</th>
                                            <th class="px-4 py-2.5 text-center">Permissão</th>
                                            <th class="px-4 py-2.5 text-center">Status</th>
                                            <th class="px-4 py-2.5 text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tabelaMembrosCorpo">
                                        <!-- Preenchido dinamicamente -->
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                    <!-- ABA 2: IDENTIDADE VISUAL -->
                    <div id="admin-tab-pane-identidade" class="hidden space-y-4">
                        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <h4 class="text-xs font-extrabold uppercase text-slate-800 tracking-wider">Identidade Visual da Organização Militar</h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div class="space-y-1">
                                    <label class="block text-[10px] font-bold text-slate-600 uppercase">Sigla da OM</label>
                                    <input type="text" id="cfg-short-name" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs">
                                </div>
                                <div class="space-y-1">
                                    <label class="block text-[10px] font-bold text-slate-600 uppercase">Órgão Superior</label>
                                    <input type="text" id="cfg-parent-org" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs">
                                </div>
                                <div class="sm:col-span-2 space-y-1">
                                    <label class="block text-[10px] font-bold text-slate-600 uppercase">Nome Completo</label>
                                    <input type="text" id="cfg-full-name" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs">
                                </div>
                                <div class="sm:col-span-2 space-y-1">
                                    <label class="block text-[10px] font-bold text-slate-600 uppercase">Lema / Slogan</label>
                                    <input type="text" id="cfg-slogan" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs">
                                </div>
                            </div>
                            <div class="flex justify-end pt-3 border-t border-slate-100">
                                <button type="button" onclick="salvarIdentidadeVisualPeloAdminModal()" class="px-4 py-2 bg-naval-blue hover:bg-naval-light text-white font-bold text-xs rounded-lg shadow-sm">
                                    Salvar Identidade Visual
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- ABA 3: MÓDULOS -->
                    <div id="admin-tab-pane-modulos" class="hidden space-y-4">
                        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <h4 class="text-xs font-extrabold uppercase text-slate-800 tracking-wider">Habilitar / Desabilitar Módulos da OM</h4>
                            <p class="text-xs text-slate-500">Controle quais módulos ficam disponíveis aos militares autorizados da OM.</p>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="listaModulosAdminToggles">
                                <!-- Preenchido dinamicamente -->
                            </div>
                            <div class="flex justify-end pt-3 border-t border-slate-100">
                                <button type="button" onclick="salvarModulosPeloAdminModal()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm">
                                    Salvar Módulos Habilitados
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- ABA 4: AUDITORIA -->
                    <div id="admin-tab-pane-auditoria" class="hidden space-y-4">
                        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                            <h4 class="text-xs font-extrabold uppercase text-slate-800 tracking-wider">Histórico de Alterações &amp; Auditoria</h4>
                            <div id="auditoriaAdminContainer" class="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar">
                                <p class="text-xs text-slate-400">Carregando histórico...</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

// Atualizar tabela de membros e e-mails autorizados
let todosMembrosCache = [];

async function atualizarTabelaMembros() {
    const corpo = document.getElementById('tabelaMembrosCorpo');
    if (!corpo) return;

    corpo.innerHTML = `<tr><td colspan="5" class="px-4 py-8 text-center text-xs text-slate-400">Carregando e-mails autorizados...</td></tr>`;

    try {
        let membrosMap = new Map();

        // 1. Sempre injeta os administradores principais nativos
        COMSOC_DEFAULT_WHITELIST.forEach(adm => {
            membrosMap.set(adm.email.toLowerCase(), {
                id: 'super_' + btoa(adm.email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16),
                nome: adm.nome,
                email: adm.email.toLowerCase(),
                role: adm.role,
                ativo: adm.ativo,
                tipo_email: adm.tipo,
                isSuperAdminFix: true
            });
        });

        // 2. Carregar do Firestore: perfis_usuarios
        if (firebaseDb) {
            try {
                const snap = await firebaseDb.collection('perfis_usuarios').get();
                snap.forEach(doc => {
                    const d = doc.data();
                    const em = (d.email || '').toLowerCase().trim();
                    if (em) {
                        const ehSuper = SUPER_ADMIN_EMAILS.some(s => s.toLowerCase() === em) || em.includes('sacra');
                        membrosMap.set(em, {
                            id: doc.id,
                            ...d,
                            email: em,
                            role: ehSuper ? 'super_admin' : (d.role || 'editor'),
                            isSuperAdminFix: ehSuper
                        });
                    }
                });
            } catch(e) {
                console.warn("[Membros] Aviso ao ler Firestore:", e.message);
            }

            // 3. Carregar da coleção autorizacoes (Agenda-CFT)
            try {
                const autoSnap = await firebaseDb.collection('autorizacoes').get();
                autoSnap.forEach(doc => {
                    const a = doc.data();
                    const em = (a.email || doc.id || '').toLowerCase().trim();
                    if (em && !membrosMap.has(em)) {
                        membrosMap.set(em, {
                            id: 'auto_' + btoa(em).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16),
                            nome: a.nome || em.split('@')[0].toUpperCase(),
                            email: em,
                            role: a.cargo?.toLowerCase().includes('admin') ? 'admin' : 'editor',
                            ativo: a.ativo !== false,
                            isSuperAdminFix: SUPER_ADMIN_EMAILS.some(s => s.toLowerCase() === em)
                        });
                    }
                });
            } catch(e) {}
        }

        todosMembrosCache = Array.from(membrosMap.values());
        renderizarLinhasTabelaMembros(todosMembrosCache);
        salvarCacheEmailsAutorizados(todosMembrosCache);
        lucide.createIcons();
    } catch (e) {
        corpo.innerHTML = `<tr><td colspan="5" class="px-4 py-8 text-center text-xs text-rose-500 font-bold">Erro ao carregar e-mails autorizados: ${e.message}</td></tr>`;
    }
}

function renderizarLinhasTabelaMembros(lista) {
    const corpo = document.getElementById('tabelaMembrosCorpo');
    if (!corpo) return;

    if (!lista || lista.length === 0) {
        corpo.innerHTML = `<tr><td colspan="5" class="px-4 py-8 text-center text-xs text-slate-400">Nenhum militar cadastrado.</td></tr>`;
        return;
    }

    const currentEmail = (currentUser?.email || currentProfile?.email || '').toLowerCase().trim();

    corpo.innerHTML = lista.map(m => {
        const email = (m.email || '').toLowerCase().trim();
        const isSelf = email === currentEmail;
        const isSuperAdminPrincipal = (m.isSuperAdminFix || SUPER_ADMIN_EMAILS.some(s => s.toLowerCase() === email) || email.includes('sacrasub') || email === 'cristiano.sacramento@marinha.mil.br');

        // Badge de Provedor
        let providerBadge = '';
        if (email.endsWith('@marinha.mil.br')) {
            providerBadge = '<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">⚓ Marinha</span>';
        } else if (email.endsWith('@gmail.com')) {
            providerBadge = '<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">🔍 Google</span>';
        } else {
            providerBadge = '<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">✉️ E-mail</span>';
        }

        // Badge de Permissão
        let roleBadge = '';
        if (isSuperAdminPrincipal || m.role === 'super_admin') {
            roleBadge = '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-400 font-black text-[9px] uppercase shadow-sm">👑 Super Admin</span>';
        } else if (m.role === 'admin') {
            roleBadge = '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300 font-extrabold text-[9px] uppercase">🔑 Administrador</span>';
        } else if (m.role === 'editor') {
            roleBadge = '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-extrabold text-[9px] uppercase">✏️ Editor</span>';
        } else {
            roleBadge = '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-300 font-bold text-[9px] uppercase">👁️ Visualizador</span>';
        }

        const isAtivo = m.ativo !== false;

        return `
            <tr class="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                <td class="px-4 py-2.5 text-xs font-bold text-slate-800 uppercase">
                    <div class="flex items-center gap-1.5">
                        <span>${m.nome || email.split('@')[0].toUpperCase()}</span>
                        ${isSelf ? '<span class="text-[9px] text-blue-600 font-bold lowercase bg-blue-50 px-1 rounded">(você)</span>' : ''}
                    </div>
                </td>
                <td class="px-4 py-2.5 text-xs text-slate-600">
                    <div class="flex items-center gap-1.5">
                        <span class="font-mono text-slate-700">${email}</span>
                        ${providerBadge}
                    </div>
                </td>
                <td class="px-4 py-2.5 text-xs text-center">${roleBadge}</td>
                <td class="px-4 py-2.5 text-xs text-center">
                    ${isAtivo ? `
                        <span class="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Ativo
                        </span>
                    ` : `
                        <span class="inline-flex items-center gap-1 text-[10px] text-red-600 font-bold">
                            <span class="w-1.5 h-1.5 rounded-full bg-red-400"></span> Suspenso
                        </span>
                    `}
                </td>
                <td class="px-4 py-2.5 text-xs text-center">
                    <div class="flex items-center justify-center gap-1">
                        ${!isSuperAdminPrincipal ? `
                            <button onclick="iniciarEdicaoMembro('${m.id}', '${m.nome || ''}', '${m.role || 'editor'}', '${email}')" class="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Editar Permissão">
                                <i data-lucide="pencil" class="w-4 h-4"></i>
                            </button>
                            <button onclick="removerMembroComSoc('${m.id}', '${m.nome || ''}', '${email}')" class="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Revogar Acesso deste E-mail">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        ` : `
                            <span class="text-[9px] text-amber-700 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 border border-amber-200" title="Administrador Principal protegido contra remoção">
                                Protegido
                            </span>
                        `}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    lucide.createIcons();
}

function filtrarTabelaMembros() {
    const termo = (document.getElementById('filtroMembrosInput')?.value || '').toLowerCase().trim();
    if (!termo) {
        renderizarLinhasTabelaMembros(todosMembrosCache);
        return;
    }
    const filtrados = todosMembrosCache.filter(m => 
        (m.nome || '').toLowerCase().includes(termo) ||
        (m.email || '').toLowerCase().includes(termo)
    );
    renderizarLinhasTabelaMembros(filtrados);
}

function iniciarEdicaoMembro(id, nome, role, email) {
    editingMemberId = id;
    document.getElementById('memberNome').value = nome;
    
    const emailField = document.getElementById('memberEmail');
    emailField.value = email || "";
    emailField.disabled = true; // Não altera e-mail para não quebrar referências
    
    document.getElementById('memberRole').value = (role === 'super_admin') ? 'admin' : role;
    
    const btnSubmit = document.getElementById('btnSubmitMembro');
    btnSubmit.innerHTML = '<i data-lucide="save" class="w-4 h-4"></i> <span>Salvar Alterações</span>';
    btnSubmit.classList.remove('bg-naval-blue');
    btnSubmit.classList.add('bg-emerald-600', 'hover:bg-emerald-500');
    
    document.getElementById('formMemberTitle').textContent = `Editando Permissão: ${nome}`;
    document.getElementById('btnCancelEditMembro').classList.remove('hidden');
    lucide.createIcons();
    document.getElementById('memberNome').focus();
}

function cancelarEdicaoMembro() {
    editingMemberId = null;
    document.getElementById('addMemberForm').reset();
    
    const emailField = document.getElementById('memberEmail');
    emailField.disabled = false;
    
    const btnSubmit = document.getElementById('btnSubmitMembro');
    btnSubmit.innerHTML = '<i data-lucide="plus-circle" class="w-4 h-4"></i> <span>Cadastrar &amp; Autorizar Acesso</span>';
    btnSubmit.classList.add('bg-naval-blue');
    btnSubmit.classList.remove('bg-emerald-600', 'hover:bg-emerald-500');
    
    document.getElementById('formMemberTitle').textContent = "Autorizar Novo E-mail de Militar";
    document.getElementById('btnCancelEditMembro').classList.add('hidden');
    lucide.createIcons();
}

async function handleCadastrarMembroSubmit(event) {
    event.preventDefault();
    const nome = document.getElementById('memberNome').value.trim();
    const email = document.getElementById('memberEmail').value.trim().toLowerCase();
    const role = document.getElementById('memberRole').value;

    if (!email) {
        showToast("Por favor, digite o e-mail.", true);
        return;
    }

    if (editingMemberId) {
        showToast("Atualizando permissão...");
        try {
            if (firebaseDb) {
                await firebaseDb.collection('perfis_usuarios').doc(editingMemberId).set({
                    nome: nome,
                    role: role
                }, { merge: true });
                await firebaseDb.collection('autorizacoes').doc(email).set({
                    nome: nome,
                    cargo: role === 'admin' ? 'Comandante/COMSOC' : 'Militar Autorizado',
                    atualizado_em: new Date().toISOString()
                }, { merge: true });
            }

            showToast(`Militar "${nome}" atualizado com sucesso!`);
            cancelarEdicaoMembro();
            await atualizarTabelaMembros();
            if (typeof registrarLogAlteracao === 'function') {
                await registrarLogAlteracao('perfis_usuarios', 'editar', `Atualizou o militar: ${nome} (${email}) - Cargo: ${role}`);
            }
        } catch (e) {
            console.error("Erro ao editar militar:", e);
            showToast("Erro ao editar: " + e.message, true);
        }
        return;
    }

    showToast("Autorizando e-mail no sistema...");
    try {
        const defaultPassword = "Marinha123";
        await createUserForOrg(email, defaultPassword, nome, role);
        showToast(`E-mail ${email} autorizado com sucesso para acesso!`);
        document.getElementById('addMemberForm').reset();
        await atualizarTabelaMembros();
        if (typeof registrarLogAlteracao === 'function') {
            await registrarLogAlteracao('perfis_usuarios', 'inserir', `Cadastrou e autorizou o e-mail: ${email} (${nome}) - Cargo: ${role}`);
        }
    } catch (e) {
        console.error("Erro no cadastro de militar:", e);
        showToast("Erro ao autorizar e-mail: " + e.message, true);
    }
}

async function removerMembroComSoc(id, nome, email) {
    email = (email || '').toLowerCase().trim();
    if (SUPER_ADMIN_EMAILS.some(s => s.toLowerCase() === email) || email.includes('sacra')) {
        showToast("O Administrador Principal não pode ser removido.", true);
        return;
    }

    showConfirm(
        "Revogar Acesso?",
        `Tem certeza de que deseja revogar o acesso do e-mail "${email}" (${nome})? Este militar não conseguirá mais entrar nos módulos do sistema.`,
        'danger',
        async () => {
            try {
                if (firebaseDb) {
                    await firebaseDb.collection('perfis_usuarios').doc(id).delete();
                    try { await firebaseDb.collection('autorizacoes').doc(email).delete(); } catch(e) {}
                }
                if (typeof supabaseClient !== 'undefined' && supabaseClient) {
                    await supabaseClient.from('perfis_usuarios').delete().eq('id', id);
                }
                removerDoCacheEmailAutorizado(email);
                showToast(`Acesso revogado para ${email}.`);
                await atualizarTabelaMembros();
                if (typeof registrarLogAlteracao === 'function') {
                    await registrarLogAlteracao('perfis_usuarios', 'deletar', `Revogou acesso do militar: ${nome} (${email})`);
                }
            } catch (e) {
                showToast("Erro ao remover: " + e.message, true);
            }
        }
    );
}

// Helpers para Abas Adicionais do Modal
function carregarDadosIdentidadeNoAdminModal() {
    if (typeof unitConfig !== 'undefined') {
        const s = document.getElementById('cfg-short-name');
        const p = document.getElementById('cfg-parent-org');
        const f = document.getElementById('cfg-full-name');
        const l = document.getElementById('cfg-slogan');
        if (s) s.value = unitConfig.shortName || '';
        if (p) p.value = unitConfig.parentOrg || '';
        if (f) f.value = unitConfig.fullName || '';
        if (l) l.value = unitConfig.slogan || '';
    }
}

async function salvarIdentidadeVisualPeloAdminModal() {
    if (typeof unitConfig === 'undefined') return;
    unitConfig.shortName = document.getElementById('cfg-short-name')?.value.trim() || unitConfig.shortName;
    unitConfig.parentOrg = document.getElementById('cfg-parent-org')?.value.trim() || unitConfig.parentOrg;
    unitConfig.fullName = document.getElementById('cfg-full-name')?.value.trim() || unitConfig.fullName;
    unitConfig.slogan = document.getElementById('cfg-slogan')?.value.trim() || unitConfig.slogan;

    showToast("Salvando identidade visual...");
    try {
        if (typeof salvarIdentidadeVisualNuvem === 'function') {
            await salvarIdentidadeVisualNuvem(unitConfig);
        }
        if (typeof applyUnitSettings === 'function') applyUnitSettings();
        showToast("Identidade visual atualizada com sucesso!");
    } catch(e) {
        showToast("Erro ao salvar: " + e.message, true);
    }
}

function carregarDadosModulosNoAdminModal() {
    const container = document.getElementById('listaModulosAdminToggles');
    if (!container) return;

    const modulosDisponiveis = [
        { id: 'directory', nome: 'Diretório de Autoridades', icon: '🏛️' },
        { id: 'agenda', nome: 'Agenda de Eventos', icon: '📅' },
        { id: 'comsoc', nome: 'Gerenc. ComSoc', icon: '📋' },
        { id: 'comsoc-controles', nome: 'Gestão & Controles', icon: '🛡️' },
        { id: 'processos', nome: 'Gestão de Processos & Delegação', icon: '🔄' },
        { id: 'votacao', nome: 'Sistema de Votação (SEV)', icon: '🗳️' }
    ];

    const ativos = (currentOrg && currentOrg.modulos_habilitados) || ['directory', 'agenda', 'comsoc', 'comsoc-controles', 'processos', 'votacao'];

    container.innerHTML = modulosDisponiveis.map(m => {
        const isChecked = ativos.includes(m.id);
        return `
            <label class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                <input type="checkbox" name="admin_modulo_toggle" value="${m.id}" ${isChecked ? 'checked' : ''} class="w-4 h-4 accent-naval-blue rounded">
                <span class="text-base">${m.icon}</span>
                <span class="text-xs font-bold text-slate-800">${m.nome}</span>
            </label>
        `;
    }).join('');
}

async function salvarModulosPeloAdminModal() {
    const checkboxes = document.querySelectorAll('input[name="admin_modulo_toggle"]:checked');
    const selecionados = Array.from(checkboxes).map(c => c.value);

    if (selecionados.length === 0) {
        showToast("Ao menos um módulo deve permanecer habilitado.", true);
        return;
    }

    showToast("Atualizando módulos habilitados...");
    try {
        if (typeof atualizarModulosOrg === 'function') {
            await atualizarModulosOrg(currentOrg.id, selecionados);
            showToast("Módulos atualizados com sucesso!");
        }
    } catch(e) {
        showToast("Erro ao salvar módulos: " + e.message, true);
    }
}

async function carregarDadosAuditoriaNoAdminModal() {
    const container = document.getElementById('auditoriaAdminContainer');
    if (!container) return;
    container.innerHTML = `<p class="text-xs text-slate-400">Carregando logs recentes...</p>`;
    try {
        let logs = [];
        if (typeof obterLogsAuditoriaRegiao === 'function') {
            logs = await obterLogsAuditoriaRegiao();
        }
        if (logs.length === 0) {
            container.innerHTML = `<p class="text-xs text-slate-400 italic">Nenhum registro de auditoria encontrado.</p>`;
            return;
        }
        container.innerHTML = logs.map(l => `
            <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-0.5">
                <div class="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>${new Date(l.criado_em).toLocaleString('pt-BR')}</span>
                    <span class="font-bold uppercase text-slate-700">${l.usuario_nome || 'Sistema'}</span>
                </div>
                <p class="text-slate-800 font-medium">${l.detalhes || l.acao}</p>
            </div>
        `).join('');
    } catch(e) {
        container.innerHTML = `<p class="text-xs text-rose-500">Erro ao carregar logs.</p>`;
    }
}



// --- TOGGLE VISIBILIDADE DE SENHA ---
function toggleSenhaVisivel(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    if (icon) {
        icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
        lucide.createIcons();
    }
}

// --- RESET DE SENHA (SUPER ADMIN) ---
async function resetarSenhaUsuario(userId, nomeUsuario) {
    if (typeof isSuperAdmin === 'undefined' || !isSuperAdmin) {
        showToast('Apenas Super Admins podem resetar senhas.', 'error');
        return;
    }
    const emailUsuario = prompt(`Informe o e-mail de "${nomeUsuario}" para envio do link de redefinição de senha:`);
    if (!emailUsuario) return;
    showToast('Enviando e-mail de redefinição...');
    try {
        if (firebaseAuth) {
            await firebaseAuth.sendPasswordResetEmail(emailUsuario);
            showToast(`E-mail de redefinição enviado com sucesso para "${emailUsuario}"!`, 'success');
        } else {
            showToast('Firebase Auth não inicializado.', 'error');
        }
        if (typeof registrarLogAlteracao === 'function') {
            await registrarLogAlteracao('perfis_usuarios', 'editar', `Super Admin enviou redefinição de senha para o operador: ${nomeUsuario}`);
        }
    } catch (e) {
        console.error('Erro ao resetar senha:', e);
        showToast('Erro ao resetar senha: ' + e.message, 'error');
    }
}

// --- MÓDULO VISUAL DE AUDITORIA (LOGS DE ALTERAÇÃO RECENTES) ---
function openAuditLogsModal() {
    renderizarAuditLogsModal();
    const modal = document.getElementById('auditLogsModal');
    const content = document.getElementById('auditLogsModalContent');
    modal.classList.remove('hidden');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
    lucide.createIcons();
    atualizarLogsAuditoria();
}

function closeAuditLogsModal() {
    const modal = document.getElementById('auditLogsModal');
    const content = document.getElementById('auditLogsModalContent');
    content.classList.add('scale-95', 'opacity-0');
    content.classList.remove('scale-100', 'opacity-100');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 250);
}

function renderizarAuditLogsModal() {
    let modal = document.getElementById('auditLogsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'auditLogsModal';
        modal.className = 'fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden';
        modal.innerHTML = `
            <div id="auditLogsModalContent" class="bg-white rounded-2xl shadow-premium border border-slate-200/80 w-full max-w-3xl overflow-hidden card-anim scale-95 opacity-0 flex flex-col max-h-[85vh]">
                <!-- Header -->
                <div class="bg-slate-50 border-b border-slate-200/80 px-6 py-4 flex justify-between items-center font-outfit">
                    <div>
                        <h3 class="text-lg font-extrabold text-slate-900 uppercase">Logs de Alterações Recentes</h3>
                        <p class="text-xs text-slate-500 font-medium">Histórico regional e auditoria das ações dos operadores</p>
                    </div>
                    <button onclick="closeAuditLogsModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-200">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>
                <!-- Body -->
                <div class="p-6 overflow-y-auto flex-grow custom-scrollbar space-y-4 font-sans">
                    <div class="border border-slate-200 rounded-xl overflow-hidden bg-white max-h-[60vh] overflow-y-auto custom-scrollbar">
                        <table class="w-full border-collapse">
                            <thead>
                                <tr class="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                                    <th class="px-4 py-2 text-left">Data/Hora</th>
                                    <th class="px-4 py-2 text-left">ComSoc</th>
                                    <th class="px-4 py-2 text-left">Operador</th>
                                    <th class="px-4 py-2 text-left">Ação realizada</th>
                                </tr>
                            </thead>
                            <tbody id="corpoTabelaLogs">
                                <!-- Logs Dinâmicos -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

async function atualizarLogsAuditoria() {
    const corpo = document.getElementById('corpoTabelaLogs');
    if (!corpo) return;

    corpo.innerHTML = `<tr><td colspan="4" class="px-4 py-8 text-center text-xs text-slate-400">Carregando histórico...</td></tr>`;

    try {
        const logs = await obterLogsAuditoriaRegiao();

        if (logs.length === 0) {
            corpo.innerHTML = `<tr><td colspan="4" class="px-4 py-8 text-center text-xs text-slate-400">Nenhuma alteração registrada recentemente.</td></tr>`;
            return;
        }

        corpo.innerHTML = logs.map(l => {
            const dataStr = new Date(l.criado_em).toLocaleString('pt-BR');
            let badgeAcao = '';
            
            if (l.acao === 'inserir') {
                badgeAcao = '<span class="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] font-extrabold uppercase">Novo</span>';
            } else if (l.acao === 'editar') {
                badgeAcao = '<span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[8px] font-extrabold uppercase">Edição</span>';
            } else {
                badgeAcao = '<span class="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[8px] font-extrabold uppercase">Exclusão</span>';
            }

            return `
                <tr class="border-b border-slate-100 hover:bg-slate-50/50 text-xs">
                    <td class="px-4 py-3 text-slate-500 font-mono">${dataStr}</td>
                    <td class="px-4 py-3 font-bold text-naval-blue uppercase">${l.org_nome}</td>
                    <td class="px-4 py-3 font-medium text-slate-700 uppercase">${l.usuario_nome}</td>
                    <td class="px-4 py-3 text-slate-600">
                        <div class="flex items-center gap-2">
                            ${badgeAcao}
                            <span>${l.detalhes}</span>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (e) {
        corpo.innerHTML = `<tr><td colspan="4" class="px-4 py-8 text-center text-xs text-rose-500 font-bold">Erro ao obter dados de auditoria.</td></tr>`;
    }
}


// --- ACOMPANHAMENTO DE CONVITES DE EVENTOS ---
let currentInvitationEventId = null;

function openInvitationManagerModal(eventId) {
    currentInvitationEventId = eventId;
    renderizarInvitationModal();
    const modal = document.getElementById('invitationManagerModal');
    const content = document.getElementById('invitationManagerModalContent');
    modal.classList.remove('hidden');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
    lucide.createIcons();
    atualizarFilaConvites();
}

function closeInvitationManagerModal() {
    const modal = document.getElementById('invitationManagerModal');
    const content = document.getElementById('invitationManagerModalContent');
    content.classList.add('scale-95', 'opacity-0');
    content.classList.remove('scale-100', 'opacity-100');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 250);
}

function renderizarInvitationModal() {
    let modal = document.getElementById('invitationManagerModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'invitationManagerModal';
        modal.className = 'fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden';
        modal.innerHTML = `
            <div id="invitationManagerModalContent" class="bg-white rounded-2xl shadow-premium border border-slate-200/80 w-full max-w-3xl overflow-hidden card-anim scale-95 opacity-0 flex flex-col max-h-[85vh]">
                <!-- Header -->
                <div class="bg-slate-50 border-b border-slate-200/80 px-6 py-4 flex justify-between items-center font-outfit">
                    <div>
                        <h3 class="text-lg font-extrabold text-slate-900 uppercase">Controle de Convites do Evento</h3>
                        <p class="text-xs text-slate-500 font-medium">Envie convites formais para autoridades e controle respostas</p>
                    </div>
                    <button onclick="closeInvitationManagerModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-200">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>
                <!-- Body -->
                <div class="p-6 overflow-y-auto flex-grow custom-scrollbar space-y-6 font-sans">
                    <!-- Formulário de Envio de Convite -->
                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                        <h4 class="text-xs font-bold text-slate-600 uppercase tracking-wide">Adicionar Autoridade ao Evento</h4>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div class="space-y-1">
                                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Selecione o Líder / Autoridade</label>
                                <select id="inviteContactSelect" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none">
                                    <!-- Dinâmico -->
                                </select>
                            </div>
                            <div class="space-y-1">
                                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Status Inicial</label>
                                <select id="inviteStatusSelect" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none">
                                    <option value="pendente">Pendente (Não Enviado)</option>
                                    <option value="enviado">Enviado (Aguardando Retorno)</option>
                                    <option value="confirmado">Confirmado</option>
                                    <option value="recusado">Recusado</option>
                                </select>
                            </div>
                            <div class="space-y-1 flex items-end gap-2">
                                <div class="flex-grow">
                                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Observação / Nota</label>
                                    <input type="text" id="inviteObsInput" placeholder="Acompanhantes, horários, etc..." class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none">
                                </div>
                                <button onclick="handleEnviarConvite()" class="bg-naval-blue text-white px-4 py-2.5 rounded-lg font-bold hover:bg-naval-light text-xs flex items-center justify-center gap-1">
                                    <i data-lucide="mail-plus" class="w-4 h-4"></i> Enviar
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Fila de Convites do Evento -->
                    <div class="space-y-3">
                        <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Acompanhamento de Respostas</h4>
                        <div class="border border-slate-200 rounded-xl overflow-hidden bg-white max-h-[40vh] overflow-y-auto custom-scrollbar">
                            <table class="w-full border-collapse">
                                <thead>
                                    <tr class="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase">
                                        <th class="px-4 py-2 text-left">Autoridade / Cargo</th>
                                        <th class="px-4 py-2 text-center">Status</th>
                                        <th class="px-4 py-2 text-left">Observação do Convite</th>
                                        <th class="px-4 py-2 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody id="tabelaConvitesCorpo">
                                    <!-- Convites dinâmicos -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

async function atualizarFilaConvites() {
    const select = document.getElementById('inviteContactSelect');
    const corpo = document.getElementById('tabelaConvitesCorpo');
    if (!select || !corpo || !currentInvitationEventId) return;

    corpo.innerHTML = `<tr><td colspan="4" class="px-4 py-8 text-center text-xs text-slate-400">Carregando convites...</td></tr>`;

    try {
        // 1. Carregar contatos para alimentar o Select
        const contatos = await carregarContatosNuvem();
        select.innerHTML = contatos.map(c => `<option value="${c.id}">${c.title || ''} ${c.name} - ${c.role}</option>`).join('');

        // 2. Carregar convites já enviados para o evento
        const convites = await carregarConvitesEvento(currentInvitationEventId);

        if (convites.length === 0) {
            corpo.innerHTML = `<tr><td colspan="4" class="px-4 py-8 text-center text-xs text-slate-400">Nenhum convite emitido para este evento.</td></tr>`;
            return;
        }

        corpo.innerHTML = convites.map(conv => {
            const aut = conv.contatos_v5 || { name: "Desconhecido", role: "-" };
            const statusClasses = {
                'pendente': 'bg-slate-50 text-slate-500 border-slate-200',
                'enviado': 'bg-blue-50 text-blue-700 border-blue-200',
                'confirmado': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                'recusado': 'bg-rose-50 text-rose-700 border-rose-200'
            };

            return `
                <tr class="border-b border-slate-100 hover:bg-slate-50/50 text-xs">
                    <td class="px-4 py-3">
                        <div class="font-bold text-slate-800 uppercase">${aut.name}</div>
                        <div class="text-[10px] text-slate-500 leading-snug">${aut.role}</div>
                    </td>
                    <td class="px-4 py-3 text-center">
                        <select onchange="alterarStatusConviteRemoto('${conv.id}', this.value)" class="px-2.5 py-1 border text-[10px] rounded-lg font-bold uppercase transition-all bg-white text-slate-700 focus:outline-none">
                            <option value="pendente" ${conv.status === 'pendente' ? 'selected' : ''}>Pendente</option>
                            <option value="enviado" ${conv.status === 'enviado' ? 'selected' : ''}>Enviado</option>
                            <option value="confirmado" ${conv.status === 'confirmado' ? 'selected' : ''}>Confirmado</option>
                            <option value="recusado" ${conv.status === 'recusado' ? 'selected' : ''}>Recusado</option>
                        </select>
                    </td>
                    <td class="px-4 py-3">
                        <input type="text" value="${conv.observacao || ''}" onchange="alterarObsConviteRemoto('${conv.id}', this.value)" placeholder="Clique para adicionar observação" class="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-naval-blue px-1 py-0.5 focus:outline-none focus:bg-white text-xs">
                    </td>
                    <td class="px-4 py-3 text-center">
                        <button onclick="removerConviteRemoto('${conv.id}', '${aut.name}')" class="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded" title="Excluir Convite">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
        lucide.createIcons();
    } catch(e) {
        corpo.innerHTML = `<tr><td colspan="4" class="px-4 py-8 text-center text-xs text-rose-500 font-bold">Erro ao carregar convites.</td></tr>`;
    }
}

async function handleEnviarConvite() {
    const contatoId = document.getElementById('inviteContactSelect').value;
    const status = document.getElementById('inviteStatusSelect').value;
    const obs = document.getElementById('inviteObsInput').value.trim();

    if (!contatoId || !currentInvitationEventId) return;

    showToast("Enviando convite...");
    try {
        await salvarConviteEvento({
            evento_id: currentInvitationEventId,
            contato_id: contatoId,
            status: status,
            observacao: obs
        });
        showToast("Convite registrado!");
        document.getElementById('inviteObsInput').value = '';
        await atualizarFilaConvites();
    } catch(e) {
        showToast("Erro ao registrar convite: " + e.message, true);
    }
}

async function alterarStatusConviteRemoto(conviteId, novoStatus) {
    try {
        if (firebaseDb) {
            await firebaseDb.collection('convites_eventos').doc(conviteId).set({
                status: novoStatus,
                atualizado_por: currentProfile ? currentProfile.id : '',
                atualizado_em: new Date().toISOString()
            }, { merge: true });
        } else if (typeof supabaseClient !== 'undefined' && supabaseClient) {
            await supabaseClient
                .from('convites_eventos')
                .update({ status: novoStatus, atualizado_por: currentProfile.id, atualizado_em: new Date().toISOString() })
                .eq('id', conviteId);
        }

        showToast(`Convite atualizado para ${novoStatus}!`);
        if (typeof registrarLogAlteracao === 'function') {
            await registrarLogAlteracao('convites_eventos', 'editar', `Atualizou status do convite ${conviteId.substring(0,6)} para: ${novoStatus}`);
        }
        await atualizarFilaConvites();
    } catch(e) {
        showToast("Erro ao alterar status: " + e.message, true);
    }
}

async function alterarObsConviteRemoto(conviteId, novaObs) {
    try {
        if (firebaseDb) {
            await firebaseDb.collection('convites_eventos').doc(conviteId).set({
                observacao: novaObs,
                atualizado_por: currentProfile ? currentProfile.id : '',
                atualizado_em: new Date().toISOString()
            }, { merge: true });
        } else if (typeof supabaseClient !== 'undefined' && supabaseClient) {
            await supabaseClient
                .from('convites_eventos')
                .update({ observacao: novaObs, atualizado_por: currentProfile.id, atualizado_em: new Date().toISOString() })
                .eq('id', conviteId);
        }

        showToast("Observação do convite salva!");
        if (typeof registrarLogAlteracao === 'function') {
            await registrarLogAlteracao('convites_eventos', 'editar', `Atualizou observação do convite ${conviteId.substring(0,6)}`);
        }
    } catch(e) {
        showToast("Erro ao salvar observação: " + e.message, true);
    }
}

async function removerConviteRemoto(conviteId, nomeAut) {
    showConfirm(
        "Excluir Convite?",
        `Deseja realmente remover o convite da autoridade "${nomeAut}" para este evento?`,
        'danger',
        async () => {
            try {
                if (firebaseDb) {
                    await firebaseDb.collection('convites_eventos').doc(conviteId).delete();
                } else if (typeof supabaseClient !== 'undefined' && supabaseClient) {
                    await supabaseClient
                        .from('convites_eventos')
                        .delete()
                        .eq('id', conviteId);
                }

                showToast("Convite removido.");
                if (typeof registrarLogAlteracao === 'function') {
                    await registrarLogAlteracao('convites_eventos', 'deletar', `Excluiu convite de: ${nomeAut}`);
                }
                await atualizarFilaConvites();
            } catch(e) {
                showToast("Erro ao excluir: " + e.message, true);
            }
        }
    );
}

// --- CONTROLE DE TROCA DE SENHA NO PRIMEIRO ACESSO ---
function renderizarTelaTrocaSenha() {
    const authOverlay = document.getElementById('authOverlay');
    if (!authOverlay) return;

    authOverlay.classList.remove('hidden'); // Garante que está visível
    authOverlay.innerHTML = `
        <div class="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-premium border border-slate-200/80 w-full max-w-md space-y-6 card-anim">
            <div class="text-center space-y-2">
                <div class="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto text-white shadow-md">
                    <i data-lucide="key-round" class="w-8 h-8 text-white animate-pulse"></i>
                </div>
                <h2 class="text-2xl font-extrabold font-outfit text-slate-900 tracking-tight">Primeiro Acesso</h2>
                <p class="text-xs text-slate-500 font-medium">Por motivos de segurança, você deve alterar a sua senha inicial para continuar.</p>
            </div>

            <!-- Formulário de Alteração de Senha -->
            <form id="changePasswordForm" class="space-y-4 font-sans" onsubmit="handleTrocaSenhaSubmit(event)">
                <div class="space-y-1">
                    <label for="newPassword" class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Nova Senha</label>
                    <input type="password" id="newPassword" required minlength="6" placeholder="Mínimo 6 caracteres" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-naval-accent/50 focus:border-naval-blue focus:bg-white transition-all">
                </div>

                <div class="space-y-1">
                    <label for="confirmNewPassword" class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Confirmar Nova Senha</label>
                    <input type="password" id="confirmNewPassword" required minlength="6" placeholder="Confirme a nova senha" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-naval-accent/50 focus:border-naval-blue focus:bg-white transition-all">
                </div>

                <button type="submit" class="w-full py-2.5 bg-naval-blue hover:bg-naval-light text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm text-sm">
                    <i data-lucide="check" class="w-4 h-4"></i> Salvar e Acessar o Sistema
                </button>
            </form>
            
            <div class="text-center pt-2 border-t border-slate-100 font-sans">
                <button onclick="signOut()" class="text-xs text-rose-600 hover:underline font-bold">
                    Cancelar e Sair da Conta
                </button>
            </div>
        </div>
    `;
    lucide.createIcons();
}

async function handleTrocaSenhaSubmit(event) {
    event.preventDefault();
    const novaSenha = document.getElementById('newPassword').value;
    const confirmacao = document.getElementById('confirmNewPassword').value;

    if (novaSenha.length < 6) {
        showToast("A senha deve ter no mínimo 6 caracteres.", true);
        return;
    }

    if (novaSenha !== confirmacao) {
        showToast("As senhas não coincidem.", true);
        return;
    }

    showToast("Atualizando senha...");
    try {
        if (currentUser && typeof currentUser.updatePassword === 'function') {
            await currentUser.updatePassword(novaSenha);
        } else if (typeof supabaseClient !== 'undefined' && supabaseClient) {
            await supabaseClient.auth.updateUser({ password: novaSenha });
        }

        // Atualizar perfil para não forçar mais a troca
        if (firebaseDb && currentUser) {
            await firebaseDb.collection('perfis_usuarios').doc(currentUser.uid).update({ forcar_troca_senha: false });
        } else if (typeof supabaseClient !== 'undefined' && supabaseClient) {
            await supabaseClient.from('perfis_usuarios').update({ forcar_troca_senha: false }).eq('id', currentUser.id);
        }

        if (currentProfile) currentProfile.forcar_troca_senha = false;
        showToast("Senha atualizada com sucesso!");
        // A primeira página após atualizar senha DEVE ser o Hub
        if (typeof window.mostrarHub === 'function') {
            window.mostrarHub();
        } else if (typeof renderizarTelaSelecaoModulo === 'function') {
            const authOverlay = document.getElementById('authOverlay');
            if (authOverlay) authOverlay.classList.remove('hidden');
            renderizarTelaSelecaoModulo(typeof window.garantirHubCallbacks === 'function' ? window.garantirHubCallbacks() : (window._hubModuleConfig || {}));
        }
    } catch (e) {
        console.error("Erro ao alterar senha no primeiro acesso:", e);
        showToast("Erro ao atualizar senha: " + e.message, true);
    }
}


/* =========================================================
   TELA DE SELEÇÃO DE MÓDULO
   Exibida após autenticação bem-sucedida.
   O utilizador escolhe entre:
     • Painel Autoridades & Eventos  →  abre o painel principal
     • Sistema de Votação Eletrônica →  abre votacao.html em iframe
   ========================================================= */
// Compatibilidade: aceita tanto objeto { onDiretorio, onAgenda, ... } quanto
// os dois parâmetros posicionais legados (onEscolhaPainel, onEscolhaVotacao).
function renderizarTelaSelecaoModulo(onEscolhaPainel, onEscolhaVotacao) {
    // Normalizar para objeto de callbacks
    let callbacks = {};
    if (onEscolhaPainel && typeof onEscolhaPainel === 'object' && !Array.isArray(onEscolhaPainel)) {
        callbacks = onEscolhaPainel; // já é o objeto novo
    } else {
        callbacks = { onDiretorio: onEscolhaPainel, onVotacao: onEscolhaVotacao };
    }
    const { onDiretorio, onAgenda, onVotacao, onBemVindos, onConfiguracoes } = callbacks;

    const overlay = document.getElementById('authOverlay');
    if (!overlay) return;

    // Adaptar o overlay para tela cheia (sem padding centralizado)
    overlay.style.padding = '0';
    overlay.style.alignItems = 'stretch';
    overlay.style.justifyContent = 'stretch';
    overlay.style.overflowY = 'hidden';

    const userEmailCompleto = (typeof currentUser !== 'undefined' && currentUser?.email)
        ? currentUser.email
        : ((typeof currentProfile !== 'undefined' && currentProfile?.email) ? currentProfile.email : '');
    const nomeUsuario = (typeof currentProfile !== 'undefined' && currentProfile?.nome)
        ? currentProfile.nome.split(' ')[0]
        : ((typeof currentUser !== 'undefined' && currentUser?.displayName) ? currentUser.displayName.split(' ')[0] : 'Usuário');
    const nomeOrg = (typeof currentOrg !== 'undefined' && currentOrg?.nome_curto)
        ? currentOrg.nome_curto
        : 'ComSoc CFT';
    const nomeOrgFull = (typeof currentOrg !== 'undefined' && currentOrg?.nome_completo)
        ? currentOrg.nome_completo
        : 'Capitania Fluvial de Tabatinga';
    const isAdmin = (typeof isUsuarioAdmin === 'function')
        ? isUsuarioAdmin(currentUser, currentProfile)
        : ((typeof isSuperAdmin !== 'undefined' && isSuperAdmin) ||
           (typeof currentProfile !== 'undefined' && (currentProfile?.role === 'admin' || currentProfile?.role === 'super_admin')));
    const dataHoje = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    // Armazenar callbacks globalmente para uso nos onclick inline
    window._hubCallbacks = { onDiretorio, onAgenda, onVotacao, onBemVindos, onConfiguracoes };

    const configCard = isAdmin ? `
        <button class="hub-card hub-card--config" id="hub-card-config"
            onclick="window._hubCallbacks.onConfiguracoes && window._hubCallbacks.onConfiguracoes()"
            aria-label="Configurações do sistema" style="--i:4">
            <div class="hub-card-accent"></div>
            <div class="hub-card-icon">⚙️</div>
            <div class="hub-card-body">
                <h3 class="hub-card-title">Configurações &amp;<br>Acessos</h3>
                <p class="hub-card-desc">Controle de e-mails (@gmail e @marinha), operadores e parâmetros.</p>
            </div>
            <div class="hub-card-badge hub-badge--admin">Admin</div>
            <span class="hub-card-arrow">→</span>
        </button>
    ` : '';

    overlay.innerHTML = `
        <div class="hub-root" id="hub-root">

            <!-- Plano de fundo gradiente -->
            <div class="hub-bg" aria-hidden="true">
                <div class="hub-bg-orb hub-bg-orb--1"></div>
                <div class="hub-bg-orb hub-bg-orb--2"></div>
                <div class="hub-bg-orb hub-bg-orb--3"></div>
                <div class="hub-bg-grid"></div>
            </div>

            <!-- HEADER -->
            <header class="hub-header" role="banner">
                <div class="hub-header-brand">
                    <div class="hub-anchor" aria-hidden="true">⚓</div>
                    <div class="hub-brand-text">
                        <span class="hub-brand-name">${nomeOrg}</span>
                        <span class="hub-brand-full">${nomeOrgFull}</span>
                    </div>
                </div>
                <div class="hub-header-actions">
                    <div class="hub-user-chip" title="Sessão autenticada: ${userEmailCompleto}">
                        <span class="hub-online-dot" aria-label="Online"></span>
                        <span>${nomeUsuario}</span>
                        ${isAdmin ? '<span style="background: rgba(212,175,55,0.22); color: #FCD34D; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 12px; border: 1px solid rgba(212,175,55,0.45); text-transform: uppercase;">Admin</span>' : ''}
                    </div>
                    <button class="hub-btn-signout"
                        onclick="if(typeof signOut==='function') signOut()"
                        title="Encerrar sessão">
                        🚪 Sair
                    </button>
                </div>
            </header>

            <!-- TÍTULO CENTRAL -->
            <div class="hub-hero" role="main">
                <h1 class="hub-hero-title">Selecione o Módulo</h1>
                <p class="hub-hero-sub">
                    <span class="hub-status-dot" aria-hidden="true"></span>
                    Sessão ativa · ${dataHoje} ${userEmailCompleto ? `· <span style="color: #60a5fa; font-weight: 600;">${userEmailCompleto}</span>` : ''}
                </p>
            </div>

            <!-- GRADE DE MÓDULOS -->
            <nav class="hub-grid" aria-label="Módulos disponíveis">

                <!-- Diretório de Autoridades & Eventos -->
                <button class="hub-card hub-card--dir" id="hub-card-dir"
                    onclick="window._hubCallbacks.onDiretorio && window._hubCallbacks.onDiretorio()"
                    aria-label="Acessar Painel de Autoridades e Eventos"
                    style="--i:0">
                    <div class="hub-card-accent"></div>
                    <div class="hub-card-icon">🏛️</div>
                    <div class="hub-card-body">
                        <h3 class="hub-card-title">Painel de Autoridades<br>&amp; Eventos</h3>
                        <p class="hub-card-desc">Diretório institucional, agenda integrada, RSVP e comunicação com autoridades.</p>
                    </div>
                    <span class="hub-card-arrow" aria-hidden="true">→</span>
                </button>

                <!-- Agenda CFT -->
                <button class="hub-card hub-card--agenda" id="hub-card-agenda"
                    onclick="window._hubCallbacks.onAgenda && window._hubCallbacks.onAgenda()"
                    aria-label="Acessar Agenda Oficial CFT"
                    style="--i:1">
                    <div class="hub-card-accent"></div>
                    <div class="hub-card-icon">📅</div>
                    <div class="hub-card-body">
                        <h3 class="hub-card-title">Agenda Oficial<br>CFT</h3>
                        <p class="hub-card-desc">Calendário de compromissos do Comandante e cerimônias militares.</p>
                    </div>
                    <div class="hub-card-badge hub-badge--ext" aria-label="Módulo externo">🔗 Externo</div>
                    <span class="hub-card-arrow" aria-hidden="true">→</span>
                </button>

                <!-- Votação SEV-CFT -->
                <button class="hub-card hub-card--votacao" id="hub-card-votacao"
                    onclick="window._hubCallbacks.onVotacao && window._hubCallbacks.onVotacao()"
                    aria-label="Acessar Sistema de Votação Eletrônica"
                    style="--i:2">
                    <div class="hub-card-accent"></div>
                    <div class="hub-card-icon">🗳️</div>
                    <div class="hub-card-body">
                        <h3 class="hub-card-title">Sistema de Votação<br>Eletrônica — CFT</h3>
                        <p class="hub-card-desc">SEV-CFT: votação sigilosa para eleições internas de Praças e Suboficiais.</p>
                    </div>
                    <span class="hub-card-arrow" aria-hidden="true">→</span>
                </button>

                <!-- Bem-Vindos CFT -->
                <button class="hub-card hub-card--bemvindos" id="hub-card-bemvindos"
                    onclick="window._hubCallbacks.onBemVindos && window._hubCallbacks.onBemVindos()"
                    aria-label="Acessar Portal Bem-Vindos CFT"
                    style="--i:3">
                    <div class="hub-card-accent"></div>
                    <div class="hub-card-icon">👋</div>
                    <div class="hub-card-body">
                        <h3 class="hub-card-title">Portal<br>Bem-Vindos CFT</h3>
                        <p class="hub-card-desc">Guia de orientação e sobrevivência na Amazônia para novos militares.</p>
                    </div>
                    <div class="hub-card-badge hub-badge--ext" aria-label="Módulo externo">🔗 Externo</div>
                    <span class="hub-card-arrow" aria-hidden="true">→</span>
                </button>

                ${configCard}
            </nav>

            <!-- RODAPÉ -->
            <footer class="hub-footer" role="contentinfo">
                <span>Marinha do Brasil · Seção de Comunicação Social · CFT</span>
                <span class="hub-footer-sep" aria-hidden="true">·</span>
                <span>Sistema Integrado de Gestão</span>
            </footer>
        </div>

        <style id="hub-styles">
            /* ===================================================
               HUB — Tela de Seleção de Módulo (ComSoc CFT)
               =================================================== */

            /* Root container */
            .hub-root {
                position: relative;
                width: 100%;
                height: 100%;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 1.25rem 1rem 1.5rem;
                box-sizing: border-box;
                overflow-y: auto;
                overflow-x: hidden;
                background: #020C1B;
                gap: 0;
                font-family: 'Inter', 'Outfit', system-ui, -apple-system, sans-serif;
            }

            /* Plano de fundo animado */
            .hub-bg {
                position: fixed;
                inset: 0;
                pointer-events: none;
                overflow: hidden;
            }
            .hub-bg-grid {
                position: absolute;
                inset: 0;
                background-image:
                    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                background-size: 48px 48px;
            }
            .hub-bg-orb {
                position: absolute;
                border-radius: 50%;
                filter: blur(80px);
                animation: hubOrbDrift 20s ease-in-out infinite;
            }
            .hub-bg-orb--1 {
                width: 500px; height: 500px;
                background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
                top: -10%; left: -5%;
                animation-delay: 0s;
            }
            .hub-bg-orb--2 {
                width: 600px; height: 600px;
                background: radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%);
                top: 30%; right: -15%;
                animation-delay: -7s;
            }
            .hub-bg-orb--3 {
                width: 400px; height: 400px;
                background: radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%);
                bottom: -5%; left: 30%;
                animation-delay: -14s;
            }
            @keyframes hubOrbDrift {
                0%,100% { transform: translate(0, 0) scale(1); }
                33%  { transform: translate(30px, -20px) scale(1.05); }
                66%  { transform: translate(-15px, 15px) scale(0.97); }
            }

            /* HEADER */
            .hub-header {
                width: 100%;
                max-width: 920px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem 1.25rem;
                background: rgba(255,255,255,0.035);
                border: 1px solid rgba(255,255,255,0.07);
                border-radius: 14px;
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                margin-bottom: 2.25rem;
                flex-wrap: wrap;
                gap: 0.75rem;
                flex-shrink: 0;
            }
            .hub-header-brand {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .hub-anchor {
                font-size: 1.65rem;
                line-height: 1;
                filter: drop-shadow(0 0 8px rgba(212,175,55,0.55));
            }
            .hub-brand-text {
                display: flex;
                flex-direction: column;
            }
            .hub-brand-name {
                font-size: 0.98rem;
                font-weight: 800;
                color: #E2E8F0;
                letter-spacing: -0.02em;
                line-height: 1.2;
            }
            .hub-brand-full {
                font-size: 0.65rem;
                color: #475569;
                font-weight: 500;
                line-height: 1.2;
            }
            .hub-header-actions {
                display: flex;
                align-items: center;
                gap: 0.6rem;
            }
            .hub-user-chip {
                display: flex;
                align-items: center;
                gap: 0.4rem;
                font-size: 0.75rem;
                font-weight: 600;
                color: #94A3B8;
                background: rgba(255,255,255,0.04);
                border: 1px solid rgba(255,255,255,0.08);
                padding: 0.28rem 0.7rem;
                border-radius: 100px;
            }
            .hub-online-dot {
                width: 6px; height: 6px;
                background: #22C55E;
                border-radius: 50%;
                flex-shrink: 0;
                box-shadow: 0 0 0 2px rgba(34,197,94,0.25);
                animation: hubDotPulse 2.5s ease-in-out infinite;
            }
            @keyframes hubDotPulse {
                0%,100% { box-shadow: 0 0 0 2px rgba(34,197,94,0.25); }
                50%  { box-shadow: 0 0 0 6px rgba(34,197,94,0.07); }
            }
            .hub-btn-signout {
                background: rgba(239,68,68,0.1);
                border: 1px solid rgba(239,68,68,0.25);
                color: #FCA5A5;
                font-size: 0.7rem;
                font-weight: 700;
                padding: 0.28rem 0.7rem;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.18s;
                line-height: 1.5;
            }
            .hub-btn-signout:hover {
                background: rgba(239,68,68,0.22);
                border-color: rgba(239,68,68,0.45);
                color: #FECACA;
            }

            /* HERO */
            .hub-hero {
                text-align: center;
                margin-bottom: 2rem;
                flex-shrink: 0;
                animation: hubHeroIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
            }
            @keyframes hubHeroIn {
                from { opacity: 0; transform: translateY(-12px); }
                to   { opacity: 1; transform: none; }
            }
            .hub-hero-title {
                font-size: clamp(1.7rem, 4.5vw, 2.6rem);
                font-weight: 800;
                color: #F1F5F9;
                letter-spacing: -0.045em;
                margin: 0 0 0.5rem;
                line-height: 1.1;
                font-family: 'Outfit', system-ui, sans-serif;
            }
            .hub-hero-sub {
                display: inline-flex;
                align-items: center;
                gap: 0.45rem;
                font-size: 0.75rem;
                color: #475569;
                font-weight: 500;
                margin: 0;
            }
            .hub-status-dot {
                width: 7px; height: 7px;
                background: #22C55E;
                border-radius: 50%;
                display: inline-block;
                flex-shrink: 0;
                box-shadow: 0 0 0 2px rgba(34,197,94,0.2);
            }

            /* GRID DE CARDS */
            .hub-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 0.9rem;
                width: 100%;
                max-width: 860px;
                flex-shrink: 0;
            }

            /* CARD BASE */
            .hub-card {
                position: relative;
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                padding: 1.4rem 1.25rem 1.4rem 1.3rem;
                background: rgba(255,255,255,0.038);
                border: 1px solid rgba(255,255,255,0.065);
                border-radius: 18px;
                cursor: pointer;
                text-align: left;
                transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1),
                            box-shadow 0.22s ease,
                            border-color 0.22s ease,
                            background 0.22s ease;
                overflow: hidden;
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                animation: hubCardIn 0.55s cubic-bezier(0.22,1,0.36,1) both;
                animation-delay: calc(var(--i, 0) * 0.09s + 0.15s);
            }
            @keyframes hubCardIn {
                from { opacity: 0; transform: translateY(22px) scale(0.96); }
                to   { opacity: 1; transform: none; }
            }
            .hub-card:focus-visible {
                outline: 2px solid rgba(255,255,255,0.4);
                outline-offset: 2px;
            }
            .hub-card:hover {
                background: rgba(255,255,255,0.065);
                transform: translateY(-4px) scale(1.01);
            }
            .hub-card:active {
                transform: translateY(0) scale(0.99);
                transition-duration: 0.1s;
            }

            /* Barra de cor no topo do card */
            .hub-card-accent {
                position: absolute;
                top: 0; left: 0; right: 0;
                height: 3px;
                border-radius: 18px 18px 0 0;
                transition: height 0.18s;
            }
            .hub-card:hover .hub-card-accent { height: 4px; }

            /* Ícone */
            .hub-card-icon {
                font-size: 2.2rem;
                line-height: 1;
                flex-shrink: 0;
                margin-top: 0.05rem;
                filter: drop-shadow(0 2px 6px rgba(0,0,0,0.35));
            }

            /* Corpo do card */
            .hub-card-body {
                flex: 1;
                min-width: 0;
            }
            .hub-card-title {
                font-size: 0.95rem;
                font-weight: 700;
                color: #CBD5E1;
                margin: 0 0 0.3rem;
                line-height: 1.3;
                font-family: 'Outfit', system-ui, sans-serif;
            }
            .hub-card-desc {
                font-size: 0.71rem;
                color: #475569;
                margin: 0;
                line-height: 1.55;
            }

            /* Seta */
            .hub-card-arrow {
                font-size: 1.15rem;
                color: #1E293B;
                flex-shrink: 0;
                align-self: center;
                transition: transform 0.2s, color 0.2s;
                margin-left: auto;
                padding-left: 0.5rem;
            }
            .hub-card:hover .hub-card-arrow {
                transform: translateX(5px);
                color: #64748B;
            }

            /* Badge */
            .hub-card-badge {
                position: absolute;
                top: 0.65rem;
                right: 0.65rem;
                font-size: 0.58rem;
                font-weight: 700;
                padding: 0.18rem 0.4rem;
                border-radius: 100px;
                letter-spacing: 0.02em;
                line-height: 1.4;
            }
            .hub-badge--ext {
                background: rgba(99,102,241,0.18);
                color: #A5B4FC;
                border: 1px solid rgba(99,102,241,0.28);
            }
            .hub-badge--admin {
                background: rgba(212,175,55,0.15);
                color: #D4AF37;
                border: 1px solid rgba(212,175,55,0.28);
            }

            /* Cores por módulo */
            .hub-card--dir .hub-card-accent     { background: linear-gradient(90deg,#2563EB,#60A5FA); }
            .hub-card--dir:hover                 { border-color: rgba(59,130,246,0.35); box-shadow: 0 16px 40px rgba(59,130,246,0.18),0 0 0 1px rgba(59,130,246,0.15); }
            .hub-card--dir:hover .hub-card-title { color: #93C5FD; }

            .hub-card--agenda .hub-card-accent   { background: linear-gradient(90deg,#4F46E5,#818CF8); }
            .hub-card--agenda:hover              { border-color: rgba(99,102,241,0.35); box-shadow: 0 16px 40px rgba(99,102,241,0.18),0 0 0 1px rgba(99,102,241,0.15); }
            .hub-card--agenda:hover .hub-card-title { color: #A5B4FC; }

            .hub-card--votacao .hub-card-accent  { background: linear-gradient(90deg,#059669,#34D399); }
            .hub-card--votacao:hover             { border-color: rgba(16,185,129,0.35); box-shadow: 0 16px 40px rgba(16,185,129,0.18),0 0 0 1px rgba(16,185,129,0.15); }
            .hub-card--votacao:hover .hub-card-title { color: #6EE7B7; }

            .hub-card--bemvindos .hub-card-accent{ background: linear-gradient(90deg,#D97706,#FCD34D); }
            .hub-card--bemvindos:hover           { border-color: rgba(245,158,11,0.35); box-shadow: 0 16px 40px rgba(245,158,11,0.18),0 0 0 1px rgba(245,158,11,0.15); }
            .hub-card--bemvindos:hover .hub-card-title { color: #FCD34D; }

            .hub-card--config .hub-card-accent   { background: linear-gradient(90deg,#475569,#94A3B8); }
            .hub-card--config                    { grid-column: 1 / -1; max-width: 420px; width: 100%; justify-self: center; }
            .hub-card--config:hover              { border-color: rgba(100,116,139,0.35); box-shadow: 0 16px 40px rgba(100,116,139,0.18),0 0 0 1px rgba(100,116,139,0.15); }

            /* RODAPÉ */
            .hub-footer {
                margin-top: 1.75rem;
                font-size: 0.62rem;
                color: #1E293B;
                text-align: center;
                font-weight: 600;
                letter-spacing: 0.04em;
                text-transform: uppercase;
                display: flex;
                align-items: center;
                gap: 0.4rem;
                flex-wrap: wrap;
                justify-content: center;
                flex-shrink: 0;
            }
            .hub-footer-sep { color: #0F172A; }

            /* RESPONSIVO */
            @media (max-width: 640px) {
                .hub-root    { padding: 1rem 0.75rem 1.25rem; }
                .hub-header  { padding: 0.6rem 0.9rem; margin-bottom: 1.5rem; }
                .hub-grid    { grid-template-columns: 1fr; gap: 0.7rem; }
                .hub-card--config { grid-column: 1; max-width: 100%; }
                .hub-hero-title  { font-size: 1.55rem; }
                .hub-card        { padding: 1rem 1rem; }
                .hub-card-desc   { display: none; }
                .hub-card-icon   { font-size: 1.75rem; }
                .hub-card-title  { font-size: 0.88rem; }
            }
        </style>
    `;
}

