// Módulo de Autenticação e Controle de Acesso (RBAC) do ComSoc com Firebase
let currentUser = null;
let currentProfile = null;
let currentOrg = null;
let isSuperAdmin = false;
let todasOrganizacoes = [];

// Lista oficial de e-mails de Administradores Principais do ComSoc CFT
const SUPER_ADMIN_EMAILS = [
    'sacrasub@mail.com',
    'sacrasub@gmail.com',
    'cristiano.sacramento@marinha.mil.br',
    'eduardoheld81@gmail.com',
    'fluvialcapitania486@gmail.com',
    'admin@marinha.mil.br'
];

// Helper global para checar permissão administrativa total
function isUsuarioAdmin(user = currentUser, profile = currentProfile) {
    const email = ((user && user.email) || (profile && profile.email) || '').toLowerCase().trim();
    if (!email) return false;
    if (SUPER_ADMIN_EMAILS.some(adm => adm.toLowerCase() === email)) return true;
    if (email.includes('sacrasub') || email === 'cristiano.sacramento@marinha.mil.br') return true;
    if (profile && (profile.role === 'admin' || profile.role === 'super_admin')) return true;
    if (typeof isSuperAdmin !== 'undefined' && isSuperAdmin) return true;
    return false;
}
window.isUsuarioAdmin = isUsuarioAdmin;

// Base inicial garantida de e-mails autorizados
const COMSOC_DEFAULT_WHITELIST = [
    { email: 'sacrasub@mail.com', nome: 'Cristiano Sacramento', role: 'super_admin', ativo: true, tipo: 'admin' },
    { email: 'sacrasub@gmail.com', nome: 'Cristiano Sacramento (Google)', role: 'super_admin', ativo: true, tipo: 'google' },
    { email: 'cristiano.sacramento@marinha.mil.br', nome: 'Cristiano Sacramento', role: 'super_admin', ativo: true, tipo: 'institucional' },
    { email: 'eduardoheld81@gmail.com', nome: 'CMG Eduardo Held', role: 'admin', ativo: true, tipo: 'google' },
    { email: 'fluvialcapitania486@gmail.com', nome: 'ComSoc CFT', role: 'admin', ativo: true, tipo: 'google' },
    { email: 'admin@marinha.mil.br', nome: 'Administrador CFT', role: 'admin', ativo: true, tipo: 'institucional' }
];

function obterCacheEmailsAutorizados() {
    try {
        const raw = localStorage.getItem('comsoc_authorized_emails_cache');
        if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list) && list.length > 0) return list;
        }
    } catch(e) {}
    localStorage.setItem('comsoc_authorized_emails_cache', JSON.stringify(COMSOC_DEFAULT_WHITELIST));
    return COMSOC_DEFAULT_WHITELIST;
}

function salvarCacheEmailsAutorizados(lista) {
    try {
        localStorage.setItem('comsoc_authorized_emails_cache', JSON.stringify(lista));
    } catch(e) {}
}

function atualizarCacheEmailAutorizado(item) {
    if (!item || !item.email) return;
    const cache = obterCacheEmailsAutorizados();
    const emailNorm = item.email.toLowerCase().trim();
    const idx = cache.findIndex(c => (typeof c === 'string' ? c.toLowerCase() === emailNorm : c.email?.toLowerCase() === emailNorm));
    const obj = {
        email: emailNorm,
        nome: item.nome || emailNorm.split('@')[0].toUpperCase(),
        role: item.role || 'editor',
        ativo: item.ativo !== false,
        tipo: emailNorm.endsWith('@marinha.mil.br') ? 'institucional' : (emailNorm.endsWith('@gmail.com') ? 'google' : 'outro')
    };
    if (idx >= 0) cache[idx] = obj;
    else cache.push(obj);
    salvarCacheEmailsAutorizados(cache);
}

function removerDoCacheEmailAutorizado(email) {
    if (!email) return;
    const emailNorm = email.toLowerCase().trim();
    const cache = obterCacheEmailsAutorizados().filter(c => {
        const em = (typeof c === 'string' ? c : c.email || '').toLowerCase().trim();
        return em !== emailNorm;
    });
    salvarCacheEmailsAutorizados(cache);
}

