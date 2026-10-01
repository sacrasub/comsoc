// =============================================================================
// MÓDULO DE UI — ComSoc Fase 3
// Gerenciamento completo do ciclo de Comunicação Social de eventos
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// ESTADO GLOBAL DO MÓDULO
// ─────────────────────────────────────────────────────────────────────────────
let comsocActiveEventId = null;
let comsocActiveEventName = '';
let comsocChecklistState = {}; // Map { tarefa_id: objeto }
let comsocClippingData = [];
let comsocReleaseData = [];
let comsocEditingReleaseId = null;
let comsocEditingClippingId = null;
let comsocStarRatings = { planejamento: 0, execucao: 0, pos_evento: 0 };
let comsocPanelLoaded = false; // Evita re-renderização ao trocar de aba
let comsocControlesPanelLoaded = false;
let comsocControlesChecklistState = {}; // Map { tarefa_id: objeto }
const COMSOC_GLOBAL_EVENT_ID = 'comsoc_global';
const COMSOC_GLOBAL_EVENT_NAME = 'Gestão e Controles';

// ─────────────────────────────────────────────────────────────────────────────
// DEFINIÇÃO DAS TAREFAS (CHECKLIST NORMATIVO)
// ─────────────────────────────────────────────────────────────────────────────
const COMSOC_TAREFAS = [
    // FASE 1: PLANEJAMENTO
    {
        fase: 'planejamento', id: 'T01', ordem: 1,
        nome: 'Lista de Convidados e Convites',
        descricao: 'Elaborar a lista em coordenação com o Gabinete/Comando. Convites por e-mail para autoridades superiores devem ser subscritos pela própria autoridade que convida (não pode ser delegado). Redação conforme Decreto nº 9.758/2019 e NODAM.',
        icon: 'users', cor: 'blue',
        acao: { label: 'Abrir Diretório', fn: 'comsocAbrirDiretorio' }
    },
    {
        fase: 'planejamento', id: 'T02', ordem: 2,
        nome: 'Roteiro do Mestre de Cerimônias (Vogal)',
        descricao: 'Elaborar o script da cerimônia. Evitar "será feita" ou "será lida". Convidar para "posição respeitosa" nos Hinos e movimentação de tropa. Não repetir exaustivamente "Excelentíssimo Senhor" — citar cargo, posto e nome.',
        icon: 'mic', cor: 'purple',
        acao: { label: 'Gerar Roteiro', fn: 'openRoteirVogalModal' }
    },
    {
        fase: 'planejamento', id: 'T03', ordem: 3,
        nome: 'Marcação do Dispositivo',
        descricao: 'Providenciar marcação e indicação visual dos locais reservados. Comandante e Titulares da Cadeia de Comando preferencialmente na primeira linha. Reservar assentos confortáveis para civis, convidados e cônjuges.',
        icon: 'layout-list', cor: 'amber'
    },
    {
        fase: 'planejamento', id: 'T04', ordem: 4,
        nome: 'Apoio de Som e Púlpito',
        descricao: 'Garantir que o púlpito do Vogal esteja posicionado para facilitar a visualização pelas autoridades (pela "bochecha" de quem preside). Priorizar microfone com fio. Ter sistema de som reserva testado.',
        icon: 'volume-2', cor: 'teal'
    },
    {
        fase: 'planejamento', id: 'T05', ordem: 5,
        nome: 'Aviso de Pauta (Imprensa)',
        descricao: 'Se o evento for aberto, elaborar e enviar o "Aviso de Pauta" (Press Release pré-evento) para a mídia regional e local, a fim de atrair cobertura jornalística.',
        icon: 'newspaper', cor: 'rose',
        acao: { label: 'Criar Aviso de Pauta', fn: 'openReleaseModal', param: 'aviso_pauta' }
    },
    {
        fase: 'planejamento', id: 'T06', ordem: 6,
        nome: 'Briefing da Equipe de Imagem',
        descricao: 'Definir o número estritamente necessário de fotógrafos/cinegrafistas. Orientar para máxima discrição, divisão de tarefas sem fotos redundantes, e não se interpor entre autoridades ou obstruir a visão do público.',
        icon: 'camera', cor: 'indigo'
    },
    // FASE 2: EXECUÇÃO
    {
        fase: 'execucao', id: 'T07', ordem: 1,
        nome: 'Estrutura para Imprensa',
        descricao: 'Recepcionar jornalistas. Providenciar local bem ventilado, iluminação adequada, água/café e, se necessário, uma caixa de som próxima para melhor captação de áudio por emissoras de TV e Rádio (evitando acúmulo de gravadores no púlpito).',
        icon: 'tv', cor: 'sky'
    },
    {
        fase: 'execucao', id: 'T08', ordem: 2,
        nome: 'Mediação de Entrevistas',
        descricao: 'O Oficial/Assessor de ComSoc deve atuar como ligação, acompanhando a autoridade concedente da entrevista e providenciando a gravação da mesma, para análise posterior e segurança da informação.',
        icon: 'mic-2', cor: 'orange'
    },
    {
        fase: 'execucao', id: 'T09', ordem: 3,
        nome: 'Cobertura Fotográfica / Audiovisual Estratégica',
        descricao: 'Checklist de imagens fundamentais: fachadas, autoridades, momentos-chave (hasteamento, troféus), visão geral do público e humanização da tropa (militares exercendo suas funções).',
        icon: 'aperture', cor: 'emerald'
    },
    // FASE 3: PÓS-EVENTO
    {
        fase: 'pos_evento', id: 'T10', ordem: 1,
        nome: 'Produção de Matéria Institucional (Release)',
        descricao: 'Redigir texto com informações básicas (o quê, quando, onde e como), enquadrando a ação nos campos de atuação do Poder Naval e valorizando a imagem da Força.',
        icon: 'file-text', cor: 'blue',
        acao: { label: 'Criar Release', fn: 'openReleaseModal', param: 'release_pos' }
    },
    {
        fase: 'pos_evento', id: 'T11', ordem: 2,
        nome: 'Aprovação e Envio (Público Externo)',
        descricao: 'Submeter a matéria e fotos à aprovação do Comando e enviar à cadeia de comando (Com9ºDN/CCSM) para publicação oficial no site e redes sociais. Se aplicável, distribuir ao mailing da imprensa local.',
        icon: 'send', cor: 'green'
    },
    {
        fase: 'pos_evento', id: 'T12', ordem: 3,
        nome: 'Endomarketing (Público Interno)',
        descricao: 'Publicar notas padronizadas no Plano do Dia e na Intranet local para manter a tripulação informada e reconhecer os militares envolvidos.',
        icon: 'users-2', cor: 'violet'
    },
    {
        fase: 'pos_evento', id: 'T13', ordem: 4,
        nome: 'Clipping (Relatório Estatístico de Mídia)',
        descricao: 'Monitorar jornais, sites, rádios e redes sociais para verificar quem publicou sobre o evento. Salvar links e arquivos em banco de dados para formar o Clipping/Sinopse mensal da OM.',
        icon: 'bar-chart-2', cor: 'amber',
        acao: { label: 'Abrir Clipping', fn: 'openClippingModal' }
    },
    {
        fase: 'pos_evento', id: 'T14', ordem: 5,
        nome: 'Registro Histórico',
        descricao: 'Certificar-se de que a cerimônia, especialmente se for de maior notoriedade (aniversários, passagens de comando), seja registrada no Livro do Navio ou Livro do Estabelecimento.',
        icon: 'book-open', cor: 'rose',
        acao: { label: 'Abrir Registro', fn: 'openHistoricoModal' }
    },
    {
        fase: 'pos_evento', id: 'T15', ordem: 6,
        nome: 'Avaliação de Resultados',
        descricao: 'Realizar avaliação interna dos aspectos positivos e negativos das ações de ComSoc do evento, para aprimorar os processos futuros.',
        icon: 'star', cor: 'gold',
        acao: { label: 'Avaliar Evento', fn: 'openAvaliacaoModal' }
    },

    // ───────────────────────────────────────────────────────────────
    // FASE 4: GESTÃO INSTITUCIONAL E BUROCRÁTICA
    // ───────────────────────────────────────────────────────────────
    {
        fase: 'gestao_institucional', id: 'T16', ordem: 1,
        nome: 'Controle e Prestação de Contas de Acervo (IAM/DPHDM)',
        descricao: 'Atualizar e remeter anualmente: Ficha de Acervo em Comodato (Anexo L da SGM-501) até 31 de março • Ficha de Inventário de Acervo da OM (Anexo E) até 30 de junho • Ficha de Registro de Patrimônio Imóvel (Anexo I) até 30 de setembro.',
        icon: 'archive', cor: 'cyan',
    },
    {
        fase: 'gestao_institucional', id: 'T17', ordem: 2,
        nome: 'Execução do Plano de Capacitação (PLACAPE)',
        descricao: 'Verificar as metas anuais de qualificação da equipe de ComSoc (ex: ECSO-OPE e Cursos Especiais para Praças) e enviar as propostas ao CCSM dentro dos prazos estabelecidos no calendário de capacitação da MB.',
        icon: 'graduation-cap', cor: 'indigo',
    },
    {
        fase: 'gestao_institucional', id: 'T18', ordem: 3,
        nome: 'Manuênção do Armorial e Tradições Navais',
        descricao: 'Assegurar que os símbolos, escudos e o Livro do Navio/Estabelecimento estejam atualizados. Orientar a tripulação sobre o uso correto das insínias e da Identidade Visual da MB/Governo Federal (conforme o MIV).',
        icon: 'shield', cor: 'slate2',
    },
    {
        fase: 'gestao_institucional', id: 'T19', ordem: 4,
        nome: 'Alinhamento Institucional com a SOAMAR-TBT',
        descricao: 'Realizar despachos periódicos com o Presidente da SOAMAR-TBT para coordenar ações conjuntas (ex: Dia do Marítimo, Dia da Marinha) e manter o cadastro atualizado dos Soamarinos da Tríplice Fronteira.',
        icon: 'handshake', cor: 'teal',
    },
    {
        fase: 'gestao_institucional', id: 'T20', ordem: 5,
        nome: 'Monitoramento do SISGD (Fluxo Documental ComSoc)',
        descricao: 'Acompanhar semanalmente o fluxo de Documentos Protocolados x Documentos Prontificados pertinentes à ComSoc para evitar atrasos nas respostas à cadeia de comando (Com9°DN/CCSM).',
        icon: 'file-clock', cor: 'amber',
    },

    // ───────────────────────────────────────────────────────────────
    // FASE 5: APOIO OPERACIONAL E LOGÍSTICO
    // ───────────────────────────────────────────────────────────────
    {
        fase: 'apoio_operacional', id: 'T21', ordem: 1,
        nome: 'Operação Cisne Branco (OCB) — Concurso de Redação',
        descricao: 'Distribuir o edital e organizar a logística de palestras e recolhimento das redações nas escolas das redes pública e privada da jurisdição, em contato direto com as diretorias escolares.',
        icon: 'pen-line', cor: 'lime',
    },
    {
        fase: 'apoio_operacional', id: 'T22', ordem: 2,
        nome: 'Cobertura de Ações Táticas e Humanitárias',
        descricao: 'Em operações (ex: "Navegue Seguro", Operação Estiagem, apoio a indígenas ou resgates SAR), assegurar a captação de imagens que comprovem a Ação do Estado. Evitar exposição de civis vulneráveis.',
        icon: 'life-buoy', cor: 'sky',
    },
    {
        fase: 'apoio_operacional', id: 'T23', ordem: 3,
        nome: 'Gestão de Endomarketing — Bússola Amazônica',
        descricao: 'Fornecer conteúdo local para o boletim “Bússola Amazônica” (Informativo do Com9°DN) ou para o informativo próprio da Capitania. Manter a tripulação informada sobre as ações da OM.',
        icon: 'newspaper', cor: 'violet',
    },
    {
        fase: 'apoio_operacional', id: 'T24', ordem: 4,
        nome: 'Infraestrutura Transfronteiriça e Controle de Acesso',
        descricao: 'Em eventos conjuntos (BraColPer ou Dia do Marítimo em Letícia), escalar militar para check-in e identificação de convidados. Garantir controle de lotação (limite por delegação) e cumprir trâmites aduaneiros (Termos de Aquiescência).',
        icon: 'shield-check', cor: 'emerald',
    },

    // ───────────────────────────────────────────────────────────────
    // FASE 6: GESTÃO DE CRISE E RELACIONAMENTO PÚBLICO
    // ───────────────────────────────────────────────────────────────
    {
        fase: 'gestao_crise', id: 'T25', ordem: 1,
        nome: 'Nota de Esclarecimento (SAR / Acidentes Navais)',
        descricao: 'Em caso de naufrágios ou Incidentes de Busca e Salvamento (IAFN), compilar dados primários com o Setor Operativo e submeter a "Nota à Imprensa" ao Com9°DN com extrema agilidade para conter a desinformação local.',
        icon: 'alert-triangle', cor: 'rose',
    },
    {
        fase: 'gestao_crise', id: 'T26', ordem: 2,
        nome: 'Demandas de Ouvidoria e SIC (e-SIC)',
        descricao: 'Acompanhar as solicitações do Sistema de Informação ao Cidadão e da Ouvidoria repassadas à ComSoc, prestando as informações (Transparência Passiva) dentro dos prazos legais estabelecidos pela LAI.',
        icon: 'message-square-text', cor: 'blue',
    },
    {
        fase: 'gestao_crise', id: 'T27', ordem: 3,
        nome: 'Apoio a Visitas VIP e Parlamentares (Relações Governamentais)',
        descricao: 'Organizar o receptivo (honras de portaló, sala com TI e material de apresentação) e produzir relatórios fotográficos para evidenciar demandas logísticas da Capitania (ex: necessidade de Trator, Caminhão-tanque via Emenda Parlamentar).',
        icon: 'building-2', cor: 'indigo',
    },
    {
        fase: 'gestao_crise', id: 'T28', ordem: 4,
        nome: 'Ações Cívico-Sociais e Ambientais',
        descricao: 'Articular com Prefeituras, IFAM e ONGs locais para execução de palestras em Jornadas Pedagógicas, ordenamento de orlas ou campanhas de limpeza dos rios, reforçando a imagem da Marinha como vetor de desenvolvimento socioeconômico.',
        icon: 'tree-pine', cor: 'green',
    },
];

