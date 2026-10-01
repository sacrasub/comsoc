/**
 * ================================================================
 * SEV-CFT – Sistema Eletrônico de Votação v1.1
 * Capitania Fluvial de Tabatinga – Marinha do Brasil
 * ================================================================
 * Novidades v1.1:
 *  - Autenticação por NIP antes de confirmar voto
 *  - Foto dos candidatos (Base64 redimensionada)
 *  - Renomeado "Eleitor" → "Oficial" em toda a UI
 *  - Edição completa de oficiais (mesmo os que já votaram)
 *  - Importação CSV de Oficiais e Candidatos com preview
 *  - Download de templates CSV
 * ================================================================
 */

'use strict';

/* ================================================================
   CONFIGURAÇÃO SUPABASE — Urna Remota Descentralizada
   Para ativar a votação pela internet (cada oficial votando de seu celular):
     1. Crie um projeto gratuito no Supabase (https://supabase.com).
     2. Execute o script "supabase-sev-votacao.sql" no SQL Editor do painel.
     3. Preencha a URL e a Anon Key abaixo e mude "ativo" para true.
   ================================================================ */
const SUPABASE_CONFIG = {
  url: 'https://uoeeqvqotwytvzryavqj.supabase.co',
  anonKey: 'sb_publishable_oIGVzb7kb1kpcUvRtL7Mow_pubRRbw0',
  ativo: true
};

/* ================================================================
   MODULE: SupabaseSyncService
   ================================================================ */
const SupabaseSyncService = (() => {
  let supabaseClient = null;

  const inicializar = () => {
    if (!SUPABASE_CONFIG.ativo || !SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) return false;
    try {
      if (window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        console.log('[Supabase] Conectado e ativo em segundo plano.');
        return true;
      }
    } catch (e) {
      console.error('[Supabase] Falha ao inicializar cliente:', e);
    }
    return false;
  };

  const isAtivo = () => !!supabaseClient;

  const enviarParaNuvem = async (tabela, dados, eventoId) => {
    if (!isAtivo()) return;
    try {
      if (tabela === 'eventos') {
        const payload = dados.map(e => ({
          id: e.id, nome: e.nome, tipo: e.tipo, data: e.data, status: e.status, descricao: e.descricao || ''
        }));
        await supabaseClient.from('sev_eventos').upsert(payload);
      }
      else if (tabela === 'eleitores' && eventoId) {
        const payload = dados.map(e => ({
          id: e.id, evento_id: eventoId, nome_completo: e.nomeCompleto, posto: e.posto, especialidade: e.especialidade || '', nip: e.nip, votou: !!e.votou, antiguidade: e.antiguidade || 9999
        }));
        await supabaseClient.from('sev_eleitores').upsert(payload);
      }
      else if (tabela === 'candidatosSO' && eventoId) {
        const payload = dados.map(e => ({
          id: e.id, evento_id: eventoId, nome: e.nome, posto: e.posto, especialidade: e.especialidade || '', nip: e.nip, numero: e.numero, foto: e.foto || '', grupo: 'so'
        }));
        await supabaseClient.from('sev_candidatos').upsert(payload);
      }
      else if (tabela === 'candidatosCB' && eventoId) {
        const payload = dados.map(e => ({
          id: e.id, evento_id: eventoId, nome: e.nome, posto: e.posto, especialidade: e.especialidade || '', nip: e.nip, numero: e.numero, foto: e.foto || '', grupo: 'cb'
        }));
        await supabaseClient.from('sev_candidatos').upsert(payload);
      }
      else if (tabela === 'votos' && eventoId) {
        const payload = dados.map(e => ({
          id: e.id, evento_id: eventoId, eleitor: e.eleitor, candidato_so: e.candidatoSO || null, candidato_cb: e.candidatoCB || null, data: e.data, hora: e.hora, timestamp: e.timestamp
        }));
        await supabaseClient.from('sev_votos').upsert(payload);
      }
      else if (tabela === 'logs' && eventoId) {
        const payload = dados.map(e => ({
          evento_id: eventoId, tipo: e.tipo, descricao: e.descricao, data: e.data, hora: e.hora, timestamp: e.timestamp
        }));
        await supabaseClient.from('sev_logs').upsert(payload);
      }
      else if (tabela === 'historico') {
        const payload = dados.map(e => ({
          id: e.id, nome: e.nome, periodo: e.periodo, data: e.data, evento_id: e.eventoAtivoId || null, total_votos: e.totalVotos, total_eleitores: e.totalEleitores, vencedor_so: e.vencedorSO, vencedor_cb: e.vencedorCB, snap_so: e.snapSO, snap_cb: e.snapCB, registrado_em: e.registradoEm
        }));
        await supabaseClient.from('sev_historico').upsert(payload);
      }
      console.log(`[Supabase] Tabela "${tabela}" enviada para nuvem.`);
    } catch (e) {
      console.error('[Supabase] Erro ao sincronizar para nuvem:', e);
    }
  };

  const puxarDaNuvem = async () => {
    if (!isAtivo()) return;
    try {
      const { data: eventos, error: errEventos } = await supabaseClient.from('sev_eventos').select('*');
      if (eventos && !errEventos && eventos.length > 0) {
        const localEventos = eventos.map(e => ({
          id: e.id, nome: e.nome, tipo: e.tipo, data: e.data, status: e.status, descricao: e.descricao
        }));
        localStorage.setItem('cft_sev_eventos', JSON.stringify(localEventos));

        // Define automaticamente o evento ativo local caso exista um ativo na nuvem
        const eventoAtivoRemoto = eventos.find(e => e.status === 'ativo');
        if (eventoAtivoRemoto) {
          const rawLocalId = localStorage.getItem('cft_sev_eventoAtivoId');
          const localId = rawLocalId ? JSON.parse(rawLocalId) : null;
          if (localId !== eventoAtivoRemoto.id) {
            localStorage.setItem('cft_sev_eventoAtivoId', JSON.stringify(eventoAtivoRemoto.id));
          }
        }
      }

      const { data: historico, error: errHist } = await supabaseClient.from('sev_historico').select('*');
      if (historico && !errHist && historico.length > 0) {
        const localHist = historico.map(e => ({
          id: e.id, nome: e.nome, periodo: e.periodo, data: e.data, eventoAtivoId: e.evento_id, totalVotos: e.total_votos, totalEleitores: e.total_eleitores, vencedorSO: e.vencedor_so, vencedorCB: e.vencedor_cb, snapSO: e.snap_so, snapCB: e.snap_cb, registradoEm: e.registrado_em
        }));
        localStorage.setItem('cft_sev_historico', JSON.stringify(localHist));
      }

      const rawAtivoId = localStorage.getItem('cft_sev_eventoAtivoId');
      if (rawAtivoId) {
        const eventoAtivoId = JSON.parse(rawAtivoId);
        if (eventoAtivoId) {
          const { data: eleitores, error: errEl } = await supabaseClient.from('sev_eleitores').select('*').eq('evento_id', eventoAtivoId);
          if (eleitores && !errEl && eleitores.length > 0) {
            const localEl = eleitores.map(e => ({
              id: e.id, nomeCompleto: e.nome_completo, posto: e.posto, especialidade: e.especialidade, nip: e.nip, votou: e.votou, antiguidade: e.antiguidade
            }));
            localStorage.setItem(`cft_sev_eleitores_${eventoAtivoId}`, JSON.stringify(localEl));
          }

          const { data: candidatos, error: errCand } = await supabaseClient.from('sev_candidatos').select('*').eq('evento_id', eventoAtivoId);
          if (candidatos && !errCand && candidatos.length > 0) {
            const localSO = candidatos.filter(c => c.grupo === 'so').map(c => ({
              id: c.id, numero: c.numero, posto: c.posto, especialidade: c.especialidade, nip: c.nip, nome: c.nome, foto: c.foto
            }));
            const localCB = candidatos.filter(c => c.grupo === 'cb').map(c => ({
              id: c.id, numero: c.numero, posto: c.posto, especialidade: c.especialidade, nip: c.nip, nome: c.nome, foto: c.foto
            }));
            localStorage.setItem(`cft_sev_candidatosSO_${eventoAtivoId}`, JSON.stringify(localSO));
            localStorage.setItem(`cft_sev_candidatosCB_${eventoAtivoId}`, JSON.stringify(localCB));
          }

          const { data: votos, error: errVotos } = await supabaseClient.from('sev_votos').select('*').eq('evento_id', eventoAtivoId);
          if (votos && !errVotos && votos.length > 0) {
            const localVotos = votos.map(v => ({
              id: v.id, eleitor: v.eleitor, candidatoSO: v.candidato_so, candidatoCB: v.candidato_cb, data: v.data, hora: v.hora, timestamp: v.timestamp
            }));
            localStorage.setItem(`cft_sev_votos_${eventoAtivoId}`, JSON.stringify(localVotos));
          }
        }
      }
      console.log('[Supabase] Dados locais sincronizados com a nuvem.');
    } catch (e) {
      console.error('[Supabase] Erro ao sincronizar da nuvem:', e);
    }
  };

  return { inicializar, isAtivo, enviarParaNuvem, puxarDaNuvem };
})();

/* ================================================================
   MODULE: StorageService
   ================================================================ */
const StorageService = (() => {
  const PREFIX = 'cft_sev_';

  const obterChaveEvento = (chaveBase) => {
    const chavesIsoladas = ['eleitores', 'candidatosSO', 'candidatosCB', 'votos', 'logs'];
    if (chavesIsoladas.includes(chaveBase)) {
      try {
        const eventoAtivoIdRaw = localStorage.getItem(PREFIX + 'eventoAtivoId');
        if (eventoAtivoIdRaw) {
          const eventoAtivoId = JSON.parse(eventoAtivoIdRaw);
          if (eventoAtivoId) {
            return `${chaveBase}_${eventoAtivoId}`;
          }
        }
      } catch (e) {
        console.error('[Storage] Erro ao obter chave do evento:', e);
      }
      return `${chaveBase}_nenhum_evento`;
    }
    return chaveBase;
  };

  const salvar = (chave, valor) => {
    try {
      const chaveFinal = obterChaveEvento(chave);
      localStorage.setItem(PREFIX + chaveFinal, JSON.stringify(valor));

      // Sincroniza em background com o Supabase
      if (SupabaseSyncService.isAtivo()) {
        let eventoId = null;
        try {
          const raw = localStorage.getItem(PREFIX + 'eventoAtivoId');
          if (raw) eventoId = JSON.parse(raw);
        } catch (err) { }
        SupabaseSyncService.enviarParaNuvem(chave, valor, eventoId);
      }
    }
    catch (e) { console.error('[Storage] Erro ao salvar:', chave, e); }
  };

  const obter = (chave, padrao = null) => {
    try {
      const chaveFinal = obterChaveEvento(chave);
      const raw = localStorage.getItem(PREFIX + chaveFinal);
      return raw !== null ? JSON.parse(raw) : padrao;
    } catch (e) { return padrao; }
  };

  const remover = (chave) => {
    const chaveFinal = obterChaveEvento(chave);
    localStorage.removeItem(PREFIX + chaveFinal);
  };

  const limparTudo = () =>
    Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).forEach(k => localStorage.removeItem(k));

  const exportarTudo = () => {
    // Exportar todo o localStorage que inicia com o prefixo para preservar todos os eventos
    const dados = {};
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(PREFIX)) {
        const chaveSemPrefixo = k.substring(PREFIX.length);
        try {
          dados[chaveSemPrefixo] = JSON.parse(localStorage.getItem(k));
        } catch (e) {
          dados[chaveSemPrefixo] = localStorage.getItem(k);
        }
      }
    });
    return {
      backupCompleto: true,
      dados: dados,
      exportadoEm: new Date().toISOString(),
      versao: '1.2.0',
    };
  };

  const restaurarTudo = (backup) => {
    if (backup.backupCompleto && backup.dados) {
      Object.entries(backup.dados).forEach(([chave, valor]) => {
        try {
          localStorage.setItem(PREFIX + chave, JSON.stringify(valor));
        } catch (e) {
          localStorage.setItem(PREFIX + chave, valor);
        }
      });
    } else {
      // Compatibilidade com backups antigos
      ['eleitores', 'candidatosSO', 'candidatosCB', 'votos', 'config', 'logs', 'estatisticas']
        .forEach(c => { if (backup[c] !== undefined) salvar(c, backup[c]); });
    }
  };

  return { salvar, obter, remover, limparTudo, exportarTudo, restaurarTudo };
})();


/* ================================================================
   MODULE: DadosIniciais
   ================================================================ */
const DadosIniciais = (() => {
  // DADOS REAIS: CFT - Capitania Fluvial de Tabatinga - Eleicao 2026
  // NIPs a verificar: el-so-010 08.0811.84 | el-so-027 15.0234.01
  //   el-so-033/035 NIP DUPLICADO 15.0197.99 | el-cb-002 18.0139.11
  //   el-cb-009 21.0512.41 | el-cb-011 21.0779.41
  const ELEITORES = [
    { id: 'el-001', posto: 'CF', especialidade: 'IN', nip: '11.1111.1-9', nomeCompleto: 'Eduardo Guimaraes de Held', antiguidade: 1, votou: false },
    { id: 'el-002', posto: 'CC', especialidade: 'AA', nip: '22.2222.2-7', nomeCompleto: 'Daniel Costa de Souza', antiguidade: 2, votou: false },
    { id: 'el-003', posto: 'CT', especialidade: 'IM', nip: '33.3333.3-5', nomeCompleto: 'Matheus Bispo Pires da Silva', antiguidade: 3, votou: false },
    { id: 'el-004', posto: '1º Ten', especialidade: 'IN', nip: '44.4444.4-3', nomeCompleto: 'Kelly Rodrigues Veras', antiguidade: 4, votou: false },
    { id: 'el-005', posto: '1º Ten', especialidade: 'IN', nip: '55.5555.5-1', nomeCompleto: 'Camila Cravero da Silva', antiguidade: 5, votou: false },
    { id: 'el-006', posto: '1º Ten', especialidade: 'IN', nip: '66.6666.6-0', nomeCompleto: 'Luiz Henrique Costa Balieiro', antiguidade: 6, votou: false },
    { id: 'el-007', posto: '2º Ten', especialidade: 'IN', nip: '77.7777.7-8', nomeCompleto: 'Leonardo Barbosa Azevedo', antiguidade: 7, votou: false },
  ];

  const CANDIDATOS_SO = [
    { id: 'so-001', numero: 1, posto: 'SO', especialidade: 'CI', nip: '97.1057.91', nome: 'CRISTIANO DO SACRAMENTO SOARES', foto: '' },
    { id: 'so-002', numero: 2, posto: 'SO', especialidade: 'HN', nip: '97.0182.87', nome: 'EDSON ROGERIO ROSA RIBEIRO DOS SANTOS', foto: '' },
    { id: 'so-003', numero: 3, posto: 'SO', especialidade: 'MO', nip: '99.2056.53', nome: 'WEVERTON LUIZ FRANCA', foto: '' },
    { id: 'so-004', numero: 4, posto: 'SO', especialidade: 'PL', nip: '99.1860.39', nome: 'HUMBERTO MARINO DOS SANTOS SERRA', foto: '' },
    { id: 'so-005', numero: 5, posto: 'SO', especialidade: 'MO', nip: '97.1125.42', nome: 'EDVALDO VICENTE DE SOUZA', foto: '' },
    { id: 'so-006', numero: 6, posto: 'SO', especialidade: 'ET-SB', nip: '01.0369.55', nome: 'ROGERIO CORREIA DE OLIVEIRA JUNIOR', foto: '' },
    { id: 'so-007', numero: 7, posto: '1SG', especialidade: 'CN', nip: '07.1546.58', nome: 'BRUNO RODRIGUES RUBEM', foto: '' },
    { id: 'so-008', numero: 8, posto: '1SG', especialidade: 'MO-SB', nip: '05.0624.38', nome: 'TIAGO GONCALVES FARIA', foto: '' },
    { id: 'so-009', numero: 9, posto: '1SG', especialidade: 'MT', nip: '06.0301.06', nome: 'MIGUEL ANGELO NEPOMUCENO DE LIMA', foto: '' },
    { id: 'so-010', numero: 10, posto: '2SG', especialidade: 'ET', nip: '08.0811.84', nome: 'FRANCISCO TOMAZ VIEIRA ANGELO', foto: '' },
    { id: 'so-011', numero: 11, posto: '2SG', especialidade: 'MA', nip: '14.0992.17', nome: 'NILTON DA SILVA CARVALHO JUNIOR', foto: '' },
    { id: 'so-012', numero: 12, posto: '2SG', especialidade: 'BA', nip: '09.0075.71', nome: 'FERNANDO PARANHOS AZEVEDO', foto: '' },
    { id: 'so-013', numero: 13, posto: '2SG', especialidade: 'AM', nip: '09.0214.42', nome: 'RAMON GUIMARAES SOUZA', foto: '' },
    { id: 'so-014', numero: 14, posto: '2SG', especialidade: 'PL', nip: '10.0164.73', nome: 'MAICON APARECIDO GOMES DA COSTA', foto: '' },
    { id: 'so-015', numero: 15, posto: '2SG', especialidade: 'AR', nip: '11.0354.12', nome: 'MAURO AZOLA ULTRAMAR', foto: '' },
    { id: 'so-016', numero: 16, posto: '2SG', especialidade: 'ET', nip: '11.0261.62', nome: 'RODRIGO CORREA DA COSTA', foto: '' },
    { id: 'so-017', numero: 17, posto: '3SG', especialidade: 'QI', nip: '15.1637.33', nome: 'EMILSON PONTES GERALDO', foto: '' },
    { id: 'so-018', numero: 18, posto: '3SG', especialidade: 'CN', nip: '13.0332.98', nome: 'JOSE VINICIUS RAMOS FERNANDES COUSAQUIVITI', foto: '' },
    { id: 'so-019', numero: 19, posto: '3SG', especialidade: 'DT', nip: '13.0121.18', nome: 'CARLOS HENRIQUE LIMA DO DESTERRO', foto: '' },
    { id: 'so-020', numero: 20, posto: '3SG', especialidade: 'SQ', nip: '14.0052.71', nome: 'DIMAS BARBOSA', foto: '' },
    { id: 'so-021', numero: 21, posto: '3SG', especialidade: 'EL', nip: '14.0170.67', nome: 'WELDER UCHOA SILVA GOMES', foto: '' },
    { id: 'so-022', numero: 22, posto: '3SG', especialidade: 'EL', nip: '11.0691.55', nome: 'REINILSON DO NASCIMENTO OLIVEIRA', foto: '' },
    { id: 'so-023', numero: 23, posto: '3SG', especialidade: 'MO', nip: '14.0124.64', nome: 'MATHEUS ALVES DE OLIVEIRA', foto: '' },
    { id: 'so-024', numero: 24, posto: '3SG', especialidade: 'SQ', nip: '15.0289.92', nome: 'JOAO CLEBER DA SILVA PAZ', foto: '' },
    { id: 'so-025', numero: 25, posto: '3SG', especialidade: 'MR', nip: '87.3815.67', nome: 'LUIZ JONAS MESSIAS JUNIOR', foto: '' },
    { id: 'so-026', numero: 26, posto: '3SG', especialidade: 'SQ', nip: '13.1220.70', nome: 'INACIO CARVALHO GUIMARAES', foto: '' },
    { id: 'so-027', numero: 27, posto: '3SG', especialidade: 'MO', nip: '15.0234.01', nome: 'JOAO MARCOS FARIAS RAMOS', foto: '' },
    { id: 'so-028', numero: 28, posto: '3SG', especialidade: 'ET', nip: '15.0193.73', nome: 'RODRIGO PINTO DA SILVA TEIXEIRA', foto: '' },
    { id: 'so-029', numero: 29, posto: '3SG', especialidade: 'EL', nip: '15.0313.57', nome: 'EVERTON PEREZ MATTOS FERREIRA', foto: '' },
    { id: 'so-030', numero: 30, posto: '3SG', especialidade: 'MA', nip: '15.0308.57', nome: 'JOSE THOMAZ FEIO BARROSO', foto: '' },
    { id: 'so-031', numero: 31, posto: '3SG', especialidade: 'MR', nip: '15.0362.51', nome: 'ERLLEY JOEL FRANCA DOS SANTOS', foto: '' },
    { id: 'so-032', numero: 32, posto: '3SG', especialidade: 'MO', nip: '15.0338.56', nome: 'DIEGO DA SILVA MARINHO', foto: '' },
    { id: 'so-033', numero: 33, posto: '3SG', especialidade: 'MC', nip: '15.0197.99', nome: 'ROBSON SANTOS DA SILVA', foto: '' },
    { id: 'so-034', numero: 34, posto: '3SG', especialidade: 'CI', nip: '15.0311.01', nome: 'BRUNO MARTINS SOUZA DE JESUS', foto: '' },
    { id: 'so-035', numero: 35, posto: '3SG', especialidade: 'CP', nip: '15.0197.99', nome: 'LEONARDO SILVA RIBEIRO', foto: '' },
  ];

  const CANDIDATOS_CB = [
    { id: 'cb-001', numero: 1, posto: 'CB', especialidade: 'OR', nip: '18.0073.09', nome: 'CILAS DE OLIVEIRA SANTOS', foto: '' },
    { id: 'cb-002', numero: 2, posto: 'CB', especialidade: 'MA', nip: '18.0139.11', nome: 'IURI HENRIQUE DE MELLO', foto: '' },
    { id: 'cb-003', numero: 3, posto: 'CB', especialidade: 'MR', nip: '18.0135.89', nome: 'GUSTAVO WELLINGTON DE JESUS PERES', foto: '' },
    { id: 'cb-004', numero: 4, posto: 'CB', especialidade: 'MR', nip: '19.0099.33', nome: 'LUIZ MATEUS ACIOLY DO CARMO', foto: '' },
    { id: 'cb-005', numero: 5, posto: 'CB', especialidade: 'RM2-PD', nip: '25.4262.20', nome: 'MARLA INGRIDH ROCHA GUEDES', foto: '' },
    { id: 'cb-006', numero: 6, posto: 'CB', especialidade: 'RM2-PD', nip: '25.4248.23', nome: 'THAINA LIMA GOMES', foto: '' },
    { id: 'cb-007', numero: 7, posto: 'CB', especialidade: 'RM2-EF', nip: '25.4252.26', nome: 'LUZIA PACIFICO DOS SANTOS', foto: '' },
    { id: 'cb-008', numero: 8, posto: 'CB', especialidade: 'RM2-EF', nip: '25.4259.27', nome: 'ANDREZA PACIFICO VENANCIO', foto: '' },
    { id: 'cb-009', numero: 9, posto: 'CB', especialidade: 'SQ', nip: '21.0512.41', nome: 'ANDRE LUCAS TAVARES SOUZA', foto: '' },
    { id: 'cb-010', numero: 10, posto: 'CB', especialidade: 'SQ', nip: '21.0805.42', nome: 'JOAO LUIZ BORDUAN DE SOUZA', foto: '' },
    { id: 'cb-011', numero: 11, posto: 'CB', especialidade: 'SQ', nip: '21.0779.41', nome: 'ITALO GABRIEL SILVA MENDES', foto: '' },
    { id: 'cb-012', numero: 12, posto: 'CB', especialidade: 'ES', nip: '21.0767.40', nome: 'ALEXANDRE DE OLIVEIRA ELIAS', foto: '' },
    { id: 'cb-013', numero: 13, posto: 'MN', especialidade: 'RM-2', nip: '22.1810.24', nome: 'EVERTON ARCANJO GARRIDO', foto: '' },
    { id: 'cb-014', numero: 14, posto: 'MN', especialidade: 'RM-2', nip: '22.1804.27', nome: 'CARLOS HENRIQUE RODRIGUES COSTA', foto: '' },
    { id: 'cb-015', numero: 15, posto: 'MN', especialidade: 'RM-2', nip: '22.1773.29', nome: 'MATEUS DIAS DE ALMEIDA', foto: '' },
    { id: 'cb-016', numero: 16, posto: 'MN', especialidade: 'RM-2', nip: '22.1807.29', nome: 'GABRIEL DA COSTA TANANTA', foto: '' },
    { id: 'cb-017', numero: 17, posto: 'MN', especialidade: 'RM-2', nip: '24.3773.25', nome: 'LUIS ANTONIO GRANDE LOPES', foto: '' },
    { id: 'cb-018', numero: 18, posto: 'MN', especialidade: 'RC', nip: '25.3360.29', nome: 'JANDERSON VINICIUS DA COSTA DAVILA', foto: '' },
    { id: 'cb-019', numero: 19, posto: 'MN', especialidade: 'RC', nip: '25.3312.21', nome: 'DANLEY ATAIDE ANGELO', foto: '' },
    { id: 'cb-020', numero: 20, posto: 'MN', especialidade: 'RC', nip: '25.3325.20', nome: 'HAYMAN PEQUENO DA SILVA', foto: '' },
    { id: 'cb-021', numero: 21, posto: 'MN', especialidade: 'RC', nip: '25.3376.29', nome: 'LEVY DE CASTRO MACEDO', foto: '' },
  ];

  const inicializar = () => {
    const versao = StorageService.obter('inicializado');
    if (versao !== 'cft_v7') {
      // 1. Configurações gerais
      const configExistente = StorageService.obter('config', {});
      StorageService.salvar('config', {
        nomeEleicao: configExistente.nomeEleicao || 'Eleição de Representantes – CFT',
        dataEleicao: configExistente.dataEleicao || new Date().toISOString().split('T')[0],
        senhaAdmin: configExistente.senhaAdmin || Seguranca.hashSenha('ComSoc123'),
        iniciadaEm: configExistente.iniciadaEm || new Date().toISOString(),
      });

      // 2. Cria o primeiro evento ativo padrão para homologação imediata
      const eventos = StorageService.obter('eventos', []);
      const eventoPadraoId = 'evt-padrao-cft';

      if (!eventos.some(e => e.id === eventoPadraoId)) {
        eventos.push({
          id: eventoPadraoId,
          nome: 'Militar Padrão CFT',
          tipo: 'militar_padrao',
          data: new Date().toISOString().split('T')[0],
          status: 'ativo',
          descricao: 'Eleição padrão da Capitania Fluvial de Tabatinga.'
        });
        StorageService.salvar('eventos', eventos);
      }

      // Define como ativo no localStorage
      localStorage.setItem('cft_sev_eventoAtivoId', JSON.stringify(eventoPadraoId));

      // 3. Popula as listas de oficiais e candidatos da CFT para este evento padrão
      StorageService.salvar('eleitores', ELEITORES);
      StorageService.salvar('candidatosSO', CANDIDATOS_SO);
      StorageService.salvar('candidatosCB', CANDIDATOS_CB);
      StorageService.salvar('votos', []);
      StorageService.salvar('logs', []);
      StorageService.salvar('estatisticas', {});

      StorageService.salvar('inicializado', 'cft_v7');
    }
  };

  return {
    inicializar,
    obterEleitoresPadrao: () => ELEITORES,
    obterCandidatosSOPadrao: () => CANDIDATOS_SO,
    obterCandidatosCBPadrao: () => CANDIDATOS_CB
  };
})();


