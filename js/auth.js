// Módulo de Autenticação e Controle de Acesso (RBAC) do ComSoc

let currentUser = null;
let currentProfile = null;
let currentOrg = null;

// Observador de estado de autenticação
function setupAuthObserver(onAuthStateChanged) {
    if (!supabaseClient) return;

    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth State Change Event:", event);
        if (session && session.user) {
            currentUser = session.user;
            await loadUserProfileAndOrg();
        } else {
            currentUser = null;
            currentProfile = null;
            currentOrg = null;
        }
        if (typeof onAuthStateChanged === 'function') {
            onAuthStateChanged(currentUser, currentProfile, currentOrg);
        }
    });
}

// Carregar Perfil e Organização do Usuário Ativo
async function loadUserProfileAndOrg() {
    if (!currentUser) return;

    try {
        // Carregar Perfil
        const { data: profile, error: profileErr } = await supabaseClient
            .from('perfis_usuarios')
            .select('*')
            .eq('id', currentUser.id)
            .maybeSingle();

        if (profileErr) throw profileErr;

        if (profile) {
            currentProfile = profile;
            
            // Carregar Organização
            const { data: org, error: orgErr } = await supabaseClient
                .from('organizacoes')
                .select('*')
                .eq('id', profile.org_id)
                .maybeSingle();

            if (orgErr) throw orgErr;
            currentOrg = org;
        } else {
            console.warn("Perfil de usuário não encontrado.");
        }
    } catch (e) {
        console.error("Erro ao carregar perfil/organização:", e);
    }
}

// Cadastrar Novo Órgão / ComSoc (Sign Up Administrativo)
async function signUpNewOrg(email, password, nomeAdmin, nomeCurtoOrg, nomeCompletoOrg, orgaoSuperior, slogan, tema = 'naval') {
    try {
        // 1. Criar Organização
        const { data: org, error: orgErr } = await supabaseClient
            .from('organizacoes')
            .insert({
                nome_curto: nomeCurtoOrg,
                nome_completo: nomeCompletoOrg,
                orgao_superior: orgaoSuperior,
                slogan: slogan,
                tema: tema
            })
            .select()
            .single();

        if (orgErr) throw orgErr;

        // 2. Criar Usuário no Supabase Auth
        const { data: authData, error: authErr } = await supabaseClient.auth.signUp({
            email,
            password
        });

        if (authErr) {
            // Rollback organização se o cadastro do usuário falhar
            await supabaseClient.from('organizacoes').delete().eq('id', org.id);
            throw authErr;
        }

        const user = authData.user;
        if (!user) throw new Error("Usuário criado com sucesso, mas retorno vazio.");

        // 3. Criar Perfil de Administrador (Role = 'admin')
        const { error: profileErr } = await supabaseClient
            .from('perfis_usuarios')
            .insert({
                id: user.id,
                org_id: org.id,
                role: 'admin',
                nome: nomeAdmin
            });

        if (profileErr) throw profileErr;

        return { user, org };
    } catch (e) {
        console.error("Erro ao cadastrar novo órgão:", e);
        throw e;
    }
}

// Fazer Login
async function signIn(email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    } catch (e) {
        console.error("Erro ao efetuar login:", e);
        throw e;
    }
}

// Fazer Logout
async function signOut() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        currentUser = null;
        currentProfile = null;
        currentOrg = null;
    } catch (e) {
        console.error("Erro ao efetuar logout:", e);
        throw e;
    }
}

// Criar outro usuário dentro do mesmo ComSoc (apenas admins)
async function createUserForOrg(email, password, nome, role) {
    if (!currentProfile || currentProfile.role !== 'admin') {
        throw new Error("Apenas administradores podem convidar usuários.");
    }

    try {
        // Criar o usuário no Supabase Auth usando um cliente secundário para não deslogar o admin atual
        const tempClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            }
        });

        const { data: authData, error: authErr } = await tempClient.auth.signUp({
            email: email,
            password: password
        });

        if (authErr) throw authErr;
        
        const userId = authData.user?.id;
        if (!userId) throw new Error("Não foi possível obter o ID do novo usuário.");

        const { data, error } = await supabaseClient
            .from('perfis_usuarios')
            .upsert({
                id: userId,
                org_id: currentProfile.org_id,
                role: role,
                nome: nome
            })
            .select();
        if (error) throw error;
        return data;
    } catch (e) {
        console.error("Erro ao criar usuário para o órgão:", e);
        throw e;
    }
}

// Gerar UUID provisório no client
function gen_random_uuid_client() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Verificar se o usuário ativo possui permissão (RBAC)
function checkUserPermission(requiredRole) {
    if (!currentProfile) return false;
    
    const roles = {
        'admin': 3,
        'editor': 2,
        'visualizador': 1
    };
    
    return roles[currentProfile.role] >= roles[requiredRole];
}