// Verifica se um e-mail está autorizado a acessar os módulos do sistema
async function verificarEmailAutorizado(email) {
    if (!email) return { autorizado: false, motivo: "E-mail não informado." };
    email = email.trim().toLowerCase();

    // 1. Super Admins e Administradores Oficiais sempre passam
    if (SUPER_ADMIN_EMAILS.some(e => e.toLowerCase() === email) || email.includes('sacrasub') || email === 'cristiano.sacramento@marinha.mil.br') {
        return { autorizado: true, role: 'super_admin', nome: 'Administrador', ehSuperAdmin: true };
    }

    // 2. Consulta Firestore na coleção 'perfis_usuarios'
    if (firebaseDb) {
        try {
            const q = await firebaseDb.collection('perfis_usuarios')
                .where('email', '==', email)
                .limit(1)
                .get();

            if (!q.empty) {
                const data = q.docs[0].data();
                if (data.ativo === false) {
                    return { autorizado: false, motivo: "O acesso deste e-mail foi desativado pelo Administrador." };
                }
                atualizarCacheEmailAutorizado(data);
                return { autorizado: true, role: data.role || 'editor', nome: data.nome || email.split('@')[0].toUpperCase(), profile: data };
            }

            // 3. Consulta Firestore na coleção 'autorizacoes' (usada também pela Agenda CFT)
            const autoSnap = await firebaseDb.collection('autorizacoes').doc(email).get();
            if (autoSnap.exists) {
                const aData = autoSnap.data();
                if (aData.ativo === false) {
                    return { autorizado: false, motivo: "O acesso deste e-mail foi desativado pelo Administrador." };
                }
                const res = { autorizado: true, role: aData.cargo?.toLowerCase().includes('admin') ? 'admin' : 'editor', nome: aData.nome || email.split('@')[0].toUpperCase() };
                atualizarCacheEmailAutorizado({ email, ...res });
                return res;
            }
        } catch (fsErr) {
            console.warn("[Auth] Erro ao consultar autorizações no Firestore:", fsErr.message);
        }
    }

    // 4. Consulta no Supabase se disponível
    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        try {
            const { data } = await supabaseClient
                .from('perfis_usuarios')
                .select('*')
                .eq('email', email)
                .maybeSingle();

            if (data) {
                if (data.ativo === false) {
                    return { autorizado: false, motivo: "O acesso deste e-mail foi desativado pelo Administrador." };
                }
                atualizarCacheEmailAutorizado(data);
                return { autorizado: true, role: data.role || 'editor', nome: data.nome || email.split('@')[0].toUpperCase(), profile: data };
            }
        } catch (sbErr) {
            console.warn("[Auth] Erro ao consultar Supabase para autorização:", sbErr.message);
        }
    }

    // 5. Consulta no Cache local de contingência
    try {
        const cache = obterCacheEmailsAutorizados();
        const found = cache.find(item => {
            const em = (typeof item === 'string' ? item : item.email || '').toLowerCase().trim();
            return em === email;
        });
        if (found) {
            if (typeof found === 'object' && found.ativo === false) {
                return { autorizado: false, motivo: "O acesso deste e-mail foi desativado pelo Administrador." };
            }
            return {
                autorizado: true,
                role: (typeof found === 'object' ? found.role : null) || 'editor',
                nome: (typeof found === 'object' ? found.nome : null) || email.split('@')[0].toUpperCase()
            };
        }
    } catch(e) {}

    return {
        autorizado: false,
        motivo: `O e-mail "${email}" não está cadastrado na lista de acessos autorizados pelo Administrador.`
    };
}
window.verificarEmailAutorizado = verificarEmailAutorizado;

let _authObserverCallback = null;

