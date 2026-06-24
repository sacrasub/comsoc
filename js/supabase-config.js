// Configurações globais de conexão do Supabase
const SUPABASE_URL = 'https://uoeeqvqotwytvzryavqj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_oIGVzb7kb1kpcUvRtL7Mow_pubRRbw0';

let supabaseClient = null;

try {
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("Supabase Client inicializado com sucesso.");
    } else {
        console.error("SDK do Supabase não carregado. Verifique a importação no HTML.");
    }
} catch (e) {
    console.error("Erro ao inicializar o cliente Supabase:", e);
}