/* ================================================================
   MODULE: Seguranca
   ================================================================ */
const Seguranca = (() => {
  let _adminAutenticado = false;

  const hashSenha = (str) => {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return (hash >>> 0).toString(16).padStart(8, '0') + '_cft';
  };

  const verificarSenhaAdmin = (senhaDigitada) => {
    const config = StorageService.obter('config', {});
    return config.senhaAdmin === hashSenha(senhaDigitada);
  };

  const autenticarAdmin = (senha) => {
    if (verificarSenhaAdmin(senha)) {
      _adminAutenticado = true;
      registrarLog('ADMIN_LOGIN', 'Administrador autenticado.');
      return true;
    }
    registrarLog('ADMIN_LOGIN_FALHA', 'Tentativa falha de acesso administrativo.');
    return false;
  };

  const encerrarSessaoAdmin = () => { _adminAutenticado = false; registrarLog('ADMIN_LOGOUT', 'Sessão administrativa encerrada.'); };
  const isAdminAutenticado = () => _adminAutenticado;

  /**
   * Valida um NIP da Marinha do Brasil usando o algoritmo Módulo 11.
   * Aceita qualquer formato (com ou sem pontos/traço) — apenas os dígitos importam.
   *
   * Formato oficial: XX.XXXX.X-X  (8 dígitos: 7 sequenciais + 1 DV)
   * Cálculo: soma = Σ (dígitoᵢ × pesoᵢ), pesos de 8 a 2 da esquerda para direita.
   * DV = (resto == 0 || resto == 1) ? 0 : 11 - resto
   *
   * @param {string} nipCompleto - NIP digitado (ex: "11.1111.1-9" ou "11111119")
   * @returns {boolean} true se matematicamente válido
   */
  const validarNIP = (nipCompleto) => {
    const nipLimpo = String(nipCompleto).replace(/\D/g, '').padStart(8, '0');
    if (nipLimpo.length !== 8) return false;

    let soma = 0;
    let peso = 8;
    for (let i = 0; i < 7; i++) {
      soma += parseInt(nipLimpo.charAt(i), 10) * peso;
      peso--;
    }
    const resto = soma % 11;
    const dvCalculado = (resto === 0 || resto === 1) ? 0 : 11 - resto;
    const dvDigitado = parseInt(nipLimpo.charAt(7), 10);
    return dvCalculado === dvDigitado;
  };

  /**
   * Verifica o NIP digitado pelo oficial:
   * 1. Valida o checksum Módulo 11.
   * 2. Compara (apenas dígitos, normalizados com zeros à esquerda) com o NIP armazenado do oficial.
   *
   * @param {string} oficialId - ID do oficial
   * @param {string} nipDigitado - NIP informado pelo usuário
   * @returns {{ ok: boolean, motivo: string }}
   */
  const verificarNip = (oficialId, nipDigitado) => {
    // Passo 1 — valida o próprio NIP digitado pelo Módulo 11
    if (!validarNIP(nipDigitado)) {
      console.warn(`[NIP] Digitação inválida no Módulo 11: ${nipDigitado}`);
      return { ok: false, motivo: 'nip_invalido' };
    }

    // Passo 2 — compara com o NIP cadastrado (ignorando formatação e preenchendo zeros à esquerda)
    const eleitores = StorageService.obter('eleitores', []);
    const oficial = eleitores.find(e => e.id === oficialId);
    if (!oficial || !oficial.nip) {
      console.warn(`[NIP] Oficial ${oficialId} não encontrado ou sem NIP cadastrado.`);
      return { ok: false, motivo: 'sem_cadastro' };
    }

    const nipStoredClean = oficial.nip.replace(/\D/g, '').padStart(8, '0');
    const nipDigitadoClean = nipDigitado.replace(/\D/g, '').padStart(8, '0');
    
    const ok = nipStoredClean === nipDigitadoClean;
    if (!ok) {
      console.warn(`[NIP] Divergência para oficial ${oficial.nomeCompleto} (ID: ${oficialId}). Digitado: "${nipDigitadoClean}" | Cadastrado no sistema: "${nipStoredClean}"`);
    } else {
      console.log(`[NIP] Sucesso para oficial ${oficial.nomeCompleto}`);
    }

    return ok
      ? { ok: true, motivo: 'ok' }
      : { ok: false, motivo: 'nip_divergente' };
  };

  const eleitorJaVotou = (id) => {
    const e = StorageService.obter('eleitores', []).find(x => x.id === id);
    return e ? e.votou === true : false;
  };

  const registrarLog = (tipo, descricao) => {
    const logs = StorageService.obter('logs', []);
    logs.push({ tipo, descricao, timestamp: Date.now(), data: new Date().toLocaleDateString('pt-BR'), hora: new Date().toLocaleTimeString('pt-BR') });
    StorageService.salvar('logs', logs);
  };

  const alterarSenha = (senhaAtual, novaSenha) => {
    if (!verificarSenhaAdmin(senhaAtual)) return { ok: false, msg: 'Senha atual incorreta.' };
    if (novaSenha.length < 6) return { ok: false, msg: 'A nova senha deve ter no mínimo 6 caracteres.' };
    const config = StorageService.obter('config', {});
    config.senhaAdmin = hashSenha(novaSenha);
    StorageService.salvar('config', config);
    registrarLog('SENHA_ALTERADA', 'Senha administrativa alterada.');
    return { ok: true, msg: 'Senha alterada com sucesso.' };
  };

  return { hashSenha, validarNIP, autenticarAdmin, encerrarSessaoAdmin, isAdminAutenticado, verificarNip, eleitorJaVotou, registrarLog, alterarSenha, verificarSenhaAdmin };
})();


/* ================================================================
   MODULE: Utilitarios
   ================================================================ */