// Observador de estado de autenticação (Firebase Auth + Sessão Local)
function setupAuthObserver(onAuthStateChanged) {
    _authObserverCallback = onAuthStateChanged;
    // 1. Restaurar sessão persistida imediatamente se existir (com verificação de autorização)
    const sessaoSalva = localStorage.getItem('comsoc_active_session');
    if (sessaoSalva) {
        try {
            currentUser = JSON.parse(sessaoSalva);
            console.log("[Auth] Verificando autorização para sessão salva:", currentUser.email);
            verificarEmailAutorizado(currentUser.email).then(async (check) => {
                if (!check.autorizado) {
                    console.warn("[Auth] Sessão existente revogada:", currentUser.email);
                    localStorage.removeItem('comsoc_active_session');
                    currentUser = null;
                    currentProfile = null;
                    if (typeof onAuthStateChanged === 'function') {
                        onAuthStateChanged(null, null, null, 'UNAUTHORIZED');
                    }
                    return;
                }
                await loadUserProfileAndOrg();
                if (typeof onAuthStateChanged === 'function') {
                    onAuthStateChanged(currentUser, currentProfile, currentOrg, 'LOCAL_RESTORE');
                }
            }).catch(e => {
                console.warn("[Auth] Erro na validação da sessão salva:", e);
            });
        } catch (e) {
            console.warn("[Auth] Erro ao restaurar sessão:", e);
        }
    }

    if (!firebaseAuth) {
        console.warn("[Auth] firebaseAuth não disponível ainda.");
        if (!currentUser && typeof onAuthStateChanged === 'function') {
            onAuthStateChanged(null, null, null, 'INIT_EMPTY');
        }
        return;
    }

    // Verificar se retornou de um login com Google via Redirect
    if (typeof firebaseAuth.getRedirectResult === 'function') {
        firebaseAuth.getRedirectResult().then(async (result) => {
            if (result && result.user) {
                const userEmail = (result.user.email || '').toLowerCase().trim();
                const check = await verificarEmailAutorizado(userEmail);
                if (!check.autorizado) {
                    await firebaseAuth.signOut();
                    localStorage.removeItem('comsoc_active_session');
                    alert(`Acesso negado: O e-mail Google "${userEmail}" não está cadastrado pelo Administrador.`);
                    return;
                }
                console.log("[Auth] Login via redirect bem-sucedido:", userEmail);
                currentUser = {
                    uid: result.user.uid,
                    email: userEmail,
                    displayName: result.user.displayName || userEmail.split('@')[0].toUpperCase()
                };
                localStorage.setItem('comsoc_active_session', JSON.stringify(currentUser));
                await loadUserProfileAndOrg();
                if (typeof onAuthStateChanged === 'function') {
                    onAuthStateChanged(currentUser, currentProfile, currentOrg, 'REDIRECT_LOGIN');
                }
            }
        }).catch(err => {
            if (err.code !== 'auth/credential-already-in-use') {
                console.warn("[Auth] Resultado de redirecionamento:", err.message || err);
            }
        });
    }

    // 2. Observador do Firebase Auth
    firebaseAuth.onAuthStateChanged(async (user) => {
        console.log("[Auth] Firebase Auth State Change:", user ? user.email : "deslogado");
        if (user) {
            const userEmail = (user.email || '').toLowerCase().trim();
            const check = await verificarEmailAutorizado(userEmail);
            if (!check.autorizado) {
                console.warn("[Auth] Usuário desautorizado no Firebase Auth State:", userEmail);
                try { await firebaseAuth.signOut(); } catch(e) {}
                localStorage.removeItem('comsoc_active_session');
                currentUser = null;
                currentProfile = null;
                if (typeof onAuthStateChanged === 'function') {
                    onAuthStateChanged(null, null, null, 'UNAUTHORIZED');
                }
                return;
            }
            currentUser = {
                uid: user.uid,
                email: userEmail,
                displayName: user.displayName || (userEmail ? userEmail.split('@')[0].toUpperCase() : 'USUÁRIO')
            };
            localStorage.setItem('comsoc_active_session', JSON.stringify(currentUser));
            await loadUserProfileAndOrg();
        } else if (!sessaoSalva) {
            currentUser = null;
            currentProfile = null;
            currentOrg = null;
            isSuperAdmin = false;
            todasOrganizacoes = [];
        }
        if (typeof onAuthStateChanged === 'function') {
            onAuthStateChanged(currentUser, currentProfile, currentOrg, 'STATE_CHANGED');
        }
    });
}