const FASES_CONFIG = {
    planejamento:          { label: 'Planejamento e Pré-Evento',          icon: 'clipboard-list',   cor: 'blue' },
    execucao:              { label: 'Execução (Dia do Evento)',            icon: 'zap',              cor: 'amber' },
    pos_evento:            { label: 'Pós-Evento e Divulgação',            icon: 'send-horizontal',  cor: 'emerald' },
    gestao_institucional:  { label: 'Gestão Institucional e Burocrática',  icon: 'landmark',         cor: 'cyan' },
    apoio_operacional:     { label: 'Apoio Operacional e Logístico',        icon: 'ship',             cor: 'lime' },
    gestao_crise:          { label: 'Crise, SAR e Relacionamento Público',  icon: 'siren',            cor: 'rose' },
};

const STATUS_CONFIG = {
    pendente:       { label: 'Pendente',       cls: 'bg-slate-100 text-slate-600 border-slate-200',   dot: 'bg-slate-400'   },
    em_andamento:   { label: 'Em Andamento',   cls: 'bg-amber-50  text-amber-700 border-amber-200',   dot: 'bg-amber-400'   },
    concluido:      { label: 'Concluído',      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    nao_aplicavel:  { label: 'N/A',            cls: 'bg-slate-50  text-slate-400 border-slate-100',   dot: 'bg-slate-300'   },
};

const COR_MAP = {
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   icon: 'text-blue-600'   },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: 'text-purple-600' },
    amber:  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  icon: 'text-amber-600'  },
    teal:   { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200',   icon: 'text-teal-600'   },
    rose:   { bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-200',   icon: 'text-rose-600'   },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: 'text-indigo-600' },
    sky:    { bg: 'bg-sky-50',    text: 'text-sky-700',    border: 'border-sky-200',    icon: 'text-sky-600'    },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: 'text-orange-600' },
    emerald:{ bg: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-200',icon: 'text-emerald-600'},
    green:  { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  icon: 'text-green-600'  },
    violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', icon: 'text-violet-600' },
    gold:   { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: 'text-yellow-600' },
    cyan:   { bg: 'bg-cyan-50',   text: 'text-cyan-700',   border: 'border-cyan-200',   icon: 'text-cyan-600'   },
    lime:   { bg: 'bg-lime-50',   text: 'text-lime-700',   border: 'border-lime-200',   icon: 'text-lime-600'   },
    slate2: { bg: 'bg-slate-100', text: 'text-slate-700',  border: 'border-slate-300',  icon: 'text-slate-600'  },
};

// ─────────────────────────────────────────────────────────────────────────────
// INICIALIZAÇÃO DA ABA COMSOC
// ─────────────────────────────────────────────────────────────────────────────
async function initComSocTab() {
    // Só renderiza o painel uma vez; nas próximas visitas apenas re-popula o dropdown
    if (comsocPanelLoaded) {
        populateEventSelectComsoc();
        return;
    }
    comsocPanelLoaded = true;
    renderComSocDashboard();
}

function renderComSocDashboard() {
    const container = document.getElementById('comsoc-main-panel');
    if (!container) return;

    // Usar o evento ativo global do sistema (variável eventsData)
    const evAtivo = (typeof eventsData !== 'undefined' && eventsData.length > 0)
        ? eventsData.find(e => e.id === (typeof activeEventId !== 'undefined' ? activeEventId : null)) || eventsData[0]
        : null;

    if (evAtivo) {
        comsocActiveEventId = evAtivo.id;
        comsocActiveEventName = evAtivo.name;
    }

    const tarefasEvento = COMSOC_TAREFAS.filter(t => ['planejamento', 'execucao', 'pos_evento'].includes(t.fase));

    container.innerHTML = `
    <!-- Header da aba -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h2 class="text-3xl font-outfit font-bold text-naval-blue mb-1 tracking-tight">
                Gerenciamento de Comunicação Social
            </h2>
            <p class="text-slate-500 text-sm max-w-2xl">
                Ciclo completo de planejamento, execução e pós-evento baseado nos manuais EMA-136, EMA-860 e Plano de Comunicação Social da Marinha.
            </p>
        </div>
        <div class="flex gap-2 flex-wrap">
            <button onclick="switchTab('processos')" class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm">
                <i data-lucide="workflow" class="w-4 h-4"></i> Gestão de Processos & 15 Dias
            </button>
            <button onclick="openClippingModal()" class="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                <i data-lucide="bar-chart-2" class="w-4 h-4"></i> Clipping de Mídia
            </button>
            <button onclick="openAvaliacaoModal()" class="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                <i data-lucide="star" class="w-4 h-4"></i> Avaliações
            </button>
        </div>
    </div>

    <!-- Seletor de evento -->
    <div id="comsoc-event-selector" class="bg-gradient-to-r from-naval-blue to-naval-light text-white p-5 rounded-xl shadow-premium mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
            <div class="bg-naval-accent/20 p-3 rounded-lg border border-naval-accent/30">
                <i data-lucide="calendar-check" class="w-6 h-6 text-naval-accent"></i>
            </div>
            <div>
                <p class="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Evento Selecionado para o Checklist</p>
                <h3 class="text-lg font-outfit font-extrabold" id="comsoc-event-display-name">${comsocActiveEventName || 'Nenhum evento ativo'}</h3>
                <p class="text-xs text-slate-300 mt-0.5" id="comsoc-event-display-date">
                    ${evAtivo ? (evAtivo.date ? new Date(evAtivo.date + 'T12:00:00').toLocaleDateString('pt-BR') : 'Data não definida') : '--/--/----'}
                </p>
            </div>
        </div>
        <div class="flex gap-2 items-center flex-wrap">
            <select id="comsoc-event-select" onchange="comsocSelecionarEvento(this.value)"
                class="px-3 py-2 bg-white/10 border border-white/20 text-white text-xs font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 min-w-[220px]">
                <option value="">— Selecionar Evento —</option>
            </select>
            <button onclick="comsocCarregarChecklist()" id="btn-comsoc-load"
                class="flex items-center gap-1.5 px-4 py-2 bg-naval-accent hover:bg-yellow-400 text-naval-blue text-xs font-bold rounded-lg transition-colors shadow-sm">
                <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Carregar
            </button>
        </div>
    </div>

    <!-- Cards de métricas -->
    <div id="comsoc-metrics-row" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        ${renderMetricCard('comsoc-metric-total', 'Tarefas Totais', tarefasEvento.length, 'list-checks', 'slate')}
        ${renderMetricCard('comsoc-metric-concluidas', 'Concluídas', '0', 'check-circle-2', 'emerald')}
        ${renderMetricCard('comsoc-metric-andamento', 'Em Andamento', '0', 'loader-2', 'amber')}
        ${renderMetricCard('comsoc-metric-pendentes', 'Pendentes', tarefasEvento.length, 'clock', 'rose')}
    </div>

    <!-- Barra de progresso geral -->
    <div id="comsoc-progress-bar-wrapper" class="bg-white p-4 rounded-xl border border-slate-200 shadow-premium mb-6">
        <div class="flex justify-between items-center text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
            <span>Progresso Geral do Checklist ComSoc</span>
            <span id="comsoc-pct-geral">0% Concluído</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex border border-slate-200/50">
            <div id="comsoc-progress-concluido" class="bg-emerald-500 h-full transition-all duration-700 rounded-full" style="width:0%"></div>
            <div id="comsoc-progress-andamento" class="bg-amber-400 h-full transition-all duration-700" style="width:0%"></div>
        </div>
        <div class="flex flex-wrap gap-4 mt-2.5 text-[10px] font-semibold text-slate-500">
            <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Concluídas (<span id="p-cnt-c">0</span>)</div>
            <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Em Andamento (<span id="p-cnt-a">0</span>)</div>
            <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Pendentes (<span id="p-cnt-p">0</span>)</div>
            <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-300"></span> N/A (<span id="p-cnt-n">0</span>)</div>
        </div>
    </div>

    <!-- Checklist por fases -->
    <div id="comsoc-checklist-container" class="space-y-6">
        ${['planejamento', 'execucao', 'pos_evento'].map(faseKey => renderFaseSection(faseKey, FASES_CONFIG[faseKey])).join('')}
    </div>
    `;

    populateEventSelectComsoc();
    if (evAtivo) comsocCarregarChecklist();
    lucide.createIcons();
}

function renderMetricCard(id, label, valor, icon, cor) {
    const corMap = {
        slate:   'bg-slate-50 text-slate-600',
        emerald: 'bg-emerald-50 text-emerald-700',
        amber:   'bg-amber-50 text-amber-700',
        rose:    'bg-rose-50 text-rose-700',
    };
    return `
    <div class="bg-white p-4 rounded-xl shadow-premium border border-slate-200/60 flex items-center gap-3">
        <div class="${corMap[cor]} p-3 rounded-lg flex-shrink-0">
            <i data-lucide="${icon}" class="w-5 h-5"></i>
        </div>
        <div>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">${label}</p>
            <p class="text-2xl font-extrabold text-naval-blue font-outfit" id="${id}">${valor}</p>
        </div>
    </div>`;
}

function renderFaseSection(faseKey, faseCfg) {
    const corCls = { blue: 'border-blue-400 bg-blue-600', amber: 'border-amber-400 bg-amber-500', emerald: 'border-emerald-400 bg-emerald-600' };
    const tarefas = COMSOC_TAREFAS.filter(t => t.fase === faseKey);
    return `
    <div class="bg-white rounded-xl shadow-premium border border-slate-200/60 overflow-hidden">
        <!-- Cabeçalho da fase -->
        <div class="bg-gradient-to-r from-naval-blue to-naval-light px-5 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="bg-white/15 p-2 rounded-lg border border-white/20">
                    <i data-lucide="${faseCfg.icon}" class="w-5 h-5 text-naval-accent"></i>
                </div>
                <div>
                    <h3 class="text-base font-outfit font-extrabold text-white">${faseCfg.label}</h3>
                    <p class="text-xs text-slate-300">${tarefas.length} tarefas nesta fase</p>
                </div>
            </div>
            <div class="text-right">
                <p class="text-[10px] text-slate-300 uppercase tracking-wider font-bold">Progresso</p>
                <p class="text-xl font-extrabold text-naval-accent font-outfit" id="comsoc-fase-pct-${faseKey}">0%</p>
            </div>
        </div>
        <!-- Barra de progresso da fase -->
        <div class="h-1.5 bg-slate-200">
            <div id="comsoc-fase-bar-${faseKey}" class="h-full bg-emerald-500 transition-all duration-700" style="width:0%"></div>
        </div>
        <!-- Lista de tarefas -->
        <div class="divide-y divide-slate-100">
            ${tarefas.map(t => renderTarefaItem(t)).join('')}
        </div>
    </div>`;
}

function renderTarefaItem(tarefa) {
    const cor = COR_MAP[tarefa.cor] || COR_MAP.blue;
    const acaoBtn = tarefa.acao
        ? `<button onclick="${tarefa.acao.fn}(${tarefa.acao.param ? `'${tarefa.acao.param}'` : ''})"
               class="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 bg-naval-blue/10 hover:bg-naval-blue/20 text-naval-blue text-[10px] font-bold rounded-md transition-colors border border-naval-blue/20">
               <i data-lucide="external-link" class="w-3 h-3"></i> ${tarefa.acao.label}
           </button>`
        : '';
    return `
    <div class="p-4 hover:bg-slate-50/60 transition-colors group" id="comsoc-row-${tarefa.id}">
        <div class="flex items-start gap-4">
            <!-- Ícone da tarefa -->
            <div class="${cor.bg} p-2.5 rounded-lg border ${cor.border} flex-shrink-0 mt-0.5">
                <i data-lucide="${tarefa.icon}" class="w-4 h-4 ${cor.icon}"></i>
            </div>
            <!-- Conteúdo principal -->
            <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-1">
                    <span class="text-[10px] font-bold text-slate-400 font-mono">${tarefa.id}</span>
                    <h4 class="text-sm font-bold text-slate-800">${tarefa.nome}</h4>
                    <!-- Badge de status -->
                    <span id="badge-${tarefa.id}" class="text-[9px] font-bold px-2 py-0.5 rounded-full border ${STATUS_CONFIG.pendente.cls}">
                        ${STATUS_CONFIG.pendente.label}
                    </span>
                </div>
                <p class="text-xs text-slate-500 leading-relaxed mb-3">${tarefa.descricao}</p>
                <!-- Controles -->
                <div class="flex flex-wrap items-center gap-2">
                    <!-- Selector de status -->
                    <select id="status-${tarefa.id}" onchange="comsocAlterarStatus('${tarefa.id}', this.value)"
                        class="px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-naval-accent/50 focus:border-naval-blue transition-all cursor-pointer min-h-[36px]">
                        <option value="pendente">⚪ Pendente</option>
                        <option value="em_andamento">🟡 Em Andamento</option>
                        <option value="concluido">🟢 Concluído</option>
                        <option value="nao_aplicavel">⛔ N/A</option>
                    </select>
                    <!-- Campo de anotação (toggle) -->
                    <button onclick="comsocToggleAnotacao('${tarefa.id}')"
                        class="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors min-h-[36px]">
                        <i data-lucide="pencil" class="w-3 h-3"></i> Anotação
                    </button>
                    ${acaoBtn}
                    <!-- Responsável / timestamp -->
                    <span id="resp-${tarefa.id}" class="text-[9px] text-slate-400 italic hidden ml-auto"></span>
                </div>
                <!-- Campo de anotação colapsável -->
                <div id="anotacao-box-${tarefa.id}" class="hidden mt-3">
                    <textarea id="anotacao-${tarefa.id}" rows="2" placeholder="Digite observações, links, nomes de responsáveis..."
                        class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-naval-accent/50 focus:border-naval-blue transition-all resize-none custom-scrollbar"
                        onblur="comsocSalvarAnotacao('${tarefa.id}')"></textarea>
                </div>
            </div>
        </div>
    </div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// LÓGICA DO CHECKLIST
// ─────────────────────────────────────────────────────────────────────────────

function populateEventSelectComsoc() {
    const sel = document.getElementById('comsoc-event-select');
    if (!sel || typeof eventsData === 'undefined') return;
    sel.innerHTML = '<option value="">— Selecionar Evento —</option>';
    [...eventsData].sort((a,b) => new Date(b.date) - new Date(a.date)).forEach(ev => {
        const opt = document.createElement('option');
        opt.value = ev.id;
        opt.textContent = `${ev.name} (${ev.date ? new Date(ev.date + 'T12:00:00').toLocaleDateString('pt-BR') : 'Sem data'})`;
        if (ev.id === comsocActiveEventId) opt.selected = true;
        sel.appendChild(opt);
    });
}

function comsocSelecionarEvento(eventId) {
    if (!eventId) return;
    const ev = (typeof eventsData !== 'undefined') ? eventsData.find(e => e.id === eventId) : null;
    comsocActiveEventId = eventId;
    comsocActiveEventName = ev ? ev.name : 'Evento';
    document.getElementById('comsoc-event-display-name').textContent = comsocActiveEventName;
    if (ev && ev.date) {
        document.getElementById('comsoc-event-display-date').textContent =
            new Date(ev.date + 'T12:00:00').toLocaleDateString('pt-BR');
    }
}

async function comsocCarregarChecklist() {
    if (!comsocActiveEventId) {
        showToast('Selecione um evento antes de carregar o checklist.', 'warning');
        return;
    }
    const btn = document.getElementById('btn-comsoc-load');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i data-lucide="loader-2" class="w-3.5 h-3.5 animate-spin"></i> Carregando...'; lucide.createIcons(); }

    comsocChecklistState = await carregarChecklistEvento(comsocActiveEventId);
    comsocAplicarEstadoChecklist();
    comsocAtualizarProgresso();

    if (btn) { btn.disabled = false; btn.innerHTML = '<i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Carregar'; lucide.createIcons(); }
}

function comsocAplicarEstadoChecklist() {
    const tarefasEvento = COMSOC_TAREFAS.filter(t => ['planejamento', 'execucao', 'pos_evento'].includes(t.fase));
    tarefasEvento.forEach(tarefa => {
        const item = comsocChecklistState[tarefa.id];
        const status = item ? item.status : 'pendente';
        const anotacao = item ? (item.anotacoes || '') : '';
        const sel = document.getElementById(`status-${tarefa.id}`);
        if (sel) sel.value = status;
        atualizarBadgeStatus(tarefa.id, status);
        const anotEl = document.getElementById(`anotacao-${tarefa.id}`);
        if (anotEl) anotEl.value = anotacao;
        // Mostrar anotação se houver conteúdo
        if (anotacao) {
            const box = document.getElementById(`anotacao-box-${tarefa.id}`);
            if (box) box.classList.remove('hidden');
        }
        // Responsável
        if (item && item.responsavel_nome && item.status === 'concluido') {
            const respEl = document.getElementById(`resp-${tarefa.id}`);
            if (respEl) {
                respEl.textContent = `✓ ${item.responsavel_nome}${item.concluido_em ? ' · ' + new Date(item.concluido_em).toLocaleDateString('pt-BR') : ''}`;
                respEl.classList.remove('hidden');
            }
        }
        // Estilo de linha concluída
        const row = document.getElementById(`comsoc-row-${tarefa.id}`);
        if (row) {
            row.classList.toggle('opacity-60', status === 'nao_aplicavel');
        }
    });
}

function atualizarBadgeStatus(tarefaId, status) {
    const badge = document.getElementById(`badge-${tarefaId}`);
    if (!badge) return;
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pendente;
    badge.className = `text-[9px] font-bold px-2 py-0.5 rounded-full border ${cfg.cls}`;
    badge.textContent = cfg.label;
}

async function comsocAlterarStatus(tarefaId, novoStatus) {
    const isControle = ['T16','T17','T18','T19','T20','T21','T22','T23','T24','T25','T26','T27','T28'].includes(tarefaId);
    const targetEventId = isControle ? COMSOC_GLOBAL_EVENT_ID : comsocActiveEventId;
    const targetEventName = isControle ? COMSOC_GLOBAL_EVENT_NAME : comsocActiveEventName;

    if (!targetEventId) {
        showToast('Nenhum evento selecionado. Carregue um evento primeiro.', 'warning');
        return;
    }
    atualizarBadgeStatus(tarefaId, novoStatus);
    // Responsável
    const respEl = document.getElementById(`resp-${tarefaId}`);
    if (respEl) {
        if (novoStatus === 'concluido' && currentProfile) {
            respEl.textContent = `✓ ${currentProfile.nome || 'Usuário'} · ${new Date().toLocaleDateString('pt-BR')}`;
            respEl.classList.remove('hidden');
        } else { respEl.classList.add('hidden'); }
    }
    const tarefa = COMSOC_TAREFAS.find(t => t.id === tarefaId);
    const anotacao = document.getElementById(`anotacao-${tarefaId}`)?.value || '';
    try {
        await salvarItemChecklist(targetEventId, targetEventName, tarefaId, tarefa?.nome || tarefaId, tarefa?.fase || '', novoStatus, anotacao);
        if (isControle) {
            comsocControlesChecklistState[tarefaId] = { ...comsocControlesChecklistState[tarefaId], tarefa_id: tarefaId, status: novoStatus, anotacoes: anotacao };
            comsocAtualizarProgressoControles();
        } else {
            comsocChecklistState[tarefaId] = { ...comsocChecklistState[tarefaId], tarefa_id: tarefaId, status: novoStatus, anotacoes: anotacao };
            comsocAtualizarProgresso();
        }
        // Linha N/A fica com opacidade reduzida
        const row = document.getElementById(`comsoc-row-${tarefaId}`);
        if (row) row.classList.toggle('opacity-60', novoStatus === 'nao_aplicavel');
    } catch(e) {
        showToast('Erro ao salvar status da tarefa.', 'error');
    }
}

async function comsocSalvarAnotacao(tarefaId) {
    const isControle = ['T16','T17','T18','T19','T20','T21','T22','T23','T24','T25','T26','T27','T28'].includes(tarefaId);
    const targetEventId = isControle ? COMSOC_GLOBAL_EVENT_ID : comsocActiveEventId;
    const targetEventName = isControle ? COMSOC_GLOBAL_EVENT_NAME : comsocActiveEventName;

    if (!targetEventId) return;
    const tarefa = COMSOC_TAREFAS.find(t => t.id === tarefaId);
    const anotacao = document.getElementById(`anotacao-${tarefaId}`)?.value || '';
    const statusEl = document.getElementById(`status-${tarefaId}`);
    const status = statusEl ? statusEl.value : 'pendente';
    try {
        await salvarItemChecklist(targetEventId, targetEventName, tarefaId, tarefa?.nome || tarefaId, tarefa?.fase || '', status, anotacao);
        if (isControle) {
            comsocControlesChecklistState[tarefaId] = { ...comsocControlesChecklistState[tarefaId], anotacoes: anotacao };
        } else {
            comsocChecklistState[tarefaId] = { ...comsocChecklistState[tarefaId], anotacoes: anotacao };
        }
    } catch(e) { /* silencioso */ }
}

function comsocToggleAnotacao(tarefaId) {
    const box = document.getElementById(`anotacao-box-${tarefaId}`);
    if (!box) return;
    box.classList.toggle('hidden');
    if (!box.classList.contains('hidden')) {
        document.getElementById(`anotacao-${tarefaId}`)?.focus();
    }
}

function comsocAtualizarProgresso() {
    let concluidas = 0, emAndamento = 0, pendentes = 0, na = 0;
    const tarefasEvento = COMSOC_TAREFAS.filter(t => ['planejamento', 'execucao', 'pos_evento'].includes(t.fase));
    const total = tarefasEvento.length;

    tarefasEvento.forEach(t => {
        const s = comsocChecklistState[t.id]?.status || 'pendente';
        if (s === 'concluido')     concluidas++;
        else if (s === 'em_andamento') emAndamento++;
        else if (s === 'nao_aplicavel') na++;
        else pendentes++;
    });

    // Métricas globais
    const pct = total > 0 ? Math.round((concluidas / total) * 100) : 0;
    setTextSafe('comsoc-metric-concluidas', concluidas);
    setTextSafe('comsoc-metric-andamento', emAndamento);
    setTextSafe('comsoc-metric-pendentes', pendentes);
    setTextSafe('comsoc-pct-geral', `${pct}% Concluído`);
    setStyleWidth('comsoc-progress-concluido', `${(concluidas/total)*100}%`);
    setStyleWidth('comsoc-progress-andamento', `${(emAndamento/total)*100}%`);
    setTextSafe('p-cnt-c', concluidas);
    setTextSafe('p-cnt-a', emAndamento);
    setTextSafe('p-cnt-p', pendentes);
    setTextSafe('p-cnt-n', na);

    // Progresso por fase (fases de evento)
    ['planejamento', 'execucao', 'pos_evento'].forEach(faseKey => {
        const tarefasFase = tarefasEvento.filter(t => t.fase === faseKey);
        const concl = tarefasFase.filter(t => (comsocChecklistState[t.id]?.status || 'pendente') === 'concluido').length;
        const pctFase = tarefasFase.length > 0 ? Math.round((concl / tarefasFase.length) * 100) : 0;
        setTextSafe(`comsoc-fase-pct-${faseKey}`, `${pctFase}%`);
        setStyleWidth(`comsoc-fase-bar-${faseKey}`, `${pctFase}%`);
    });
}

function setTextSafe(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
function setStyleWidth(id, w) { const el = document.getElementById(id); if (el) el.style.width = w; }

// ─────────────────────────────────────────────────────────────────────────────
// ABA DE GESTÃO E CONTROLES COMSOC (ROTINAS INDEPENDENTES)
// ─────────────────────────────────────────────────────────────────────────────
async function initComSocControlesTab() {
    if (comsocControlesPanelLoaded) {
        return;
    }
    comsocControlesPanelLoaded = true;
    renderComSocControles();
}

let comsocActiveSubtab = 'rotinas';
let comsocGanttPrazos = [];

const PRAZOS_PADRAO_GANTT = [
    { titulo: 'Ficha de Acervo em Comodato (Anexo L)', descricao: 'Atualizar e remeter anualmente (T16) - Limite: 31 de Março.', data_inicio: '2026-01-01', data_fim: '2026-03-31', categoria: 'administrativo', responsavel: 'Oficial de ComSoc' },
    { titulo: 'Ficha de Inventário de Acervo da OM (Anexo E)', descricao: 'Atualizar e remeter anualmente (T16) - Limite: 30 de Junho.', data_inicio: '2026-04-01', data_fim: '2026-06-30', categoria: 'administrativo', responsavel: 'Oficial de ComSoc' },
    { titulo: 'Ficha de Registro de Patrimônio Imóvel (Anexo I)', descricao: 'Atualizar e remeter anualmente (T16) - Limite: 30 de Setembro.', data_inicio: '2026-07-01', data_fim: '2026-09-30', categoria: 'administrativo', responsavel: 'Oficial de ComSoc' },
    { titulo: 'Batalha Naval do Riachuelo (Data Magna)', descricao: 'Cerimônia militar e eventos comemorativos à Data Magna da Marinha (T19).', data_inicio: '2026-06-01', data_fim: '2026-06-11', categoria: 'evento', responsavel: 'Gabinete / ComSoc' },
    { titulo: 'Alinhamento SOAMAR (Dia do Marítimo)', descricao: 'Coordenação conjunta e cadastramento de Soamarinos (T19).', data_inicio: '2026-12-01', data_fim: '2026-12-10', categoria: 'evento', responsavel: 'SOAMAR / ComSoc' },
    { titulo: 'Operação Cisne Branco (OCB)', descricao: 'Logística de palestras, distribuição de editais e recolhimento de redações (T21).', data_inicio: '2026-08-01', data_fim: '2026-10-31', categoria: 'campanha', responsavel: 'Equipe OCB' },
    { titulo: 'Operação BraColPer', descricao: 'Eventos cívicos e desfiles conjuntos na Tríplice Fronteira em Letícia/Tabatinga (T24).', data_inicio: '2026-07-10', data_fim: '2026-09-07', categoria: 'campanha', responsavel: 'ComSoc / Operações' },
    { titulo: 'Cerimônia do Dia do Marinheiro', descricao: 'Aniversário do Patrono Tamandaré, imposição de medalhas e Livro do Navio (T18).', data_inicio: '2026-12-01', data_fim: '2026-12-13', categoria: 'evento', responsavel: 'Ajudância / ComSoc' }
];

function renderComSocControles() {
    const container = document.getElementById('comsoc-controles-panel');
    if (!container) return;

    const tarefasControles = COMSOC_TAREFAS.filter(t => ['gestao_institucional', 'apoio_operacional', 'gestao_crise'].includes(t.fase));

    container.innerHTML = `
    <!-- Header da aba -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h2 class="text-3xl font-outfit font-bold text-naval-blue mb-1 tracking-tight">
                Gestão e Controles ComSoc
            </h2>
            <p class="text-slate-500 text-sm max-w-2xl">
                Controles permanentes e rotinas institucionais de Comunicação Social da Capitania Fluvial de Tabatinga.
            </p>
        </div>
        <div>
            <button onclick="switchTab('processos')" class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm">
                <i data-lucide="workflow" class="w-4 h-4"></i> Gestão de Processos & Delegação
            </button>
        </div>
    </div>

    <!-- Cards de métricas -->
    <div id="comsoc-controles-metrics-row" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        ${renderMetricCard('comsoc-controles-metric-total', 'Tarefas Totais', tarefasControles.length, 'list-checks', 'slate')}
        ${renderMetricCard('comsoc-controles-metric-concluidas', 'Concluídas', '0', 'check-circle-2', 'emerald')}
        ${renderMetricCard('comsoc-controles-metric-andamento', 'Em Andamento', '0', 'loader-2', 'amber')}
        ${renderMetricCard('comsoc-controles-metric-pendentes', 'Pendentes', tarefasControles.length, 'clock', 'rose')}
    </div>

    <!-- Navegação de Sub-abas -->
    <div class="border-b border-slate-200 mb-6 flex gap-4 sm:gap-6 overflow-x-auto custom-scrollbar">
        <button id="subtab-btn-rotinas" onclick="comsocSwitchSubtab('rotinas')" 
            class="border-b-2 border-naval-blue text-naval-blue py-3 px-1 font-outfit font-bold text-sm tracking-wide transition-all whitespace-nowrap min-h-[44px]">
            Tarefas de Rotina
        </button>
        <button id="subtab-btn-gantt" onclick="comsocSwitchSubtab('gantt')" 
            class="border-b-2 border-transparent text-slate-500 hover:text-slate-700 py-3 px-1 font-outfit font-bold text-sm tracking-wide transition-all whitespace-nowrap min-h-[44px]">
            Cronograma Sazonal (Gantt)
        </button>
    </div>

    <!-- Contêiner de Tarefas de Rotina -->
    <div id="subtab-content-rotinas" class="space-y-6">
        <!-- Barra de progresso geral -->
        <div id="comsoc-controles-progress-bar-wrapper" class="bg-white p-4 rounded-xl border border-slate-200 shadow-premium">
            <div class="flex justify-between items-center text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                <span>Progresso Geral dos Controles</span>
                <span id="comsoc-controles-pct-geral">0% Concluído</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex border border-slate-200/50">
                <div id="comsoc-controles-progress-concluido" class="bg-emerald-500 h-full transition-all duration-700 rounded-full" style="width:0%"></div>
                <div id="comsoc-controles-progress-andamento" class="bg-amber-400 h-full transition-all duration-700" style="width:0%"></div>
            </div>
            <div class="flex flex-wrap gap-4 mt-2.5 text-[10px] font-semibold text-slate-500">
                <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Concluídas (<span id="pc-cnt-c">0</span>)</div>
                <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Em Andamento (<span id="pc-cnt-a">0</span>)</div>
                <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Pendentes (<span id="pc-cnt-p">0</span>)</div>
                <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-300"></span> N/A (<span id="pc-cnt-n">0</span>)</div>
            </div>
        </div>

        <!-- Checklist por fases -->
        <div id="comsoc-controles-checklist-container" class="space-y-6">
            ${['gestao_institucional', 'apoio_operacional', 'gestao_crise'].map(faseKey => renderControleFaseSection(faseKey)).join('')}
        </div>
    </div>

    <!-- Contêiner do Gantt (inicia oculto) -->
    <div id="subtab-content-gantt" class="hidden space-y-6">
        <!-- Renderizado dinamicamente por renderGanttView() -->
    </div>
    `;

    comsocActiveSubtab = 'rotinas';
    comsocCarregarControlesChecklist();
}

function comsocSwitchSubtab(subtabName) {
    comsocActiveSubtab = subtabName;
    const btnRotinas = document.getElementById('subtab-btn-rotinas');
    const btnGantt = document.getElementById('subtab-btn-gantt');
    const contentRotinas = document.getElementById('subtab-content-rotinas');
    const contentGantt = document.getElementById('subtab-content-gantt');
    
    if (!btnRotinas || !btnGantt || !contentRotinas || !contentGantt) return;
    
    const activeCls = "border-b-2 border-naval-blue text-naval-blue py-3 px-1 font-outfit font-bold text-sm tracking-wide transition-all whitespace-nowrap min-h-[44px]";
    const inactiveCls = "border-b-2 border-transparent text-slate-500 hover:text-slate-700 py-3 px-1 font-outfit font-bold text-sm tracking-wide transition-all whitespace-nowrap min-h-[44px]";
    
    if (subtabName === 'rotinas') {
        btnRotinas.className = activeCls;
        btnGantt.className = inactiveCls;
        contentRotinas.classList.remove('hidden');
        contentGantt.classList.add('hidden');
    } else {
        btnRotinas.className = inactiveCls;
        btnGantt.className = activeCls;
        contentRotinas.classList.add('hidden');
        contentGantt.classList.remove('hidden');
        renderGanttView();
    }
}

function renderGanttView() {
    const container = document.getElementById('subtab-content-gantt');
    if (!container) return;

    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const prazosOrdenados = [...comsocGanttPrazos].sort((a,b) => new Date(a.data_inicio) - new Date(b.data_inicio));
    
    const catLabels = {
        administrativo: { text: '⚙ Administrativo', cls: 'bg-cyan-500 text-white' },
        evento: { text: '⭐ Evento / Cerimônia', cls: 'bg-amber-500 text-white' },
        campanha: { text: '⚓ Operação / Campanha', cls: 'bg-emerald-500 text-white' }
    };

    let rowsHTML = prazosOrdenados.map(p => {
        const { pctInicio, pctLargura } = obterPorcentagensAno(p.data_inicio, p.data_fim);
        const catCfg = catLabels[p.categoria] || catLabels.administrativo;
        
        const dtIni = new Date(p.data_inicio + 'T12:00:00').toLocaleDateString('pt-BR');
        const dtFim = new Date(p.data_fim + 'T12:00:00').toLocaleDateString('pt-BR');
        
        return `
        <div class="hover:bg-slate-50 transition-colors py-3.5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center gap-4">
            <!-- Lado Esquerdo: Info -->
            <div class="w-full lg:w-80 flex-shrink-0 flex items-start justify-between gap-2">
                <div class="min-w-0">
                    <h5 class="text-xs font-bold text-slate-800 flex items-center gap-1.5 truncate">
                        <span class="w-2 h-2 rounded-full ${p.categoria === 'evento' ? 'bg-amber-400' : p.categoria === 'campanha' ? 'bg-emerald-500' : 'bg-cyan-500'}"></span>
                        ${p.titulo}
                    </h5>
                    <p class="text-[10px] text-slate-400 font-semibold truncate mt-0.5">${p.responsavel || 'Sem responsável'} · <span class="italic text-slate-500">${dtIni} a ${dtFim}</span></p>
                    ${p.descricao ? `<p class="text-[10px] text-slate-500 italic mt-0.5 line-clamp-1" title="${p.descricao}">${p.descricao}</p>` : ''}
                </div>
                <button onclick="openGanttModal('${p.id}')" class="p-1 text-slate-300 hover:text-naval-blue hover:bg-slate-100 rounded transition-all">
                    <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                </button>
            </div>
            
            <!-- Lado Direito: Linha do Tempo -->
            <div class="flex-1 relative bg-slate-50/50 rounded h-8 border border-slate-100 overflow-hidden flex items-center">
                <!-- Grade de meses em background -->
                <div class="absolute inset-0 grid grid-cols-12 pointer-events-none divide-x divide-slate-100">
                    ${Array(12).fill(0).map(() => `<div></div>`).join('')}
                </div>
                
                <!-- Barra de Gantt -->
                <div class="absolute h-5 rounded shadow-sm text-[9px] font-bold flex items-center px-2 cursor-pointer transition-transform hover:scale-[1.01] overflow-hidden ${catCfg.cls}" 
                     style="left: ${pctInicio}%; width: ${pctLargura}%;"
                     onclick="openGanttModal('${p.id}')"
                     title="${p.titulo} (${dtIni} a ${dtFim})">
                    <span class="truncate">${p.titulo}</span>
                </div>
            </div>
        </div>`;
    }).join('');

    if (prazosOrdenados.length === 0) {
        rowsHTML = '<p class="text-xs text-slate-400 italic py-6 text-center">Nenhum prazo cadastrado.</p>';
    }

    container.innerHTML = `
    <div class="bg-white rounded-xl shadow-premium border border-slate-200/60 p-5 space-y-6">
        <!-- Topo da aba Gantt -->
        <div class="flex justify-between items-center flex-wrap gap-4 border-b border-slate-100 pb-4">
            <div>
                <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wider">Diagrama de Gantt Anual</h4>
                <p class="text-xs text-slate-400 mt-0.5">Calendário recorrente de rotinas sazonais e datas comemorativas da Marinha e CFT.</p>
            </div>
            <button onclick="openGanttModal()" class="flex items-center gap-1.5 px-4 py-2 bg-naval-blue hover:bg-naval-light text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                <i data-lucide="calendar-plus" class="w-4 h-4 text-naval-accent"></i> Adicionar Prazo Sazonal
            </button>
        </div>

        <!-- Grade de Legendas e Meses -->
        <div class="space-y-4">
            <!-- Legenda -->
            <div class="flex flex-wrap gap-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-cyan-500"></span> Administrativo</div>
                <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-amber-500"></span> Evento / Cerimônia</div>
                <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-emerald-500"></span> Operação / Campanha</div>
            </div>

            <!-- Cabeçalho de meses (alinhado com as barras) -->
            <div class="hidden lg:flex items-center gap-4 pt-2 border-b-2 border-slate-200 pb-1">
                <div class="w-80 flex-shrink-0">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Atividade / Prazo</span>
                </div>
                <div class="flex-1 grid grid-cols-12 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    ${meses.map(m => `<div>${m}</div>`).join('')}
                </div>
            </div>

            <!-- Linhas de Gantt -->
            <div class="divide-y divide-slate-150">
                ${rowsHTML}
            </div>
        </div>
    </div>`;
    
    lucide.createIcons();
}

function obterPorcentagensAno(dataInicioStr, dataFimStr) {
    const partsIni = dataInicioStr.split('-');
    const partsFim = dataFimStr.split('-');
    
    const mesIni = parseInt(partsIni[1], 10) - 1;
    const diaIni = parseInt(partsIni[2], 10);
    
    const mesFim = parseInt(partsFim[1], 10) - 1;
    const diaFim = parseInt(partsFim[2], 10);
    
    const anoRef = 2026;
    const ini = new Date(anoRef, mesIni, diaIni);
    let fim = new Date(anoRef, mesFim, diaFim);
    
    if (fim < ini) {
        fim = new Date(anoRef + 1, mesFim, diaFim);
    }
    
    const inicioAno = new Date(anoRef, 0, 1);
    const msTotalAno = 365 * 24 * 60 * 60 * 1000;
    
    const msInicio = ini.getTime() - inicioAno.getTime();
    const msDuracao = fim.getTime() - ini.getTime();
    
    let pctInicio = (msInicio / msTotalAno) * 100;
    let pctLargura = (msDuracao / msTotalAno) * 100;
    
    if (pctInicio < 0) pctInicio = 0;
    if (pctInicio > 100) pctInicio = 100;
    if (pctLargura < 0.8) pctLargura = 0.8;
    if (pctInicio + pctLargura > 100) {
        pctLargura = 100 - pctInicio;
    }
    
    return { pctInicio, pctLargura };
}

function renderControleFaseSection(faseKey) {
    const faseCfg = FASES_CONFIG[faseKey];
    if (!faseCfg) return '';
    const tarefas = COMSOC_TAREFAS.filter(t => t.fase === faseKey);
    return `
    <div class="bg-white rounded-xl shadow-premium border border-slate-200/60 overflow-hidden">
        <!-- Cabeçalho da fase -->
        <div class="bg-gradient-to-r from-naval-blue to-naval-light px-5 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="bg-white/15 p-2 rounded-lg border border-white/20">
                    <i data-lucide="${faseCfg.icon}" class="w-5 h-5 text-naval-accent"></i>
                </div>
                <div>
                    <h3 class="text-base font-outfit font-extrabold text-white">${faseCfg.label}</h3>
                    <p class="text-xs text-slate-300">${tarefas.length} tarefas nesta fase</p>
                </div>
            </div>
            <div class="text-right">
                <p class="text-[10px] text-slate-300 uppercase tracking-wider font-bold">Progresso</p>
                <p class="text-xl font-extrabold text-naval-accent font-outfit" id="comsoc-fase-pct-${faseKey}">0%</p>
            </div>
        </div>
        <!-- Barra de progresso da fase -->
        <div class="h-1.5 bg-slate-200">
            <div id="comsoc-fase-bar-${faseKey}" class="h-full bg-emerald-500 transition-all duration-700" style="width:0%"></div>
        </div>
        <!-- Lista de tarefas -->
        <div class="divide-y divide-slate-100">
            ${tarefas.map(t => renderTarefaItem(t)).join('')}
        </div>
    </div>`;
}

async function comsocCarregarControlesChecklist() {
    comsocControlesChecklistState = await carregarChecklistEvento(COMSOC_GLOBAL_EVENT_ID);
    comsocAplicarEstadoControlesChecklist();
    comsocAtualizarProgressoControles();
    
    try {
        let prazos = await carregarPrazosGantt();
        if (prazos.length === 0) {
            // Inicializar com prazos padrão
            for (const p of PRAZOS_PADRAO_GANTT) {
                const salvo = await salvarPrazoGantt(p);
                if (salvo) prazos.push(salvo);
            }
        }
        comsocGanttPrazos = prazos;
    } catch (e) {
        console.error('Erro ao carregar prazos do Gantt:', e);
    }
}

function comsocAplicarEstadoControlesChecklist() {
    const tarefasControles = COMSOC_TAREFAS.filter(t => ['gestao_institucional', 'apoio_operacional', 'gestao_crise'].includes(t.fase));
    tarefasControles.forEach(tarefa => {
        const item = comsocControlesChecklistState[tarefa.id];
        const status = item ? item.status : 'pendente';
        const anotacao = item ? (item.anotacoes || '') : '';
        const sel = document.getElementById(`status-${tarefa.id}`);
        if (sel) sel.value = status;
        atualizarBadgeStatus(tarefa.id, status);
        const anotEl = document.getElementById(`anotacao-${tarefa.id}`);
        if (anotEl) anotEl.value = anotacao;
        if (anotacao) {
            const box = document.getElementById(`anotacao-box-${tarefa.id}`);
            if (box) box.classList.remove('hidden');
        }
        if (item && item.responsavel_nome && item.status === 'concluido') {
            const respEl = document.getElementById(`resp-${tarefa.id}`);
            if (respEl) {
                respEl.textContent = `✓ ${item.responsavel_nome}${item.concluido_em ? ' · ' + new Date(item.concluido_em).toLocaleDateString('pt-BR') : ''}`;
                respEl.classList.remove('hidden');
            }
        }
        const row = document.getElementById(`comsoc-row-${tarefa.id}`);
        if (row) {
            row.classList.toggle('opacity-60', status === 'nao_aplicavel');
        }
    });
}

function comsocAtualizarProgressoControles() {
    let concluidas = 0, emAndamento = 0, pendentes = 0, na = 0;
    const tarefasControles = COMSOC_TAREFAS.filter(t => ['gestao_institucional', 'apoio_operacional', 'gestao_crise'].includes(t.fase));
    const total = tarefasControles.length;

    tarefasControles.forEach(t => {
        const s = comsocControlesChecklistState[t.id]?.status || 'pendente';
        if (s === 'concluido')     concluidas++;
        else if (s === 'em_andamento') emAndamento++;
        else if (s === 'nao_aplicavel') na++;
        else pendentes++;
    });

    const pct = total > 0 ? Math.round((concluidas / total) * 100) : 0;
    setTextSafe('comsoc-controles-metric-concluidas', concluidas);
    setTextSafe('comsoc-controles-metric-andamento', emAndamento);
    setTextSafe('comsoc-controles-metric-pendentes', pendentes);
    setTextSafe('comsoc-controles-pct-geral', `${pct}% Concluído`);
    setStyleWidth('comsoc-controles-progress-concluido', `${(concluidas/total)*100}%`);
    setStyleWidth('comsoc-controles-progress-andamento', `${(emAndamento/total)*100}%`);
    setTextSafe('pc-cnt-c', concluidas);
    setTextSafe('pc-cnt-a', emAndamento);
    setTextSafe('pc-cnt-p', pendentes);
    setTextSafe('pc-cnt-n', na);

    ['gestao_institucional', 'apoio_operacional', 'gestao_crise'].forEach(faseKey => {
        const tarefasFase = tarefasControles.filter(t => t.fase === faseKey);
        const concl = tarefasFase.filter(t => (comsocControlesChecklistState[t.id]?.status || 'pendente') === 'concluido').length;
        const pctFase = tarefasFase.length > 0 ? Math.round((concl / tarefasFase.length) * 100) : 0;
        setTextSafe(`comsoc-fase-pct-${faseKey}`, `${pctFase}%`);
        setStyleWidth(`comsoc-fase-bar-${faseKey}`, `${pctFase}%`);
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL & AÇÕES DO DIAGRAMA DE GANTT
// ─────────────────────────────────────────────────────────────────────────────
let comsocEditingGanttId = null;

function openGanttModal(prazoId = null) {
    comsocEditingGanttId = prazoId;
    const modal = document.getElementById('ganttPrazoModal');
    const btnExcluir = document.getElementById('btn-excluir-gantt');
    const title = document.getElementById('gantt-modal-title');
    
    if (!modal) return;
    
    document.getElementById('gantt-id').value = '';
    document.getElementById('gantt-titulo').value = '';
    document.getElementById('gantt-inicio').value = '';
    document.getElementById('gantt-fim').value = '';
    document.getElementById('gantt-categoria').value = 'administrativo';
    document.getElementById('gantt-responsavel').value = '';
    document.getElementById('gantt-descricao').value = '';
    
    if (prazoId) {
        title.textContent = 'Editar Prazo Sazonal';
        if (btnExcluir) btnExcluir.classList.remove('hidden');
        
        const p = comsocGanttPrazos.find(x => x.id === prazoId);
        if (p) {
            document.getElementById('gantt-id').value = p.id;
            document.getElementById('gantt-titulo').value = p.titulo || '';
            document.getElementById('gantt-inicio').value = p.data_inicio || '';
            document.getElementById('gantt-fim').value = p.data_fim || '';
            document.getElementById('gantt-categoria').value = p.categoria || 'administrativo';
            document.getElementById('gantt-responsavel').value = p.responsavel || '';
            document.getElementById('gantt-descricao').value = p.descricao || '';
        }
    } else {
        title.textContent = 'Adicionar Prazo Sazonal';
        if (btnExcluir) btnExcluir.classList.add('hidden');
    }
    
    openModal('ganttPrazoModal', 'ganttPrazoModalContent');
}

function closeGanttModal() {
    closeModal('ganttPrazoModal', 'ganttPrazoModalContent');
}

async function salvarPrazoGanttForm() {
    const id = document.getElementById('gantt-id').value;
    const titulo = document.getElementById('gantt-titulo').value.trim();
    const data_inicio = document.getElementById('gantt-inicio').value;
    const data_fim = document.getElementById('gantt-fim').value;
    const categoria = document.getElementById('gantt-categoria').value;
    const responsavel = document.getElementById('gantt-responsavel').value.trim();
    const descricao = document.getElementById('gantt-descricao').value.trim();
    
    if (!titulo || !data_inicio || !data_fim) {
        showToast('Preencha os campos obrigatórios (*).', 'warning');
        return;
    }
    
    if (new Date(data_fim) < new Date(data_inicio)) {
        showToast('A data de fim não pode ser anterior à data de início.', 'warning');
        return;
    }
    
    const obj = {
        titulo, data_inicio, data_fim, categoria, responsavel, descricao
    };
    if (id) obj.id = id;
    
    try {
        const salvo = await salvarPrazoGantt(obj);
        if (id) {
            comsocGanttPrazos = comsocGanttPrazos.map(x => x.id === salvo.id ? salvo : x);
            showToast('Prazo atualizado com sucesso!', 'success');
        } else {
            comsocGanttPrazos.push(salvo);
            showToast('Prazo cadastrado com sucesso!', 'success');
        }
        closeGanttModal();
        if (comsocActiveSubtab === 'gantt') {
            renderGanttView();
        }
    } catch (e) {
        showToast('Erro ao salvar prazo.', 'error');
    }
}

async function excluirPrazoGanttAction() {
    const id = document.getElementById('gantt-id').value;
    if (!id) return;
    
    if (!confirm('Tem certeza de que deseja excluir este prazo sazonal?')) return;
    
    try {
        await excluirPrazoGantt(id);
        comsocGanttPrazos = comsocGanttPrazos.filter(x => x.id !== id);
        showToast('Prazo excluído com sucesso!', 'success');
        closeGanttModal();
        if (comsocActiveSubtab === 'gantt') {
            renderGanttView();
        }
    } catch (e) {
        showToast('Erro ao excluir prazo.', 'error');
    }
}


function comsocAbrirDiretorio() {
    if (typeof switchTab === 'function') switchTab('directory');
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: ROTEIRO DO VOGAL
// ─────────────────────────────────────────────────────────────────────────────
const MOMENTOS_PADRAO = [
    { id: 'm1', texto: 'Senhor [CARGO/POSTO], [NOME COMPLETO], [FUNÇÃO NO ATO]. Senhoras e Senhores. Às [HORA], declaro aberta a cerimônia de [NOME DO EVENTO].', tipo: 'abertura' },
    { id: 'm2', texto: 'Solicito que todos permaneçam em posição respeitosa para a execução do Hino Nacional Brasileiro.', tipo: 'hino', alerta: true },
    { id: 'm3', texto: 'Solicito que todos permaneçam em posição respeitosa para a execução do Hino da Marinha do Brasil.', tipo: 'hino', alerta: true },
    { id: 'm4', texto: 'Para fazer uso da palavra, convido o [CARGO/POSTO] [NOME], [FUNÇÃO].', tipo: 'discurso' },
    { id: 'm5', texto: 'Solicito que todos permaneçam em posição respeitosa para o hasteamento da Bandeira Nacional.', tipo: 'tropa', alerta: true },
    { id: 'm6', texto: 'Nada mais havendo a tratar, declaramos encerrada a cerimônia de [NOME DO EVENTO]. Muito obrigado a todos.', tipo: 'encerramento' },
];

let roteiroMomentos = [];

function openRoteirVogalModal() {
    roteiroMomentos = MOMENTOS_PADRAO.map(m => ({ ...m }));
    const modal = document.getElementById('roteiroVogalModal');
    if (!modal) return;
    document.getElementById('roteiro-evento-nome').value = comsocActiveEventName || '';
    document.getElementById('roteiro-evento-data').value = '';
    document.getElementById('roteiro-evento-local').value = '';
    renderRoteiroMomentos();
    openModal('roteiroVogalModal', 'roteiroVogalModalContent');
}

function closeRoteiroVogalModal() { closeModal('roteiroVogalModal', 'roteiroVogalModalContent'); }

function renderRoteiroMomentos() {
    const container = document.getElementById('roteiro-momentos-list');
    if (!container) return;
    container.innerHTML = roteiroMomentos.map((m, idx) => {
        const tipoConfig = {
            abertura:    { label: 'Abertura',   cls: 'bg-blue-50 border-blue-200 text-blue-700' },
            hino:        { label: 'Hino',       cls: 'bg-purple-50 border-purple-200 text-purple-700' },
            discurso:    { label: 'Discurso',   cls: 'bg-amber-50 border-amber-200 text-amber-700' },
            tropa:       { label: 'Tropa',      cls: 'bg-rose-50 border-rose-200 text-rose-700' },
            encerramento:{ label: 'Encerramento', cls: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
            livre:       { label: 'Livre',      cls: 'bg-slate-50 border-slate-200 text-slate-600' },
        };
        const cfg = tipoConfig[m.tipo] || tipoConfig.livre;
        return `
        <div class="border border-slate-200 rounded-lg p-3 bg-white group" id="momento-${m.id}">
            <div class="flex items-center gap-2 mb-2">
                <div class="flex items-center gap-1.5 cursor-move text-slate-300 hover:text-slate-500">
                    <i data-lucide="grip-vertical" class="w-4 h-4"></i>
                </div>
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-full border ${cfg.cls}">${cfg.label}</span>
                ${m.alerta ? `<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-yellow-50 border border-yellow-300 text-yellow-700 flex items-center gap-1"><i data-lucide="alert-circle" class="w-2.5 h-2.5"></i> Posição Respeitosa</span>` : ''}
                <select onchange="roteiroAlterarTipo('${m.id}', this.value)"
                    class="ml-auto text-[10px] px-2 py-1 border border-slate-200 rounded bg-slate-50 font-bold text-slate-600 focus:outline-none cursor-pointer">
                    ${['abertura','hino','discurso','tropa','encerramento','livre'].map(t =>
                        `<option value="${t}" ${m.tipo===t?'selected':''}>${tipoConfig[t]?.label||t}</option>`
                    ).join('')}
                </select>
                <button onclick="roteiroRemoverMomento('${m.id}')" class="p-1 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
            </div>
            <textarea id="texto-${m.id}" rows="2" class="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-naval-blue resize-none custom-scrollbar"
                onchange="roteiroAlterarTexto('${m.id}', this.value)">${m.texto}</textarea>
        </div>`;
    }).join('');
    lucide.createIcons();
}

function roteiroAlterarTipo(id, tipo) {
    const m = roteiroMomentos.find(x => x.id === id);
    if (m) { m.tipo = tipo; m.alerta = (tipo === 'hino' || tipo === 'tropa'); }
    renderRoteiroMomentos();
}
function roteiroAlterarTexto(id, texto) {
    const m = roteiroMomentos.find(x => x.id === id);
    if (m) m.texto = texto;
}
function roteiroRemoverMomento(id) {
    roteiroMomentos = roteiroMomentos.filter(m => m.id !== id);
    renderRoteiroMomentos();
}
function roteiroAdicionarMomento() {
    roteiroMomentos.push({ id: 'mn_' + Date.now(), texto: 'Para fazer uso da palavra, convido o [CARGO/POSTO] [NOME], [FUNÇÃO].', tipo: 'discurso' });
    renderRoteiroMomentos();
    const container = document.getElementById('roteiro-momentos-list');
    if (container) container.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
}

function roteiroGerarPDF() {
    const nomeEvento = document.getElementById('roteiro-evento-nome')?.value || 'Evento';
    const dataEvento = document.getElementById('roteiro-evento-data')?.value || '';
    const localEvento = document.getElementById('roteiro-evento-local')?.value || '';
    const dataFormatada = dataEvento ? new Date(dataEvento + 'T12:00:00').toLocaleDateString('pt-BR', { weekday:'long', year:'numeric', month:'long', day:'numeric'}) : '';

    const htmlContent = `
    <div style="font-family: 'Times New Roman', serif; max-width: 720px; margin: 0 auto; padding: 20px; color: #1a1a1a;">
        <div style="text-align:center; border-bottom: 3px double #002B5B; padding-bottom:16px; margin-bottom:20px;">
            <p style="font-size:11px; color:#555; text-transform:uppercase; letter-spacing:2px; margin:0;">MARINHA DO BRASIL</p>
            <h1 style="font-size:20px; font-weight:bold; color:#002B5B; margin:8px 0 4px;">ROTEIRO DO MESTRE DE CERIMÔNIAS</h1>
            <h2 style="font-size:15px; font-weight:normal; color:#1A4D80; margin:0;">${nomeEvento}</h2>
            ${dataFormatada ? `<p style="font-size:12px; color:#666; margin:6px 0 0;">${dataFormatada}${localEvento ? ' — ' + localEvento : ''}</p>` : ''}
        </div>
        <div style="background:#fffde7; border-left:4px solid #FFD700; padding:10px 14px; margin-bottom:20px; font-size:10px; color:#5a4a00;">
            <strong>REGRAS NODAM / EMA-136:</strong> Evitar "será feita" ou "será lida". Usar apenas cargo, posto e nome (não repetir "Excelentíssimo Senhor" exaustivamente). Convidar para "posição respeitosa" nos Hinos e movimentação de tropa.
        </div>
        ${roteiroMomentos.map((m, i) => `
        <div style="border:1px solid #e2e8f0; border-radius:8px; padding:12px 14px; margin-bottom:12px; background:${m.alerta ? '#fefce8' : '#f8fafc'}; border-left:3px solid ${m.alerta ? '#EAB308' : '#1A4D80'};">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                <span style="font-size:9px; font-weight:bold; text-transform:uppercase; letter-spacing:1px; background:#002B5B; color:white; padding:2px 8px; border-radius:20px;">${i+1}</span>
                <span style="font-size:9px; font-weight:bold; color:#64748b; text-transform:uppercase;">${m.tipo.replace('_',' ')}</span>
                ${m.alerta ? '<span style="font-size:9px; color:#92400e; font-weight:bold;">⚠ POSIÇÃO RESPEITOSA</span>' : ''}
            </div>
            <p style="font-size:13px; line-height:1.7; margin:0; color:#1e293b;">${m.texto}</p>
        </div>`).join('')}
        <div style="margin-top:32px; border-top:1px solid #e2e8f0; padding-top:16px; text-align:center; font-size:10px; color:#94a3b8;">
            Gerado pelo Sistema ComSoc • ${new Date().toLocaleString('pt-BR')}
        </div>
    </div>`;

    const el = document.createElement('div');
    el.innerHTML = htmlContent;
    document.body.appendChild(el);

    html2pdf().set({
        margin: [10, 10, 10, 10],
        filename: `Roteiro_Vogal_${nomeEvento.replace(/\s+/g,'_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(el).save().then(() => {
        document.body.removeChild(el);
        showToast('Roteiro do Vogal exportado em PDF!', 'success');
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: PRESS RELEASE / AVISO DE PAUTA
// ─────────────────────────────────────────────────────────────────────────────
async function openReleaseModal(tipo = 'release_pos') {
    comsocEditingReleaseId = null;
    comsocReleaseData = comsocActiveEventId ? await carregarReleasesEvento(comsocActiveEventId) : [];
    const modal = document.getElementById('releaseModal');
    if (!modal) return;
    document.getElementById('release-modal-tipo').value = tipo;
    const isAviso = tipo === 'aviso_pauta';
    document.getElementById('release-modal-title-header').textContent = isAviso ? 'Aviso de Pauta (Pré-Evento)' : 'Matéria Institucional (Release Pós-Evento)';
    document.getElementById('release-titulo').value = '';
    document.getElementById('release-lead').value = '';
    document.getElementById('release-corpo').value = '';
    document.getElementById('release-enquadramento').value = '';
    renderReleasesList();
    openModal('releaseModal', 'releaseModalContent');
}
function closeReleaseModal() { closeModal('releaseModal', 'releaseModalContent'); }

function renderReleasesList() {
    const container = document.getElementById('releases-list');
    if (!container) return;
    if (comsocReleaseData.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-400 italic py-3 text-center">Nenhum release cadastrado para este evento.</p>';
        return;
    }
    container.innerHTML = comsocReleaseData.map(r => `
    <div class="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 hover:border-naval-blue/30 transition-colors">
        <div class="flex-1 min-w-0">
            <p class="text-xs font-bold text-slate-800 truncate">${r.titulo || '(Sem título)'}</p>
            <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded ${r.tipo === 'aviso_pauta' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}">
                    ${r.tipo === 'aviso_pauta' ? 'Aviso de Pauta' : 'Release Pós-Evento'}
                </span>
                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded ${r.status === 'aprovado' ? 'bg-emerald-100 text-emerald-700' : r.status === 'enviado' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}">
                    ${r.status === 'aprovado' ? '✓ Aprovado' : r.status === 'enviado' ? '✈ Enviado' : 'Rascunho'}
                </span>
            </div>
        </div>
        <div class="flex items-center gap-1 ml-2">
            <button onclick="releaseEditar('${r.id}')" class="p-1.5 text-slate-400 hover:text-naval-blue transition-colors" title="Editar">
                <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="releaseCopiar('${r.id}')" class="p-1.5 text-slate-400 hover:text-sky-600 transition-colors" title="Copiar texto">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="releaseExcluir('${r.id}', '${(r.titulo || '').replace(/'/g,"")}')" class="p-1.5 text-slate-400 hover:text-rose-600 transition-colors" title="Excluir">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
        </div>
    </div>`).join('');
    lucide.createIcons();
}

function releaseEditar(id) {
    const r = comsocReleaseData.find(x => x.id === id);
    if (!r) return;
    comsocEditingReleaseId = id;
    document.getElementById('release-titulo').value = r.titulo || '';
    document.getElementById('release-lead').value = r.lead || '';
    document.getElementById('release-corpo').value = r.corpo || '';
    document.getElementById('release-enquadramento').value = r.enquadramento || '';
    document.getElementById('release-modal-tipo').value = r.tipo;
    document.getElementById('release-modal-title-header').textContent = r.tipo === 'aviso_pauta' ? 'Aviso de Pauta (Pré-Evento)' : 'Matéria Institucional (Release Pós-Evento)';
    document.getElementById('release-titulo').scrollIntoView({ behavior: 'smooth' });
}

function releaseCopiar(id) {
    const r = comsocReleaseData.find(x => x.id === id);
    if (!r) return;
    const texto = `${r.titulo || ''}\n\n${r.lead || ''}\n\n${r.corpo || ''}\n\n${r.enquadramento ? 'Enquadramento: ' + r.enquadramento : ''}`;
    navigator.clipboard.writeText(texto.trim()).then(() => showToast('Texto do release copiado!', 'success'));
}

async function releaseExcluir(id, titulo) {
    if (!confirm(`Excluir o release "${titulo}"?`)) return;
    try {
        await excluirRelease(id, titulo);
        comsocReleaseData = comsocReleaseData.filter(r => r.id !== id);
        renderReleasesList();
        showToast('Release excluído.', 'success');
    } catch(e) { showToast('Erro ao excluir release.', 'error'); }
}

async function salvarReleaseForm() {
    const tipo = document.getElementById('release-modal-tipo').value;
    const titulo = document.getElementById('release-titulo').value.trim();
    const lead = document.getElementById('release-lead').value.trim();
    const corpo = document.getElementById('release-corpo').value.trim();
    const enquadramento = document.getElementById('release-enquadramento').value.trim();
    if (!titulo) { showToast('Informe o título do release.', 'warning'); return; }
    const obj = {
        id: comsocEditingReleaseId || undefined,
        evento_id: comsocActiveEventId,
        tipo, titulo, lead, corpo, enquadramento, status: 'rascunho',
    };
    try {
        const salvo = await salvarRelease(obj);
        if (comsocEditingReleaseId) {
            comsocReleaseData = comsocReleaseData.map(r => r.id === salvo.id ? salvo : r);
        } else {
            comsocReleaseData.unshift(salvo);
        }
        comsocEditingReleaseId = null;
        document.getElementById('release-titulo').value = '';
        document.getElementById('release-lead').value = '';
        document.getElementById('release-corpo').value = '';
        document.getElementById('release-enquadramento').value = '';
        renderReleasesList();
        showToast('Release salvo com sucesso!', 'success');
    } catch(e) { showToast('Erro ao salvar release.', 'error'); }
}

async function releaseAtualizarStatus(id, novoStatus) {
    const r = comsocReleaseData.find(x => x.id === id);
    if (!r) return;
    r.status = novoStatus;
    try {
        await salvarRelease(r);
        renderReleasesList();
        showToast(`Status atualizado para "${novoStatus}".`, 'success');
    } catch(e) { showToast('Erro ao atualizar status.', 'error'); }
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: CLIPPING DE MÍDIA
// ─────────────────────────────────────────────────────────────────────────────
async function openClippingModal() {
    comsocEditingClippingId = null;
    comsocClippingData = await carregarTodoClipping();
    const modal = document.getElementById('clippingModal');
    if (!modal) return;
    resetClippingForm();
    renderClippingList();
    renderClippingStats();
    openModal('clippingModal', 'clippingModalContent');
}
function closeClippingModal() { closeModal('clippingModal', 'clippingModalContent'); }

function resetClippingForm() {
    ['clip-veiculo','clip-titulo','clip-link','clip-data','clip-observacoes'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const tipoSel = document.getElementById('clip-tipo'); if (tipoSel) tipoSel.value = 'site';
    const sentSel = document.getElementById('clip-sentimento'); if (sentSel) sentSel.value = 'neutro';
    comsocEditingClippingId = null;
}

function renderClippingList() {
    const container = document.getElementById('clipping-list');
    if (!container) return;
    const filtroEvento = document.getElementById('clip-filtro-evento')?.value;
    let dados = comsocClippingData;
    if (filtroEvento) dados = dados.filter(c => c.evento_id === filtroEvento);
    if (dados.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-400 italic py-4 text-center">Nenhuma aparição na mídia registrada.</p>';
        return;
    }
    const tipoIcon = { tv: 'tv', radio: 'radio', site: 'globe', jornal: 'newspaper', rede_social: 'share-2' };
    const sentConfig = {
        positivo: 'bg-emerald-100 text-emerald-700',
        neutro:   'bg-slate-100 text-slate-600',
        negativo: 'bg-rose-100 text-rose-700',
    };
    container.innerHTML = dados.map(c => `
    <div class="flex items-start justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-naval-blue/30 transition-all gap-3">
        <div class="flex items-start gap-3 flex-1 min-w-0">
            <div class="bg-slate-100 p-2 rounded-lg text-slate-500 flex-shrink-0">
                <i data-lucide="${tipoIcon[c.tipo_veiculo] || 'globe'}" class="w-4 h-4"></i>
            </div>
            <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-1.5 mb-0.5">
                    <p class="text-xs font-bold text-slate-800 truncate">${c.titulo_materia || c.veiculo}</p>
                    <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full ${sentConfig[c.sentimento] || sentConfig.neutro}">
                        ${c.sentimento === 'positivo' ? '😊 Positivo' : c.sentimento === 'negativo' ? '😟 Negativo' : '😐 Neutro'}
                    </span>
                </div>
                <p class="text-[10px] text-slate-500">${c.veiculo}${c.data_publicacao ? ' · ' + new Date(c.data_publicacao + 'T12:00:00').toLocaleDateString('pt-BR') : ''}</p>
                ${c.link_url ? `<a href="${c.link_url}" target="_blank" class="text-[10px] text-sky-600 hover:underline flex items-center gap-0.5 mt-0.5 truncate"><i data-lucide="external-link" class="w-2.5 h-2.5 flex-shrink-0"></i> <span class="truncate">${c.link_url}</span></a>` : ''}
            </div>
        </div>
        <div class="flex gap-1 flex-shrink-0">
            <button onclick="clippingEditar('${c.id}')" class="p-1.5 text-slate-400 hover:text-naval-blue transition-colors"><i data-lucide="pencil" class="w-3.5 h-3.5"></i></button>
            <button onclick="clippingExcluir('${c.id}', '${(c.titulo_materia||c.veiculo||'').replace(/'/g,'')}')" class="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
        </div>
    </div>`).join('');
    lucide.createIcons();
}

function renderClippingStats() {
    const dados = comsocClippingData;
    const total = dados.length;
    setTextSafe('clip-stat-total', total);
    setTextSafe('clip-stat-pos', dados.filter(c => c.sentimento === 'positivo').length);
    setTextSafe('clip-stat-neutro', dados.filter(c => c.sentimento === 'neutro').length);
    setTextSafe('clip-stat-neg', dados.filter(c => c.sentimento === 'negativo').length);

    // Contagem por veículo
    const porTipo = {};
    dados.forEach(c => { porTipo[c.tipo_veiculo || 'site'] = (porTipo[c.tipo_veiculo || 'site'] || 0) + 1; });
    const maxVal = Math.max(...Object.values(porTipo), 1);
    const tipoLabel = { tv: 'TV', radio: 'Rádio', site: 'Site/Portal', jornal: 'Jornal/Impresso', rede_social: 'Redes Sociais' };
    const barContainer = document.getElementById('clip-bars');
    if (barContainer) {
        barContainer.innerHTML = Object.entries(porTipo).sort((a,b)=>b[1]-a[1]).map(([tipo, cnt]) => `
        <div class="flex items-center gap-2">
            <span class="text-[10px] font-bold text-slate-500 w-28 flex-shrink-0">${tipoLabel[tipo] || tipo}</span>
            <div class="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div class="h-full bg-naval-blue rounded-full transition-all duration-500" style="width:${Math.round((cnt/maxVal)*100)}%"></div>
            </div>
            <span class="text-[10px] font-bold text-slate-700 w-4 flex-shrink-0">${cnt}</span>
        </div>`).join('') || '<p class="text-xs text-slate-400 italic">Sem dados</p>';
    }
}

async function salvarClippingForm() {
    const veiculo = document.getElementById('clip-veiculo')?.value.trim();
    if (!veiculo) { showToast('Informe o veículo de comunicação.', 'warning'); return; }
    const obj = {
        id: comsocEditingClippingId || undefined,
        evento_id: comsocActiveEventId,
        veiculo,
        tipo_veiculo: document.getElementById('clip-tipo')?.value,
        titulo_materia: document.getElementById('clip-titulo')?.value.trim(),
        link_url: document.getElementById('clip-link')?.value.trim(),
        data_publicacao: document.getElementById('clip-data')?.value || null,
        sentimento: document.getElementById('clip-sentimento')?.value,
        observacoes: document.getElementById('clip-observacoes')?.value.trim(),
    };
    try {
        const salvo = await salvarClipping(obj);
        if (comsocEditingClippingId) {
            comsocClippingData = comsocClippingData.map(c => c.id === salvo.id ? salvo : c);
        } else {
            comsocClippingData.unshift(salvo);
        }
        resetClippingForm();
        renderClippingList();
        renderClippingStats();
        showToast('Clipping salvo com sucesso!', 'success');
    } catch(e) { showToast('Erro ao salvar clipping.', 'error'); }
}

function clippingEditar(id) {
    const c = comsocClippingData.find(x => x.id === id);
    if (!c) return;
    comsocEditingClippingId = id;
    ['clip-veiculo','clip-titulo','clip-link','clip-observacoes'].forEach(fid => {
        const map = { 'clip-veiculo': 'veiculo', 'clip-titulo': 'titulo_materia', 'clip-link': 'link_url', 'clip-observacoes': 'observacoes' };
        const el = document.getElementById(fid);
        if (el) el.value = c[map[fid]] || '';
    });
    const tipoEl = document.getElementById('clip-tipo'); if (tipoEl) tipoEl.value = c.tipo_veiculo || 'site';
    const sentEl = document.getElementById('clip-sentimento'); if (sentEl) sentEl.value = c.sentimento || 'neutro';
    const dataEl = document.getElementById('clip-data'); if (dataEl) dataEl.value = c.data_publicacao || '';
    document.getElementById('clip-veiculo')?.scrollIntoView({ behavior: 'smooth' });
}

async function clippingExcluir(id, titulo) {
    if (!confirm(`Excluir o registro de clipping "${titulo}"?`)) return;
    try {
        await excluirClipping(id, titulo);
        comsocClippingData = comsocClippingData.filter(c => c.id !== id);
        renderClippingList();
        renderClippingStats();
        showToast('Clipping excluído.', 'success');
    } catch(e) { showToast('Erro ao excluir clipping.', 'error'); }
}

function exportarClippingExcel() {
    if (typeof XLSX === 'undefined') { showToast('Biblioteca de exportação não carregada.', 'error'); return; }
    const rows = comsocClippingData.map(c => ({
        'Veículo': c.veiculo, 'Tipo': c.tipo_veiculo, 'Título': c.titulo_materia,
        'Link': c.link_url, 'Data': c.data_publicacao, 'Sentimento': c.sentimento, 'Observações': c.observacoes
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Clipping');
    XLSX.writeFile(wb, `Clipping_ComSoc_${new Date().toLocaleDateString('pt-BR').replace(/\//g,'-')}.xlsx`);
    showToast('Clipping exportado em Excel!', 'success');
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: REGISTRO HISTÓRICO
// ─────────────────────────────────────────────────────────────────────────────
async function openHistoricoModal() {
    if (!comsocActiveEventId) { showToast('Selecione um evento primeiro.', 'warning'); return; }
    const modal = document.getElementById('historicoModal');
    if (!modal) return;
    const hist = await carregarHistoricoEvento(comsocActiveEventId);
    document.getElementById('hist-narrativa').value = hist?.narrativa || '';
    document.getElementById('hist-autoridades').value = hist?.autoridades_presentes || '';
    document.getElementById('hist-destaques').value = hist?.destaques || '';
    document.getElementById('hist-evento-nome').textContent = comsocActiveEventName;
    openModal('historicoModal', 'historicoModalContent');
}
function closeHistoricoModal() { closeModal('historicoModal', 'historicoModalContent'); }

function historicoImportarConfirmados() {
    // Importar lista de confirmados do RSVP ativo
    if (typeof contacts === 'undefined') return;
    const confirmados = (typeof contactsData !== 'undefined' ? contactsData : []).filter(c => {
        const rsvpData = (typeof comsocActiveEventId !== 'undefined' && c.rsvpByEvent) ? c.rsvpByEvent[comsocActiveEventId] : c.rsvp;
        return rsvpData === 'confirmado';
    });
    const lista = confirmados.map(c => `${c.title ? c.title + ' ' : ''}${c.name} (${c.role})`).join('\n');
    const el = document.getElementById('hist-autoridades');
    if (el) { el.value = lista; showToast(`${confirmados.length} autoridades importadas da lista RSVP.`, 'success'); }
}

async function salvarHistoricoForm() {
    const obj = {
        evento_id: comsocActiveEventId,
        narrativa: document.getElementById('hist-narrativa')?.value.trim(),
        autoridades_presentes: document.getElementById('hist-autoridades')?.value.trim(),
        destaques: document.getElementById('hist-destaques')?.value.trim(),
    };
    try {
        await salvarHistorico(obj);
        showToast('Registro histórico salvo com sucesso!', 'success');
        closeHistoricoModal();
    } catch(e) { showToast('Erro ao salvar registro histórico.', 'error'); }
}

function historicoImprimirTermo() {
    const nomeEvento = comsocActiveEventName;
    const narrativa = document.getElementById('hist-narrativa')?.value || '';
    const autoridades = document.getElementById('hist-autoridades')?.value || '';
    const destaques = document.getElementById('hist-destaques')?.value || '';
    const el = document.createElement('div');
    el.innerHTML = `
    <div style="font-family:'Times New Roman',serif;max-width:720px;margin:0 auto;padding:24px;color:#1a1a1a;">
        <div style="text-align:center;border-bottom:3px double #002B5B;padding-bottom:16px;margin-bottom:24px;">
            <p style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:2px;margin:0;">MARINHA DO BRASIL</p>
            <h1 style="font-size:18px;font-weight:bold;color:#002B5B;margin:8px 0 4px;">REGISTRO HISTÓRICO</h1>
            <h2 style="font-size:14px;font-weight:normal;color:#1A4D80;margin:0;">${nomeEvento}</h2>
        </div>
        ${narrativa ? `<div style="margin-bottom:20px;"><h3 style="font-size:12px;text-transform:uppercase;color:#002B5B;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:10px;">Narrativa</h3><p style="font-size:13px;line-height:1.9;white-space:pre-wrap;">${narrativa}</p></div>` : ''}
        ${autoridades ? `<div style="margin-bottom:20px;"><h3 style="font-size:12px;text-transform:uppercase;color:#002B5B;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:10px;">Autoridades Presentes</h3><p style="font-size:12px;line-height:1.8;white-space:pre-wrap;">${autoridades}</p></div>` : ''}
        ${destaques ? `<div style="margin-bottom:20px;"><h3 style="font-size:12px;text-transform:uppercase;color:#002B5B;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:10px;">Destaques</h3><p style="font-size:13px;line-height:1.9;white-space:pre-wrap;">${destaques}</p></div>` : ''}
        <div style="margin-top:48px;display:flex;justify-content:space-between;">
            <div style="text-align:center;width:45%;border-top:1px solid #1a1a1a;padding-top:8px;font-size:11px;">Oficial de ComSoc / Redator</div>
            <div style="text-align:center;width:45%;border-top:1px solid #1a1a1a;padding-top:8px;font-size:11px;">Comandante / Autoridade Presidindo</div>
        </div>
        <p style="text-align:center;font-size:9px;color:#94a3b8;margin-top:24px;">Gerado pelo Sistema ComSoc em ${new Date().toLocaleString('pt-BR')}</p>
    </div>`;
    document.body.appendChild(el);
    html2pdf().set({
        margin:10, filename:`Registro_Historico_${nomeEvento.replace(/\s+/g,'_')}.pdf`,
        image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2}, jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}
    }).from(el).save().then(() => { document.body.removeChild(el); showToast('Termo de Registro exportado!', 'success'); });
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL: AVALIAÇÃO DE RESULTADOS
// ─────────────────────────────────────────────────────────────────────────────
async function openAvaliacaoModal() {
    const modal = document.getElementById('avaliacaoModal');
    if (!modal) return;
    comsocStarRatings = { planejamento: 0, execucao: 0, pos_evento: 0 };
    if (comsocActiveEventId) {
        const aval = await carregarAvaliacaoEvento(comsocActiveEventId);
        if (aval) {
            comsocStarRatings = {
                planejamento: aval.nota_planejamento || 0,
                execucao: aval.nota_execucao || 0,
                pos_evento: aval.nota_pos_evento || 0,
            };
            document.getElementById('aval-positivos').value = aval.pontos_positivos || '';
            document.getElementById('aval-negativos').value = aval.pontos_negativos || '';
            document.getElementById('aval-licoes').value = aval.licoes_aprendidas || '';
        } else {
            ['aval-positivos','aval-negativos','aval-licoes'].forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
        }
    }
    document.getElementById('aval-evento-nome').textContent = comsocActiveEventName || 'Nenhum evento selecionado';
    renderStarRatings();
    await renderAvaliacoesHistorico();
    openModal('avaliacaoModal', 'avaliacaoModalContent');
}
function closeAvaliacaoModal() { closeModal('avaliacaoModal', 'avaliacaoModalContent'); }

function renderStarRatings() {
    ['planejamento','execucao','pos_evento'].forEach(fase => {
        const container = document.getElementById(`stars-${fase}`);
        if (!container) return;
        container.innerHTML = [1,2,3,4,5].map(n => `
        <button type="button" onclick="comsocSetStar('${fase}', ${n})" 
            class="transition-transform hover:scale-110 ${n <= comsocStarRatings[fase] ? 'text-yellow-400' : 'text-slate-300'}">
            <i data-lucide="star" class="w-6 h-6 ${n <= comsocStarRatings[fase] ? 'fill-yellow-400' : ''}"></i>
        </button>`).join('');
        lucide.createIcons();
    });
}

function comsocSetStar(fase, nota) {
    comsocStarRatings[fase] = nota;
    renderStarRatings();
}

async function salvarAvaliacaoForm() {
    const obj = {
        evento_id: comsocActiveEventId,
        nota_planejamento: comsocStarRatings.planejamento,
        nota_execucao: comsocStarRatings.execucao,
        nota_pos_evento: comsocStarRatings.pos_evento,
        pontos_positivos: document.getElementById('aval-positivos')?.value.trim(),
        pontos_negativos: document.getElementById('aval-negativos')?.value.trim(),
        licoes_aprendidas: document.getElementById('aval-licoes')?.value.trim(),
    };
    try {
        await salvarAvaliacao(obj);
        showToast('Avaliação salva com sucesso!', 'success');
        await renderAvaliacoesHistorico();
    } catch(e) { showToast('Erro ao salvar avaliação.', 'error'); }
}

async function renderAvaliacoesHistorico() {
    const container = document.getElementById('aval-historico-list');
    if (!container) return;
    const avaliacoes = await carregarTodasAvaliacoes();
    if (avaliacoes.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-400 italic text-center py-2">Nenhuma avaliação registrada ainda.</p>';
        return;
    }
    const mediaGeral = (notas) => {
        const validas = notas.filter(n => n > 0);
        return validas.length ? (validas.reduce((a,b)=>a+b,0)/validas.length).toFixed(1) : '—';
    };
    const evList = (typeof eventsData !== 'undefined') ? eventsData : [];
    container.innerHTML = avaliacoes.slice(0,5).map(a => {
        const ev = evList.find(e => e.id === a.evento_id);
        const media = mediaGeral([a.nota_planejamento, a.nota_execucao, a.nota_pos_evento]);
        const stars = Math.round(parseFloat(media) || 0);
        return `
        <div class="p-3 bg-white rounded-lg border border-slate-200">
            <div class="flex items-center justify-between gap-2 mb-1.5">
                <p class="text-xs font-bold text-slate-800 truncate">${ev ? ev.name : (a.evento_id ? 'Evento' : 'Sem evento')}</p>
                <div class="flex items-center gap-0.5 flex-shrink-0">
                    ${[1,2,3,4,5].map(n=>`<i data-lucide="star" class="w-3 h-3 ${n<=stars?'text-yellow-400 fill-yellow-400':'text-slate-200'}"></i>`).join('')}
                    <span class="text-[10px] font-bold text-slate-600 ml-1">${media}</span>
                </div>
            </div>
            <div class="flex gap-3 text-[9px] font-bold text-slate-500">
                <span>Plan: ${'⭐'.repeat(a.nota_planejamento||0)||'—'}</span>
                <span>Exec: ${'⭐'.repeat(a.nota_execucao||0)||'—'}</span>
                <span>Pós: ${'⭐'.repeat(a.nota_pos_evento||0)||'—'}</span>
            </div>
            ${a.licoes_aprendidas ? `<p class="text-[10px] text-slate-500 mt-1 italic truncate">${a.licoes_aprendidas}</p>` : ''}
        </div>`;
    }).join('');
    lucide.createIcons();
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS DE MODAL
// ─────────────────────────────────────────────────────────────────────────────
function openModal(modalId, contentId) {
    const modal = document.getElementById(modalId);
    const content = document.getElementById(contentId);
    if (!modal || !content) return;
    modal.classList.remove('hidden');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closeModal(modalId, contentId) {
    const modal = document.getElementById(modalId);
    const content = document.getElementById(contentId);
    if (!modal || !content) return;
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 200);
}