const Utilitarios = (() => {
  const gerarId = (pfx = 'id') => `${pfx}-${Date.now()}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;

  const gerarIniciais = (nome) => {
    if (!nome) return '?';
    const partes = nome.trim().split(' ').filter(p => p.length > 2);
    return (partes[0]?.charAt(0) + (partes[partes.length - 1]?.charAt(0) || '')).toUpperCase();
  };

  const formatarData = () => new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formatarHora = () => new Date().toLocaleTimeString('pt-BR');

  const sanitizar = (str) => {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(String(str ?? '')));
    return d.innerHTML;
  };

  const ordenarPor = (arr, campo, dir = 'asc') =>
    [...arr].sort((a, b) => {
      const va = (a[campo] || '').toString().toLowerCase();
      const vb = (b[campo] || '').toString().toLowerCase();
      return dir === 'asc' ? va.localeCompare(vb, 'pt') : vb.localeCompare(va, 'pt');
    });

  const formatarPercentual = (v, t) => t === 0 ? '0,0%' : `${((v / t) * 100).toFixed(1).replace('.', ',')}%`;

  const downloadArquivo = (conteudo, nome, mime) => {
    const blob = new Blob([conteudo], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = nome;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  /**
   * Redimensiona e converte uma imagem File para Base64.
   * Limita o tamanho a maxPx×maxPx para não lotar o LocalStorage.
   * @param {File} arquivo
   * @param {number} maxPx - Dimensão máxima (px)
   * @returns {Promise<string>} Data URL base64
   */
  const imagemParaBase64 = (arquivo, maxPx = 200) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (evt) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width: w, height: h } = img;
        const ratio = Math.min(maxPx / w, maxPx / h, 1);
        canvas.width = Math.round(w * ratio);
        canvas.height = Math.round(h * ratio);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(arquivo);
  });

  /**
   * Analisa um CSV simples (primeira linha = cabeçalho).
   * @param {string} texto
   * @returns {{ cabecalho: string[], linhas: Object[] }}
   */
  const parsearCSV = (texto) => {
    const linhas = texto.trim().split(/\r?\n/).filter(l => l.trim());
    if (linhas.length < 2) return { cabecalho: [], linhas: [] };
    const sep = linhas[0].includes(';') ? ';' : ',';
    const cabecalho = linhas[0].split(sep).map(c => c.trim().replace(/^"|"$/g, ''));
    const dados = linhas.slice(1).map(linha => {
      const cols = linha.split(sep).map(c => c.trim().replace(/^"|"$/g, ''));
      return Object.fromEntries(cabecalho.map((h, i) => [h, cols[i] ?? '']));
    });
    return { cabecalho, linhas: dados };
  };

  /**
   * Aplica a máscara de NIP conforme o padrão oficial da Marinha: XX.XXXX.X-X
   * Deve ser chamada no evento 'input' do campo para formatar enquanto digita.
   *
   * @param {string} valor - Valor atual do input (possivelmente parcial)
   * @returns {string} Valor formatado
   */
  const aplicarMascaraNIP = (valor) => {
    const nums = String(valor).replace(/\D/g, '').substring(0, 8);
    if (nums.length <= 2) return nums;
    if (nums.length <= 6) return `${nums.slice(0, 2)}.${nums.slice(2)}`;
    // 8 dígitos — formato completo: XX.XXXX.XX
    return `${nums.slice(0, 2)}.${nums.slice(2, 6)}.${nums.slice(6)}`;
  };

  /**
   * Formata um NIP armazenado (pode estar em qualquer formato) para exibição padrão.
   * @param {string} nip
   * @returns {string} Ex: "11.1111.19"
   */
  const formatarNIP = (nip) => aplicarMascaraNIP(String(nip || '').replace(/\D/g, ''));

  const obterPesoAntiguidadePosto = (posto) => {
    const p = String(posto || '').toLowerCase().trim();
    if (p.includes('almirante') || p.includes('alm')) return 10;
    if (p.includes('cmg') || p.includes('capitao de mar e guerra')) return 20;
    if (p.includes('cf') || p.includes('fragata')) return 30; // Capitão de Fragata
    if (p.includes('cc') || p.includes('corveta')) return 40; // Capitão de Corveta
    if (p.includes('ct') || p.includes('tenente') && p.includes('capitao')) return 50; // Capitão-Tenente
    if (p.includes('1º ten') || p.includes('1 ten') || p.includes('primeiro tenente')) return 60;
    if (p.includes('2º ten') || p.includes('2 ten') || p.includes('segundo tenente')) return 70;
    if (p.includes('guardamari') || p.includes('gm')) return 80;
    return 999; // Demais postos
  };

  return { gerarId, gerarIniciais, formatarData, formatarHora, sanitizar, ordenarPor, formatarPercentual, downloadArquivo, imagemParaBase64, parsearCSV, aplicarMascaraNIP, formatarNIP, obterPesoAntiguidadePosto };
})();


/* ================================================================
   MODULE: Interface
   ================================================================ */
const Interface = (() => {
  const el = {};

  const inicializarRefs = () => {
    const ids = [
      'loading-screen', 'loading-bar', 'app',
      'status-data', 'status-hora', 'progress-bar-fill', 'progress-text',
      'select-oficial', 'oficial-info', 'oficial-avatar', 'oficial-nome-display',
      'oficial-posto-display', 'oficial-status-badge', 'alerta-ja-votou', 'btn-iniciar-votacao',
      'section-identificacao', 'section-votacao', 'section-sucesso',
      'grupo-so', 'grupo-cb',
      'grid-so', 'grid-cb', 'pesquisa-so', 'pesquisa-cb',
      'btn-ordem-so', 'btn-ordem-cb', 'btn-avancar-cb', 'btn-voltar-so', 'btn-confirmar-voto',
      'sem-resultado-so', 'sem-resultado-cb',
      'step-so', 'step-cb', 'step-confirm',
      'sucesso-info', 'btn-nova-identificacao',
      'modal-nip', 'input-nip-votacao', 'btn-toggle-nip', 'btn-cancelar-nip', 'btn-confirmar-nip',
      'nip-oficial-resumo', 'erro-nip', 'tentativas-nip', 'tentativas-nip-texto',
      'modal-confirmacao', 'confirm-candidato-so', 'confirm-candidato-cb',
      'btn-modal-sim', 'btn-modal-nao',
      'modal-senha', 'input-senha-admin', 'erro-senha', 'btn-entrar-admin',
      'btn-cancelar-senha', 'btn-fechar-modal-senha', 'btn-toggle-pass',
      'btn-area-restrita', 'footer-ano', 'btn-dark-mode',
      'painel-admin', 'btn-fechar-admin', 'admin-clock',
      'toast-container',
      // KPIs
      'kpi-total-eleitores', 'kpi-votos-registrados', 'kpi-pendentes', 'kpi-participacao',
      'admin-progress-fill', 'admin-progress-pct', 'admin-progress-count',
      'lista-votaram', 'lista-nao-votaram', 'ultimo-voto',
      // Apuração
      'tbody-so', 'tbody-cb', 'chart-bar-so', 'chart-pie-so', 'chart-bar-cb', 'chart-pie-cb',
      'btn-print-apuracao', 'btn-atualizar-apuracao',
      // Gestão oficiais
      'form-oficial-wrap', 'form-oficial-titulo', 'el-nomeCompleto', 'el-posto',
      'el-especialidade', 'el-nip', 'el-id-editando', 'btn-novo-oficial',
      'btn-cancelar-oficial', 'btn-salvar-oficial', 'tbody-oficiais',
      // Gestão candidatos SO
      'form-cand-so-wrap', 'form-cand-so-titulo', 'so-nome', 'so-posto', 'so-especialidade',
      'so-nip', 'so-numero', 'so-foto', 'so-foto-input', 'so-foto-preview', 'so-foto-remover',
      'so-id-editando', 'btn-novo-cand-so', 'btn-cancelar-cand-so', 'btn-salvar-cand-so', 'tbody-cand-so',
      // Gestão candidatos CB
      'form-cand-cb-wrap', 'form-cand-cb-titulo', 'cb-nome', 'cb-posto', 'cb-especialidade',
      'cb-nip', 'cb-numero', 'cb-foto', 'cb-foto-input', 'cb-foto-preview', 'cb-foto-remover',
      'cb-id-editando', 'btn-novo-cand-cb', 'btn-cancelar-cand-cb', 'btn-salvar-cand-cb', 'tbody-cand-cb',
      // Exportação/Importação
      'btn-export-csv', 'btn-export-xlsx', 'btn-export-pdf', 'btn-export-json',
      'input-restaurar', 'btn-restaurar',
      'import-csv-oficiais', 'btn-preview-oficiais', 'preview-oficiais', 'preview-oficiais-count',
      'tbody-preview-oficiais', 'btn-cancelar-import-oficiais', 'btn-confirmar-import-oficiais',
      'import-csv-candidatos', 'btn-preview-candidatos', 'preview-candidatos', 'preview-candidatos-count',
      'tbody-preview-candidatos', 'btn-cancelar-import-candidatos', 'btn-confirmar-import-candidatos',
      'btn-download-template-oficiais', 'btn-download-template-candidatos',
      // Configurações
      'config-nome-eleicao', 'config-data-eleicao', 'btn-salvar-config',
      'config-senha-atual', 'config-senha-nova', 'config-senha-confirmar', 'btn-alterar-senha',
      'btn-reiniciar-votacao', 'btn-limpar-tudo',
      // Modal genérico
      'modal-generico', 'modal-generico-title', 'modal-generico-msg',
      'modal-generico-senha-wrap', 'modal-generico-senha',
      'btn-modal-generico-cancelar', 'btn-modal-generico-confirmar',
    ];
    ids.forEach(id => { el[id] = document.getElementById(id); });
  };

  const get = (id) => el[id] || document.getElementById(id);

  /* ── CARREGAMENTO ───────────────────────────────────────────── */
  const executarCarregamento = (callback) => {
    const bar = get('loading-bar');
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18 + 5;
      if (p >= 100) {
        p = 100; clearInterval(iv);
        setTimeout(() => {
          const ls = get('loading-screen');
          ls.classList.add('hide');
          ls.addEventListener('transitionend', () => {
            ls.style.display = 'none';
            get('app').style.display = 'flex';
            callback?.();
          }, { once: true });
        }, 300);
      }
      if (bar) bar.style.width = `${Math.min(p, 100)}%`;
    }, 80);
  };

  /* ── RELÓGIO ────────────────────────────────────────────────── */
  const iniciarRelogio = () => {
    const atualizar = () => {
      const d = get('status-data'), h = get('status-hora'), ac = get('admin-clock');
      if (d) d.textContent = Utilitarios.formatarData();
      if (h) h.textContent = Utilitarios.formatarHora();
      if (ac) ac.textContent = Utilitarios.formatarHora();
    };
    atualizar();
    setInterval(atualizar, 1000);
  };

  /* ── MODO ESCURO ────────────────────────────────────────────── */
  const inicializarModoEscuro = () => {
    aplicarTema(StorageService.obter('tema', 'light'));
    get('btn-dark-mode')?.addEventListener('click', () => {
      const novo = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      aplicarTema(novo);
      StorageService.salvar('tema', novo);
    });
  };

  const aplicarTema = (tema) => {
    document.documentElement.setAttribute('data-theme', tema);
    const btn = get('btn-dark-mode');
    if (btn) {
      btn.querySelector('.icon-moon').style.display = tema === 'dark' ? 'none' : 'block';
      btn.querySelector('.icon-sun').style.display = tema === 'light' ? 'none' : 'block';
    }
  };

  /* ── PROGRESSO ──────────────────────────────────────────────── */
  const atualizarProgresso = () => {
    const el = StorageService.obter('eleitores', []);
    const total = el.length;
    const votou = el.filter(e => e.votou).length;
    const pct = total > 0 ? Math.round((votou / total) * 100) : 0;

    const fill = get('progress-bar-fill'), text = get('progress-text');
    if (fill) fill.style.width = `${pct}%`;
    if (text) text.textContent = `${votou} / ${total} votos`;

    const af = get('admin-progress-fill'), ap = get('admin-progress-pct'), ac = get('admin-progress-count');
    if (af) af.style.width = `${pct}%`;
    if (ap) ap.textContent = `${pct}%`;
    if (ac) ac.textContent = `${votou} de ${total} oficiais`;
  };

  /* ── TOASTS ─────────────────────────────────────────────────── */
  const mostrarToast = (mensagem, tipo = 'info', duracao = 3500) => {
    const icones = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const container = get('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.innerHTML = `<span class="toast-icon">${icones[tipo] || 'ℹ️'}</span><span class="toast-msg">${Utilitarios.sanitizar(mensagem)}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('hide');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }, duracao);
  };

  /* ── MODAIS ─────────────────────────────────────────────────── */
  const toggleModal = (id, mostrar) => {
    const m = get(id) || document.getElementById(id);
    if (!m) return;
    m.style.display = mostrar ? 'flex' : 'none';
    if (mostrar) setTimeout(() => m.querySelector('input, button, select')?.focus(), 100);
  };

  const modalConfirmacao = ({ titulo, mensagem, precisaSenha = false, onConfirmar }) => {
    get('modal-generico-title').textContent = titulo;
    get('modal-generico-msg').textContent = mensagem;
    const sw = get('modal-generico-senha-wrap'), si = get('modal-generico-senha');
    sw.style.display = precisaSenha ? 'block' : 'none';
    if (si) si.value = '';
    toggleModal('modal-generico', true);

    const cb = get('btn-modal-generico-confirmar');
    const newCb = cb.cloneNode(true);
    cb.parentNode.replaceChild(newCb, cb);
    el['btn-modal-generico-confirmar'] = newCb;

    newCb.addEventListener('click', () => {
      if (precisaSenha && si && !Seguranca.autenticarAdmin(si.value)) {
        mostrarToast('Senha incorreta.', 'error'); return;
      }
      toggleModal('modal-generico', false);
      onConfirmar?.();
    });
    get('btn-modal-generico-cancelar').onclick = () => toggleModal('modal-generico', false);
  };

  /* ── SELECT OFICIAIS ────────────────────────────────────────── */
  const popularSelectOficiais = () => {
    const select = get('select-oficial');
    if (!select) return;

    // Ordena oficiais pela precedência/antiguidade militar
    const eleitores = StorageService.obter('eleitores', []);
    const oficiais = eleitores.slice().sort((a, b) => {
      const antA = a.antiguidade !== undefined ? a.antiguidade : 9999;
      const antB = b.antiguidade !== undefined ? b.antiguidade : 9999;
      if (antA !== antB) return antA - antB;

      const pesoA = Utilitarios.obterPesoAntiguidadePosto(a.posto);
      const pesoB = Utilitarios.obterPesoAntiguidadePosto(b.posto);
      if (pesoA !== pesoB) return pesoA - pesoB;

      return a.nomeCompleto.localeCompare(b.nomeCompleto, 'pt');
    });

    select.innerHTML = '<option value="">— Selecione seu nome —</option>';

    // Injeta simulação se o ComSoc Admin estiver conectado
    let logadoAdmin = false;
    try {
      const logadoInfo = localStorage.getItem('cft_votacao_oficial_logado');
      if (logadoInfo) {
        const profile = JSON.parse(logadoInfo);
        const email = (profile.email || '').toLowerCase().trim();
        if (profile && (
          email === 'sacrasub@gmail.com' ||
          email === 'sacrasub@mail.com' ||
          email === 'cristiano.sacramento@marinha.mil.br' ||
          profile.role === 'admin' ||
          profile.role === 'super_admin' ||
          profile.nome?.toLowerCase().includes('comsoc')
        )) {
          logadoAdmin = true;
        }
      }
    } catch (e) { }

    if (logadoAdmin || Seguranca.isAdminAutenticado()) {
      const opt = document.createElement('option');
      opt.value = 'oficial-teste-admin';
      opt.textContent = '⚓ [SIMULAÇÃO] Oficial de Teste (ComSoc Admin)';
      select.appendChild(opt);
    }

    oficiais.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o.id;
      opt.textContent = `${o.posto} ${o.nomeCompleto}`;
      select.appendChild(opt);
    });
  };

  /* ── CARDS DE CANDIDATOS ────────────────────────────────────── */
  /**
   * Gera o HTML de um card de candidato.
   * Se o candidato tiver foto (Base64), exibe <img>; senão, exibe iniciais.
   */
  const gerarCardCandidato = (candidato, grupo) => {
    const iniciais = Utilitarios.gerarIniciais(candidato.nome);
    const numStr = String(candidato.numero).padStart(2, '0');
    const cardId = `card-${grupo}-${candidato.id}`;
    const avatarHtml = candidato.foto
      ? `<img src="${candidato.foto}" alt="Foto de ${Utilitarios.sanitizar(candidato.nome)}" loading="lazy" />`
      : iniciais;

    return `
      <div class="candidato-card" id="${cardId}"
           data-id="${Utilitarios.sanitizar(candidato.id)}"
           data-grupo="${grupo}"
           data-nome="${Utilitarios.sanitizar(candidato.nome)}"
           tabindex="0" role="radio" aria-checked="false"
           aria-label="Candidato ${Utilitarios.sanitizar(candidato.nome)}, ${Utilitarios.sanitizar(candidato.posto)}">
        <span class="candidato-numero">${numStr}</span>
        <div class="candidato-radio-wrap">
          <input type="radio" class="candidato-radio" name="voto-${grupo}"
                 value="${Utilitarios.sanitizar(candidato.id)}"
                 id="radio-${grupo}-${candidato.id}"
                 aria-label="Selecionar ${Utilitarios.sanitizar(candidato.nome)}" />
        </div>
        <div class="candidato-avatar">${avatarHtml}</div>
        <span class="candidato-nome">${Utilitarios.sanitizar(candidato.nome)}</span>
        <span class="candidato-posto">${Utilitarios.sanitizar(candidato.posto)}</span>
        <span class="candidato-especialidade">${Utilitarios.sanitizar(candidato.especialidade)}</span>
        <button class="btn-selecionar" type="button"
                data-id="${Utilitarios.sanitizar(candidato.id)}" data-grupo="${grupo}">
          Selecionar
        </button>
      </div>`;
  };

  const renderizarCandidatos = (gridId, candidatos, grupo) => {
    const grid = get(gridId);
    if (!grid) return;
    grid.innerHTML = Utilitarios.ordenarPor(candidatos, 'nome').map(c => gerarCardCandidato(c, grupo)).join('');
  };

  const atualizarAnoFooter = () => {
    const e = get('footer-ano');
    if (e) e.textContent = new Date().getFullYear();
  };

  return {
    inicializarRefs, get, executarCarregamento, iniciarRelogio,
    inicializarModoEscuro, atualizarProgresso, mostrarToast,
    toggleModal, modalConfirmacao, popularSelectOficiais,
    renderizarCandidatos, atualizarAnoFooter,
  };
})();


/* ================================================================
   MODULE: Votacao
   Fluxo de votação com autenticação NIP antes do voto.
   ================================================================ */