// Carregar Perfil e Organização do Usuário Ativo via Firestore (com contingência)
async function loadUserProfileAndOrg() {
    if (!currentUser) return;

    const email = (currentUser.email || '').toLowerCase().trim();
    const uid = currentUser.uid || ('usr_' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 24));
    currentUser.uid = uid;

    // Detectar Super Admin usando a checagem global
    isSuperAdmin = isUsuarioAdmin(currentUser, currentProfile);
    window.isSuperAdmin = isSuperAdmin;

    // 1. Tentar ler do Firestore
    let profile = null;
    let org = null;

    if (firebaseDb) {
        try {
            const profileDoc = await firebaseDb.collection('perfis_usuarios').doc(uid).get();
            if (profileDoc.exists) {
                profile = { id: profileDoc.id, ...profileDoc.data() };
            } else if (email) {
                const queryEmail = await firebaseDb.collection('perfis_usuarios')
                    .where('email', '==', email)
                    .limit(1)
                    .get();

                if (!queryEmail.empty) {
                    const foundDoc = queryEmail.docs[0];
                    profile = { id: uid, ...foundDoc.data(), email: email };
                    try {
                        await firebaseDb.collection('perfis_usuarios').doc(uid).set(profile, { merge: true });
                    } catch (e) {}
                }
            }

            // Se for super admin e a org ainda não existe no Firestore, inicializar 'cft'
            if (isSuperAdmin) {
                try {
                    let orgSnap = await firebaseDb.collection('organizacoes').doc('cft').get();
                    if (!orgSnap.exists) {
                        const defaultOrgData = {
                            id: 'cft',
                            nome_curto: 'CFT',
                            nome_completo: 'Capitania Fluvial de Tabatinga',
                            orgao_superior: 'Comando do 9º Distrito Naval',
                            slogan: 'Protegendo as nossas Riquezas, Cuidando da nossa Gente',
                            tema: 'naval',
                            modulos_habilitados: ['directory', 'agenda', 'comsoc', 'comsoc-controles', 'processos', 'votacao'],
                            modulos_externos: [],
                            localizacao: 'Tabatinga - AM',
                            criado_em: new Date().toISOString()
                        };
                        await firebaseDb.collection('organizacoes').doc('cft').set(defaultOrgData);
                        org = defaultOrgData;
                    } else {
                        org = { id: orgSnap.id, ...orgSnap.data() };
                    }
                } catch (e) {
                    console.warn("[Auth] Aviso ao acessar organizacoes no Firestore:", e.message);
                }
            }

            if (!profile && isSuperAdmin) {
                profile = {
                    id: uid,
                    org_id: 'cft',
                    role: 'super_admin',
                    nome: currentUser.displayName || (email.split('@')[0].toUpperCase()),
                    email: email,
                    forcar_troca_senha: false,
                    ativo: true,
                    tipo_email: email.endsWith('@marinha.mil.br') ? 'institucional' : (email.endsWith('@gmail.com') ? 'google' : 'outro'),
                    criado_em: new Date().toISOString()
                };
                try {
                    await firebaseDb.collection('perfis_usuarios').doc(uid).set(profile);
                } catch (e) {}
            }

            if (profile && !org && profile.org_id) {
                try {
                    const orgDoc = await firebaseDb.collection('organizacoes').doc(profile.org_id).get();
                    if (orgDoc.exists) {
                        org = { id: orgDoc.id, ...orgDoc.data() };
                    }
                } catch (e) {}
            }

            // Carregar todas as organizações para o Super Admin
            if (isSuperAdmin) {
                try {
                    const allOrgsSnap = await firebaseDb.collection('organizacoes').get();
                    todasOrganizacoes = [];
                    allOrgsSnap.forEach(d => todasOrganizacoes.push({ id: d.id, ...d.data() }));
                    todasOrganizacoes.sort((a,b) => (a.nome_curto || '').localeCompare(b.nome_curto || ''));
                } catch (e) {}
            }
        } catch (e) {
            console.warn("[Auth] Firestore protegido ou offline, utilizando perfil autônomo:", e.message);
        }
    }

    // 2. Garantia de perfil e organização (Contingência à prova de falhas)
    if (!org) {
        org = {
            id: 'cft',
            nome_curto: 'CFT',
            nome_completo: 'Capitania Fluvial de Tabatinga',
            orgao_superior: 'Comando do 9º Distrito Naval',
            slogan: 'Protegendo as nossas Riquezas, Cuidando da nossa Gente',
            tema: 'naval',
            modulos_habilitados: ['directory', 'agenda', 'comsoc', 'comsoc-controles', 'processos', 'votacao'],
            modulos_externos: [],
            localizacao: 'Tabatinga - AM'
        };
    }

    if (!profile) {
        profile = {
            id: uid,
            org_id: org.id,
            role: isSuperAdmin ? 'super_admin' : 'editor',
            nome: currentUser.displayName || (email ? email.split('@')[0].toUpperCase() : 'OFICIAL'),
            email: email,
            ativo: true,
            forcar_troca_senha: false
        };
    }

    // Atualizar se for Super Admin identificado posteriormente
    if (isSuperAdmin && profile.role !== 'super_admin') {
        profile.role = 'super_admin';
    }

    currentProfile = profile;
    currentOrg = org;
    if (todasOrganizacoes.length === 0) {
        todasOrganizacoes = [org];
    }
}

