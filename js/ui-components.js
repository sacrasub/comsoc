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
                    <label for="loginPassword" class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Senha</label>
                    <input type="password" id="loginPassword" required placeholder="Digite sua senha" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-naval-accent/50 focus:border-naval-blue focus:bg-white transition-all">
                </div>

                <button type="submit" class="w-full py-2.5 bg-naval-blue hover:bg-naval-light text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm text-sm">
                    <i data-lucide="log-in" class="w-4 h-4"></i> Entrar no Sistema
                </button>
            </form>

            <div class="text-center pt-2 border-t border-slate-100 font-sans">
                <button onclick="renderizarTelaRegistro()" class="text-xs text-naval-blue hover:underline font-bold">
                    Não tem um ComSoc? Cadastrar nova Organização
                </button>
            </div>
        </div>
    `;
    lucide.createIcons();
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
        document.getElementById('authOverlay').classList.add('hidden');
        await recarregarAplicacaoCompleta();
    } catch (e) {
        showToast(e.message || "Erro ao efetuar login. Verifique dados.", true);
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

    showToast("Criando organização e administrador...");
    try {
        await signUpNewOrg(email, password, nomeAdmin, nomeCurtoOrg, nomeCompletoOrg, orgaoSuperior, slogan, tema);
        showToast("ComSoc criado com sucesso! Faça login para começar.");
        renderizarTelaLogin();
    } catch (e) {
        showToast(e.message || "Erro no cadastro. Verifique os dados e tente novamente.", true);
    }
}


// --- DASHBOARD DE GERENCIAMENTO DE MEMBROS ---
function openMembersManagerModal() {
    if (!currentProfile || currentProfile.role !== 'admin') {
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
    atualizarTabelaMembros();
}

function closeMembersManagerModal() {
    const modal = document.getElementById('membersManagerModal');
    const content = document.getElementById('membersManagerModalContent');
    content.classList.add('scale-95', 'opacity-0');
    content.classList.remove('scale-100', 'opacity-100');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 250);
}

function renderizarMembrosModal() {
    let modal = document.getElementById('membersManagerModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'membersManagerModal';
        modal.className = 'fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden';
        modal.innerHTML = `
            <div id="membersManagerModalContent" class="bg-white rounded-2xl shadow-premium border border-slate-200/80 w-full max-w-2xl overflow-hidden card-anim scale-95 opacity-0 flex flex-col max-h-[85vh]">
                <!-- Header -->
                <div class="bg-slate-50 border-b border-slate-200/80 px-6 py-4 flex justify-between items-center font-outfit">
                    <div>
                        <h3 class="text-lg font-extrabold text-slate-900 uppercase">Membros do ComSoc</h3>
                        <p class="text-xs text-slate-500 font-medium">Cadastre novos operadores e defina cargos de acesso</p>
                    </div>
                    <button onclick="closeMembersManagerModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-200">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>
                <!-- Body -->
                <div class="p-6 overflow-y-auto space-y-6 flex-grow custom-scrollbar font-sans">
                    <!-- Cadastro rápido de Usuário -->
                    <form id="addMemberForm" onsubmit="handleCadastrarMembroSubmit(event)" class="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div class="space-y-1">
                            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Nome Completo</label>
                            <input type="text" id="memberNome" required placeholder="Ex: Sargento Oliveira" class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none">
                        </div>
                        <div class="space-y-1">
                            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">E-mail</label>
                            <input type="email" id="memberEmail" required placeholder="email@marinha.mil.br" class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none">
                        </div>
                        <div class="space-y-1 flex items-end gap-2">
                            <div class="flex-grow">
                                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Permissão</label>
                                <select id="memberRole" class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none">
                                    <option value="editor">Editor (Escrever/Editar)</option>
                                    <option value="visualizador">Visualizador (Ler apenas)</option>
                                    <option value="admin">Administrador (Total)</option>
                                </select>
                            </div>
                            <button type="submit" class="bg-naval-blue text-white px-3 py-2 rounded-lg font-bold hover:bg-naval-light text-xs flex items-center justify-center" title="Adicionar Membro">
                                <i data-lucide="plus" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </form>

                    <!-- Lista de Membros -->
                    <div class="space-y-3">
                        <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Membros Cadastrados</h4>
                        <div class="border border-slate-200 rounded-xl overflow-hidden bg-white">
                            <table class="w-full border-collapse">
                                <thead>
                                    <tr class="bg-slate-50 border-b border-slate-200">
                                        <th class="px-4 py-2 text-left text-[10px] font-bold text-slate-500 uppercase">Nome</th>
                                        <th class="px-4 py-2 text-left text-[10px] font-bold text-slate-500 uppercase">E-mail / Id</th>
                                        <th class="px-4 py-2 text-center text-[10px] font-bold text-slate-500 uppercase">Permissão</th>
                                        <th class="px-4 py-2 text-center text-[10px] font-bold text-slate-500 uppercase">Ações</th>
                                    </tr>
                                </thead>
                                <tbody id="tabelaMembrosCorpo">
                                    <!-- Dinâmico -->
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