const Votacao = (() => {
  const estado = {
    oficialId: null,
    candidatoSOId: null,
    candidatoCBId: null,
    nipVerificado: false,
    tentativasNip: 0,
    ordemSO: 'asc',
    ordemCB: 'asc',
  };

  const MAX_TENTATIVAS_NIP = 3;

  /* ── SELEÇÃO DO OFICIAL ─────────────────────────────────────── */
  const aoSelecionarOficial = () => {
    const select = Interface.get('select-oficial');
    const oficialId = select?.value;

    Interface.get('oficial-info').style.display = 'none';
    Interface.get('alerta-ja-votou').style.display = 'none';
    Interface.get('btn-iniciar-votacao').style.display = 'none';

    if (!oficialId) return;

    const oficiais = StorageService.obter('eleitores', []);
    const oficial = oficiais.find(e => e.id === oficialId);
    if (!oficial) return;

    Interface.get('oficial-avatar').textContent = Utilitarios.gerarIniciais(oficial.nomeCompleto);
    Interface.get('oficial-nome-display').textContent = oficial.nomeCompleto;
    Interface.get('oficial-posto-display').textContent = `${oficial.posto}${oficial.especialidade ? ' (' + oficial.especialidade + ')' : ''}`;
    Interface.get('oficial-info').style.display = 'flex';

    if (oficial.votou) {
      const badge = Interface.get('oficial-status-badge');
      badge.className = 'badge badge-success';
      badge.textContent = '✅ Já votou';
      Interface.get('alerta-ja-votou').style.display = 'flex';
    } else {
      const badge = Interface.get('oficial-status-badge');
      badge.className = 'badge badge-pending';
      badge.textContent = '⏳ Pendente';
      Interface.get('btn-iniciar-votacao').style.display = 'flex';
    }
  };

  /* ── INÍCIO DA VOTAÇÃO ──────────────────────────────────────── */
  const iniciarVotacao = () => {
    const oficialId = Interface.get('select-oficial')?.value;
    if (!oficialId) return;

    const ativoId = Eventos.obterAtivoId();
    const eventos = Eventos.obterTodos();
    const eventoAtivo = eventos.find(e => e.id === ativoId);
    if (!eventoAtivo || eventoAtivo.status !== 'ativo') {
      Interface.mostrarToast('Não há nenhuma votação ativa no momento.', 'error');
      return;
    }

    if (Seguranca.eleitorJaVotou(oficialId)) { Interface.mostrarToast('Este oficial já votou.', 'error'); return; }

    estado.oficialId = oficialId;
    estado.candidatoSOId = null;
    estado.candidatoCBId = null;
    estado.nipVerificado = false;
    estado.tentativasNip = 0;

    const candidatosSO = StorageService.obter('candidatosSO', []);
    const candidatosCB = StorageService.obter('candidatosCB', []);
    Interface.renderizarCandidatos('grid-so', candidatosSO, 'so');
    Interface.renderizarCandidatos('grid-cb', candidatosCB, 'cb');
    registrarListenersCards('grid-so', 'so');
    registrarListenersCards('grid-cb', 'cb');

    // Resetar estado visual dos botões e toolbars
    const btnSO = Interface.get('btn-avancar-cb');
    if (btnSO) btnSO.disabled = true;
    const btnCB = Interface.get('btn-confirmar-voto');
    if (btnCB) btnCB.disabled = true;

    const toolbarSO = Interface.get('grupo-so')?.querySelector('.candidatos-toolbar');
    if (toolbarSO) toolbarSO.style.display = 'flex';
    const toolbarCB = Interface.get('grupo-cb')?.querySelector('.candidatos-toolbar');
    if (toolbarCB) toolbarCB.style.display = 'flex';

    Interface.get('section-identificacao').style.display = 'none';
    Interface.get('section-votacao').style.display = 'block';
    Interface.get('section-sucesso').style.display = 'none';
    Interface.get('grupo-so').style.display = 'block';
    Interface.get('grupo-cb').style.display = 'none';
    atualizarSteps(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    Seguranca.registrarLog('VOTACAO_INICIADA', `Oficial ${oficialId} iniciou a votação.`);
  };

  /* ── LISTENERS DOS CARDS ────────────────────────────────────── */
  const registrarListenersCards = (gridId, grupo) => {
    const grid = Interface.get(gridId);
    if (!grid) return;
    grid.addEventListener('click', (evt) => {
      const card = evt.target.closest('.candidato-card');
      const btnSel = evt.target.closest('.btn-selecionar');
      const alvo = card || btnSel?.closest('.candidato-card');
      if (alvo) selecionarCandidato(alvo.dataset.id, grupo);
    });
    grid.addEventListener('keydown', (evt) => {
      if (evt.key === 'Enter' || evt.key === ' ') {
        const card = evt.target.closest('.candidato-card');
        if (card) { evt.preventDefault(); selecionarCandidato(card.dataset.id, grupo); }
      }
    });
  };

  const selecionarCandidato = (candidatoId, grupo) => {
    const gridId = grupo === 'so' ? 'grid-so' : 'grid-cb';
    const btnAvancar = grupo === 'so' ? 'btn-avancar-cb' : 'btn-confirmar-voto';
    const grid = Interface.get(gridId);
    const grupoDivId = grupo === 'so' ? 'grupo-so' : 'grupo-cb';
    const grupoDiv = Interface.get(grupoDivId);
    if (!grid) return;

    const jaSelecionado = (grupo === 'so' && estado.candidatoSOId === candidatoId) ||
      (grupo === 'cb' && estado.candidatoCBId === candidatoId);

    if (jaSelecionado) {
      // ── DESMARCAR CANDIDATO (RESTAURAR GRID COMPLETO) ──
      grid.querySelectorAll('.candidato-card').forEach(c => {
        c.classList.remove('selected', 'hidden');
        c.setAttribute('aria-checked', 'false');
        const btnSel = c.querySelector('.btn-selecionar');
        if (btnSel) {
          btnSel.textContent = 'Selecionar';
          btnSel.style.backgroundColor = '';
          btnSel.style.borderColor = '';
        }
      });

      const radio = grid.querySelector(`input[value="${candidatoId}"]`);
      if (radio) radio.checked = false;

      if (grupo === 'so') { estado.candidatoSOId = null; }
      else { estado.candidatoCBId = null; }

      // Mostrar toolbar de pesquisa e ordenação novamente
      if (grupoDiv) {
        const toolbar = grupoDiv.querySelector('.candidatos-toolbar');
        if (toolbar) toolbar.style.display = 'flex';
      }

      // Desabilitar o botão de avançar/confirmar
      const btn = Interface.get(btnAvancar);
      if (btn) btn.disabled = true;
      return;
    }

    // ── SELECIONAR CANDIDATO E ESCONDER OS DEMAIS ──
    grid.querySelectorAll('.candidato-card').forEach(c => {
      const isAlvo = c.dataset.id === candidatoId;
      c.classList.toggle('selected', isAlvo);
      c.classList.toggle('hidden', !isAlvo);
      c.setAttribute('aria-checked', isAlvo ? 'true' : 'false');

      const btnSel = c.querySelector('.btn-selecionar');
      if (btnSel) {
        if (isAlvo) {
          btnSel.textContent = 'Mudar Voto';
          btnSel.style.backgroundColor = '#6c757d'; // Cinza escuro para mudar voto
          btnSel.style.borderColor = '#6c757d';
        } else {
          btnSel.textContent = 'Selecionar';
          btnSel.style.backgroundColor = '';
          btnSel.style.borderColor = '';
        }
      }
    });

    const radio = grid.querySelector(`input[value="${candidatoId}"]`);
    if (radio) radio.checked = true;

    if (grupo === 'so') { estado.candidatoSOId = candidatoId; }
    else { estado.candidatoCBId = candidatoId; }

    // Esconder toolbar de pesquisa e ordenação para focar no candidato selecionado
    if (grupoDiv) {
      const toolbar = grupoDiv.querySelector('.candidatos-toolbar');
      if (toolbar) toolbar.style.display = 'none';
    }

    // Habilitar o botão de avançar/confirmar
    const btn = Interface.get(btnAvancar);
    if (btn) {
      btn.disabled = false;
      setTimeout(() => {
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  /* ── NAVEGAÇÃO ──────────────────────────────────────────────── */
  const avancarParaCB = () => {
    if (!estado.candidatoSOId) { Interface.mostrarToast('Selecione um candidato SO/SG.', 'warning'); return; }
    Interface.get('grupo-so').style.display = 'none';
    Interface.get('grupo-cb').style.display = 'block';
    atualizarSteps(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const voltarParaSO = () => {
    Interface.get('grupo-cb').style.display = 'none';
    Interface.get('grupo-so').style.display = 'block';
    atualizarSteps(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const atualizarSteps = (stepAtivo) => {
    const steps = [
      { el: 'step-so', n: 1, label: '1' },
      { el: 'step-cb', n: 2, label: '2' },
      { el: 'step-confirm', n: 3, label: '✓' },
    ];
    steps.forEach(({ el: id, n, label }) => {
      const dot = Interface.get(id)?.querySelector('.step-dot');
      if (!dot) return;
      dot.classList.remove('active', 'done');
      if (n < stepAtivo) { dot.classList.add('done'); dot.textContent = '✓'; }
      else if (n === stepAtivo) { dot.classList.add('active'); dot.textContent = label; }
      else { dot.textContent = label; }
    });
  };

  /* ── AUTENTICAÇÃO NIP ───────────────────────────────────────── */
  /**
   * Abre o modal de autenticação por NIP.
   * Deve ser chamado antes de abrir o modal de confirmação.
   */
  const abrirAutenticacaoNip = () => {
    if (!estado.candidatoSOId || !estado.candidatoCBId) {
      Interface.mostrarToast('Selecione um candidato em cada grupo.', 'warning'); return;
    }

    const oficiais = StorageService.obter('eleitores', []);
    const oficial = oficiais.find(e => e.id === estado.oficialId);
    if (!oficial) return;

    // Preenche o resumo do oficial no modal NIP
    const resumo = Interface.get('nip-oficial-resumo');
    if (resumo) {
      resumo.innerHTML = `
        <div class="nip-avatar">${Utilitarios.gerarIniciais(oficial.nomeCompleto)}</div>
        <div class="nip-info-texto">
          <span class="nip-info-nome">${Utilitarios.sanitizar(oficial.nomeCompleto)}</span>
          <span class="nip-info-posto">${Utilitarios.sanitizar(oficial.posto)}${oficial.especialidade ? ' (' + oficial.especialidade + ')' : ''}</span>
        </div>`;
    }

    // Limpa campos e erros anteriores
    const inputNip = Interface.get('input-nip-votacao');
    if (inputNip) inputNip.value = '';
    Interface.get('erro-nip').style.display = 'none';
    Interface.get('tentativas-nip').style.display = 'none';

    Interface.toggleModal('modal-nip', true);
    atualizarSteps(3);
  };

  /**
   * Processa a verificação do NIP digitado pelo oficial.
   * Usa o novo retorno { ok, motivo } de Seguranca.verificarNip():
   *   - 'nip_invalido'    : dígito verificador (Módulo 11) incorreto — NIP com formato/número errado
   *   - 'nip_divergente'  : NIP válido matematicamente, mas não é o cadastrado para o oficial
   *   - 'sem_cadastro'    : oficial sem NIP cadastrado no sistema
   */
  const processarNip = () => {
    const nip = Interface.get('input-nip-votacao')?.value?.trim() || '';
    if (!nip) { Interface.mostrarToast('Digite seu NIP.', 'warning'); return; }

    const resultado = Seguranca.verificarNip(estado.oficialId, nip);

    if (resultado.ok) {
      // NIP correto → avança para confirmação do voto
      estado.nipVerificado = true;
      estado.tentativasNip = 0;
      Interface.get('erro-nip').style.display = 'none';
      Interface.get('tentativas-nip').style.display = 'none';
      Interface.toggleModal('modal-nip', false);
      abrirConfirmacaoVoto();
      Seguranca.registrarLog('NIP_VERIFICADO', `Oficial ${estado.oficialId} autenticou com NIP.`);
    } else {
      estado.tentativasNip++;

      // Mensagem específica por motivo
      const erroEl = Interface.get('erro-nip');
      if (erroEl) {
        erroEl.innerHTML = resultado.motivo === 'nip_invalido'
          ? '<span>🚫</span> NIP inválido. O dígito verificador não confere (Módulo 11).'
          : '<span>🚫</span> NIP incorreto. Este NIP não está vinculado ao oficial selecionado.';
        erroEl.style.display = 'flex';
      }

      Seguranca.registrarLog('NIP_FALHA', `Oficial ${estado.oficialId} — tentativa ${estado.tentativasNip} | motivo: ${resultado.motivo}.`);

      if (estado.tentativasNip >= MAX_TENTATIVAS_NIP) {
        Interface.toggleModal('modal-nip', false);
        Interface.mostrarToast(`Número máximo de tentativas atingido (${MAX_TENTATIVAS_NIP}). Votação cancelada.`, 'error', 6000);
        voltarIdentificacao();
        Seguranca.registrarLog('NIP_BLOQUEADO', `Oficial ${estado.oficialId} bloqueado por excesso de tentativas.`);
      } else {
        const restantes = MAX_TENTATIVAS_NIP - estado.tentativasNip;
        const tEl = Interface.get('tentativas-nip');
        const tTx = Interface.get('tentativas-nip-texto');
        if (tEl && tTx) {
          tEl.style.display = 'flex';
          tTx.textContent = `Tentativa ${estado.tentativasNip} de ${MAX_TENTATIVAS_NIP}. Restam ${restantes}.`;
        }
        Interface.get('input-nip-votacao').value = '';
        Interface.get('input-nip-votacao').focus();
      }
    }
  };

  /* ── CONFIRMAÇÃO DO VOTO ────────────────────────────────────── */
  const abrirConfirmacaoVoto = () => {
    const candidatosSO = StorageService.obter('candidatosSO', []);
    const candidatosCB = StorageService.obter('candidatosCB', []);
    const so = candidatosSO.find(c => c.id === estado.candidatoSOId);
    const cb = candidatosCB.find(c => c.id === estado.candidatoCBId);
    Interface.get('confirm-candidato-so').textContent = so ? `${so.posto} ${so.nome}` : '—';
    Interface.get('confirm-candidato-cb').textContent = cb ? `${cb.posto} ${cb.nome}` : '—';
    Interface.toggleModal('modal-confirmacao', true);
  };

  const confirmarVoto = () => {
    const { oficialId, candidatoSOId, candidatoCBId } = estado;
    if (!oficialId || !candidatoSOId || !candidatoCBId) { Interface.mostrarToast('Dados incompletos.', 'error'); return; }

    const agora = new Date();
    const votos = StorageService.obter('votos', []);
    votos.push({
      id: Utilitarios.gerarId('voto'),
      eleitor: oficialId,
      candidatoSO: candidatoSOId,
      candidatoCB: candidatoCBId,
      data: agora.toLocaleDateString('pt-BR'),
      hora: agora.toLocaleTimeString('pt-BR'),
      timestamp: agora.getTime(),
    });
    StorageService.salvar('votos', votos);

    // Marca oficial como tendo votado
    const oficiais = StorageService.obter('eleitores', []);
    const idx = oficiais.findIndex(e => e.id === oficialId);
    if (idx !== -1) { oficiais[idx].votou = true; StorageService.salvar('eleitores', oficiais); }

    Seguranca.registrarLog('VOTO_REGISTRADO', `Oficial ${oficialId} registrou voto.`);
    Interface.toggleModal('modal-confirmacao', false);
    exibirSucesso(agora);
    Interface.atualizarProgresso();
  };

  const exibirSucesso = (agora) => {
    Interface.get('section-votacao').style.display = 'none';
    Interface.get('section-sucesso').style.display = 'block';
    const info = Interface.get('sucesso-info');
    if (info) {
      info.innerHTML = `
        <span>📅 ${agora.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <span>🕐 ${agora.toLocaleTimeString('pt-BR')}</span>`;
    }
    Interface.mostrarToast('Voto registrado com sucesso!', 'success', 5000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── PESQUISA ───────────────────────────────────────────────── */
  const pesquisarCandidatos = (termo, gridId, semResultadoId) => {
    const grid = Interface.get(gridId);
    if (!grid) return;
    const t = termo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let visiveis = 0;
    grid.querySelectorAll('.candidato-card').forEach(card => {
      const nome = (card.dataset.nome || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const ok = nome.includes(t);
      card.classList.toggle('hidden', !ok);
      if (ok) visiveis++;
    });
    const sr = Interface.get(semResultadoId);
    if (sr) sr.style.display = visiveis === 0 ? 'block' : 'none';
  };

  const reordenarCandidatos = (gridId, grupo) => {
    const campo = grupo === 'so' ? 'ordemSO' : 'ordemCB';
    estado[campo] = estado[campo] === 'asc' ? 'desc' : 'asc';
    const chave = grupo === 'so' ? 'candidatosSO' : 'candidatosCB';
    const lista = [...StorageService.obter(chave, [])].sort((a, b) => {
      const v = estado[campo] === 'asc' ? 1 : -1;
      return a.nome.localeCompare(b.nome, 'pt') * v;
    });
    Interface.renderizarCandidatos(gridId, lista, grupo);
    registrarListenersCards(gridId, grupo);
    const btn = Interface.get(grupo === 'so' ? 'btn-ordem-so' : 'btn-ordem-cb');
    if (btn) btn.textContent = estado[campo] === 'asc' ? 'A→Z' : 'Z→A';
  };

  const registrarAvisoSaida = () => {
    window.addEventListener('beforeunload', (evt) => {
      if (Interface.get('section-votacao')?.style.display === 'block' && estado.oficialId) {
        evt.preventDefault();
        evt.returnValue = 'Você está no meio da votação. Deseja realmente sair?';
      }
    });
  };

  const voltarIdentificacao = () => {
    estado.oficialId = estado.candidatoSOId = estado.candidatoCBId = null;
    estado.nipVerificado = false;
    estado.tentativasNip = 0;
    Interface.get('section-identificacao').style.display = 'block';
    Interface.get('section-votacao').style.display = 'none';
    Interface.get('section-sucesso').style.display = 'none';
    Interface.get('select-oficial').value = '';
    Interface.get('oficial-info').style.display = 'none';
    Interface.get('alerta-ja-votou').style.display = 'none';
    Interface.get('btn-iniciar-votacao').style.display = 'none';
    atualizarTelaPublicaAtiva();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const encontrarOficialPorNomeLogado = (nomeLogado, oficiais) => {
    if (!nomeLogado) return null;
    const normalizar = (str) => {
      return str
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/^(1tn|2tn|cc|cf|ct|so-mor|so|sgt|cb|mn|sg|ten|1º\s*ten|2º\s*ten|1ºten|2ºten|suboficial|oficial|praca)\s+/i, '')
        .replace(/[^a-z0-9\s]/g, '')
        .trim();
    };

    const nomeLogadoNorm = normalizar(nomeLogado);
    const palavrasLogado = nomeLogadoNorm.split(/\s+/).filter(p => p.length > 2);
    if (palavrasLogado.length === 0) return null;

    let melhorMatch = null;
    let melhorPontuacao = 0;

    oficiais.forEach(oficial => {
      const nomeOficialNorm = normalizar(oficial.nomeCompleto);
      if (nomeOficialNorm === nomeLogadoNorm) {
        melhorMatch = oficial;
        melhorPontuacao = 999;
        return;
      }
      const palavrasOficial = nomeOficialNorm.split(/\s+/);
      let pontuacao = 0;
      palavrasLogado.forEach(p => {
        if (palavrasOficial.includes(p)) {
          pontuacao += 10;
        } else if (palavrasOficial.some(po => po.includes(p) || p.includes(po))) {
          pontuacao += 2;
        }
      });
      if (pontuacao > melhorPontuacao) {
        melhorPontuacao = pontuacao;
        melhorMatch = oficial;
      }
    });

    return melhorPontuacao >= 10 ? melhorMatch : null;
  };

  /* ── AUTO-SELEÇÃO DO OFICIAL LOGADO NO COMSOC ───────────────── */
  const verificarAutoSelecaoOficial = () => {
    try {
      const logadoInfo = localStorage.getItem('cft_votacao_oficial_logado');
      if (!logadoInfo) return;

      const profile = JSON.parse(logadoInfo);
      if (!profile || !profile.nome) return;

      // Se for super admin ou o nome reservado de demonstração "SO-Mor", deixa dropdown aberto para testes
      if (profile.role === 'super_admin' || profile.nome === 'SO-Mor' || profile.nome === 'Super Admin') {
        console.log("Perfil admin/demonstração. Dropdown liberado para testes.");
        return;
      }

      const eleitores = StorageService.obter('eleitores', []);
      const encontrado = encontrarOficialPorNomeLogado(profile.nome, eleitores);

      if (encontrado) {
        const select = Interface.get('select-oficial');
        if (select) {
          select.value = encontrado.id;
          aoSelecionarOficial();

          // Ocultar a caixa de seleção para não exigir ação redundante do Oficial
          const formGroup = select.closest('.form-group');
          if (formGroup) {
            formGroup.style.display = 'none';
          }

          // Ajustar textos informativos para indicar identificação direta
          const h2 = document.querySelector('.section-identificacao .section-title');
          if (h2) h2.textContent = "Identificação Confirmada";

          const p = document.querySelector('.section-identificacao .section-desc');
          if (p) {
            p.innerHTML = `Sua sessão foi identificada como <strong>${encontrado.posto} ${encontrado.nomeCompleto}</strong>. Confirme as informações abaixo para prosseguir.`;
          }
          console.log("Militar identificado automaticamente: " + encontrado.nomeCompleto);
        }
      } else {
        console.warn("Nenhum militar correspondente para o nome: " + profile.nome);
      }
    } catch (e) {
      console.error("Erro na detecção automática do militar:", e);
    }
  };

  const renderizarResultadoPublico = (evento) => {
    const candSO = StorageService.obter('candidatosSO', []);
    const candCB = StorageService.obter('candidatosCB', []);
    const votos = StorageService.obter('votos', []);

    const contarVotos = (grupo) => {
      const mapa = {};
      votos.forEach(v => {
        const cId = grupo === 'so' ? v.candidatoSO : v.candidatoCB;
        if (cId) {
          mapa[cId] = (mapa[cId] || 0) + 1;
        }
      });
      return mapa;
    };
    const votosSO = contarVotos('so');
    const votosCB = contarVotos('cb');

    const totalSO = votos.filter(v => v.candidatoSO).length;
    const totalCB = votos.filter(v => v.candidatoCB).length;

    const apuracaoSO = candSO.map(c => ({ ...c, votos: votosSO[c.id] || 0 })).sort((a, b) => b.votos - a.votos);
    const apuracaoCB = candCB.map(c => ({ ...c, votos: votosCB[c.id] || 0 })).sort((a, b) => b.votos - a.votos);

    const tbodySO = Interface.get('resultado-publico-so-tbody');
    if (tbodySO) {
      if (apuracaoSO.length === 0) {
        tbodySO.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:1rem;">Nenhum candidato cadastrado.</td></tr>`;
      } else {
        tbodySO.innerHTML = apuracaoSO.map((c, i) => `
          <tr style="${i === 0 ? 'font-weight:700; color:var(--gold,#F59E0B);' : ''}">
            <td>${i + 1}º</td>
            <td><strong>${Utilitarios.sanitizar(c.nome)}</strong></td>
            <td>${Utilitarios.sanitizar(c.posto || '')}</td>
            <td style="text-align:right; font-weight: 600;">${c.votos} voto${c.votos !== 1 ? 's' : ''} (${Utilitarios.formatarPercentual(c.votos, totalSO)})</td>
          </tr>
        `).join('');
      }
    }

    const tbodyCB = Interface.get('resultado-publico-cb-tbody');
    if (tbodyCB) {
      if (apuracaoCB.length === 0) {
        tbodyCB.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:1rem;">Nenhum candidato cadastrado.</td></tr>`;
      } else {
        tbodyCB.innerHTML = apuracaoCB.map((c, i) => `
          <tr style="${i === 0 ? 'font-weight:700; color:var(--gold,#F59E0B);' : ''}">
            <td>${i + 1}º</td>
            <td><strong>${Utilitarios.sanitizar(c.nome)}</strong></td>
            <td>${Utilitarios.sanitizar(c.posto || '')}</td>
            <td style="text-align:right; font-weight: 600;">${c.votos} voto${c.votos !== 1 ? 's' : ''} (${Utilitarios.formatarPercentual(c.votos, totalCB)})</td>
          </tr>
        `).join('');
      }
    }
  };

  const atualizarTelaPublicaAtiva = () => {
    let ativoId = Eventos.obterAtivoId();
    const eventos = Eventos.obterTodos();

    // Se não há ID de evento ativo definido localmente, mas há um evento ativo na lista, seleciona-o
    if (!ativoId && eventos.length > 0) {
      const evAtivo = eventos.find(e => e.status === 'ativo');
      if (evAtivo) {
        localStorage.setItem('cft_sev_eventoAtivoId', JSON.stringify(evAtivo.id));
        ativoId = evAtivo.id;
      }
    }

    let eventoAtivo = eventos.find(e => e.id === ativoId);

    const infoContainer = Interface.get('info-evento-ativo-container');
    const nomeDisplay = Interface.get('nome-evento-ativo-display');
    const descDisplay = Interface.get('desc-evento-ativo-display');
    const controlesWrap = Interface.get('identificacao-controles-wrap');
    const semVotacaoMsg = Interface.get('sem-votacao-ativa-mensagem');
    const resultadoWrap = Interface.get('resultado-evento-encerrado-wrap');
    const restricaoMsg = Interface.get('restricao-acesso-mensagem');

    const eleitores = StorageService.obter('eleitores', []);

    // Determina se o usuário logado tem permissão para votar
    let temPermissaoVoto = true; // Fallback default
    const logadoInfo = localStorage.getItem('cft_votacao_oficial_logado');
    if (logadoInfo) {
      try {
        const profile = JSON.parse(logadoInfo);
        if (profile && profile.nome) {
          if (profile.role === 'super_admin' || profile.role === 'admin') {
            temPermissaoVoto = true;
          } else {
            const encontrado = encontrarOficialPorNomeLogado(profile.nome, eleitores);
            temPermissaoVoto = !!encontrado;
          }
        }
      } catch(e) { console.error('Erro ao processar login na tela publica:', e); }
    }

    // Se o evento estiver ativo, verificar se todos já votaram
    if (eventoAtivo && eventoAtivo.status === 'ativo') {
      const votos = StorageService.obter('votos', []);

      if (eleitores.length > 0 && votos.length >= eleitores.length) {
        // Encerramento automático!
        eventoAtivo.status = 'encerrado';
        const idx = eventos.findIndex(e => e.id === eventoAtivo.id);
        if (idx !== -1) {
          eventos[idx] = eventoAtivo;
          StorageService.salvar('eventos', eventos);
        }

        // Registra snapshot no histórico
        const config = StorageService.obter('config', {});
        Historico.registrarSnapshot(eventoAtivo.nome, config.periodo || '1º Semestre 2026', eventoAtivo.data, eventoAtivo.id);

        Seguranca.registrarLog('EVENTO_ENCERRADO_AUTO', `Votação do evento "${eventoAtivo.nome}" encerrada automaticamente após todos os oficiais votarem.`);
      }
    }

    if (eventoAtivo) {
      if (infoContainer) infoContainer.style.display = 'flex';
      if (nomeDisplay) nomeDisplay.textContent = eventoAtivo.nome;
      if (descDisplay) descDisplay.textContent = eventoAtivo.descricao || 'Nenhuma descrição fornecida.';

      if (eventoAtivo.status === 'ativo') {
        if (temPermissaoVoto) {
          if (controlesWrap) controlesWrap.style.display = 'block';
          if (semVotacaoMsg) semVotacaoMsg.style.display = 'none';
          if (resultadoWrap) resultadoWrap.style.display = 'none';
          if (restricaoMsg) restricaoMsg.style.display = 'none';
          Interface.popularSelectOficiais();
        } else {
          // Acesso restrito
          if (controlesWrap) controlesWrap.style.display = 'none';
          if (semVotacaoMsg) semVotacaoMsg.style.display = 'none';
          if (resultadoWrap) resultadoWrap.style.display = 'none';
          if (restricaoMsg) restricaoMsg.style.display = 'flex';
        }
      } else {
        // Status: encerrado - TODOS podem ver o resultado
        if (controlesWrap) controlesWrap.style.display = 'none';
        if (semVotacaoMsg) semVotacaoMsg.style.display = 'none';
        if (restricaoMsg) restricaoMsg.style.display = 'none';
        if (resultadoWrap) resultadoWrap.style.display = 'block';
        renderizarResultadoPublico(eventoAtivo);
      }
    } else {
      if (infoContainer) infoContainer.style.display = 'none';
      if (controlesWrap) controlesWrap.style.display = 'none';
      if (semVotacaoMsg) semVotacaoMsg.style.display = 'block';
      if (resultadoWrap) resultadoWrap.style.display = 'none';
      if (restricaoMsg) restricaoMsg.style.display = 'none';
    }
  };

  return {
    aoSelecionarOficial, iniciarVotacao, avancarParaCB, voltarParaSO,
    abrirAutenticacaoNip, processarNip, abrirConfirmacaoVoto, confirmarVoto,
    pesquisarCandidatos, reordenarCandidatos, registrarAvisoSaida, voltarIdentificacao,
    verificarAutoSelecaoOficial, atualizarTelaPublicaAtiva,
  };
})();


/* ================================================================
   MODULE: Dashboard
   KPIs, apuração e gráficos Canvas nativos.
   ================================================================ */
const Dashboard = (() => {
  const CORES = ['#003366', '#00509E', '#1A6BB5', '#4D94CC', '#99C2E0', '#C9A227', '#E6A817', '#1A7F54', '#7C3AED', '#DC2626', '#059669', '#D97706', '#2563EB', '#7C3AED', '#DB2777'];

  const atualizarKPIs = () => {
    const eleitores = StorageService.obter('eleitores', []);
    const total = eleitores.length;
    const votaram = eleitores.filter(e => e.votou).length;
    const pendentes = total - votaram;
    const pct = total > 0 ? Math.round((votaram / total) * 100) : 0;

    Interface.get('kpi-total-eleitores').textContent = total;
    Interface.get('kpi-votos-registrados').textContent = votaram;
    Interface.get('kpi-pendentes').textContent = pendentes;
    Interface.get('kpi-participacao').textContent = `${pct}%`;

    const lv = Interface.get('lista-votaram'), lnv = Interface.get('lista-nao-votaram');
    if (lv) lv.innerHTML = '';
    if (lnv) lnv.innerHTML = '';

    eleitores.forEach(e => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="li-dot ${e.votou ? 'li-dot-green' : 'li-dot-orange'}"></span><span>${Utilitarios.sanitizar(e.posto)} ${Utilitarios.sanitizar(e.nomeCompleto)}</span>`;
      if (e.votou) lv?.appendChild(li);
      else lnv?.appendChild(li);
    });

    const votos = StorageService.obter('votos', []);
    const ultimo = votos.length > 0 ? votos[votos.length - 1] : null;
    const ulEl = Interface.get('ultimo-voto');
    if (ulEl) {
      if (ultimo) {
        const of = StorageService.obter('eleitores', []).find(e => e.id === ultimo.eleitor);
        const nome = of ? `${of.posto} ${of.nomeCompleto}` : ultimo.eleitor;
        ulEl.innerHTML = `<span>👤 ${Utilitarios.sanitizar(nome)}</span><span>📅 ${Utilitarios.sanitizar(ultimo.data)}</span><span>🕐 ${Utilitarios.sanitizar(ultimo.hora)}</span>`;
      } else { ulEl.textContent = 'Nenhum voto registrado ainda.'; }
    }
    Interface.atualizarProgresso();
  };

  const renderizarApuracao = () => {
    const votos = StorageService.obter('votos', []);
    const candidatosSO = StorageService.obter('candidatosSO', []);
    const candidatosCB = StorageService.obter('candidatosCB', []);

    const contarVotos = (lista, campo) =>
      lista.map(c => ({ ...c, totalVotos: votos.filter(v => v[campo] === c.id).length }))
        .sort((a, b) => b.totalVotos - a.totalVotos);

    const rSO = contarVotos(candidatosSO, 'candidatoSO');
    const rCB = contarVotos(candidatosCB, 'candidatoCB');

    preencherTabela('tbody-so', rSO, votos.length);
    preencherTabela('tbody-cb', rCB, votos.length);
    renderizarBarras('chart-bar-so', rSO);
    renderizarPizza('chart-pie-so', rSO);
    renderizarBarras('chart-bar-cb', rCB);
    renderizarPizza('chart-pie-cb', rCB);
  };

  const preencherTabela = (tbodyId, resultados, totalVotos) => {
    const tbody = Interface.get(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = resultados.map((c, i) => {
      const rank = i + 1;
      const pct = totalVotos > 0 ? ((c.totalVotos / totalVotos) * 100) : 0;
      const cls = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-other';
      return `<tr>
        <td><span class="rank-badge ${cls}">${rank}º</span></td>
        <td><strong>${Utilitarios.sanitizar(c.nome)}</strong></td>
        <td>${Utilitarios.sanitizar(c.posto)}</td>
        <td>${Utilitarios.sanitizar(c.especialidade)}</td>
        <td><strong>${c.totalVotos}</strong></td>
        <td>${pct.toFixed(1).replace('.', ',')}%</td>
        <td><div class="barra-mini"><div class="barra-mini-fill" style="width:${pct}%"></div></div></td>
      </tr>`;
    }).join('');
  };

  const renderizarBarras = (canvasId, dados) => {
    const canvas = Interface.get(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.parentElement.clientWidth - 48;
    const h = Math.max(dados.length * 44 + 60, 160);
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);

    if (!dados.length || dados.every(d => d.totalVotos === 0)) {
      ctx.fillStyle = '#6B7280'; ctx.font = '14px Inter,sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Nenhum voto registrado', w / 2, h / 2); return;
    }

    const maxV = Math.max(...dados.map(d => d.totalVotos), 1);
    const bH = 28, bG = 16, lW = 160, cW = w - lW - 60, pT = 40;

    ctx.fillStyle = '#6B7280'; ctx.font = '11px Inter,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Votos', lW + cW / 2, 16);

    dados.forEach((c, i) => {
      const y = pT + i * (bH + bG);
      const bW = (c.totalVotos / maxV) * cW;
      ctx.fillStyle = '#E5E7EB'; ctx.beginPath(); ctx.roundRect(lW, y, cW, bH, 4); ctx.fill();
      if (bW > 0) { ctx.fillStyle = CORES[i % CORES.length]; ctx.beginPath(); ctx.roundRect(lW, y, bW, bH, 4); ctx.fill(); }
      ctx.fillStyle = '#374151'; ctx.font = '12px Inter,sans-serif'; ctx.textAlign = 'right';
      ctx.fillText(c.nome.split(' ').slice(0, 2).join(' '), lW - 8, y + bH / 2 + 4);
      ctx.font = 'bold 11px Inter,sans-serif'; ctx.textAlign = 'center';
      if (bW > 30) { ctx.fillStyle = '#fff'; ctx.fillText(c.totalVotos, lW + bW / 2, y + bH / 2 + 4); }
      else { ctx.fillStyle = '#374151'; ctx.fillText(c.totalVotos, lW + bW + 16, y + bH / 2 + 4); }
    });
  };

  const renderizarPizza = (canvasId, dados) => {
    const canvas = Interface.get(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = Math.min(canvas.parentElement.clientWidth - 48, 280);
    canvas.width = size * dpr; canvas.height = size * dpr;
    canvas.style.width = `${size}px`; canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr); ctx.clearRect(0, 0, size, size);

    const total = dados.reduce((s, c) => s + c.totalVotos, 0);
    if (!total) {
      ctx.fillStyle = '#E5E7EB'; ctx.beginPath(); ctx.arc(size / 2, size / 2, size / 2 - 20, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#6B7280'; ctx.font = '13px Inter,sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Sem votos', size / 2, size / 2 + 5); return;
    }

    const cx = size / 2, cy = size / 2, r = size / 2 - 20;
    let ang = -Math.PI / 2;
    dados.forEach((c, i) => {
      if (!c.totalVotos) return;
      const fatia = (c.totalVotos / total) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, ang, ang + fatia); ctx.closePath();
      ctx.fillStyle = CORES[i % CORES.length]; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
      if (fatia > 0.3) {
        const midA = ang + fatia / 2;
        ctx.fillStyle = '#fff'; ctx.font = 'bold 11px Inter,sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(`${((c.totalVotos / total) * 100).toFixed(0)}%`, cx + r * 0.65 * Math.cos(midA), cy + r * 0.65 * Math.sin(midA));
      }
      ang += fatia;
    });
    let ly = 10;
    dados.slice(0, 6).forEach((c, i) => {
      if (!c.totalVotos) return;
      ctx.fillStyle = CORES[i % CORES.length]; ctx.fillRect(10, ly, 12, 12);
      ctx.fillStyle = '#374151'; ctx.font = '10px Inter,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText(`${c.nome.split(' ')[0]} (${c.totalVotos})`, 26, ly);
      ly += 18;
    });
  };

  /* ── TABELA DE OFICIAIS (admin) ─────────────────────────────── */
  const renderizarTabelaOficiais = () => {
    const tbody = Interface.get('tbody-oficiais');
    if (!tbody) return;
    const eleitores = StorageService.obter('eleitores', []);
    const oficiais = eleitores.slice().sort((a, b) => {
      const antA = a.antiguidade !== undefined ? a.antiguidade : 9999;
      const antB = b.antiguidade !== undefined ? b.antiguidade : 9999;
      if (antA !== antB) return antA - antB;

      const pesoA = Utilitarios.obterPesoAntiguidadePosto(a.posto);
      const pesoB = Utilitarios.obterPesoAntiguidadePosto(b.posto);
      if (pesoA !== pesoB) return pesoA - pesoB;

      return a.nomeCompleto.localeCompare(b.nomeCompleto, 'pt');
    });

    tbody.innerHTML = oficiais.length === 0
      ? '<tr><td colspan="7" style="text-align:center;color:#9CA3AF;">Nenhum oficial cadastrado.</td></tr>'
      : oficiais.map((o, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${Utilitarios.sanitizar(o.nomeCompleto)}</td>
            <td>${Utilitarios.sanitizar(o.posto)}</td>
            <td>${Utilitarios.sanitizar(o.especialidade || '—')}</td>
            <td>${Utilitarios.sanitizar(o.nip || '—')}</td>
            <td><span class="badge ${o.votou ? 'badge-success' : 'badge-pending'}">${o.votou ? '✅ Sim' : '⏳ Não'}</span></td>
            <td>
              <div class="acoes-cell">
                <button class="btn-acao btn-acao-editar" onclick="Admin.editarOficial('${Utilitarios.sanitizar(o.id)}')">✏️ Editar</button>
                ${!o.votou ? `<button class="btn-acao btn-acao-excluir" onclick="Admin.excluirOficial('${Utilitarios.sanitizar(o.id)}')">🗑️</button>` : ''}
                ${o.votou ? `<button class="btn-acao btn-acao-reset"  onclick="Admin.resetarVotoOficial('${Utilitarios.sanitizar(o.id)}')">↩️</button>` : ''}
              </div>
            </td>
          </tr>`).join('');
  };

  const renderizarTabelaCandidatos = (grupo) => {
    const tbodyId = grupo === 'so' ? 'tbody-cand-so' : 'tbody-cand-cb';
    const chave = grupo === 'so' ? 'candidatosSO' : 'candidatosCB';
    const tbody = Interface.get(tbodyId);
    if (!tbody) return;
    const lista = StorageService.obter(chave, []);
    tbody.innerHTML = lista.length === 0
      ? '<tr><td colspan="8" style="text-align:center;color:#9CA3AF;">Nenhum candidato cadastrado.</td></tr>'
      : lista.map((c, i) => {
        const avatarHtml = c.foto
          ? `<div class="avatar-mini"><img src="${c.foto}" alt="" /></div>`
          : `<div class="avatar-mini">${Utilitarios.gerarIniciais(c.nome)}</div>`;
        return `<tr>
            <td>${i + 1}</td>
            <td>${avatarHtml}</td>
            <td><strong>${String(c.numero).padStart(2, '0')}</strong></td>
            <td>${Utilitarios.sanitizar(c.nome)}</td>
            <td>${Utilitarios.sanitizar(c.posto)}</td>
            <td>${Utilitarios.sanitizar(c.especialidade || '—')}</td>
            <td>${Utilitarios.sanitizar(c.nip || '—')}</td>
            <td>
              <div class="acoes-cell">
                <button class="btn-acao btn-acao-editar" onclick="Admin.editarCandidato('${grupo}','${Utilitarios.sanitizar(c.id)}')">✏️ Editar</button>
                <button class="btn-acao btn-acao-excluir" onclick="Admin.excluirCandidato('${grupo}','${Utilitarios.sanitizar(c.id)}')">🗑️</button>
              </div>
            </td>
          </tr>`;
      }).join('');
  };

  return { atualizarKPIs, renderizarApuracao, renderizarTabelaOficiais, renderizarTabelaCandidatos };
})();


/* ================================================================
   MODULE: Admin
   Gestão de oficiais e candidatos pelo administrador.
   ================================================================ */
const Admin = (() => {

  /* ── OFICIAIS ───────────────────────────────────────────────── */
  const novoOficial = () => {
    Interface.get('form-oficial-titulo').textContent = 'Novo Oficial';
    ['el-nomeCompleto', 'el-posto', 'el-especialidade', 'el-nip'].forEach(id => { const e = Interface.get(id); if (e) e.value = ''; });
    Interface.get('el-id-editando').value = '';
    Interface.get('form-oficial-wrap').style.display = 'block';
    Interface.get('el-nomeCompleto').focus();
  };

  const cancelarOficial = () => { Interface.get('form-oficial-wrap').style.display = 'none'; };

  const editarOficial = (id) => {
    const of = StorageService.obter('eleitores', []).find(e => e.id === id);
    if (!of) return;
    Interface.get('form-oficial-titulo').textContent = 'Editar Oficial';
    Interface.get('el-nomeCompleto').value = of.nomeCompleto;
    Interface.get('el-posto').value = of.posto;
    Interface.get('el-especialidade').value = of.especialidade || '';
    Interface.get('el-nip').value = of.nip || '';
    Interface.get('el-id-editando').value = of.id;
    Interface.get('form-oficial-wrap').style.display = 'block';
    Interface.get('form-oficial-wrap').scrollIntoView({ behavior: 'smooth' });
  };

  const salvarOficial = () => {
    const nome = Interface.get('el-nomeCompleto').value.trim();
    const posto = Interface.get('el-posto').value.trim();
    const esp = Interface.get('el-especialidade').value.trim();
    const nip = Interface.get('el-nip').value.trim();
    const idEdit = Interface.get('el-id-editando').value;

    if (!nome || !posto) { Interface.mostrarToast('Nome e Posto são obrigatórios.', 'warning'); return; }
    if (!nip) { Interface.mostrarToast('NIP é obrigatório para autenticação do voto.', 'warning'); return; }

    // Normaliza e formata o NIP antes de salvar
    const nipLimpo = nip.replace(/\D/g, '').padStart(8, '0');
    if (nipLimpo.length !== 8) { Interface.mostrarToast('O NIP deve conter exatamente 8 dígitos.', 'error'); return; }
    const nipFormatado = Utilitarios.formatarNIP(nipLimpo);

    const oficiais = StorageService.obter('eleitores', []);
    if (idEdit) {
      const idx = oficiais.findIndex(e => e.id === idEdit);
      if (idx !== -1) { oficiais[idx] = { ...oficiais[idx], nomeCompleto: nome, posto, especialidade: esp, nip: nipFormatado }; }
      Interface.mostrarToast('Oficial atualizado.', 'success');
    } else {
      oficiais.push({ id: Utilitarios.gerarId('el'), nomeCompleto: nome, posto, especialidade: esp, nip: nipFormatado, votou: false });
      Interface.mostrarToast('Oficial adicionado.', 'success');
    }
    StorageService.salvar('eleitores', oficiais);
    cancelarOficial();
    Dashboard.renderizarTabelaOficiais();
    Interface.popularSelectOficiais();
    Interface.atualizarProgresso();
    Dashboard.atualizarKPIs();
  };

  const excluirOficial = (id) => {
    const of = StorageService.obter('eleitores', []).find(e => e.id === id);
    if (!of) return;
    if (of.votou) { Interface.mostrarToast('Não é possível remover um oficial que já votou.', 'error'); return; }
    Interface.modalConfirmacao({
      titulo: 'Remover Oficial',
      mensagem: `Remover "${of.nomeCompleto}"?`,
      onConfirmar: () => {
        StorageService.salvar('eleitores', StorageService.obter('eleitores', []).filter(e => e.id !== id));
        Dashboard.renderizarTabelaOficiais(); Interface.popularSelectOficiais();
        Interface.atualizarProgresso(); Dashboard.atualizarKPIs();
        Interface.mostrarToast('Oficial removido.', 'success');
      },
    });
  };

  const resetarVotoOficial = (id) => {
    const of = StorageService.obter('eleitores', []).find(e => e.id === id);
    if (!of) return;
    Interface.modalConfirmacao({
      titulo: 'Resetar Voto',
      mensagem: `Resetar voto de "${of.nomeCompleto}"? O voto já contabilizado não será removido.`,
      precisaSenha: true,
      onConfirmar: () => {
        const oficiais = StorageService.obter('eleitores', []);
        const idx = oficiais.findIndex(e => e.id === id);
        if (idx !== -1) { oficiais[idx].votou = false; StorageService.salvar('eleitores', oficiais); }
        Dashboard.renderizarTabelaOficiais(); Interface.atualizarProgresso(); Dashboard.atualizarKPIs();
        Interface.mostrarToast('Voto resetado.', 'warning');
      },
    });
  };

  /* ── FOTO UPLOAD (helper) ───────────────────────────────────── */
  /**
   * Registra os eventos de upload de foto para um grupo de candidatos.
   * @param {'so'|'cb'} grupo
   */
  const registrarEventosFoto = (grupo) => {
    const input = Interface.get(`${grupo}-foto-input`);
    const preview = Interface.get(`${grupo}-foto-preview`);
    const remover = Interface.get(`${grupo}-foto-remover`);
    const hidden = Interface.get(`${grupo}-foto`);
    if (!input) return;

    input.addEventListener('change', async () => {
      const file = input.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { Interface.mostrarToast('Imagem muito grande. Máximo: 5 MB.', 'error'); return; }
      try {
        const base64 = await Utilitarios.imagemParaBase64(file, 200);
        hidden.value = base64;
        // Atualiza preview
        preview.innerHTML = `<img src="${base64}" alt="Preview" />`;
        preview.classList.add('has-foto');
        if (remover) remover.style.display = 'inline-flex';
        Interface.mostrarToast('Foto carregada e redimensionada.', 'success');
      } catch {
        Interface.mostrarToast('Erro ao processar imagem.', 'error');
      }
    });

    if (remover) {
      remover.addEventListener('click', () => {
        hidden.value = '';
        preview.innerHTML = '<span class="foto-preview-placeholder">📷</span>';
        preview.classList.remove('has-foto');
        input.value = '';
        remover.style.display = 'none';
      });
    }
  };

  /* ── CANDIDATOS ─────────────────────────────────────────────── */
  const novoCandidato = (grupo) => {
    Interface.get(`form-cand-${grupo}-titulo`).textContent = `Novo Candidato ${grupo.toUpperCase()}`;
    ['nome', 'posto', 'especialidade', 'nip', 'numero', 'foto'].forEach(f => {
      const e = Interface.get(`${grupo}-${f}`); if (e) e.value = '';
    });
    Interface.get(`${grupo}-id-editando`).value = '';
    // Reset preview da foto
    const prev = Interface.get(`${grupo}-foto-preview`);
    if (prev) { prev.innerHTML = '<span class="foto-preview-placeholder">📷</span>'; prev.classList.remove('has-foto'); }
    const rem = Interface.get(`${grupo}-foto-remover`);
    if (rem) rem.style.display = 'none';
    const inp = Interface.get(`${grupo}-foto-input`);
    if (inp) inp.value = '';
    Interface.get(`form-cand-${grupo}-wrap`).style.display = 'block';
    Interface.get(`${grupo}-nome`).focus();
  };

  const cancelarCandidato = (grupo) => { Interface.get(`form-cand-${grupo}-wrap`).style.display = 'none'; };

  const editarCandidato = (grupo, id) => {
    const chave = grupo === 'so' ? 'candidatosSO' : 'candidatosCB';
    const c = StorageService.obter(chave, []).find(x => x.id === id);
    if (!c) return;
    Interface.get(`form-cand-${grupo}-titulo`).textContent = `Editar Candidato ${grupo.toUpperCase()}`;
    Interface.get(`${grupo}-nome`).value = c.nome;
    Interface.get(`${grupo}-posto`).value = c.posto;
    Interface.get(`${grupo}-especialidade`).value = c.especialidade || '';
    Interface.get(`${grupo}-nip`).value = c.nip || '';
    Interface.get(`${grupo}-numero`).value = c.numero;
    Interface.get(`${grupo}-foto`).value = c.foto || '';
    Interface.get(`${grupo}-id-editando`).value = c.id;

    // Atualiza preview da foto
    const prev = Interface.get(`${grupo}-foto-preview`);
    const rem = Interface.get(`${grupo}-foto-remover`);
    if (prev) {
      if (c.foto) {
        prev.innerHTML = `<img src="${c.foto}" alt="Foto atual" />`;
        prev.classList.add('has-foto');
        if (rem) rem.style.display = 'inline-flex';
      } else {
        prev.innerHTML = '<span class="foto-preview-placeholder">📷</span>';
        prev.classList.remove('has-foto');
        if (rem) rem.style.display = 'none';
      }
    }
    Interface.get(`form-cand-${grupo}-wrap`).style.display = 'block';
    Interface.get(`form-cand-${grupo}-wrap`).scrollIntoView({ behavior: 'smooth' });
  };

  const salvarCandidato = (grupo) => {
    const nome = Interface.get(`${grupo}-nome`).value.trim();
    const posto = Interface.get(`${grupo}-posto`).value.trim();
    const esp = Interface.get(`${grupo}-especialidade`).value.trim();
    const nip = Interface.get(`${grupo}-nip`).value.trim();
    const numero = parseInt(Interface.get(`${grupo}-numero`).value, 10);
    const foto = Interface.get(`${grupo}-foto`).value;
    const idEdit = Interface.get(`${grupo}-id-editando`).value;
    const chave = grupo === 'so' ? 'candidatosSO' : 'candidatosCB';

    if (!nome || !posto || isNaN(numero)) { Interface.mostrarToast('Nome, Posto e Número são obrigatórios.', 'warning'); return; }

    // Opcional: se informou o NIP do candidato, normaliza e formata
    let nipFormatado = '';
    if (nip) {
      const nipLimpo = nip.replace(/\D/g, '').padStart(8, '0');
      if (nipLimpo.length !== 8) { Interface.mostrarToast('O NIP do candidato deve conter exatamente 8 dígitos.', 'error'); return; }
      nipFormatado = Utilitarios.formatarNIP(nipLimpo);
    }

    const lista = StorageService.obter(chave, []);
    if (idEdit) {
      const idx = lista.findIndex(c => c.id === idEdit);
      if (idx !== -1) lista[idx] = { ...lista[idx], nome, posto, especialidade: esp, nip: nipFormatado, numero, foto };
      Interface.mostrarToast('Candidato updated.', 'success');
    } else {
      lista.push({ id: Utilitarios.gerarId(grupo), nome, posto, especialidade: esp, nip: nipFormatado, numero, foto });
      Interface.mostrarToast('Candidato adicionado.', 'success');
    }
    StorageService.salvar(chave, lista);
    cancelarCandidato(grupo);
    Dashboard.renderizarTabelaCandidatos(grupo);
  };

  const excluirCandidato = (grupo, id) => {
    const chave = grupo === 'so' ? 'candidatosSO' : 'candidatosCB';
    const lista = StorageService.obter(chave, []);
    const c = lista.find(x => x.id === id);
    if (!c) return;
    Interface.modalConfirmacao({
      titulo: 'Remover Candidato',
      mensagem: `Remover "${c.nome}"?`,
      onConfirmar: () => {
        StorageService.salvar(chave, lista.filter(x => x.id !== id));
        Dashboard.renderizarTabelaCandidatos(grupo);
        Interface.mostrarToast('Candidato removido.', 'success');
      },
    });
  };

  /* ── CONFIGURAÇÕES ──────────────────────────────────────────── */
  const carregarConfiguracoes = () => {
    const config = StorageService.obter('config', {});
    const n = Interface.get('config-nome-eleicao');
    const p = Interface.get('config-periodo');
    const d = Interface.get('config-data-eleicao');
    if (n) n.value = config.nomeEleicao || '';
    if (p) p.value = config.periodo || '';
    if (d) d.value = config.dataEleicao || '';
  };

  const salvarConfiguracoes = () => {
    const nome = Interface.get('config-nome-eleicao')?.value.trim();
    const periodo = Interface.get('config-periodo')?.value.trim();
    const data = Interface.get('config-data-eleicao')?.value;

    if (!nome) { Interface.mostrarToast('Informe o nome da eleição.', 'warning'); return; }

    // 1. Atualiza config global
    const config = StorageService.obter('config', {});
    config.nomeEleicao = nome;
    config.periodo = periodo;
    config.dataEleicao = data;
    StorageService.salvar('config', config);

    // 2. Registra snapshot no histórico usando a função centralizada
    const eventoAtivoId = Eventos.obterAtivoId();
    Historico.registrarSnapshot(nome, periodo, data, eventoAtivoId);

    Interface.mostrarToast('Configurações salvas e eleição registrada no histórico!', 'success');
    Historico.renderizarAdmin();
    Historico.renderizarPublico();
  };

  const reinicializarVotacao = () => {
    Interface.modalConfirmacao({
      titulo: '⚠️ Reinicializar Votação',
      mensagem: 'TODOS os votos serão APAGADOS e os oficiais poderão votar novamente.',
      precisaSenha: true,
      onConfirmar: () => {
        const of = StorageService.obter('eleitores', []);
        of.forEach(e => { e.votou = false; });
        StorageService.salvar('eleitores', of);
        StorageService.salvar('votos', []);
        StorageService.salvar('logs', []);
        Dashboard.atualizarKPIs(); Dashboard.renderizarTabelaOficiais(); Dashboard.renderizarApuracao();
        Interface.atualizarProgresso(); Interface.popularSelectOficiais();
        Interface.mostrarToast('Votação reinicializada.', 'warning');
      },
    });
  };

  const limparTodosOsDados = () => {
    Interface.modalConfirmacao({
      titulo: '🗑️ Limpar Todos os Dados',
      mensagem: 'TODOS os dados serão PERMANENTEMENTE apagados. O sistema voltará ao estado inicial.',
      precisaSenha: true,
      onConfirmar: () => {
        StorageService.limparTudo();
        Interface.mostrarToast('Dados apagados. Recarregando...', 'warning', 5000);
        setTimeout(() => window.location.reload(), 2000);
      },
    });
  };
  const carregarDadosDemonstracao = () => {
    const ativoId = Eventos.obterAtivoId();
    if (!ativoId) {
      Interface.mostrarToast('Por favor, crie e ative um Evento de Votação primeiro na aba "Eventos de Votação".', 'warning');
      return;
    }

    Interface.modalConfirmacao({
      titulo: '⚓ Carregar Dados da CFT',
      mensagem: 'Esta ação irá carregar a lista de oficiais e candidatos de demonstração da Capitania Fluvial de Tabatinga (CFT) para o evento ativo. Confirma?',
      onConfirmar: () => {
        StorageService.salvar('eleitores', DadosIniciais.obterEleitoresPadrao());
        StorageService.salvar('candidatosSO', DadosIniciais.obterCandidatosSOPadrao());
        StorageService.salvar('candidatosCB', DadosIniciais.obterCandidatosCBPadrao());

        App.atualizarPainelCompleto();
        Interface.mostrarToast('Dados de demonstração da CFT carregados com sucesso!', 'success');
      }
    });
  };

  return {
    novoOficial, cancelarOficial, editarOficial, salvarOficial, excluirOficial, resetarVotoOficial,
    registrarEventosFoto,
    novoCandidato, cancelarCandidato, editarCandidato, salvarCandidato, excluirCandidato,
    carregarConfiguracoes, salvarConfiguracoes, reinicializarVotacao, limparTodosOsDados, carregarDadosDemonstracao,
  };
})();


/* ================================================================
   MODULE: Historico
   Gerenciamento e exibição do histórico de eleições registradas.
   ================================================================ */
const Historico = (() => {
  const obterTodos = () => StorageService.obter('historico', []);

  /* Exclui um registro do histórico (somente admin) */
  const excluir = (id) => {
    Interface.modalConfirmacao({
      titulo: '🗑️ Remover do Histórico',
      mensagem: 'Remover este registro do histórico de eleições?',
      onConfirmar: () => {
        const lista = obterTodos().filter(h => h.id !== id);
        StorageService.salvar('historico', lista);
        renderizarAdmin();
        renderizarPublico();
        Interface.mostrarToast('Registro removido do histórico.', 'success');
      },
    });
  };

  /* Renderiza tabela no painel admin (aba Configurações) */
  const renderizarAdmin = () => {
    const tbody = Interface.get('tbody-historico-eleicoes');
    if (!tbody) return;
    const lista = obterTodos();
    if (lista.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--text-muted,#94a3b8);padding:1.5rem;">Nenhuma eleição registrada ainda.</td></tr>`;
      return;
    }
    const fmt = (d) => { try { return new Date(d).toLocaleDateString('pt-BR'); } catch { return d; } };
    tbody.innerHTML = lista.slice().reverse().map((h, i) => `
      <tr>
        <td>${lista.length - i}</td>
        <td><strong>${Utilitarios.sanitizar(h.nome)}</strong></td>
        <td>${Utilitarios.sanitizar(h.periodo)}</td>
        <td>${fmt(h.data)}</td>
        <td style="font-size:.82rem;">${Utilitarios.sanitizar(h.vencedorSO)}</td>
        <td style="font-size:.82rem;">${Utilitarios.sanitizar(h.vencedorCB)}</td>
        <td>${h.totalVotos}/${h.totalEleitores}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="Historico.excluir('${h.id}')" title="Remover">🗑️</button>
        </td>
      </tr>`).join('');
  };

  /* Renderiza cards na seção pública */
  const renderizarPublico = () => {
    const cards = Interface.get('historico-cards');
    const vazio = Interface.get('historico-lista-vazia');
    if (!cards) return;
    const lista = obterTodos();
    if (lista.length === 0) {
      cards.innerHTML = '';
      if (vazio) vazio.style.display = 'block';
      return;
    }
    if (vazio) vazio.style.display = 'none';
    const fmt = (d) => { try { return new Date(d).toLocaleDateString('pt-BR'); } catch { return d; } };

    cards.innerHTML = lista.slice().reverse().map((h) => {
      const soRows = (h.snapSO || []).slice(0, 5).map((c, idx) =>
        `<tr style="${idx === 0 ? 'font-weight:700;color:var(--gold,#F59E0B);' : ''}">
          <td>${idx + 1}º</td>
          <td>${Utilitarios.sanitizar(c.nome)}</td>
          <td>${Utilitarios.sanitizar(c.posto || '')}</td>
          <td>${c.votos}</td>
        </tr>`
      ).join('');
      const cbRows = (h.snapCB || []).slice(0, 5).map((c, idx) =>
        `<tr style="${idx === 0 ? 'font-weight:700;color:var(--gold,#F59E0B);' : ''}">
          <td>${idx + 1}º</td>
          <td>${Utilitarios.sanitizar(c.nome)}</td>
          <td>${Utilitarios.sanitizar(c.posto || '')}</td>
          <td>${c.votos}</td>
        </tr>`
      ).join('');

      return `
        <div class="section-card" style="padding:1.25rem 1.5rem; border-left: 4px solid var(--navy-500,#1e3a5f);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:.5rem;">
            <div>
              <h3 style="font-size:1rem;font-weight:700;margin:0;">${Utilitarios.sanitizar(h.nome)}</h3>
              <span style="font-size:.82rem;color:var(--text-muted,#94a3b8);">
                📅 ${fmt(h.data)} &nbsp;|&nbsp; 🗓️ ${Utilitarios.sanitizar(h.periodo)} &nbsp;|&nbsp; 🗳️ ${h.totalVotos} de ${h.totalEleitores} votos
              </span>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem;">
            <div>
              <p style="font-size:.8rem;font-weight:600;text-transform:uppercase;color:var(--text-muted,#94a3b8);margin-bottom:.4rem;">⚓ SO/SG – Top 5</p>
              <table style="width:100%;border-collapse:collapse;font-size:.82rem;">
                <thead><tr><th style="text-align:left;padding:2px 4px;opacity:.6;">#</th><th style="text-align:left;padding:2px 4px;opacity:.6;">Nome</th><th style="text-align:left;padding:2px 4px;opacity:.6;">Posto</th><th style="text-align:right;padding:2px 4px;opacity:.6;">Votos</th></tr></thead>
                <tbody>${soRows || '<tr><td colspan="4" style="color:var(--text-muted)">—</td></tr>'}</tbody>
              </table>
            </div>
            <div>
              <p style="font-size:.8rem;font-weight:600;text-transform:uppercase;color:var(--text-muted,#94a3b8);margin-bottom:.4rem;">🚢 CB/MN – Top 5</p>
              <table style="width:100%;border-collapse:collapse;font-size:.82rem;">
                <thead><tr><th style="text-align:left;padding:2px 4px;opacity:.6;">#</th><th style="text-align:left;padding:2px 4px;opacity:.6;">Nome</th><th style="text-align:left;padding:2px 4px;opacity:.6;">Posto</th><th style="text-align:right;padding:2px 4px;opacity:.6;">Votos</th></tr></thead>
                <tbody>${cbRows || '<tr><td colspan="4" style="color:var(--text-muted)">—</td></tr>'}</tbody>
              </table>
            </div>
          </div>
        </div>`;
    }).join('');
  };

  /* Accordion público */
  const inicializarAccordion = () => {
    const btn = Interface.get('btn-toggle-historico');
    const body = Interface.get('historico-body');
    const chevron = Interface.get('historico-chevron');
    if (!btn || !body) return;
    btn.addEventListener('click', () => {
      const aberto = body.style.display !== 'none';
      body.style.display = aberto ? 'none' : 'block';
      if (chevron) chevron.style.transform = aberto ? '' : 'rotate(180deg)';
      btn.setAttribute('aria-expanded', String(!aberto));
      if (!aberto) renderizarPublico();
    });
  };

  const registrarSnapshot = (nome, periodo, data, eventoAtivoId) => {
    const votos = StorageService.obter('votos', []);
    const eleitores = StorageService.obter('eleitores', []);
    const candSO = StorageService.obter('candidatosSO', []);
    const candCB = StorageService.obter('candidatosCB', []);

    const contarVotos = (grupo) => {
      const mapa = {};
      votos.filter(v => v.grupo === grupo).forEach(v => { mapa[v.candidatoId] = (mapa[v.candidatoId] || 0) + 1; });
      return mapa;
    };
    const votosSO = contarVotos('so');
    const votosCB = contarVotos('cb');

    const vencedorSO = candSO.reduce((top, c) => {
      const vts = votosSO[c.id] || 0;
      return vts > (votosSO[top?.id] || 0) ? c : top;
    }, null);
    const vencedorCB = candCB.reduce((top, c) => {
      const vts = votosCB[c.id] || 0;
      return vts > (votosCB[top?.id] || 0) ? c : top;
    }, null);

    const snapSO = candSO.map(c => ({ ...c, votos: votosSO[c.id] || 0 })).sort((a, b) => b.votos - a.votos);
    const snapCB = candCB.map(c => ({ ...c, votos: votosCB[c.id] || 0 })).sort((a, b) => b.votos - a.votos);

    const historico = StorageService.obter('historico', []);
    const indexExistente = historico.findIndex(h => h.eventoAtivoId === eventoAtivoId && h.eventoAtivoId !== null);

    const entrada = {
      id: indexExistente !== -1 ? historico[indexExistente].id : 'hist-' + Date.now(),
      nome,
      periodo: periodo || '-',
      data: data || new Date().toISOString().split('T')[0],
      eventoAtivoId: eventoAtivoId || null,
      totalVotos: votos.length,
      totalEleitores: eleitores.length,
      vencedorSO: vencedorSO ? `${vencedorSO.nome} (${votosSO[vencedorSO.id] || 0} voto${(votosSO[vencedorSO.id] || 0) !== 1 ? 's' : ''})` : 'Sem votos',
      vencedorCB: vencedorCB ? `${vencedorCB.nome} (${votosCB[vencedorCB.id] || 0} voto${(votosCB[vencedorCB.id] || 0) !== 1 ? 's' : ''})` : 'Sem votos',
      snapSO,
      snapCB,
      registradoEm: new Date().toISOString(),
    };

    if (indexExistente !== -1) {
      historico[indexExistente] = entrada;
    } else {
      historico.push(entrada);
    }
    StorageService.salvar('historico', historico);
  };

  window.Historico = { obterTodos, excluir, renderizarAdmin, renderizarPublico, inicializarAccordion, registrarSnapshot };
  return { obterTodos, excluir, renderizarAdmin, renderizarPublico, inicializarAccordion, registrarSnapshot };
})();


/* ================================================================
   MODULE: Eventos
   Gerenciamento de eventos de votação (Militar Padrão, etc.)
   ================================================================ */
const Eventos = (() => {
  const obterTodos = () => StorageService.obter('eventos', []);

  const obterAtivoId = () => {
    try {
      const raw = localStorage.getItem('cft_sev_eventoAtivoId');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  };

  const setEventoAtivoId = (id) => {
    if (id) {
      localStorage.setItem('cft_sev_eventoAtivoId', JSON.stringify(id));
    } else {
      localStorage.removeItem('cft_sev_eventoAtivoId');
    }
  };

  const novoEvento = () => {
    Interface.get('form-evento-titulo').textContent = 'Novo Evento de Votação';
    ['evt-nome', 'evt-data', 'evt-descricao', 'evt-id-editando'].forEach(id => {
      const el = Interface.get(id);
      if (el) el.value = '';
    });
    const selectTipo = Interface.get('evt-tipo');
    if (selectTipo) selectTipo.value = 'militar_padrao';
    const selectStatus = Interface.get('evt-status');
    if (selectStatus) selectStatus.value = 'rascunho';

    Interface.get('form-evento-wrap').style.display = 'block';
    Interface.get('evt-nome').focus();
  };

  const cancelarForm = () => {
    Interface.get('form-evento-wrap').style.display = 'none';
  };

  const salvar = () => {
    const nome = Interface.get('evt-nome').value.trim();
    const tipo = Interface.get('evt-tipo').value;
    const data = Interface.get('evt-data').value;
    const status = Interface.get('evt-status').value;
    const descricao = Interface.get('evt-descricao').value.trim();
    const idEdit = Interface.get('evt-id-editando').value;

    if (!nome || !tipo || !data || !status) {
      Interface.mostrarToast('Nome, Tipo, Data e Status são obrigatórios.', 'warning');
      return;
    }

    const eventos = obterTodos();

    // Se o status for ativo, precisamos desativar qualquer outro evento ativo
    if (status === 'ativo') {
      eventos.forEach(e => {
        if (e.id !== idEdit && e.status === 'ativo') {
          e.status = 'encerrado';
        }
      });
    }

    let eventoSalvoId = idEdit;

    if (idEdit) {
      const idx = eventos.findIndex(e => e.id === idEdit);
      if (idx !== -1) {
        eventos[idx] = { ...eventos[idx], nome, tipo, data, status, descricao };
      }
      Interface.mostrarToast('Evento atualizado.', 'success');
    } else {
      eventoSalvoId = Utilitarios.gerarId('evt');
      eventos.push({ id: eventoSalvoId, nome, tipo, data, status, descricao });
      Interface.mostrarToast('Evento criado com sucesso.', 'success');
    }

    StorageService.salvar('eventos', eventos);

    if (status === 'ativo') {
      setEventoAtivoId(eventoSalvoId);
    } else if (obterAtivoId() === idEdit && status !== 'ativo') {
      // Se era o ativo e mudou de status para não ativo, remove o ativo
      setEventoAtivoId(null);
    }

    cancelarForm();
    renderizarTabela();
    App.atualizarPainelCompleto();
    Votacao.atualizarTelaPublicaAtiva();
  };

  const editar = (id) => {
    const ev = obterTodos().find(e => e.id === id);
    if (!ev) return;

    Interface.get('form-evento-titulo').textContent = 'Editar Evento de Votação';
    Interface.get('evt-nome').value = ev.nome;
    Interface.get('evt-tipo').value = ev.tipo;
    Interface.get('evt-data').value = ev.data;
    Interface.get('evt-status').value = ev.status;
    Interface.get('evt-descricao').value = ev.descricao || '';
    Interface.get('evt-id-editando').value = ev.id;

    Interface.get('form-evento-wrap').style.display = 'block';
    Interface.get('form-evento-wrap').scrollIntoView({ behavior: 'smooth' });
  };

  const ativar = (id) => {
    const eventos = obterTodos();
    const ev = eventos.find(e => e.id === id);
    if (!ev) return;

    eventos.forEach(e => {
      if (e.id === id) {
        e.status = 'ativo';
      } else if (e.status === 'ativo') {
        e.status = 'encerrado';
      }
    });

    StorageService.salvar('eventos', eventos);
    setEventoAtivoId(id);

    Interface.mostrarToast(`Votação "${ev.nome}" ativada!`, 'success');
    renderizarTabela();
    App.atualizarPainelCompleto();
    Votacao.atualizarTelaPublicaAtiva();
  };

  const excluir = (id) => {
    const ev = obterTodos().find(e => e.id === id);
    if (!ev) return;

    Interface.modalConfirmacao({
      titulo: '⚠️ Excluir Votação',
      mensagem: `Tem certeza que deseja excluir permanentemente "${ev.nome}"? Isso apagará todos os oficiais, candidatos e votos associados a ela!`,
      precisaSenha: true,
      onConfirmar: () => {
        // Remove da lista de eventos
        const eventosFiltrados = obterTodos().filter(e => e.id !== id);
        StorageService.salvar('eventos', eventosFiltrados);

        // Se era o evento ativo, remove
        if (obterAtivoId() === id) {
          setEventoAtivoId(null);
        }

        // Limpar chaves associadas a este evento no localStorage
        const keysToRemove = [
          `cft_sev_eleitores_${id}`,
          `cft_sev_candidatosSO_${id}`,
          `cft_sev_candidatosCB_${id}`,
          `cft_sev_votos_${id}`,
          `cft_sev_logs_${id}`,
          `cft_sev_config_${id}`
        ];
        keysToRemove.forEach(k => localStorage.removeItem(k));

        Interface.mostrarToast('Votação excluída.', 'success');
        renderizarTabela();
        App.atualizarPainelCompleto();
        Votacao.atualizarTelaPublicaAtiva();
      }
    });
  };

  const renderizarTabela = () => {
    const tbody = Interface.get('tbody-eventos');
    if (!tbody) return;

    const eventos = obterTodos();

    if (eventos.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-8 text-slate-400">
            Nenhuma votação cadastrada ainda. Clique em "+ Adicionar Evento" para começar.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = eventos.map((ev, index) => {
      let statusBadge = '';
      if (ev.status === 'ativo') {
        statusBadge = '<span class="badge badge-success">✅ Ativo</span>';
      } else if (ev.status === 'encerrado') {
        statusBadge = '<span class="badge" style="background:var(--danger-bg); color:var(--danger); border:1px solid var(--danger);">🛑 Encerrado</span>';
      } else {
        statusBadge = '<span class="badge badge-pending">📝 Rascunho</span>';
      }

      const tipoStr = ev.tipo === 'militar_padrao' ? 'Militar Padrão' : (ev.tipo === 'inspetor_padrao' ? 'Inspetor Padrão' : 'Outra');
      const dataFormatada = ev.data ? ev.data.split('-').reverse().join('/') : '—';

      const btnAtivar = ev.status !== 'ativo'
        ? `<button class="btn btn-success btn-xs" onclick="Eventos.ativar('${ev.id}')">⚡ Ativar</button>`
        : `<span class="text-success font-bold" style="font-size: var(--text-xs); padding: 0.25rem;">Ativa Atualmente</span>`;

      return `
        <tr>
          <td>${index + 1}</td>
          <td>
            <strong>${Utilitarios.sanitizar(ev.nome)}</strong>
            ${ev.descricao ? `<p class="text-muted" style="font-size:var(--text-xs); margin-top:2px;">${Utilitarios.sanitizar(ev.descricao)}</p>` : ''}
          </td>
          <td>${tipoStr}</td>
          <td>${dataFormatada}</td>
          <td>${statusBadge}</td>
          <td class="table-actions">
            ${btnAtivar}
            <button class="btn btn-outline btn-xs" onclick="Eventos.editar('${ev.id}')">✏️ Editar</button>
            <button class="btn btn-xs" style="background:var(--danger-bg); color:var(--danger); border:1px solid var(--danger);" onclick="Eventos.excluir('${ev.id}')">✕ Excluir</button>
          </td>
        </tr>
      `;
    }).join('');
  };

  return {
    obterTodos, obterAtivoId, novoEvento, cancelarForm, salvar, editar, ativar, excluir, renderizarTabela
  };
})();

// Expor Eventos globalmente para botões inline na tabela
window.Eventos = Eventos;


/* ================================================================
   MODULE: Importacao
   Importação de Oficiais e Candidatos via CSV.
   ================================================================ */
const Importacao = (() => {
  /** Cache dos dados parseados aguardando confirmação */
  let _dadosOficiais = [];
  let _dadosCandidatos = [];

  /* ── OFICIAIS ───────────────────────────────────────────────── */
  const processarCSVOficiais = () => {
    const file = Interface.get('import-csv-oficiais')?.files[0];
    if (!file) { Interface.mostrarToast('Selecione um arquivo CSV.', 'warning'); return; }
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const { linhas } = Utilitarios.parsearCSV(evt.target.result);
        _dadosOficiais = linhas.map((l, i) => {
          const rawNip = (l.nip || l.NIP || '').trim();
          let nipLimpo = rawNip.replace(/\D/g, '');
          if (nipLimpo.length > 0 && nipLimpo.length < 8) {
            nipLimpo = nipLimpo.padStart(8, '0');
          }
          const nipExibicao = nipLimpo.length === 8 ? Utilitarios.formatarNIP(nipLimpo) : rawNip;

          return {
            idx: i + 1,
            nomeCompleto: (l.nomeCompleto || l['Nome Completo'] || '').trim(),
            posto: (l.posto || l.Posto || '').trim(),
            especialidade: (l.especialidade || l.Especialidade || '').trim(),
            nip: nipExibicao,
            status: 'ok',
          };
        }).map(r => {
          if (!r.nomeCompleto || !r.posto) r.status = 'erro';
          else if (!r.nip) r.status = 'aviso';
          else if (!Seguranca.validarNIP(r.nip)) r.status = 'erro';
          return r;
        });

        renderizarPreviewOficiais();
      } catch (e) {
        Interface.mostrarToast('Erro ao processar CSV.', 'error');
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const renderizarPreviewOficiais = () => {
    const tbody = Interface.get('tbody-preview-oficiais');
    const count = Interface.get('preview-oficiais-count');
    const wrap = Interface.get('preview-oficiais');
    if (!tbody) return;

    if (count) count.textContent = _dadosOficiais.length;
    tbody.innerHTML = _dadosOficiais.map(r => `
      <tr>
        <td>${r.idx}</td>
        <td>${Utilitarios.sanitizar(r.nomeCompleto || '—')}</td>
        <td>${Utilitarios.sanitizar(r.posto || '—')}</td>
        <td>${Utilitarios.sanitizar(r.especialidade || '—')}</td>
        <td>${Utilitarios.sanitizar(r.nip || '—')}</td>
        <td class="import-status-${r.status}">
          ${r.status === 'ok' ? '✅ OK' : r.status === 'aviso' ? '⚠️ Sem NIP' : '❌ Inválido'}
        </td>
      </tr>`).join('');

    if (wrap) wrap.style.display = 'block';
  };

  const confirmarImportacaoOficiais = () => {
    const validos = _dadosOficiais.filter(r => r.status !== 'erro');
    if (!validos.length) { Interface.mostrarToast('Nenhum registro válido para importar.', 'error'); return; }

    const modo = document.querySelector('input[name="modo-import-oficiais"]:checked')?.value || 'adicionar';
    const oficiais = modo === 'substituir' ? [] : StorageService.obter('eleitores', []);

    validos.forEach(r => {
      const nipLimpo = r.nip.replace(/\D/g, '').padStart(8, '0');
      const nipFormatado = Utilitarios.formatarNIP(nipLimpo);

      oficiais.push({
        id: Utilitarios.gerarId('el'),
        nomeCompleto: r.nomeCompleto,
        posto: r.posto,
        especialidade: r.especialidade,
        nip: nipFormatado,
        votou: false,
      });
    });

    StorageService.salvar('eleitores', oficiais);
    _dadosOficiais = [];
    Interface.get('preview-oficiais').style.display = 'none';
    Interface.get('import-csv-oficiais').value = '';
    Dashboard.renderizarTabelaOficiais();
    Interface.popularSelectOficiais();
    Interface.atualizarProgresso();
    Dashboard.atualizarKPIs();
    Interface.mostrarToast(`${validos.length} oficial(is) importado(s) com sucesso.`, 'success');
    Seguranca.registrarLog('IMPORTACAO_OFICIAIS', `${validos.length} oficiais importados via CSV.`);
  };

  /* ── CANDIDATOS ─────────────────────────────────────────────── */
  const processarCSVCandidatos = () => {
    const file = Interface.get('import-csv-candidatos')?.files[0];
    if (!file) { Interface.mostrarToast('Selecione um arquivo CSV.', 'warning'); return; }
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const { linhas } = Utilitarios.parsearCSV(evt.target.result);
        _dadosCandidatos = linhas.map((l, i) => {
          const grupo = (l.grupo || l.Grupo || '').toUpperCase().trim();
          const rawNip = (l.nip || l.NIP || '').trim();
          let nipLimpo = rawNip.replace(/\D/g, '');
          if (nipLimpo.length > 0 && nipLimpo.length < 8) {
            nipLimpo = nipLimpo.padStart(8, '0');
          }
          const nipExibicao = nipLimpo.length === 8 ? Utilitarios.formatarNIP(nipLimpo) : rawNip;

          const r = {
            idx: i + 1,
            nome: (l.nome || l.Nome || '').trim(),
            posto: (l.posto || l.Posto || '').trim(),
            especialidade: (l.especialidade || l.Especialidade || '').trim(),
            nip: nipExibicao,
            numero: parseInt(l.numero || l.Número || l.Numero || '0', 10),
            grupo: grupo,
            status: 'ok',
          };
          if (!r.nome || !r.posto || isNaN(r.numero) || r.numero < 1) r.status = 'erro';
          else if (!['SO', 'CB'].includes(r.grupo)) r.status = 'erro';
          else if (rawNip && !Seguranca.validarNIP(nipLimpo)) r.status = 'erro';
          return r;
        });
        renderizarPreviewCandidatos();
      } catch {
        Interface.mostrarToast('Erro ao processar CSV.', 'error');
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const renderizarPreviewCandidatos = () => {
    const tbody = Interface.get('tbody-preview-candidatos');
    const count = Interface.get('preview-candidatos-count');
    const wrap = Interface.get('preview-candidatos');
    if (!tbody) return;

    if (count) count.textContent = _dadosCandidatos.length;
    tbody.innerHTML = _dadosCandidatos.map(r => `
      <tr>
        <td>${r.idx}</td>
        <td>${Utilitarios.sanitizar(r.nome || '—')}</td>
        <td>${Utilitarios.sanitizar(r.posto || '—')}</td>
        <td>${Utilitarios.sanitizar(r.especialidade || '—')}</td>
        <td>${Utilitarios.sanitizar(r.nip || '—')}</td>
        <td>${r.numero}</td>
        <td>${Utilitarios.sanitizar(r.grupo || '?')}</td>
        <td class="import-status-${r.status}">
          ${r.status === 'ok' ? '✅ OK' : '❌ Inválido'}
        </td>
      </tr>`).join('');

    if (wrap) wrap.style.display = 'block';
  };

  const confirmarImportacaoCandidatos = () => {
    const validos = _dadosCandidatos.filter(r => r.status === 'ok');
    if (!validos.length) { Interface.mostrarToast('Nenhum registro válido.', 'error'); return; }

    const modo = document.querySelector('input[name="modo-import-candidatos"]:checked')?.value || 'adicionar';
    let listaSO = modo === 'substituir' ? [] : StorageService.obter('candidatosSO', []);
    let listaCB = modo === 'substituir' ? [] : StorageService.obter('candidatosCB', []);

    validos.forEach(r => {
      let nipFormatado = '';
      if (r.nip) {
        const nipLimpo = r.nip.replace(/\D/g, '').padStart(8, '0');
        nipFormatado = Utilitarios.formatarNIP(nipLimpo);
      }
      const obj = { id: Utilitarios.gerarId(r.grupo.toLowerCase()), nome: r.nome, posto: r.posto, especialidade: r.especialidade, nip: nipFormatado, numero: r.numero, foto: '' };
      if (r.grupo === 'SO') listaSO.push(obj);
      else listaCB.push(obj);
    });

    StorageService.salvar('candidatosSO', listaSO);
    StorageService.salvar('candidatosCB', listaCB);
    _dadosCandidatos = [];
    Interface.get('preview-candidatos').style.display = 'none';
    Interface.get('import-csv-candidatos').value = '';
    Dashboard.renderizarTabelaCandidatos('so');
    Dashboard.renderizarTabelaCandidatos('cb');
    Interface.mostrarToast(`${validos.length} candidato(s) importado(s).`, 'success');
    Seguranca.registrarLog('IMPORTACAO_CANDIDATOS', `${validos.length} candidatos importados via CSV.`);
  };

  /* ── TEMPLATES CSV ──────────────────────────────────────────── */
  const baixarTemplateOficiais = (evt) => {
    evt.preventDefault();
    const csv = 'nomeCompleto,posto,especialidade,nip\n'
      + '"João Silva de Souza","CF","IN","1234567-8"\n'
      + '"Maria Oliveira Lima","CC","AA","8765432-1"\n';
    Utilitarios.downloadArquivo('\uFEFF' + csv, 'template_oficiais.csv', 'text/csv;charset=utf-8');
  };

  const baixarTemplateCandidatos = (evt) => {
    evt.preventDefault();
    const csv = 'nome,posto,especialidade,nip,numero,grupo\n'
      + '"Carlos Alberto Nunes","SO","QT-MF","SO-001",1,"SO"\n'
      + '"Paulo Roberto Silva","1ºSG","QT-CB","SO-002",2,"SO"\n'
      + '"André Luis Costa","CB","QT-MF","CB-001",1,"CB"\n'
      + '"José Ferreira Lima","MN","QT-EL","CB-002",2,"CB"\n';
    Utilitarios.downloadArquivo('\uFEFF' + csv, 'template_candidatos.csv', 'text/csv;charset=utf-8');
  };

  return {
    processarCSVOficiais, confirmarImportacaoOficiais,
    processarCSVCandidatos, confirmarImportacaoCandidatos,
    baixarTemplateOficiais, baixarTemplateCandidatos,
  };
})();


/* ================================================================
   MODULE: Exportacao
   CSV, Excel (XLSX), PDF, JSON
   ================================================================ */
const Exportacao = (() => {
  const nomeArq = (base, ext) => `SEV_CFT_${base}_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.${ext}`;

  const coletarDados = () => {
    const votos = StorageService.obter('votos', []);
    const eleitores = StorageService.obter('eleitores', []);
    const candidatosSO = StorageService.obter('candidatosSO', []);
    const candidatosCB = StorageService.obter('candidatosCB', []);
    const rSO = candidatosSO.map(c => ({ ...c, totalVotos: votos.filter(v => v.candidatoSO === c.id).length })).sort((a, b) => b.totalVotos - a.totalVotos);
    const rCB = candidatosCB.map(c => ({ ...c, totalVotos: votos.filter(v => v.candidatoCB === c.id).length })).sort((a, b) => b.totalVotos - a.totalVotos);
    return { votos, eleitores, candidatosSO, candidatosCB, resultadoSO: rSO, resultadoCB: rCB };
  };

  const exportarCSV = () => {
    const { resultadoSO, resultadoCB, votos, eleitores } = coletarDados();
    const tv = votos.length;
    let csv = 'SISTEMA ELETRÔNICO DE VOTAÇÃO – CFT\n';
    csv += `Exportado em: ${new Date().toLocaleString('pt-BR')}\n\n`;
    csv += '== APURAÇÃO SO/SG ==\nRank,Nome,Posto,Especialidade,Votos,Percentual\n';
    resultadoSO.forEach((c, i) => { csv += `${i + 1},"${c.nome}","${c.posto}","${c.especialidade}",${c.totalVotos},${tv > 0 ? ((c.totalVotos / tv) * 100).toFixed(1) : '0.0'}%\n`; });
    csv += '\n== APURAÇÃO CB/MN ==\nRank,Nome,Posto,Especialidade,Votos,Percentual\n';
    resultadoCB.forEach((c, i) => { csv += `${i + 1},"${c.nome}","${c.posto}","${c.especialidade}",${c.totalVotos},${tv > 0 ? ((c.totalVotos / tv) * 100).toFixed(1) : '0.0'}%\n`; });
    csv += '\n== PARTICIPAÇÃO ==\nNome,Posto,Votou\n';
    eleitores.forEach(e => { csv += `"${e.nomeCompleto}","${e.posto}",${e.votou ? 'Sim' : 'Não'}\n`; });
    Utilitarios.downloadArquivo('\uFEFF' + csv, nomeArq('apuracao', 'csv'), 'text/csv;charset=utf-8');
    Interface.mostrarToast('CSV exportado!', 'success');
  };

  const exportarJSON = () => {
    Utilitarios.downloadArquivo(JSON.stringify(StorageService.exportarTudo(), null, 2), nomeArq('backup', 'json'), 'application/json');
    Interface.mostrarToast('Backup JSON exportado!', 'success');
  };

  const exportarPDF = () => {
    Interface.mostrarToast('Abrindo diálogo de impressão...', 'info', 2000);
    const t = document.querySelector('[data-tab="apuracao"]');
    if (t) t.click();
    setTimeout(() => window.print(), 500);
  };

  const exportarXLSX = () => {
    const { resultadoSO, resultadoCB, votos, eleitores } = coletarDados();
    const tv = votos.length;

    const celula = (val, t = 's') => t === 'n' ? `<c t="n"><v>${val}</v></c>` : `<c t="inlineStr"><is><t>${String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</t></is></c>`;
    const linha = (...cells) => `<row>${cells.join('')}</row>`;

    const buildSheet = (titulo, res) => {
      let r = linha(celula(titulo)) + linha(celula('Rank'), celula('Nome'), celula('Posto'), celula('Especialidade'), celula('Votos'), celula('Percentual'));
      res.forEach((c, i) => { r += linha(celula(i + 1, 'n'), celula(c.nome), celula(c.posto), celula(c.especialidade), celula(c.totalVotos, 'n'), celula(tv > 0 ? ((c.totalVotos / tv) * 100).toFixed(1) + '%' : '0%')); });
      return `<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${r}</sheetData></worksheet>`;
    };

    let rP = linha(celula('Nome'), celula('Posto'), celula('Especialidade'), celula('NIP'), celula('Votou'));
    eleitores.forEach(e => { rP += linha(celula(e.nomeCompleto), celula(e.posto), celula(e.especialidade || ''), celula(e.nip || ''), celula(e.votou ? 'Sim' : 'Não')); });
    const sheetP = `<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${rP}</sheetData></worksheet>`;

    const wb = `<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="SO-SG" sheetId="1" r:id="rId1"/><sheet name="CB-MN" sheetId="2" r:id="rId2"/><sheet name="Participação" sheetId="3" r:id="rId3"/></sheets></workbook>`;
    const rels = `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet3.xml"/></Relationships>`;
    const ct = `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`;
    const mainRels = `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;

    const zip = gerarZIP({ '[Content_Types].xml': ct, '_rels/.rels': mainRels, 'xl/workbook.xml': wb, 'xl/_rels/workbook.xml.rels': rels, 'xl/worksheets/sheet1.xml': buildSheet('Apuração SO/SG', resultadoSO), 'xl/worksheets/sheet2.xml': buildSheet('Apuração CB/MN', resultadoCB), 'xl/worksheets/sheet3.xml': sheetP });
    Utilitarios.downloadArquivo(zip, nomeArq('apuracao', 'xlsx'), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    Interface.mostrarToast('Excel exportado!', 'success');
  };

  const gerarZIP = (arquivos) => {
    const enc = new TextEncoder(), partes = [], dirs = [];
    let off = 0;
    for (const [p, c] of Object.entries(arquivos)) {
      const d = enc.encode(c), n = enc.encode(p), crc = crc32(d);
      const h = lfh(n, d.length, crc); partes.push(h, d); dirs.push({ n, d, crc, off }); off += h.length + d.length;
    }
    const central = dirs.flatMap(({ n, d, crc, off: o }) => [cdh(n, d.length, crc, o)]);
    const eocd = eocdr(dirs.length, central.reduce((s, b) => s + b.length, 0), off);
    return concat([...partes, ...central, eocd]);
  };
  const u32 = (v) => new Uint8Array([v & 0xFF, (v >> 8) & 0xFF, (v >> 16) & 0xFF, (v >> 24) & 0xFF]);
  const u16 = (v) => new Uint8Array([v & 0xFF, (v >> 8) & 0xFF]);
  const lfh = (n, s, c) => concat([new Uint8Array([0x50, 0x4B, 0x03, 0x04]), u16(20), u16(0), u16(0), u16(0), u16(0), u32(c), u32(s), u32(s), u16(n.length), u16(0), n]);
  const cdh = (n, s, c, o) => concat([new Uint8Array([0x50, 0x4B, 0x01, 0x02]), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0), u16(0), u32(c), u32(s), u32(s), u16(n.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(o), n]);
  const eocdr = (cnt, csz, coff) => concat([new Uint8Array([0x50, 0x4B, 0x05, 0x06]), u16(0), u16(0), u16(cnt), u16(cnt), u32(csz), u32(coff), u16(0)]);
  const concat = (arrays) => { const total = arrays.reduce((s, a) => s + a.length, 0), r = new Uint8Array(total); let p = 0; for (const a of arrays) { r.set(a, p); p += a.length; } return r; };
  const crc32 = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) { let c = i; for (let k = 0; k < 8; k++)c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); t[i] = c; }
    return (data) => { let c = 0xFFFFFFFF; for (const b of data) c = (c >>> 8) ^ t[(c ^ b) & 0xFF]; return (c ^ 0xFFFFFFFF) >>> 0; };
  })();

  const restaurarJSON = (arquivo) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const backup = JSON.parse(evt.target.result);
        if (!backup.eleitores && !backup.dados) throw new Error('Inválido');
        Interface.modalConfirmacao({
          titulo: '📥 Restaurar Backup',
          mensagem: 'Os dados atuais serão substituídos pelos dados do backup. Confirma?',
          onConfirmar: () => {
            StorageService.restaurarTudo(backup);
            Interface.mostrarToast('Dados restaurados! Recarregando...', 'success', 5000);
            setTimeout(() => window.location.reload(), 2000);
          },
        });
      } catch { Interface.mostrarToast('Arquivo inválido.', 'error'); }
    };
    reader.readAsText(arquivo);
  };

  return { exportarCSV, exportarJSON, exportarPDF, exportarXLSX, restaurarJSON };
})();


/* ================================================================
   MODULE: App
   Inicialização e orquestração de eventos.
   ================================================================ */
const App = (() => {
  const abrirPainel = () => {
    if (!Seguranca.isAdminAutenticado()) return;
    Interface.get('painel-admin').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    atualizarPainelCompleto();
    Admin.carregarConfiguracoes();
  };

  const fecharPainel = () => {
    Interface.get('painel-admin').style.display = 'none';
    document.body.style.overflow = '';
    Seguranca.encerrarSessaoAdmin();
    // Re-sincroniza a tela pública após qualquer alteração feita no painel
    Votacao.atualizarTelaPublicaAtiva();
    Interface.atualizarProgresso();
  };

  const atualizarPainelCompleto = () => {
    Eventos.renderizarTabela();
    Dashboard.atualizarKPIs();
    Dashboard.renderizarApuracao();
    Dashboard.renderizarTabelaOficiais();
    Dashboard.renderizarTabelaCandidatos('so');
    Dashboard.renderizarTabelaCandidatos('cb');
    Interface.atualizarProgresso();
  };

  const ativarAba = (tabId) => {
    document.querySelectorAll('.admin-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tabId);
      t.setAttribute('aria-selected', t.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-content').forEach(c => {
      const ativo = c.id === `tab-content-${tabId}`;
      c.style.display = ativo ? 'block' : 'none';
      c.classList.toggle('active', ativo);
    });
    if (tabId === 'apuracao') Dashboard.renderizarApuracao();
    if (tabId === 'gestao-eventos') Eventos.renderizarTabela();
    if (tabId === 'configuracoes') Historico.renderizarAdmin();
  };

  const ativarSubAba = (subtabId) => {
    document.querySelectorAll('.sub-tab').forEach(t => t.classList.toggle('active', t.dataset.subtab === subtabId));
    document.querySelectorAll('.sub-tab-content').forEach(c => {
      const ativo = c.id === `subtab-content-${subtabId}`;
      c.style.display = ativo ? 'block' : 'none';
      c.classList.toggle('active', ativo);
    });
  };

  const registrarEventos = () => {
    const on = (id, evt, fn) => { const e = Interface.get(id); if (e) e.addEventListener(evt, fn); };

    /* Identificação */
    on('select-oficial', 'change', Votacao.aoSelecionarOficial);
    on('btn-iniciar-votacao', 'click', Votacao.iniciarVotacao);
    on('btn-nova-identificacao', 'click', Votacao.voltarIdentificacao);

    /* Votação */
    on('btn-avancar-cb', 'click', Votacao.avancarParaCB);
    on('btn-voltar-so', 'click', Votacao.voltarParaSO);
    on('btn-confirmar-voto', 'click', Votacao.abrirConfirmacaoVoto);  // ← abre confirmacao direto sem NIP

    /* Modal NIP */
    on('btn-confirmar-nip', 'click', Votacao.processarNip);
    on('btn-cancelar-nip', 'click', () => { Interface.toggleModal('modal-nip', false); Votacao.voltarParaSO(); });
    on('input-nip-votacao', 'keydown', (e) => { if (e.key === 'Enter') Interface.get('btn-confirmar-nip')?.click(); });
    on('btn-toggle-nip', 'click', () => {
      const inp = Interface.get('input-nip-votacao');
      if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
    });

    /* Máscara de NIP: aplica XX.XXXX.X-X enquanto o usuário digita.
       Funciona em todos os campos de NIP da aplicação:
         - input-nip-votacao  : autenticação do voto
         - el-nip             : cadastro de oficial
         - so-nip / cb-nip   : cadastro de candidato
     */
    const nipInputIds = ['input-nip-votacao', 'el-nip', 'so-nip', 'cb-nip'];
    nipInputIds.forEach(id => {
      const inp = Interface.get(id);
      if (!inp) return;

      inp.addEventListener('input', () => {
        const pos = inp.selectionStart;
        const before = inp.value.substring(0, pos).replace(/\D/g, '').length;
        inp.value = Utilitarios.aplicarMascaraNIP(inp.value);

        // Reposiciona o cursor após formatação
        let count = 0, newPos = 0;
        for (let i = 0; i < inp.value.length; i++) {
          if (/\d/.test(inp.value[i])) count++;
          if (count === before) { newPos = i + 1; break; }
        }
        try { inp.setSelectionRange(newPos, newPos); } catch { }

        // Feedback visual em tempo real no campo de votação
        if (id === 'input-nip-votacao') {
          const digits = inp.value.replace(/\D/g, '');
          const erroEl = Interface.get('erro-nip');
          const confBtn = Interface.get('btn-confirmar-nip');

          if (digits.length === 8) {
            const nipOk = Seguranca.validarNIP(inp.value);
            if (nipOk) {
              inp.style.borderColor = 'var(--success, #10B981)';
              inp.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.15)';
              if (erroEl) erroEl.style.display = 'none';
              if (confBtn) confBtn.removeAttribute('disabled');
            } else {
              inp.style.borderColor = 'var(--danger, #EF4444)';
              inp.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.12)';
              if (erroEl) { erroEl.innerHTML = '<span>🚫</span> Dígito verificador incorreto (Módulo 11).'; erroEl.style.display = 'flex'; }
              if (confBtn) confBtn.setAttribute('disabled', '');
            }
          } else {
            inp.style.borderColor = '';
            inp.style.boxShadow = '';
            if (erroEl && digits.length > 0) erroEl.style.display = 'none';
            if (confBtn) confBtn.setAttribute('disabled', '');
          }
        }
      });

      // Bloqueia teclas que não são dígitos, backspace, delete, setas, tab
      inp.addEventListener('keydown', (e) => {
        const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End'];
        if (!allowed.includes(e.key) && !/^\d$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
        }
      });
    });

    /* Modal confirmação voto */
    on('btn-modal-sim', 'click', Votacao.confirmarVoto);
    on('btn-modal-nao', 'click', () => { Interface.toggleModal('modal-confirmacao', false); Votacao.voltarParaSO(); });

    /* Pesquisa / ordenação */
    on('pesquisa-so', 'input', (e) => Votacao.pesquisarCandidatos(e.target.value, 'grid-so', 'sem-resultado-so'));
    on('pesquisa-cb', 'input', (e) => Votacao.pesquisarCandidatos(e.target.value, 'grid-cb', 'sem-resultado-cb'));
    on('btn-ordem-so', 'click', () => Votacao.reordenarCandidatos('grid-so', 'so'));
    on('btn-ordem-cb', 'click', () => Votacao.reordenarCandidatos('grid-cb', 'cb'));

    /* Área restrita */
    on('btn-area-restrita', 'click', () => Interface.toggleModal('modal-senha', true));
    on('btn-fechar-modal-senha', 'click', () => Interface.toggleModal('modal-senha', false));
    on('btn-cancelar-senha', 'click', () => Interface.toggleModal('modal-senha', false));
    on('input-senha-admin', 'keydown', (e) => { if (e.key === 'Enter') Interface.get('btn-entrar-admin')?.click(); });
    on('btn-toggle-pass', 'click', () => {
      const inp = Interface.get('input-senha-admin');
      if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
    });
    on('btn-entrar-admin', 'click', () => {
      const senha = Interface.get('input-senha-admin')?.value || '';
      const erro = Interface.get('erro-senha');
      if (Seguranca.autenticarAdmin(senha)) {
        Interface.get('input-senha-admin').value = '';
        erro.style.display = 'none';
        Interface.toggleModal('modal-senha', false);
        abrirPainel();
      } else { erro.style.display = 'flex'; Interface.get('input-senha-admin').select(); }
    });

    /* Painel admin */
    on('btn-fechar-admin', 'click', fecharPainel);
    document.querySelectorAll('.admin-tab').forEach(t => t.addEventListener('click', () => ativarAba(t.dataset.tab)));
    document.querySelectorAll('.sub-tab').forEach(t => t.addEventListener('click', () => ativarSubAba(t.dataset.subtab)));

    /* Gestão eventos */
    on('btn-novo-evento', 'click', Eventos.novoEvento);
    on('btn-cancelar-evento', 'click', Eventos.cancelarForm);
    on('btn-salvar-evento', 'click', Eventos.salvar);

    /* Apuração */
    on('btn-print-apuracao', 'click', Exportacao.exportarPDF);
    on('btn-atualizar-apuracao', 'click', () => { Dashboard.renderizarApuracao(); Dashboard.atualizarKPIs(); Interface.mostrarToast('Atualizado.', 'success'); });

    /* Gestão oficiais */

    on('btn-novo-oficial', 'click', Admin.novoOficial);
    on('btn-cancelar-oficial', 'click', Admin.cancelarOficial);
    on('btn-salvar-oficial', 'click', Admin.salvarOficial);

    /* Gestão candidatos SO */
    on('btn-novo-cand-so', 'click', () => Admin.novoCandidato('so'));
    on('btn-cancelar-cand-so', 'click', () => Admin.cancelarCandidato('so'));
    on('btn-salvar-cand-so', 'click', () => Admin.salvarCandidato('so'));

    /* Gestão candidatos CB */
    on('btn-novo-cand-cb', 'click', () => Admin.novoCandidato('cb'));
    on('btn-cancelar-cand-cb', 'click', () => Admin.cancelarCandidato('cb'));
    on('btn-salvar-cand-cb', 'click', () => Admin.salvarCandidato('cb'));

    /* Foto upload events */
    Admin.registrarEventosFoto('so');
    Admin.registrarEventosFoto('cb');

    /* Exportação */
    on('btn-export-csv', 'click', Exportacao.exportarCSV);
    on('btn-export-xlsx', 'click', Exportacao.exportarXLSX);
    on('btn-export-pdf', 'click', Exportacao.exportarPDF);
    on('btn-export-json', 'click', Exportacao.exportarJSON);
    on('btn-restaurar', 'click', () => {
      const f = Interface.get('input-restaurar')?.files[0];
      if (!f) { Interface.mostrarToast('Selecione um arquivo JSON.', 'warning'); return; }
      Exportacao.restaurarJSON(f);
    });

    /* Importação Oficiais */
    on('btn-preview-oficiais', 'click', Importacao.processarCSVOficiais);
    on('btn-confirmar-import-oficiais', 'click', Importacao.confirmarImportacaoOficiais);
    on('btn-cancelar-import-oficiais', 'click', () => { Interface.get('preview-oficiais').style.display = 'none'; });
    on('btn-download-template-oficiais', 'click', Importacao.baixarTemplateOficiais);

    /* Importação Candidatos */
    on('btn-preview-candidatos', 'click', Importacao.processarCSVCandidatos);
    on('btn-confirmar-import-candidatos', 'click', Importacao.confirmarImportacaoCandidatos);
    on('btn-cancelar-import-candidatos', 'click', () => { Interface.get('preview-candidatos').style.display = 'none'; });
    on('btn-download-template-candidatos', 'click', Importacao.baixarTemplateCandidatos);

    /* Configurações */
    on('btn-salvar-config', 'click', Admin.salvarConfiguracoes);
    on('btn-carregar-demo', 'click', Admin.carregarDadosDemonstracao);
    on('btn-alterar-senha', 'click', () => {
      const a = Interface.get('config-senha-atual')?.value || '';
      const n = Interface.get('config-senha-nova')?.value || '';
      const c = Interface.get('config-senha-confirmar')?.value || '';
      if (n !== c) { Interface.mostrarToast('As senhas não coincidem.', 'error'); return; }
      const r = Seguranca.alterarSenha(a, n);
      Interface.mostrarToast(r.msg, r.ok ? 'success' : 'error');
      if (r.ok) ['config-senha-atual', 'config-senha-nova', 'config-senha-confirmar'].forEach(id => { const e = Interface.get(id); if (e) e.value = ''; });
    });
    on('btn-reiniciar-votacao', 'click', Admin.reinicializarVotacao);
    on('btn-limpar-tudo', 'click', Admin.limparTodosOsDados);

    /* Ajuda */
    const tratarCliqueAjuda = (mostrarSecaoAdmin) => {
      const secaoComSoc = Interface.get('ajuda-secao-comsoc');
      if (secaoComSoc) {
        secaoComSoc.style.display = mostrarSecaoAdmin ? 'block' : 'none';
      }
      Interface.toggleModal('modal-ajuda', true);
    };
    on('btn-ajuda', 'click', () => tratarCliqueAjuda(false));
    on('btn-ajuda-admin', 'click', () => tratarCliqueAjuda(true));
    on('btn-fechar-ajuda', 'click', () => Interface.toggleModal('modal-ajuda', false));
    on('btn-entendido-ajuda', 'click', () => Interface.toggleModal('modal-ajuda', false));

    /* Modal genérico */
    on('btn-modal-generico-cancelar', 'click', () => Interface.toggleModal('modal-generico', false));

    /* Fechar modais pelo overlay */
    ['modal-nip', 'modal-senha', 'modal-generico', 'modal-ajuda'].forEach(id => {
      const m = Interface.get(id);
      if (m) m.addEventListener('click', (e) => { if (e.target === m) Interface.toggleModal(id, false); });
    });

    /* ESC fecha modais */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        ['modal-confirmacao', 'modal-nip', 'modal-senha', 'modal-generico', 'modal-ajuda'].forEach(id => {
          const m = Interface.get(id);
          if (m && m.style.display !== 'none') Interface.toggleModal(id, false);
        });
      }
    });

    Votacao.registrarAvisoSaida();
  };

  const inicializar = () => {
    Interface.inicializarRefs();

    // Inicializar cabeçalho com usuário logado no ComSoc
    const logadoInfo = localStorage.getItem('cft_votacao_oficial_logado');
    if (logadoInfo) {
      try {
        const profile = JSON.parse(logadoInfo);
        if (profile && profile.nome) {
          const nameEl = document.getElementById('header-user-name');
          const infoEl = document.getElementById('header-user-info');
          const sairEl = document.getElementById('btn-sair-urna');
          if (nameEl) {
            const roleBadge = (profile.role === 'super_admin' || profile.role === 'admin') ? ' (Admin)' : '';
            nameEl.textContent = `${profile.nome}${roleBadge}`;
          }
          if (infoEl) infoEl.style.display = 'flex';
          if (sairEl) {
            sairEl.style.display = 'flex';
            sairEl.addEventListener('click', () => {
              localStorage.removeItem('cft_votacao_oficial_logado');
              if (window.parent && typeof window.parent.signOut === 'function') {
                window.parent.signOut();
              } else {
                window.location.reload();
              }
            });
          }
        }
      } catch(e) { console.error('Erro ao ler perfil logado no cabeçalho:', e); }
    }

    Interface.executarCarregamento(() => {
      DadosIniciais.inicializar();
      Interface.iniciarRelogio();
      Interface.atualizarAnoFooter();
      Interface.inicializarModoEscuro();
      Votacao.atualizarTelaPublicaAtiva();
      Interface.atualizarProgresso();
      Historico.inicializarAccordion();
      registrarEventos();

      // Inicializa a integração com o Supabase se as credenciais estiverem ativas
      if (SupabaseSyncService.inicializar()) {
        SupabaseSyncService.puxarDaNuvem().then(() => {
          Votacao.atualizarTelaPublicaAtiva();
          Interface.atualizarProgresso();
          atualizarPainelCompleto();
        });

        // Loop de atualização periódica (15s) para pegar votos de outros celulares
        setInterval(async () => {
          await SupabaseSyncService.puxarDaNuvem();
          Votacao.atualizarTelaPublicaAtiva();
          Interface.atualizarProgresso();
          const painel = Interface.get('painel-admin');
          if (painel && painel.style.display === 'flex') {
            atualizarPainelCompleto();
          }
        }, 15000);
      }

      // Auto-selecionar o Oficial com base na sessão ativa do ComSoc
      Votacao.verificarAutoSelecaoOficial();

      Interface.mostrarToast('SEV-CFT v1.1 carregado com sucesso.', 'success', 3000);
      Seguranca.registrarLog('SISTEMA_INICIADO', 'SEV-CFT v1.1 iniciado.');
    });
  };

  return { inicializar, atualizarPainelCompleto };
})();

// Expõe Admin globalmente para uso em botões inline de tabelas
window.Admin = Admin;

document.addEventListener('DOMContentLoaded', App.inicializar);