// Fazer Login com Email (Funcional @marinha.mil.br ou Pessoal @gmail.com)
async function signIn(email, password) {
    email = (email || '').trim().toLowerCase();
    if (!email) throw new Error("Por favor, digite seu e-mail.");

    // Validação de acesso rigorosa: somente e-mails autorizados pelo Admin
    const authCheck = await verificarEmailAutorizado(email);
    if (!authCheck.autorizado) {
        throw new Error(authCheck.motivo || `Acesso não autorizado: O e-mail "${email}" não está cadastrado pelo Administrador. Solicite sua inclusão a sacrasub@mail.com ou cristiano.sacramento@marinha.mil.br.`);
    }

    const isSuper = isUsuarioAdmin({ email });

    // Se senha foi digitada e Firebase Auth está disponível, tenta autenticar no Firebase Auth
    if (password && firebaseAuth) {
        try {
            const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
            currentUser = {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: userCredential.user.displayName || email.split('@')[0].toUpperCase()
            };
            localStorage.setItem('comsoc_active_session', JSON.stringify(currentUser));
            await loadUserProfileAndOrg();
            return { user: currentUser };
        } catch (e) {
            console.warn("Tentativa de login com senha no Firebase Auth:", e.code || e.message);

            // Se o usuário ainda não foi cadastrado no Firebase Auth, tenta criá-lo automaticamente
            if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
                try {
                    const newCred = await firebaseAuth.createUserWithEmailAndPassword(email, password);
                    currentUser = {
                        uid: newCred.user.uid,
                        email: newCred.user.email,
                        displayName: newCred.user.displayName || email.split('@')[0].toUpperCase()
                    };
                    localStorage.setItem('comsoc_active_session', JSON.stringify(currentUser));
                    await loadUserProfileAndOrg();
                    return { user: currentUser };
                } catch (regErr) {
                    console.warn("Auto-registro no Firebase Auth falhou:", regErr.code);
                    if (regErr.code === 'auth/wrong-password') {
                        throw new Error("Senha incorreta.");
                    }
                }
            }

            if (!isSuper && e.code !== 'auth/operation-not-allowed') {
                if (e.code === 'auth/wrong-password') {
                    throw new Error("Senha incorreta.");
                }
            }
        }
    }

    // Tentar autenticar anonimamente se Firebase Auth estiver ativo sem usuário conectado
    if (firebaseAuth && !firebaseAuth.currentUser) {
        try {
            await firebaseAuth.signInAnonymously();
        } catch (anonErr) {
            // Ignora se provedor anônimo estiver desligado
        }
    }

    // Acesso direto por e-mail (Login simplificado para Oficiais/Militares da OM autorizados)
    const safeUid = (firebaseAuth && firebaseAuth.currentUser)
        ? firebaseAuth.currentUser.uid
        : ('usr_' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 24));

    currentUser = {
        uid: safeUid,
        email: email,
        displayName: authCheck.nome || email.split('@')[0].toUpperCase()
    };

    localStorage.setItem('comsoc_active_session', JSON.stringify(currentUser));
    await loadUserProfileAndOrg();
    return { user: currentUser };
}