async function atualizarTabelaMembros() {
    const corpo = document.getElementById('tabelaMembrosCorpo');
    if (!corpo || !currentOrg) return;

    corpo.innerHTML = `<tr><td colspan="4" class="px-4 py-8 text-center text-xs text-slate-400">Carregando membros...</td></tr>`;

    try {
        const { data: membros, error } = await supabaseClient
            .from('perfis_usuarios')
            .select('*')
            .eq('org_id', currentOrg.id);

        if (error) throw error;

        corpo.innerHTML = membros.map(m => {
            const roleLabels = {
                'admin': '<span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 font-extrabold text-[9px] uppercase">Administrador</span>',
                'editor': '<span class="px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300 font-extrabold text-[9px] uppercase">Editor</span>',
                'visualizador': '<span class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-300 font-bold text-[9px] uppercase">Visualizador</span>'
            };

            const isSelf = m.id === currentUser.id;

            return `
                <tr class="border-b border-slate-100 hover:bg-slate-50/50">
                    <td class="px-4 py-2.5 text-xs font-bold text-slate-800 uppercase">${m.nome} ${isSelf ? '<span class="text-[9px] text-slate-400 font-normal italic">(Você)</span>' : ''}</td>
                    <td class="px-4 py-2.5 text-xs text-slate-500 font-mono">${m.id.substring(0,8)}...</td>
                    <td class="px-4 py-2.5 text-xs text-center">${roleLabels[m.role] || m.role}</td>
                    <td class="px-4 py-2.5 text-xs text-center">
                        ${!isSelf ? `
                            <button onclick="removerMembroComSoc('${m.id}', '${m.nome}')" class="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded" title="Remover Membro">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        ` : '-'}
                    </td>
                </tr>
            `;
        }).join('');
        lucide.createIcons();
    } catch (e) {
        corpo.innerHTML = `<tr><td colspan="4" class="px-4 py-8 text-center text-xs text-rose-500 font-bold">Erro ao carregar membros do ComSoc.</td></tr>`;
    }
}