// Fazer Login com Conta Google (@gmail.com)
async function signInWithGoogle() {
    if (!firebaseAuth) throw new Error("Firebase Auth não inicializado.");
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const userCredential = await firebaseAuth.signInWithPopup(provider);
        const user = userCredential.user;
        const googleEmail = (user.email || '').toLowerCase().trim();

        // Checagem rigorosa de autorização
        const authCheck = await verificarEmailAutorizado(googleEmail);
        if (!authCheck.autorizado) {
            try { await firebaseAuth.signOut(); } catch(e) {}
            localStorage.removeItem('comsoc_active_session');
            currentUser = null;
            currentProfile = null;
            throw new Error(`Acesso não autorizado: O e-mail Google "${googleEmail}" não está cadastrado pelo Administrador. Solicite a liberação a sacrasub@mail.com ou cristiano.sacramento@marinha.mil.br.`);
        }

        currentUser = {
            uid: user.uid,
            email: googleEmail,
            displayName: user.displayName || googleEmail.split('@')[0].toUpperCase()
        };
        localStorage.setItem('comsoc_active_session', JSON.stringify(currentUser));
        await loadUserProfileAndOrg();
        return userCredential;
    } catch (e) {
        console.error("Erro ao efetuar login com Google:", e);
        if (e.code === 'auth/unauthorized-domain') {
            const host = window.location.hostname;
            const msg = `O domínio "${host}" não está autorizado no Firebase Authentication.\n\nPara liberar:\n1. Acesse o Firebase Console (projeto agenda-cft-01)\n2. Vá em Authentication > Configurações > Domínios autorizados\n3. Adicione "${host}" e salve.`;
            alert(msg);
            throw new Error(`Domínio ${host} precisa ser adicionado aos Domínios Autorizados no Firebase Console.`);
        }
        if (e.code === 'auth/popup-blocked') {
            const provider = new firebase.auth.GoogleAuthProvider();
            await firebaseAuth.signInWithRedirect(provider);
            return;
        }
        if (e.code === 'auth/popup-closed-by-user') {
            throw new Error("Janela do Google fechada antes da confirmação.");
        }
        throw e;
    }
}

// Fazer Logout
async function signOut() {
    try {
        if (firebaseAuth) {
            await firebaseAuth.signOut();
        }
    } catch (e) {
        console.error("Erro no signOut do Firebase:", e);
    }
    localStorage.removeItem('comsoc_active_session');
    localStorage.removeItem('cft_votacao_oficial_logado');
    currentUser = null;
    currentProfile = null;
    currentOrg = null;
    isSuperAdmin = false;
    todasOrganizacoes = [];
    if (typeof _authObserverCallback === 'function') {
        _authObserverCallback(null, null, null, 'SIGNOUT');
    }
}

// Cadastrar Novo Órgão / ComSoc (Sign Up Administrativo)
async function signUpNewOrg(email, password, nomeAdmin, nomeCurtoOrg, nomeCompletoOrg, orgaoSuperior, slogan, tema = 'naval', modulosHabilitados = ['directory','agenda','comsoc','comsoc-controles']) {
    email = email.trim().toLowerCase();
    const orgId = nomeCurtoOrg.toLowerCase().replace(/[^a-z0-9]/g, '') || ('org_' + Date.now());
    const org = {
        id: orgId,
        nome_curto: nomeCurtoOrg,
        nome_completo: nomeCompletoOrg,
        orgao_superior: orgaoSuperior,
        slogan: slogan,
        tema: tema,
        modulos_habilitados: modulosHabilitados,
        modulos_externos: [],
        criado_em: new Date().toISOString()
    };

    if (firebaseDb) {
        try {
            await firebaseDb.collection('organizacoes').doc(orgId).set(org);
        } catch (e) {}
    }

    const safeUid = 'usr_' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 24);
    const profile = {
        id: safeUid,
        org_id: org.id,
        role: 'admin',
        nome: nomeAdmin,
        email: email,
        ativo: true,
        tipo_email: email.endsWith('@marinha.mil.br') ? 'institucional' : (email.endsWith('@gmail.com') ? 'google' : 'outro'),
        forcar_troca_senha: false,
        criado_em: new Date().toISOString()
    };

    if (firebaseDb) {
        try {
            await firebaseDb.collection('perfis_usuarios').doc(safeUid).set(profile);
            await firebaseDb.collection('autorizacoes').doc(email).set({
                email: email,
                nome: nomeAdmin,
                cargo: 'Administrador',
                criado_em: new Date().toISOString()
            }, { merge: true });
        } catch (e) {}
    }

    atualizarCacheEmailAutorizado(profile);

    return { user: profile, org };
}

// Atualizar Módulos Habilitados de uma Organização (Super Admin)
async function atualizarModulosOrg(orgId, modulosHabilitados) {
    if (!isUsuarioAdmin(currentUser, currentProfile)) throw new Error('Acesso negado. Apenas Administradores podem alterar módulos.');
    if (firebaseDb) {
        try {
            await firebaseDb.collection('organizacoes').doc(orgId).update({
                modulos_habilitados: modulosHabilitados
            });
        } catch (e) {}
    }
    if (currentOrg && currentOrg.id === orgId) {
        currentOrg.modulos_habilitados = modulosHabilitados;
    }
    const orgNaLista = todasOrganizacoes.find(o => o.id === orgId);
    if (orgNaLista) orgNaLista.modulos_habilitados = modulosHabilitados;
    if (typeof registrarLogAlteracao === 'function') {
        await registrarLogAlteracao('organizacoes', 'editar', `Administrador atualizou módulos do ComSoc: ${orgId}`);
    }
}

// Criar outro usuário dentro do mesmo ComSoc / Cadastrar E-mail Autorizado (apenas admins)
async function createUserForOrg(email, password, nome, role) {
    if (!isUsuarioAdmin(currentUser, currentProfile)) {
        throw new Error("Apenas administradores podem cadastrar e autorizar novos e-mails.");
    }
    email = email.trim().toLowerCase();
    const newUserId = 'usr_' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 24);
    const profile = {
        id: newUserId,
        org_id: (currentOrg && currentOrg.id) ? currentOrg.id : 'cft',
        role: role || 'editor',
        nome: nome,
        email: email,
        ativo: true,
        tipo_email: email.endsWith('@marinha.mil.br') ? 'institucional' : (email.endsWith('@gmail.com') ? 'google' : 'outro'),
        cadastrado_por: (currentUser && currentUser.email) || 'admin',
        forcar_troca_senha: false,
        criado_em: new Date().toISOString()
    };

    // 1. Salvar no Firestore: perfis_usuarios
    if (firebaseDb) {
        try {
            await firebaseDb.collection('perfis_usuarios').doc(newUserId).set(profile, { merge: true });
        } catch(e) {
            console.warn("[Auth] Erro ao gravar no Firestore perfis_usuarios:", e);
        }
        // 2. Salvar no Firestore: autorizacoes (Sincronizado diretamente com a Agenda CFT)
        try {
            await firebaseDb.collection('autorizacoes').doc(email).set({
                email: email,
                nome: nome,
                cargo: (role === 'admin' || role === 'super_admin') ? 'Comandante/COMSOC' : 'Militar Autorizado',
                ativo: true,
                criado_em: new Date().toISOString()
            }, { merge: true });
        } catch(e) {
            console.warn("[Auth] Erro ao gravar no Firestore autorizacoes:", e);
        }
    }

    // 3. Salvar no Supabase se ativo
    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        try {
            await supabaseClient.from('perfis_usuarios').upsert([profile]);
        } catch (e) {}
    }

    // 4. Salvar no cache local
    atualizarCacheEmailAutorizado(profile);

    return profile;
}

// Alternar organização ativa (Super Admin)
async function alternarOrganizacaoSuperAdmin(orgId) {
    if (!isUsuarioAdmin(currentUser, currentProfile) || !todasOrganizacoes) return;
    const novaOrg = todasOrganizacoes.find(o => o.id === orgId);
    if (novaOrg) {
        currentOrg = novaOrg;
        console.log("Admin alterou organização ativa para: " + novaOrg.nome_curto);
        
        if (typeof comsocPanelLoaded !== 'undefined') comsocPanelLoaded = false;
        if (typeof comsocControlesPanelLoaded !== 'undefined') comsocControlesPanelLoaded = false;
        
        if (typeof recarregarAplicacaoCompleta === 'function') {
            await recarregarAplicacaoCompleta();
        }
        showToast("ComSoc ativo alterado para: " + novaOrg.nome_curto, "success");
    }
}

// Gerar UUID provisório
function gen_random_uuid_client() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Verificar permissões RBAC com suporte explícito a super_admin
function checkUserPermission(requiredRole) {
    if (!currentProfile) return false;
    const roles = {
        'super_admin': 4,
        'admin': 3,
        'editor': 2,
        'visualizador': 1
    };
    return (roles[currentProfile.role] || 0) >= (roles[requiredRole] || 0);
}