async function handleCadastrarMembroSubmit(event) {
    event.preventDefault();
    const nome = document.getElementById('memberNome').value.trim();
    const email = document.getElementById('memberEmail').value.trim();
    const role = document.getElementById('memberRole').value;

    showToast("Cadastrando novo membro...");
    try {
        // Criar o usuário no Supabase Auth usando um cliente secundário para não deslogar o admin atual
        const tempClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            }
        });
        
        const defaultPassword = "SenhaComSoc123!";
        let userId = null;

        // 1. Tentar cadastrar o usuário no Auth
        const { data: authData, error: authErr } = await tempClient.auth.signUp({
            email: email,
            password: defaultPassword
        });

        // Tratar caso o e-mail já esteja cadastrado no Auth
        if (authErr && (authErr.message.includes("already registered") || authErr.message.includes("already exists"))) {
            console.log("Usuário já registrado no Auth. Tentando obter o ID via Login...");
            const { data: logData, error: logErr } = await tempClient.auth.signInWithPassword({
                email: email,
                password: defaultPassword
            });
            if (logErr) throw new Error("Este e-mail já possui conta com outra senha. O operador deve fazer login com sua senha.");
            userId = logData.user?.id;
        } else if (authErr) {
            throw authErr;
        } else {
            // Se o signup funcionou mas o e-mail já existia (obfuscated signup do Supabase), identities virá vazio
            const identities = authData.user?.identities;
            if (identities && identities.length === 0) {
                console.log("Usuário já existe (identidades vazias). Tentando login para obter ID...");
                const { data: logData, error: logErr } = await tempClient.auth.signInWithPassword({
                    email: email,
                    password: defaultPassword
                });
                if (logErr) throw new Error("Este e-mail já possui conta. O operador deve fazer login com seus dados.");
                userId = logData.user?.id;
            } else {
                userId = authData.user?.id;
            }
        }

        if (!userId) throw new Error("Não foi possível obter o ID do novo usuário.");

        // 2. Upsert no perfil de usuário para vincular à organização
        const { data: upsertData, error: upsertErr } = await supabaseClient
            .from('perfis_usuarios')
            .upsert({
                id: userId,
                org_id: currentOrg.id,
                role: role,
                nome: nome
            })
            .select();

        if (upsertErr) {
            // Se ainda assim der erro de FK, tenta uma última recuperação via login
            if (upsertErr.message.includes("violates foreign key constraint")) {
                console.log("Falha de FK. Tentando login para recuperar ID real...");
                const { data: logData, error: logErr } = await tempClient.auth.signInWithPassword({
                    email: email,
                    password: defaultPassword
                });
                if (!logErr && logData.user?.id) {
                    const { error: retryErr } = await supabaseClient
                        .from('perfis_usuarios')
                        .upsert({
                            id: logData.user.id,
                            org_id: currentOrg.id,
                            role: role,
                            nome: nome
                        });
                    if (!retryErr) {
                        showToast(`Membro "${nome}" cadastrado com sucesso!`);
                        document.getElementById('addMemberForm').reset();
                        await atualizarTabelaMembros();
                        await registrarLogAlteracao('perfis_usuarios', 'inserir', `Convidou/cadastrou o operador: ${nome} (Permissão: ${role})`);
                        return;
                    }
                }
            }
            throw upsertErr;
        }
        
        console.log("Perfil cadastrado/atualizado com sucesso:", upsertData);
        
        showToast(`Membro "${nome}" cadastrado! Ele pode logar com a senha padrão: ${defaultPassword}`);
        document.getElementById('addMemberForm').reset();
        await atualizarTabelaMembros();
        await registrarLogAlteracao('perfis_usuarios', 'inserir', `Convidou/cadastrou o operador: ${nome} (Permissão: ${role})`);
    } catch (e) {
        console.error("Erro geral no cadastro de membro:", e);
        showToast("Erro ao cadastrar membro: " + e.message, true);
    }
}

async function removerMembroComSoc(id, nome) {
    showConfirm(
        "Remover Operador?",
        `Tem certeza de que deseja remover o operador "${nome}" e revogar seu acesso a este ComSoc?`,
        'danger',
        async () => {
            try {
                const { error } = await supabaseClient
                    .from('perfis_usuarios')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                showToast("Membro removido.");
                await atualizarTabelaMembros();
                await registrarLogAlteracao('perfis_usuarios', 'deletar', `Removeu o operador: ${nome}`);
            } catch (e) {
                showToast("Erro ao remover: " + e.message, true);
            }
        }
    );
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
        const { error } = await supabaseClient
            .from('convites_eventos')
            .update({ status: novoStatus, atualizado_por: currentProfile.id, atualizado_em: new Date().toISOString() })
            .eq('id', conviteId);

        if (error) throw error;
        showToast(`Convite atualizado para ${novoStatus}!`);
        await registrarLogAlteracao('convites_eventos', 'editar', `Atualizou status do convite ${conviteId.substring(0,6)} para: ${novoStatus}`);
        await atualizarFilaConvites();
    } catch(e) {
        showToast("Erro ao alterar status: " + e.message, true);
    }
}

async function alterarObsConviteRemoto(conviteId, novaObs) {
    try {
        const { error } = await supabaseClient
            .from('convites_eventos')
            .update({ observacao: novaObs, atualizado_por: currentProfile.id, atualizado_em: new Date().toISOString() })
            .eq('id', conviteId);

        if (error) throw error;
        showToast("Observação do convite salva!");
        await registrarLogAlteracao('convites_eventos', 'editar', `Atualizou observação do convite ${conviteId.substring(0,6)}`);
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
                const { error } = await supabaseClient
                    .from('convites_eventos')
                    .delete()
                    .eq('id', conviteId);

                if (error) throw error;
                showToast("Convite removido.");
                await registrarLogAlteracao('convites_eventos', 'deletar', `Excluiu convite de: ${nomeAut}`);
                await atualizarFilaConvites();
            } catch(e) {
                showToast("Erro ao excluir: " + e.message, true);
            }
        }
    );
}
