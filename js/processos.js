// =============================================================================
// MÓDULO DE GESTÃO DE PROCESSOS, DELEGAÇÃO E TRANSIÇÃO — ComSoc CFT
// Capitania Fluvial de Tabatinga • Seção de Comunicação Social & Divisão 40
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// DADOS OFICIAIS NORMATIVOS
// ─────────────────────────────────────────────────────────────────────────────

// 1. Estrutura de Pessoal e Delegação Funcional
const EQUIPE_COMSOC_CFT = [
    {
        id: 'sacramento',
        nome: 'SO-CI-SB Sacramento',
        posto_grad: 'Suboficial (CI-SB)',
        funcao: 'Encarregado ComSoc & Suboficial-Mor (SOMor)',
        papel: 'Supervisão Geral, Diretrizes Estratégicas & Articulação com Comando',
        cor: 'indigo',
        icone: 'anchor',
        atribuicoes: [
            'Supervisão geral da rotina da Seção de Comunicação Social e cerimonial naval',
            'Despacho permanente com o Comandante e o Imediato da CFT',
            'Planejamento da transição e continuidade operacional da seção para a futura reserva',
            'Aprovação final de matérias para a Bússola Amazônica e releases para o Com9ºDN',
            'Orientação e mentoria contínua do SG Matheus e da CB Marla'
        ],
        badges: ['Encarregado ComSoc', 'Suboficial-Mor', 'Supervisão Geral']
    },
    {
        id: 'matheus',
        nome: 'SG-MO Matheus',
        posto_grad: 'Segundo-Sargento (MO)',
        funcao: 'Auxiliar Operacional (ComSoc & Divisão 40)',
        papel: 'Logística de Meios Navais, Som/TI, Audiovisual & Cerimonial Físico',
        cor: 'blue',
        icone: 'ship',
        atribuicoes: [
            'Gestão de Meios e Logística Integrada (Div-40): conciliar manutenções de rotina das lanchas com apoio a eventos e travessias (ex: Benjamin Constant)',
            'Apoio Técnico de Cerimonial: montagem e teste rigoroso de sonorização, microfones, telão e computador na Praça D’Armas ou no auditório antes de formaturas',
            'Acervo Audiovisual: registro fotográfico em alta resolução de todos os eventos e salvamento padronizado no servidor da Secom',
            'Dispositivo e Marcação de Cerimonial Físico em coordenação com a tripulação'
        ],
        badges: ['Auxiliar Operacional', 'Div-40 (Embarcações)', 'Som & TI', 'Acervo Foto/Vídeo']
    },
    {
        id: 'marla',
        nome: 'CB-RM2-PD Marla',
        posto_grad: 'Cabo RM2 (PD)',
        funcao: 'Auxiliar Administrativa e de Conteúdo',
        papel: 'Pedagógico, Operação Cisne Branco, Cerimonial Escrito & Mídias',
        cor: 'emerald',
        icone: 'feather',
        atribuicoes: [
            'Operação Cisne Branco (OCB): centralizar recebimento das redações digitais no canal da ComSoc, conferir fichas de identificação e organizar pastas físicas por escola',
            'Redação Institucional: elaborar matérias para a Bússola Amazônica, minutas de ofícios para diretorias de escolas e roteiros de locução para cerimônias (vogal)',
            'Interlocução Externa: manter canal direto e acolhedor com gestores das redes SEDUC e municipal de Tabatinga e Benjamin Constant',
            'Consolidação de dados estatísticos e lembretes para envio de relatórios ao Com9ºDN'
        ],
        badges: ['Auxiliar Administrativa', 'Operação Cisne Branco', 'Roteiros & Locução', 'Redação & Ofícios']
    }
];

// 2. Calendário Oficial dos 6 Eventos (Outubro a Dezembro de 2026)
const CALENDARIO_EVENTOS_2026 = [
    {
        id: 'evt-ativacao-cft-2026',
        name: 'Aniversário de Ativação da CFT',
        date: '2026-10-26',
        dia_semana: 'Segunda-feira',
        time: '08:00',
        location: 'CFT (Cerimônia Militar no Pátio) / Praça D’Armas (Café)',
        uniform: '5.5 / 6.4',
        formato_sugerido: 'Cerimônia Militar a bordo (08h) + Café da manhã especial (09h). Confraternização externa com famílias no CAMATA no sábado que antecede (24/10).',
        justificativa: 'Comemoração dos anos de ativação da Capitania Fluvial de Tabatinga.',
        tem_decisao_comando: true,
        decisao_titulo: 'Formato da Confraternização de Ativação',
        decisao_opcoes: [
            {
                id: 'opcao_a',
                label: 'Opção A bordo (Recomendada para 26/10)',
                descricao: 'Café da manhã especial / buffet de bolo, salgados e refrigerantes na Praça D’Armas logo após a formatura. Não compromete o expediente, a segurança orgânica nem o atendimento do GAP.'
            },
            {
                id: 'opcao_b',
                label: 'Opção CAMATA (Família Naval / VCB em 24/10)',
                descricao: 'Churrasco com a Família Naval e patrocínio das VCB no CAMATA no sábado, 24 de outubro, evitando esvaziar a rotina administrativa e operacional da segunda-feira útil.'
            }
        ],
        acoes_comsoc: [
            'Formatura geral às 08h00 com leitura da Ordem do Dia alusiva ao histórico da Capitania e condecorações internas.',
            'Preparar dispositivo de som e púlpito do Vogal na Praça D\'Armas ou pátio (SG Matheus).',
            'Cobrir em foto/vídeo de alta resolução os homenageados e tripulação (SG Matheus).',
            'Produzir matéria para a Bússola Amazônica e informe ao Com9ºDN (CB Marla).'
        ]
    },
    {
        id: 'evt-amigo-marinha-2026',
        name: 'Dia Nacional do Amigo da Marinha',
        date: '2026-11-06',
        dia_semana: 'Sexta-feira',
        time: '10:00',
        location: 'Sede da CFT / Auditório',
        uniform: '5.5',
        formato_sugerido: 'Cerimônia solene de imposição de medalhas com autoridades locais e membros da SOAMAR Alto Solimões.',
        justificativa: 'Reconhecimento de personalidades civis e militares que apoiam o Poder Naval na região.',
        tem_decisao_comando: true,
        decisao_titulo: 'Aprovação Final da Lista de Agraciados & Formato do Coquetel',
        decisao_opcoes: [
            {
                id: 'solene_auditorio',
                label: 'Solenidade no Auditório + Recepção de Honra',
                descricao: 'Cerimônia no auditório climatizado com exibição de vídeo institucional, imposição das comendas e coquetel leve no salão anexo.'
            },
            {
                id: 'patio_armas',
                label: 'Formatura no Pátio Externo',
                descricao: 'Dispositivo militar ao ar livre com guarda de honra e desfile da tropa em continência aos novos Amigos da Marinha.'
            }
        ],
        acoes_comsoc: [
            'Expedição dos convites institucionais com 15 dias de antecedência (impreterivelmente até 22/10) — CB Marla.',
            'Contato prévio com a presidência da SOAMAR Alto Solimões para confirmação de presença dos homenageados — CB Marla.',
            'Organização do roteiro de entrega de medalhas e diplomas em coordenação com a Seção de Pessoal — CB Marla.',
            'Montagem e testes de sonorização, microfone do Vogal e projetor no auditório — SG Matheus.'
        ]
    },
    {
        id: 'evt-tamandare-escola-2026',
        name: 'Cerimônia na E. E. Almirante Tamandaré',
        date: '2026-11-13',
        dia_semana: 'Sexta-feira',
        time: '08:30',
        location: 'Quadra da E. E. Almirante Tamandaré',
        uniform: '5.5',
        formato_sugerido: 'Atividade cívico-escolar encerrando a semana pedagógica antes do feriado da Proclamação da República (15/11).',
        justificativa: 'Sexta-feira (13/11) é ideal pois a escola mobiliza os turnos para atividades cívicas antes do feriado.',
        tem_decisao_comando: false,
        decisao_titulo: 'Dispositivo da Guarda e Doação Institucional',
        decisao_opcoes: [],
        acoes_comsoc: [
            'Alinhamento com a equipe pedagógica da escola na última semana de outubro — CB Marla.',
            'Definição do dispositivo da Guarda de Honra e representação da Capitania — SO Sacramento.',
            'Roteiro alusivo ao Patrono da Marinha e doação de material institucional/Bandeira Nacional — CB Marla.',
            'Apoio de sonorização portátil e cobertura fotográfica dos alunos — SG Matheus.'
        ]
    },
    {
        id: 'evt-dia-bandeira-2026',
        name: 'Dia da Bandeira',
        date: '2026-11-19',
        dia_semana: 'Quinta-feira',
        time: '12:00',
        location: 'Pátio da CFT',
        uniform: '5.5',
        formato_sugerido: 'Cerimonial solene ao meio-dia rigoroso com incineração das bandeiras nacionais inservíveis recolhidas.',
        justificativa: 'Cumprimento estrito do Cerimonial Naval regulamentar pontualmente às 12h00.',
        tem_decisao_comando: false,
        decisao_titulo: '',
        decisao_opcoes: [],
        acoes_comsoc: [
            'Cumprimento do Cerimonial Naval pontualmente às 12h00 (içamento extraordinário e incineração).',
            'Convite formal a alunos de escolas cívico-militares locais para assistirem ao cerimonial — CB Marla.',
            'Coordenação com o Contramestre para recolhimento e preparo das bandeiras inservíveis — SG Matheus.',
            'Registro fotográfico do momento da incineração e salva de tiros — SG Matheus.'
        ]
    },
    {
        id: 'evt-dia-marinheiro-2026',
        name: 'Dia do Marinheiro (Data Magna 13/DEZ)',
        date: '2026-12-11',
        dia_semana: 'Sexta-feira',
        time: '10:00',
        location: 'Pátio de Formatura da CFT',
        uniform: '5.5 / 3.3',
        formato_sugerido: 'Antecipação da Cerimônia Militar oficial para sexta-feira (11/12), pois a data magna (13/12) é domingo.',
        justificativa: 'O cerimonial militar oficial com presença de autoridades públicas e comunidade sempre é antecipado para a última sexta-feira útil.',
        tem_decisao_comando: true,
        decisao_titulo: 'Definição do Uniforme (5.5 vs 3.3) e Condecorações',
        decisao_opcoes: [
            {
                id: 'uniforme_55',
                label: 'Uniforme 5.5 (Mais leve/climatizado)',
                descricao: 'Uniforme 5.5 para toda a tropa e convidados militares, adequado à umidade e calor amazônico de Tabatinga.'
            },
            {
                id: 'uniforme_33',
                label: 'Uniforme 3.3 (Gala / Alto Cerimonial)',
                descricao: 'Uniforme 3.3 para autoridades da mesa e condecorados da Medalha Mérito Marinheiro.'
            }
        ],
        acoes_comsoc: [
            'Formatura militar solene com imposição da Medalha Mérito Marinheiro — CB Marla / Seção Pessoal.',
            'Leitura da Ordem do Dia do Comandante da Marinha e promoção de Praças da CFT.',
            'Preparação do roteiro do Mestre de Cerimônias e alinhamento com autoridades — CB Marla.',
            'Cobertura fotográfica completa e registro no Livro Histórico do Estabelecimento — SG Matheus.'
        ]
    },
    {
        id: 'evt-premiacao-ocb-2026',
        name: 'Premiação da OCB 2026 (Operação Cisne Branco)',
        date: '2026-12-18',
        dia_semana: 'Sexta-feira',
        time: '10:00',
        location: 'Auditório da CFT',
        uniform: '5.5 / Passeio',
        formato_sugerido: 'Fechamento solene do ciclo letivo antes do recesso escolar, repetindo o padrão de excelência de 2025.',
        justificativa: 'Data ideal na terceira semana de dezembro, antes da liberação final dos alunos das redes de Tabatinga e Benjamin Constant.',
        tem_decisao_comando: true,
        decisao_titulo: 'Logística de Travessia Fluvial para Alunos de Benjamin Constant',
        decisao_opcoes: [
            {
                id: 'lancha_cft_direta',
                label: 'Lancha da CFT escalada para travessia (Recomendada)',
                descricao: 'Embarcação da Div-40 escalada sob comando do SG Matheus para buscar alunos e professores premiados em Benjamin Constant (CETI, Graziela, Imaculada Conceição) e retorná-los com segurança.'
            },
            {
                id: 'apoio_seduc',
                label: 'Apoio de Transporte da SEDUC/Prefeituras',
                descricao: 'Articular com a Coordenadoria Regional da SEDUC para fornecer transporte fluvial com custeio próprio das redes.'
            }
        ],
        acoes_comsoc: [
            'Logística Integrada da Div-40 (SG Matheus): escala de embarcação e plano de travessia para Benjamin Constant.',
            'Recepção calorosa de alunos, pais e diretores no portaló da Capitania.',
            'Entrega dos certificados, medalhas e brindes aos alunos vencedores do Ensino Fundamental e Médio — CB Marla.',
            'Cobertura de vídeo e foto para exibição no telão e release imediato — SG Matheus / CB Marla.'
        ]
    }
];

// 3. Matriz de Gestão e Ações dos Próximos 15 Dias (01 a 16 de Outubro de 2026)
const METAS_15_DIAS_PADRAO = [
    {
        id: 'P15-01',
        ordem: 1,
        titulo: 'Encerramento da Coleta da OCB',
        prazo_critico: '2026-10-09',
        prazo_label: 'Até 09/10/2026',
        responsavel_id: 'marla',
        responsavel_nome: 'CB Marla',
        categoria: 'OCB & Escolas',
        foco: 'Centralizar o recebimento das redações digitais no canal da ComSoc, conferir fichas de identificação e confirmar com todas as escolas participantes.',
        urgencia: 'alta',
        status: 'pendente', // pendente | em_andamento | concluido | impedido
        anotacoes: ''
    },
    {
        id: 'P15-02',
        ordem: 2,
        titulo: 'Triagem das Redações Digitais',
        prazo_critico: '2026-10-12',
        prazo_label: '05 a 12/10/2026',
        responsavel_id: 'marla',
        responsavel_nome: 'CB Marla',
        categoria: 'OCB & Escolas',
        foco: 'Verificar conformidade com o tema oficial, numeração de linhas, identificação dos alunos e organizar as notas prévias da banca.',
        urgencia: 'alta',
        status: 'pendente',
        anotacoes: ''
    },
    {
        id: 'P15-03',
        ordem: 3,
        titulo: 'Montagem das Pastas Físicas da OCB',
        prazo_critico: '2026-10-16',
        prazo_label: '13 a 16/10/2026',
        responsavel_id: 'conjunto',
        responsavel_nome: 'SG Matheus / CB Marla',
        categoria: 'OCB & Arquivo',
        foco: 'Montagem física das pastas por colégio (Tabatinga e Benjamin Constant) e preparação do acervo para submissão à comissão de avaliação.',
        urgencia: 'media',
        status: 'pendente',
        anotacoes: ''
    },
    {
        id: 'P15-04',
        ordem: 4,
        titulo: 'Minuta de Ofícios (Ativação 26/10 e Amigo da Marinha 06/11)',
        prazo_critico: '2026-10-14',
        prazo_label: 'Até 14/10/2026',
        responsavel_id: 'marla',
        responsavel_nome: 'CB Marla',
        categoria: 'Cerimonial & Ofícios',
        foco: 'Redigir minutas formais de convite institucional para diretorias de escolas, prefeituras e autoridades para os eventos de 26/10 e 06/11.',
        urgencia: 'alta',
        status: 'pendente',
        anotacoes: ''
    },
    {
        id: 'P15-05',
        ordem: 5,
        titulo: 'Levantamento Técnico e Teste de Som/Projetor',
        prazo_critico: '2026-10-15',
        prazo_label: 'Até 15/10/2026',
        responsavel_id: 'matheus',
        responsavel_nome: 'SG Matheus (Div-40)',
        categoria: 'Logística & Meios',
        foco: 'Revisar caixas de som, microfones com e sem fio, pedestais, cabos e notebook da Praça D\'Armas e auditório para evitar falhas no cerimonial de 26/10.',
        urgencia: 'media',
        status: 'pendente',
        anotacoes: ''
    },
    {
        id: 'P15-06',
        ordem: 6,
        titulo: 'Lembrete do Relatório OCB ao Com9ºDN',
        prazo_critico: '2026-10-31',
        prazo_label: 'Deixar pronto p/ envio em 31/10',
        responsavel_id: 'marla',
        responsavel_nome: 'CB Marla',
        categoria: 'Relatórios & Prestação',
        foco: 'Deixar a estrutura do relatório com dados consolidados e redações vencedoras prontos antes do prazo final de remessa ao Comando do 9º Distrito Naval.',
        urgencia: 'media',
        status: 'pendente',
        anotacoes: ''
    }
];

// 4. Passos Práticos de Passagem de Serviço (Ausência do SOMor)
const PASSOS_TRANSICAO_PADRAO = [
    {
        passo_id: 'PASSO-01',
        titulo: '1. Briefing Inicial com a Equipe',
        responsavel: 'SO Sacramento / SG Matheus / CB Marla',
        data_sugerida: '01/10/2026',
        descricao: 'Reunir o SG Matheus e a CB Marla, repassando o acesso aos arquivos digitais da ComSoc, pasta no servidor da rede e contatos dos gestores escolares de Tabatinga e Benjamin Constant.',
        concluido: false,
        observacoes: ''
    },
    {
        passo_id: 'PASSO-02',
        titulo: '2. Despacho com o Imediato',
        responsavel: 'SO Sacramento / Imediato da CFT',
        data_sugerida: '02/10/2026',
        descricao: 'Apresentar formalmente a escala de substituição temporária na ComSoc durante os 15 dias, registrando a colaboração da CB Marla para que ela tenha respaldo de horários frente às suas outras tarefas.',
        concluido: false,
        observacoes: ''
    },
    {
        passo_id: 'PASSO-03',
        titulo: '3. Ponto de Controle na Volta (Pós-Viagem)',
        responsavel: 'SO Sacramento / Equipe ComSoc',
        data_sugerida: '19/10/2026 (Segunda-feira)',
        descricao: 'Agendar reunião de avaliação no primeiro dia de retorno para revisar as redações selecionadas para envio ao Com9ºDN e aprovar os roteiros finais da cerimônia de 26 de outubro.',
        concluido: false,
        observacoes: ''
    }
];

// ─────────────────────────────────────────────────────────────────────────────
// ESTADO DO MÓDULO DE PROCESSOS
// ─────────────────────────────────────────────────────────────────────────────
let processosData = [];
let decisoesData = {};
let passosTransicaoData = {};
let processosFiltroResponsavel = 'todos';
let processosFiltroStatus = 'todos';
let processosAbaAtiva = 'prazos15'; // 'prazos15' | 'decisoes' | 'equipe' | 'kanban'
let processosPainelIniciado = false;

// ─────────────────────────────────────────────────────────────────────────────
// INICIALIZAÇÃO DA ABA DE PROCESSOS
// ─────────────────────────────────────────────────────────────────────────────
async function initProcessosTab() {
    await carregarDadosProcessos();
    renderProcessosDashboard();
    // Sincronizar silenciosamente os 6 eventos na agenda oficial na primeira vez
    verificarESincronizarEventosSilencioso();
}

async function carregarDadosProcessos() {
    try {
        // 1. Processos (Metas 15 dias)
        if (typeof carregarProcessosComsoc === 'function') {
            const lista = await carregarProcessosComsoc();
            if (lista && lista.length > 0) {
                // Mesclar preservando metas padrão caso não existam
                const map = {};
                lista.forEach(item => { map[item.id] = item; });
                processosData = METAS_15_DIAS_PADRAO.map(m => map[m.id] ? { ...m, ...map[m.id] } : { ...m });
                // Adicionar extras criados pelo usuário
                lista.forEach(item => {
                    if (!METAS_15_DIAS_PADRAO.some(m => m.id === item.id)) {
                        processosData.push(item);
                    }
                });
            } else {
                processosData = [...METAS_15_DIAS_PADRAO];
            }
        } else {
            processosData = [...METAS_15_DIAS_PADRAO];
        }

        // 2. Decisões do Comando
        if (typeof carregarDecisoesComsoc === 'function') {
            decisoesData = await carregarDecisoesComsoc() || {};
        }

        // 3. Passos de Transição
        if (typeof carregarPassosTransicao === 'function') {
            passosTransicaoData = await carregarPassosTransicao() || {};
        }
    } catch (e) {
        console.warn('Erro ao carregar dados de processos, usando dados padrão:', e);
        processosData = [...METAS_15_DIAS_PADRAO];
    }
}

// Sincronização automática dos 6 eventos na Agenda Oficial (eventsData)
async function sincronizarEventosOficiaisComAgenda(notificar = true) {
    if (typeof eventsData === 'undefined') return;

    let adicionados = 0;
    let atualizados = 0;

    for (const evtPadrao of CALENDARIO_EVENTOS_2026) {
        const existenteIdx = eventsData.findIndex(e => e.id === evtPadrao.id || (e.name && e.name.toLowerCase().trim() === evtPadrao.name.toLowerCase().trim()));
        
        const payload = {
            id: evtPadrao.id,
            name: evtPadrao.name,
            date: evtPadrao.date,
            time: evtPadrao.time,
            location: evtPadrao.location,
            uniform: evtPadrao.uniform,
            description: `${evtPadrao.formato_sugerido} | ${evtPadrao.justificativa}`,
            compartilhar: true
        };

        if (existenteIdx >= 0) {
            // Atualizar preservando campos adicionais
            eventsData[existenteIdx] = { ...eventsData[existenteIdx], ...payload };
            atualizados++;
            if (typeof salvarEventoNuvem === 'function') {
                await salvarEventoNuvem(eventsData[existenteIdx], true).catch(() => {});
            }
        } else {
            eventsData.push(payload);
            adicionados++;
            if (typeof salvarEventoNuvem === 'function') {
                await salvarEventoNuvem(payload, false).catch(() => {});
            }
        }
    }

    // Salvar no localStorage
    localStorage.setItem('cft_events_v5', JSON.stringify(eventsData));

    // Se o evento ativo atual for 'evt-default' ou não estiver entre os 6, ativar o próximo (26/10 Ativação CFT)
    if (typeof activeEventId === 'undefined' || activeEventId === 'evt-default' || !eventsData.some(e => e.id === activeEventId)) {
        activeEventId = 'evt-ativacao-cft-2026';
        localStorage.setItem('cft_active_event_id_v5', activeEventId);
    }

    // Atualizar interfaces visuais conectadas
    if (typeof updateActiveEventBanner === 'function') updateActiveEventBanner();
    if (typeof renderEventsList === 'function') renderEventsList();
    if (typeof renderAgendaTimeline === 'function') renderAgendaTimeline();
    if (typeof populateEventSelectComsoc === 'function') populateEventSelectComsoc();

    if (notificar && typeof showToast === 'function') {
        showToast(`Agenda Oficial sincronizada! ${adicionados} criados, ${atualizados} atualizados.`);
    }

    renderProcessosDashboard();
}

function verificarESincronizarEventosSilencioso() {
    if (typeof eventsData === 'undefined' || !Array.isArray(eventsData)) return;
    const faltamEventos = CALENDARIO_EVENTOS_2026.some(ep => !eventsData.some(e => e.id === ep.id));
    if (faltamEventos) {
        sincronizarEventosOficiaisComAgenda(false);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDERIZAÇÃO DO PAINEL PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
function renderProcessosDashboard() {
    const container = document.getElementById('comsoc-processos-panel');
    if (!container) return;

    // Calcular estatísticas rápidas
    const totalMetas = processosData.length;
    const concluidasMetas = processosData.filter(m => m.status === 'concluido').length;
    const andamentoMetas = processosData.filter(m => m.status === 'em_andamento').length;
    const pendentesMetas = processosData.filter(m => m.status === 'pendente' || m.status === 'impedido').length;
    const pctConclusao = totalMetas > 0 ? Math.round((concluidasMetas / totalMetas) * 100) : 0;

    // Calcular decisões tomadas
    const eventosComDecisao = CALENDARIO_EVENTOS_2026.filter(e => e.tem_decisao_comando);
    const decisoesTomadas = eventosComDecisao.filter(e => decisoesData[e.id] && decisoesData[e.id].opcao_selecionada).length;

    container.innerHTML = `
        <!-- CABEÇALHO DO MÓDULO -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-premium mb-6">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div class="flex items-start gap-4">
                    <div class="bg-gradient-to-br from-naval-blue to-naval-light p-3.5 rounded-xl text-naval-accent shadow-md flex-shrink-0">
                        <i data-lucide="workflow" class="w-8 h-8"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2.5 flex-wrap">
                            <h2 class="text-2xl sm:text-3xl font-outfit font-extrabold text-naval-blue tracking-tight">
                                Gestão de Processos & Delegação ComSoc
                            </h2>
                            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-sm animate-pulse">
                                <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                                Janela Crítica: 01 a 16/Out (Ausência SOMor)
                            </span>
                        </div>
                        <p class="text-slate-600 text-sm mt-1 max-w-3xl leading-relaxed">
                            Organização operacional, matriz de delegação funcional e acompanhamento do calendário institucional 
                            (Outubro a Dezembro de 2026) da Capitania Fluvial de Tabatinga.
                        </p>
                    </div>
                </div>

                <!-- BOTÕES DE AÇÃO RÁPIDA -->
                <div class="flex items-center gap-2.5 flex-wrap">
                    <button onclick="sincronizarEventosOficiaisComAgenda(true)" 
                        title="Injetar e sincronizar os 6 eventos na Agenda e Diretório de Presença"
                        class="flex items-center gap-2 px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition-all hover:shadow-sm">
                        <i data-lucide="refresh-cw" class="w-4 h-4 text-indigo-600"></i>
                        <span>Sincronizar Agenda Oficial</span>
                    </button>
                    <button onclick="abrirModalNovaMetaProcesso()" 
                        class="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95">
                        <i data-lucide="plus-circle" class="w-4 h-4"></i>
                        <span>Nova Ação</span>
                    </button>
                    <button onclick="imprimirQuadroProcessos()" 
                        title="Exportar ou Imprimir o Quadro de Ordens da ComSoc"
                        class="flex items-center gap-2 px-3.5 py-2.5 bg-naval-blue hover:bg-naval-light text-white font-bold text-xs rounded-xl shadow-sm transition-all">
                        <i data-lucide="printer" class="w-4 h-4 text-naval-accent"></i>
                        <span>Imprimir Quadro</span>
                    </button>
                </div>
            </div>

            <!-- CARDS DE ESTATÍSTICAS RÁPIDAS -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Metas 15 Dias</p>
                    <div class="flex items-baseline justify-between mt-1">
                        <span class="text-2xl font-black font-outfit text-slate-800">${totalMetas}</span>
                        <span class="text-xs font-semibold text-slate-500">${concluidasMetas} concluídas</span>
                    </div>
                    <div class="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div class="bg-emerald-500 h-full rounded-full transition-all duration-500" style="width: ${pctConclusao}%"></div>
                    </div>
                </div>

                <div class="bg-amber-50/60 p-4 rounded-xl border border-amber-200/60">
                    <p class="text-[10px] font-bold uppercase tracking-wider text-amber-700">Em Andamento</p>
                    <div class="flex items-baseline justify-between mt-1">
                        <span class="text-2xl font-black font-outfit text-amber-900">${andamentoMetas}</span>
                        <span class="text-xs font-semibold text-amber-700">${pendentesMetas} pendentes</span>
                    </div>
                    <p class="text-[10px] text-amber-600 font-medium mt-2">Atenção ao prazo crítico</p>
                </div>

                <div class="bg-indigo-50/60 p-4 rounded-xl border border-indigo-200/60">
                    <p class="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Decisões do Comando</p>
                    <div class="flex items-baseline justify-between mt-1">
                        <span class="text-2xl font-black font-outfit text-indigo-900">${decisoesTomadas}/${eventosComDecisao.length}</span>
                        <span class="text-xs font-semibold text-indigo-700">${eventosComDecisao.length - decisoesTomadas} pendente(s)</span>
                    </div>
                    <p class="text-[10px] text-indigo-600 font-medium mt-2">Ativação CFT, Amigo da Marinha...</p>
                </div>

                <div class="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/60">
                    <p class="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Equipe Escalada</p>
                    <div class="flex items-baseline justify-between mt-1">
                        <span class="text-2xl font-black font-outfit text-emerald-900">3 Militares</span>
                        <span class="text-xs font-semibold text-emerald-700">ComSoc & Div-40</span>
                    </div>
                    <p class="text-[10px] text-emerald-600 font-medium mt-2">SO Sacramento, SG Matheus, CB Marla</p>
                </div>
            </div>
        </div>

        <!-- SUB-NAVEGAÇÃO DE VISÕES -->
        <div class="border-b border-slate-200 mb-6 flex gap-2 sm:gap-4 overflow-x-auto custom-scrollbar">
            <button onclick="mudarSubAbaProcessos('prazos15')" id="subtab-btn-prazos15"
                class="${processosAbaAtiva === 'prazos15' ? 'border-b-2 border-naval-blue text-naval-blue' : 'border-b-2 border-transparent text-slate-500 hover:text-slate-700'} py-3 px-3 font-outfit font-bold text-sm tracking-wide transition-all whitespace-nowrap min-h-[44px] flex items-center gap-2">
                <i data-lucide="clock-alert" class="w-4 h-4 text-amber-500"></i>
                <span>Matriz dos Próximos 15 Dias (01 a 16/Out)</span>
                <span class="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">${processosData.length}</span>
            </button>

            <button onclick="mudarSubAbaProcessos('decisoes')" id="subtab-btn-decisoes"
                class="${processosAbaAtiva === 'decisoes' ? 'border-b-2 border-naval-blue text-naval-blue' : 'border-b-2 border-transparent text-slate-500 hover:text-slate-700'} py-3 px-3 font-outfit font-bold text-sm tracking-wide transition-all whitespace-nowrap min-h-[44px] flex items-center gap-2">
                <i data-lucide="calendar-check" class="w-4 h-4 text-indigo-500"></i>
                <span>Calendário & Decisões do Comando (Out a Dez)</span>
                <span class="bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">${CALENDARIO_EVENTOS_2026.length}</span>
            </button>

            <button onclick="mudarSubAbaProcessos('equipe')" id="subtab-btn-equipe"
                class="${processosAbaAtiva === 'equipe' ? 'border-b-2 border-naval-blue text-naval-blue' : 'border-b-2 border-transparent text-slate-500 hover:text-slate-700'} py-3 px-3 font-outfit font-bold text-sm tracking-wide transition-all whitespace-nowrap min-h-[44px] flex items-center gap-2">
                <i data-lucide="users-2" class="w-4 h-4 text-blue-500"></i>
                <span>Estrutura de Delegação & Transição</span>
            </button>

            <button onclick="mudarSubAbaProcessos('kanban')" id="subtab-btn-kanban"
                class="${processosAbaAtiva === 'kanban' ? 'border-b-2 border-naval-blue text-naval-blue' : 'border-b-2 border-transparent text-slate-500 hover:text-slate-700'} py-3 px-3 font-outfit font-bold text-sm tracking-wide transition-all whitespace-nowrap min-h-[44px] flex items-center gap-2">
                <i data-lucide="kanban" class="w-4 h-4 text-emerald-500"></i>
                <span>Quadro Kanban</span>
            </button>
        </div>

        <!-- CONTEÚDO DA VISÃO ATIVA -->
        <div id="processos-view-container">
            ${obterConteudoSubAbaProcessos()}
        </div>
    `;

    lucide.createIcons();
}

function mudarSubAbaProcessos(aba) {
    processosAbaAtiva = aba;
    renderProcessosDashboard();
}

function obterConteudoSubAbaProcessos() {
    switch (processosAbaAtiva) {
        case 'prazos15':
            return renderVisaoPrazos15();
        case 'decisoes':
            return renderVisaoDecisoes();
        case 'equipe':
            return renderVisaoEquipe();
        case 'kanban':
            return renderVisaoKanban();
        default:
            return renderVisaoPrazos15();
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// VISÃO 1: MATRIZ DOS PRÓXIMOS 15 DIAS (01 A 16/OUT)
// ─────────────────────────────────────────────────────────────────────────────
function renderVisaoPrazos15() {
    // Filtrar dados
    let lista = [...processosData];
    if (processosFiltroResponsavel !== 'todos') {
        lista = lista.filter(m => m.responsavel_id === processosFiltroResponsavel || (m.responsavel_id === 'conjunto' && (processosFiltroResponsavel === 'marla' || processosFiltroResponsavel === 'matheus')));
    }
    if (processosFiltroStatus !== 'todos') {
        lista = lista.filter(m => m.status === processosFiltroStatus);
    }

    return `
        <!-- BANNER DE CONTEXTO E CONDUTA -->
        <div class="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 p-4 rounded-r-xl mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div class="flex items-start gap-3">
                <i data-lucide="shield-alert" class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"></i>
                <div>
                    <h4 class="text-sm font-bold text-slate-800">Plano de Contingência — Período de Ausência do SOMor</h4>
                    <p class="text-xs text-slate-600 mt-0.5">
                        Metas rigorosas para manter o fluxo operacional da ComSoc e recolhimento das redações da Operação Cisne Branco 
                        perfeitamente alinhados até o retorno e despacho formal pós-viagem.
                    </p>
                </div>
            </div>
            
            <!-- FILTROS RÁPIDOS -->
            <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-bold text-slate-500">Filtrar por:</span>
                <select onchange="aplicarFiltroResponsavelProcessos(this.value)" class="text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-naval-blue">
                    <option value="todos" ${processosFiltroResponsavel === 'todos' ? 'selected' : ''}>Todos os Responsáveis</option>
                    <option value="marla" ${processosFiltroResponsavel === 'marla' ? 'selected' : ''}>CB Marla (Administrativo)</option>
                    <option value="matheus" ${processosFiltroResponsavel === 'matheus' ? 'selected' : ''}>SG Matheus (Operacional/Div-40)</option>
                    <option value="conjunto" ${processosFiltroResponsavel === 'conjunto' ? 'selected' : ''}>Ação Conjunta</option>
                </select>

                <select onchange="aplicarFiltroStatusProcessos(this.value)" class="text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-naval-blue">
                    <option value="todos" ${processosFiltroStatus === 'todos' ? 'selected' : ''}>Todos os Status</option>
                    <option value="pendente" ${processosFiltroStatus === 'pendente' ? 'selected' : ''}>Pendentes</option>
                    <option value="em_andamento" ${processosFiltroStatus === 'em_andamento' ? 'selected' : ''}>Em Andamento</option>
                    <option value="concluido" ${processosFiltroStatus === 'concluido' ? 'selected' : ''}>Concluídos</option>
                </select>
            </div>
        </div>

        <!-- LISTA DAS METAS DOS 15 DIAS -->
        <div class="space-y-4 mb-8">
            ${lista.map(meta => renderCardMeta15Dias(meta)).join('')}
        </div>

        <!-- SEÇÃO DOS 3 PASSOS PRÁTICOS DE PASSAGEM DE SERVIÇO -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-premium">
            <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div class="flex items-center gap-2.5">
                    <div class="bg-naval-blue text-naval-accent p-2 rounded-lg">
                        <i data-lucide="check-square" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h3 class="text-lg font-outfit font-bold text-naval-blue">Passos Práticos de Passagem de Serviço</h3>
                        <p class="text-xs text-slate-500">Checklist executivo de alinhamento com a equipe e o Imediato da CFT</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                ${PASSOS_TRANSICAO_PADRAO.map(passo => renderCardPassoTransicao(passo)).join('')}
            </div>
        </div>
    `;
}

function renderCardMeta15Dias(meta) {
    const statusCfg = {
        pendente:     { label: 'Pendente',     badge: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-400' },
        em_andamento: { label: 'Em Andamento', badge: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500' },
        concluido:    { label: 'Concluído',    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500' },
        impedido:     { label: 'Impedimento',  badge: 'bg-rose-100 text-rose-800 border-rose-300', dot: 'bg-rose-500' }
    }[meta.status] || { label: 'Pendente', badge: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-400' };

    // Calcular dias restantes
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataMeta = new Date(meta.prazo_critico + 'T12:00:00');
    const diffTime = dataMeta - hoje;
    const diffDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let avisoPrazo = '';
    if (meta.status === 'concluido') {
        avisoPrazo = `<span class="text-emerald-600 font-bold text-xs flex items-center gap-1"><i data-lucide="check" class="w-3.5 h-3.5"></i> Concluído</span>`;
    } else if (diffDias < 0) {
        avisoPrazo = `<span class="text-rose-600 font-bold text-xs flex items-center gap-1 animate-pulse"><i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i> Vencido (${Math.abs(diffDias)}d atrás)</span>`;
    } else if (diffDias === 0) {
        avisoPrazo = `<span class="text-amber-600 font-bold text-xs flex items-center gap-1 font-outfit"><i data-lucide="alarm-clock" class="w-3.5 h-3.5"></i> Vence Hoje!</span>`;
    } else {
        avisoPrazo = `<span class="text-slate-500 text-xs font-medium">Faltam <b class="text-slate-800">${diffDias} dias</b></span>`;
    }

    const respChip = meta.responsavel_id === 'marla' 
        ? `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">👩‍💼 ${meta.responsavel_nome}</span>`
        : meta.responsavel_id === 'matheus'
        ? `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">⚓ ${meta.responsavel_nome}</span>`
        : `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">🤝 ${meta.responsavel_nome}</span>`;

    return `
        <div class="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div class="flex items-start gap-4 flex-1">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center font-outfit font-black text-xs flex-shrink-0 ${meta.status === 'concluido' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}">
                    ${meta.ordem}
                </div>
                <div class="space-y-1.5 flex-1 min-w-0">
                    <div class="flex items-center gap-2.5 flex-wrap">
                        <h4 class="font-outfit font-bold text-slate-800 text-base ${meta.status === 'concluido' ? 'line-through text-slate-400' : ''}">
                            ${meta.titulo}
                        </h4>
                        <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            ${meta.categoria}
                        </span>
                        ${respChip}
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed">
                        ${meta.foco}
                    </p>
                    ${meta.anotacoes ? `
                        <div class="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200/60 mt-1 flex items-start gap-1.5">
                            <i data-lucide="message-square" class="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0"></i>
                            <span class="italic"><b>Anotação:</b> ${meta.anotacoes}</span>
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- CONTROLES DE STATUS E PRAZO -->
            <div class="flex items-center gap-4 flex-wrap w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                <div class="text-right">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prazo Crítico</p>
                    <p class="text-xs font-bold text-slate-800 font-outfit">${meta.prazo_label}</p>
                    <div class="mt-0.5">${avisoPrazo}</div>
                </div>

                <!-- SELETOR RÁPIDO DE STATUS -->
                <div class="flex items-center gap-1.5">
                    <button onclick="atualizarStatusMetaProcesso('${meta.id}', 'pendente')" 
                        title="Marcar como Pendente"
                        class="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${meta.status === 'pendente' ? 'bg-slate-700 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                        Pendente
                    </button>
                    <button onclick="atualizarStatusMetaProcesso('${meta.id}', 'em_andamento')" 
                        title="Marcar como Em Andamento"
                        class="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${meta.status === 'em_andamento' ? 'bg-amber-500 text-white shadow-sm' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}">
                        Andamento
                    </button>
                    <button onclick="atualizarStatusMetaProcesso('${meta.id}', 'concluido')" 
                        title="Marcar como Concluído"
                        class="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${meta.status === 'concluido' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}">
                        Concluído
                    </button>
                    <button onclick="abrirModalAnotacaoMeta('${meta.id}')" 
                        title="Adicionar ou Editar Anotações"
                        class="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                        <i data-lucide="edit-3" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderCardPassoTransicao(passo) {
    const salvo = passosTransicaoData[passo.passo_id] || {};
    const estaConcluido = salvo.concluido !== undefined ? salvo.concluido : passo.concluido;
    const observacao = salvo.observacoes || passo.observacoes || '';

    return `
        <div class="p-4 rounded-xl border transition-all ${estaConcluido ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'} flex flex-col justify-between">
            <div>
                <div class="flex items-center justify-between gap-2 mb-2">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">${passo.data_sugerida}</span>
                    <button onclick="alternarConclusaoPassoTransicao('${passo.passo_id}')" 
                        class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${estaConcluido ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}">
                        <i data-lucide="${estaConcluido ? 'check-circle-2' : 'circle'}" class="w-3.5 h-3.5"></i>
                        <span>${estaConcluido ? 'Realizado' : 'A Fazer'}</span>
                    </button>
                </div>
                <h4 class="font-outfit font-bold text-slate-800 text-sm mb-1">${passo.titulo}</h4>
                <p class="text-xs text-slate-600 leading-relaxed">${passo.descricao}</p>
                <p class="text-[11px] text-naval-blue font-semibold mt-2"><b>Resp:</b> ${passo.responsavel}</p>
            </div>
            ${observacao ? `<p class="text-[11px] text-slate-500 italic mt-3 pt-2 border-t border-slate-200">"${observacao}"</p>` : ''}
        </div>
    `;
}

// ─────────────────────────────────────────────────────────────────────────────
// VISÃO 2: CALENDÁRIO & DECISÕES DO COMANDO (OUT A DEZ)
// ─────────────────────────────────────────────────────────────────────────────
function renderVisaoDecisoes() {
    return `
        <div class="space-y-6">
            <div class="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
                <div class="flex items-center gap-3">
                    <i data-lucide="info" class="w-5 h-5 text-blue-600 flex-shrink-0"></i>
                    <p class="text-xs text-blue-900 leading-relaxed">
                        Os 6 eventos abaixo formam o espinhaçal do último trimestre de 2026. 
                        <b>Decisões tomadas aqui são salvas no banco de dados</b> e podem ser despachadas diretamente com o Comando e Imediato da CFT.
                    </p>
                </div>
                <button onclick="sincronizarEventosOficiaisComAgenda(true)" 
                    class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors">
                    <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
                    Sincronizar com Agenda
                </button>
            </div>

            <!-- GRADE DOS 6 EVENTOS -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                ${CALENDARIO_EVENTOS_2026.map(evento => renderCardEventoDecisao(evento)).join('')}
            </div>
        </div>
    `;
}

function renderCardEventoDecisao(evento) {
    const decisaoSalva = decisoesData[evento.id] || {};
    const opcaoSelecionadaId = decisaoSalva.opcao_selecionada;
    const opcaoObj = evento.decisao_opcoes ? evento.decisao_opcoes.find(o => o.id === opcaoSelecionadaId) : null;

    // Verificar se este evento é o ativo no diretório
    const ehAtivo = typeof activeEventId !== 'undefined' && activeEventId === evento.id;

    return `
        <div class="bg-white rounded-2xl p-6 border ${ehAtivo ? 'border-naval-blue shadow-premium ring-2 ring-naval-blue/10' : 'border-slate-200 shadow-sm'} flex flex-col justify-between transition-all">
            <div>
                <!-- CABEÇALHO DO EVENTO -->
                <div class="flex items-start justify-between gap-3 mb-3">
                    <div class="flex items-center gap-3">
                        <div class="bg-gradient-to-br from-naval-blue to-naval-light text-white p-3 rounded-xl shadow-sm text-center min-w-[54px]">
                            <span class="block text-[10px] font-bold uppercase tracking-wider text-naval-accent">${evento.date.split('-')[2]}</span>
                            <span class="block text-base font-black font-outfit leading-none mt-0.5">${obterMesAbrev(evento.date)}</span>
                        </div>
                        <div>
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${evento.dia_semana} · ${evento.time}</span>
                            <h3 class="text-lg font-outfit font-extrabold text-naval-blue leading-snug">${evento.name}</h3>
                        </div>
                    </div>

                    ${ehAtivo ? `
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ATIVO NO DIRETÓRIO
                        </span>
                    ` : ''}
                </div>

                <!-- INFORMAÇÕES DE PROTOCOLO -->
                <div class="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/70 mb-4">
                    <div>
                        <span class="block text-[10px] font-bold text-slate-400 uppercase">Local</span>
                        <span class="font-semibold text-slate-800 truncate block">${evento.location}</span>
                    </div>
                    <div>
                        <span class="block text-[10px] font-bold text-slate-400 uppercase">Uniforme</span>
                        <span class="font-semibold text-slate-800 truncate block">${evento.uniform}</span>
                    </div>
                </div>

                <!-- FORMATO SUGERIDO & JUSTIFICATIVA -->
                <div class="space-y-1.5 mb-4 text-xs text-slate-600">
                    <p><b>Formato:</b> ${evento.formato_sugerido}</p>
                    <p class="text-slate-500 italic"><b>Justificativa:</b> ${evento.justificativa}</p>
                </div>

                <!-- PONTO DE DECISÃO DO COMANDO -->
                ${evento.tem_decisao_comando ? `
                    <div class="mt-4 p-4 rounded-xl border ${opcaoObj ? 'bg-indigo-50/40 border-indigo-200' : 'bg-amber-50/50 border-amber-200'}">
                        <div class="flex items-center justify-between gap-2 mb-2">
                            <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <i data-lucide="scale" class="w-4 h-4 text-indigo-600"></i>
                                ${evento.decisao_titulo}
                            </span>
                            ${opcaoObj ? `
                                <span class="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">Decisão Registrada</span>
                            ` : `
                                <span class="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Pendente de Decisão</span>
                            `}
                        </div>

                        <!-- OPÇÕES DE DECISÃO -->
                        <div class="space-y-2 mt-2">
                            ${evento.decisao_opcoes.map(opcao => `
                                <label class="flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${opcaoSelecionadaId === opcao.id ? 'bg-white border-indigo-400 shadow-sm ring-1 ring-indigo-400' : 'bg-white/80 border-slate-200 hover:bg-white'}">
                                    <input type="radio" name="decisao_${evento.id}" value="${opcao.id}" 
                                        ${opcaoSelecionadaId === opcao.id ? 'checked' : ''}
                                        onchange="registrarDecisaoComando('${evento.id}', '${evento.name}', '${opcao.id}', '${opcao.label}')"
                                        class="mt-1 text-indigo-600 focus:ring-indigo-500">
                                    <div class="min-w-0">
                                        <p class="text-xs font-bold text-slate-800">${opcao.label}</p>
                                        <p class="text-[11px] text-slate-500 leading-snug mt-0.5">${opcao.descricao}</p>
                                    </div>
                                </label>
                            `).join('')}
                        </div>

                        ${decisaoSalva.atualizado_em ? `
                            <p class="text-[10px] text-slate-400 mt-2 text-right">
                                Registrado por: <b>${decisaoSalva.registrado_por || 'Comando'}</b> em ${formatarDataHoraBR(decisaoSalva.atualizado_em)}
                            </p>
                        ` : ''}
                    </div>
                ` : ''}

                <!-- AÇÕES COMSOC NECESSÁRIAS -->
                <div class="mt-4 pt-4 border-t border-slate-100">
                    <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Ações ComSoc Previstas:</p>
                    <ul class="space-y-1.5">
                        ${evento.acoes_comsoc.map(acao => `
                            <li class="text-xs text-slate-600 flex items-start gap-2">
                                <span class="w-1.5 h-1.5 rounded-full bg-naval-blue mt-1.5 flex-shrink-0"></span>
                                <span>${acao}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>

            <!-- AÇÕES DE RODAPÉ -->
            <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                <button onclick="definirEventoAtivoDoDiretorio('${evento.id}')" 
                    title="Definir este evento como Ativo no Diretório para marcar presenças de autoridades"
                    class="text-xs font-bold text-naval-blue hover:text-naval-light hover:underline flex items-center gap-1.5">
                    <i data-lucide="check-square" class="w-4 h-4"></i>
                    <span>${ehAtivo ? 'Evento Selecionado' : 'Gerenciar RSVP no Diretório'}</span>
                </button>

                <button onclick="switchTab('comsoc'); carregarEventoComsoc('${evento.id}');" 
                    class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1">
                    <i data-lucide="clipboard-list" class="w-3.5 h-3.5 text-slate-500"></i>
                    Checklist ComSoc
                </button>
            </div>
        </div>
    `;
}

// ─────────────────────────────────────────────────────────────────────────────
// VISÃO 3: ESTRUTURA DE DELEGAÇÃO & TRANSIÇÃO (EQUIPE)
// ─────────────────────────────────────────────────────────────────────────────
function renderVisaoEquipe() {
    return `
        <div class="space-y-8">
            <!-- ORGANOGRAMA VISUAL DE DELEGAÇÃO -->
            <div class="bg-gradient-to-br from-slate-900 via-naval-blue to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-premium">
                <div class="text-center max-w-xl mx-auto mb-8">
                    <span class="text-xs font-bold text-naval-accent uppercase tracking-widest">Cadeia Funcional ComSoc CFT</span>
                    <h3 class="text-xl sm:text-2xl font-outfit font-black mt-1">Estrutura de Delegação & Transição</h3>
                    <p class="text-xs text-slate-300 mt-1">Divisão clara de encargos para manter a prontidão da seção e preparar a transição para a reserva.</p>
                </div>

                <!-- CARD DO SUBOFICIAL-MOR (SACRAMENTO) -->
                <div class="max-w-md mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center shadow-lg mb-8 hover:bg-white/15 transition-all">
                    <div class="w-14 h-14 rounded-full bg-naval-accent text-naval-blue flex items-center justify-center font-black text-xl mx-auto mb-3 shadow-md">
                        ⚓
                    </div>
                    <span class="text-[10px] font-bold text-naval-accent uppercase tracking-wider">Supervisão Geral & Comando da Seção</span>
                    <h4 class="text-lg font-outfit font-extrabold text-white mt-0.5">SO-CI-SB SACRAMENTO</h4>
                    <p class="text-xs text-slate-200">Encarregado da ComSoc • Suboficial-Mor (SOMor)</p>
                    <div class="flex justify-center gap-1.5 mt-3 flex-wrap">
                        <span class="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">Articulação c/ Comando</span>
                        <span class="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">Supervisão de Cerimonial</span>
                        <span class="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">Mentoria Contínua</span>
                    </div>
                </div>

                <!-- CONEXÕES VISUAIS -->
                <div class="hidden md:flex justify-center items-center my-[-16px] relative z-10">
                    <div class="w-1/2 border-t-2 border-dashed border-white/30"></div>
                </div>

                <!-- DUPLA DE AUXILIARES: MATHEUS E MARLA -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-4">
                    <!-- SG MATHEUS -->
                    <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg hover:bg-white/15 transition-all">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0">
                                🚢
                            </div>
                            <div>
                                <span class="text-[10px] font-bold text-blue-300 uppercase tracking-wider">Foco Operacional e Logístico</span>
                                <h4 class="text-base font-outfit font-bold text-white">SG-MO MATHEUS</h4>
                                <p class="text-xs text-slate-300">Auxiliar Operacional (ComSoc & Divisão 40)</p>
                            </div>
                        </div>
                        <ul class="text-xs text-slate-200 space-y-2 mt-3 pt-3 border-t border-white/10">
                            <li class="flex items-start gap-2">
                                <span class="text-naval-accent font-bold">•</span>
                                <span><b>Gestão de Meios (Div-40):</b> lanchas, abastecimento e apoio a travessias náuticas (ex: Benjamin Constant).</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-naval-accent font-bold">•</span>
                                <span><b>Som, TI e Cerimonial:</b> teste rigoroso de sonorização, projetores e palanque.</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-naval-accent font-bold">•</span>
                                <span><b>Acervo Audiovisual:</b> fotos em alta resolução salvas organizadamente na rede.</span>
                            </li>
                        </ul>
                    </div>

                    <!-- CB MARLA -->
                    <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg hover:bg-white/15 transition-all">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0">
                                ✍️
                            </div>
                            <div>
                                <span class="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Foco Pedagógico, Cerimonial e Texto</span>
                                <h4 class="text-base font-outfit font-bold text-white">CB-RM2-PD MARLA</h4>
                                <p class="text-xs text-slate-300">Auxiliar Administrativa e de Conteúdo</p>
                            </div>
                        </div>
                        <ul class="text-xs text-slate-200 space-y-2 mt-3 pt-3 border-t border-white/10">
                            <li class="flex items-start gap-2">
                                <span class="text-naval-accent font-bold">•</span>
                                <span><b>Operação Cisne Branco:</b> triagem de redações digitais, pastas físicas e contato com escolas.</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-naval-accent font-bold">•</span>
                                <span><b>Redação Institucional:</b> matérias para a <i>Bússola Amazônica</i>, ofícios e roteiros de locução.</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-naval-accent font-bold">•</span>
                                <span><b>Interlocução Externa:</b> canal direto com SEDUC e secretarias municipais de educação.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- DETALHAMENTO DE ATRIBUIÇÕES POR MILITAR -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                ${EQUIPE_COMSOC_CFT.map(membro => renderCardDetalheMembro(membro)).join('')}
            </div>
        </div>
    `;
}

function renderCardDetalheMembro(membro) {
    // Contar tarefas associadas
    const tarefasMembro = processosData.filter(m => m.responsavel_id === membro.id || (m.responsavel_id === 'conjunto' && membro.id !== 'sacramento'));
    const tarefasConcluidas = tarefasMembro.filter(t => t.status === 'concluido').length;

    return `
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-12 h-12 rounded-xl bg-${membro.cor}-50 text-${membro.cor}-700 border border-${membro.cor}-200 flex items-center justify-center font-bold text-xl flex-shrink-0">
                        <i data-lucide="${membro.icone}" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <h4 class="font-outfit font-extrabold text-slate-800 text-base leading-snug">${membro.nome}</h4>
                        <p class="text-xs text-slate-500 font-semibold">${membro.funcao}</p>
                    </div>
                </div>

                <div class="space-y-2 mb-4">
                    <p class="text-xs text-slate-600 font-medium">${membro.papel}</p>
                </div>

                <div class="mb-4">
                    <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Principais Atribuições:</p>
                    <ul class="space-y-2">
                        ${membro.atribuicoes.map(a => `
                            <li class="text-xs text-slate-600 flex items-start gap-2">
                                <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0"></i>
                                <span>${a}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>

            <!-- CONTADOR DE TAREFAS NA JANELA DE 15 DIAS -->
            <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span class="text-slate-500 font-medium">Metas nos 15 Dias:</span>
                <span class="font-bold text-slate-800 font-outfit bg-slate-100 px-2 py-0.5 rounded-full">
                    ${tarefasConcluidas}/${tarefasMembro.length} Concluídas
                </span>
            </div>
        </div>
    `;
}

// ─────────────────────────────────────────────────────────────────────────────
// VISÃO 4: QUADRO KANBAN
// ─────────────────────────────────────────────────────────────────────────────
function renderVisaoKanban() {
    const colunas = [
        { id: 'pendente',     titulo: 'A Fazer / Pendente', cor: 'slate',   itens: processosData.filter(m => m.status === 'pendente') },
        { id: 'em_andamento', titulo: 'Em Andamento',       cor: 'amber',   itens: processosData.filter(m => m.status === 'em_andamento') },
        { id: 'concluido',    titulo: 'Concluído',          cor: 'emerald', itens: processosData.filter(m => m.status === 'concluido') }
    ];

    return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${colunas.map(col => `
                <div class="bg-slate-50/70 rounded-2xl p-4 border border-slate-200">
                    <div class="flex items-center justify-between gap-2 mb-4 px-1">
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-${col.cor}-500"></span>
                            <h4 class="font-outfit font-extrabold text-slate-800 text-sm">${col.titulo}</h4>
                        </div>
                        <span class="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                            ${col.itens.length}
                        </span>
                    </div>

                    <div class="space-y-3 min-h-[350px]">
                        ${col.itens.length === 0 ? `
                            <div class="text-center py-12 text-slate-400 text-xs italic">
                                Nenhuma ação nesta coluna
                            </div>
                        ` : col.itens.map(meta => `
                            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2">
                                <div class="flex items-start justify-between gap-2">
                                    <span class="text-[10px] font-bold text-slate-400 uppercase">${meta.categoria}</span>
                                    <span class="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">${meta.prazo_label}</span>
                                </div>
                                <h5 class="text-xs font-bold text-slate-800 leading-snug">${meta.titulo}</h5>
                                <p class="text-[11px] text-slate-500 line-clamp-2">${meta.foco}</p>

                                <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                                    <span class="text-[11px] font-semibold text-slate-600 truncate">👤 ${meta.responsavel_nome}</span>
                                    
                                    <!-- AÇÕES DE TRANSIÇÃO -->
                                    <div class="flex items-center gap-1">
                                        ${col.id !== 'pendente' ? `
                                            <button onclick="atualizarStatusMetaProcesso('${meta.id}', 'pendente')" title="Mover para Pendente" class="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100">
                                                ←
                                            </button>
                                        ` : ''}
                                        ${col.id !== 'em_andamento' ? `
                                            <button onclick="atualizarStatusMetaProcesso('${meta.id}', 'em_andamento')" title="Mover para Em Andamento" class="p-1 text-amber-500 hover:text-amber-700 rounded hover:bg-amber-50">
                                                ⚡
                                            </button>
                                        ` : ''}
                                        ${col.id !== 'concluido' ? `
                                            <button onclick="atualizarStatusMetaProcesso('${meta.id}', 'concluido')" title="Mover para Concluído" class="p-1 text-emerald-600 hover:text-emerald-800 rounded hover:bg-emerald-50">
                                                ✓
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ─────────────────────────────────────────────────────────────────────────────
// FUNÇÕES DE AÇÃO E PERSISTÊNCIA
// ─────────────────────────────────────────────────────────────────────────────

async function atualizarStatusMetaProcesso(metaId, novoStatus) {
    const meta = processosData.find(m => m.id === metaId);
    if (!meta) return;

    meta.status = novoStatus;
    meta.atualizado_em = new Date().toISOString();

    if (typeof salvarProcessoComsoc === 'function') {
        await salvarProcessoComsoc(meta);
    } else {
        localStorage.setItem(`comsoc_processos_${(currentOrg && currentOrg.id) || 'cft'}`, JSON.stringify(processosData));
    }

    if (typeof showToast === 'function') {
        showToast(`Meta "${meta.titulo}" atualizada para ${novoStatus.toUpperCase()}!`);
    }

    renderProcessosDashboard();
}

async function registrarDecisaoComando(eventoId, eventoNome, opcaoId, opcaoTitulo) {
    const payload = {
        evento_id: eventoId,
        evento_nome: eventoNome,
        opcao_selecionada: opcaoId,
        opcao_titulo: opcaoTitulo,
        atualizado_em: new Date().toISOString(),
        registrado_por: (currentProfile && currentProfile.nome) ? currentProfile.nome : 'Comandante/ComSoc'
    };

    decisoesData[eventoId] = payload;

    if (typeof salvarDecisaoComsoc === 'function') {
        await salvarDecisaoComsoc(payload);
    } else {
        localStorage.setItem(`comsoc_decisoes_${(currentOrg && currentOrg.id) || 'cft'}`, JSON.stringify(decisoesData));
    }

    if (typeof showToast === 'function') {
        showToast(`Decisão do Comando registrada: "${opcaoTitulo}"`);
    }

    renderProcessosDashboard();
}

async function alternarConclusaoPassoTransicao(passoId) {
    const passoAtual = passosTransicaoData[passoId] || PASSOS_TRANSICAO_PADRAO.find(p => p.passo_id === passoId) || {};
    const novoValor = !passoAtual.concluido;

    const payload = {
        ...passoAtual,
        passo_id: passoId,
        concluido: novoValor,
        atualizado_em: new Date().toISOString()
    };

    passosTransicaoData[passoId] = payload;

    if (typeof salvarPassoTransicao === 'function') {
        await salvarPassoTransicao(payload);
    } else {
        localStorage.setItem(`comsoc_passos_transicao_${(currentOrg && currentOrg.id) || 'cft'}`, JSON.stringify(passosTransicaoData));
    }

    if (typeof showToast === 'function') {
        showToast(`Passo de transição ${novoValor ? 'CONCLUÍDO' : 'PENDENTE'}!`);
    }

    renderProcessosDashboard();
}

function aplicarFiltroResponsavelProcessos(resp) {
    processosFiltroResponsavel = resp;
    renderProcessosDashboard();
}

function aplicarFiltroStatusProcessos(st) {
    processosFiltroStatus = st;
    renderProcessosDashboard();
}

function definirEventoAtivoDoDiretorio(eventoId) {
    if (typeof eventsData === 'undefined') return;
    const ev = eventsData.find(e => e.id === eventoId);
    if (!ev) {
        if (typeof showToast === 'function') showToast('Evento não encontrado na agenda. Sincronize primeiro.', true);
        return;
    }

    activeEventId = eventoId;
    localStorage.setItem('cft_active_event_id_v5', activeEventId);

    if (typeof updateActiveEventBanner === 'function') updateActiveEventBanner();
    if (typeof calculateMetrics === 'function') calculateMetrics();
    if (typeof renderLayout === 'function') renderLayout();

    if (typeof showToast === 'function') {
        showToast(`Evento Ativo alterado para: "${ev.name}"!`);
    }

    // Alternar para a aba do diretório
    switchTab('directory');
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL DE ANOTAÇÕES DE METAS
// ─────────────────────────────────────────────────────────────────────────────
function abrirModalAnotacaoMeta(metaId) {
    const meta = processosData.find(m => m.id === metaId);
    if (!meta) return;

    let modal = document.getElementById('modalAnotacaoMetaProcesso');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalAnotacaoMetaProcesso';
        modal.className = 'fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                    <i data-lucide="edit-3" class="w-5 h-5 text-naval-blue"></i>
                    <h3 class="font-outfit font-bold text-lg text-naval-blue">Anotações da Meta</h3>
                </div>
                <button onclick="fecharModalAnotacaoMeta()" class="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <p class="text-xs text-slate-600 mb-3">
                <b>${meta.titulo}</b> (${meta.prazo_label}) · <b>Resp:</b> ${meta.responsavel_nome}
            </p>

            <div class="mb-4">
                <label class="block text-xs font-bold text-slate-700 mb-1">Anotações / Despacho / Números de Protocolo:</label>
                <textarea id="txtAnotacaoMeta" rows="4" class="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-naval-blue" placeholder="Ex: Protocolo Com9ºDN nº 1234/2026 enviado em 10/10; alinhado com o Imediato...">${meta.anotacoes || ''}</textarea>
            </div>

            <div class="flex justify-end gap-2">
                <button onclick="fecharModalAnotacaoMeta()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl">Cancelar</button>
                <button onclick="salvarAnotacaoMeta('${meta.id}')" class="px-4 py-2 bg-naval-blue hover:bg-naval-light text-white text-xs font-bold rounded-xl shadow-sm">Salvar Anotação</button>
            </div>
        </div>
    `;

    lucide.createIcons();
    modal.classList.remove('hidden');
}

function fecharModalAnotacaoMeta() {
    const modal = document.getElementById('modalAnotacaoMetaProcesso');
    if (modal) modal.classList.add('hidden');
}

async function salvarAnotacaoMeta(metaId) {
    const meta = processosData.find(m => m.id === metaId);
    if (!meta) return;

    const txt = document.getElementById('txtAnotacaoMeta');
    meta.anotacoes = txt ? txt.value.trim() : '';

    if (typeof salvarProcessoComsoc === 'function') {
        await salvarProcessoComsoc(meta);
    } else {
        localStorage.setItem(`comsoc_processos_${(currentOrg && currentOrg.id) || 'cft'}`, JSON.stringify(processosData));
    }

    fecharModalAnotacaoMeta();
    if (typeof showToast === 'function') showToast('Anotação da meta salva com sucesso!');
    renderProcessosDashboard();
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL DE NOVA META / PROCESSO
// ─────────────────────────────────────────────────────────────────────────────
function abrirModalNovaMetaProcesso() {
    let modal = document.getElementById('modalNovaMetaProcesso');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalNovaMetaProcesso';
        modal.className = 'fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                    <i data-lucide="plus-circle" class="w-5 h-5 text-emerald-600"></i>
                    <h3 class="font-outfit font-bold text-lg text-naval-blue">Cadastrar Nova Ação / Meta</h3>
                </div>
                <button onclick="fecharModalNovaMeta()" class="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <form onsubmit="salvarNovaMetaProcesso(event)" class="space-y-4 text-xs">
                <div>
                    <label class="block font-bold text-slate-700 mb-1">Título da Meta *</label>
                    <input type="text" id="novoMetaTitulo" required placeholder="Ex: Envio do Ofício de Confirmação à SOAMAR" class="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-naval-blue">
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">Responsável *</label>
                        <select id="novoMetaResp" required class="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-naval-blue bg-white">
                            <option value="marla">CB Marla (Administrativo)</option>
                            <option value="matheus">SG Matheus (Operacional/Div-40)</option>
                            <option value="conjunto">SG Matheus / CB Marla (Conjunto)</option>
                            <option value="sacramento">SO Sacramento (Supervisão)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">Prazo Crítico *</label>
                        <input type="date" id="novoMetaPrazo" required class="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-naval-blue">
                    </div>
                </div>

                <div>
                    <label class="block font-bold text-slate-700 mb-1">Categoria / Seção</label>
                    <input type="text" id="novoMetaCategoria" placeholder="Ex: Cerimonial & Ofícios, OCB, Logística" class="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-naval-blue">
                </div>

                <div>
                    <label class="block font-bold text-slate-700 mb-1">Detalhamento / Foco da Ação</label>
                    <textarea id="novoMetaFoco" rows="3" placeholder="Descreva os passos necessários e entregas esperadas..." class="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-naval-blue"></textarea>
                </div>

                <div class="flex justify-end gap-2 pt-2">
                    <button type="button" onclick="fecharModalNovaMeta()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl">Cancelar</button>
                    <button type="submit" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm">Cadastrar Ação</button>
                </div>
            </form>
        </div>
    `;

    lucide.createIcons();
    modal.classList.remove('hidden');
}

function fecharModalNovaMeta() {
    const modal = document.getElementById('modalNovaMetaProcesso');
    if (modal) modal.classList.add('hidden');
}

async function salvarNovaMetaProcesso(e) {
    e.preventDefault();
    const titulo = document.getElementById('novoMetaTitulo').value.trim();
    const respId = document.getElementById('novoMetaResp').value;
    const prazo = document.getElementById('novoMetaPrazo').value;
    const categoria = document.getElementById('novoMetaCategoria').value.trim() || 'Geral';
    const foco = document.getElementById('novoMetaFoco').value.trim();

    const respNomes = {
        marla: 'CB Marla',
        matheus: 'SG Matheus (Div-40)',
        conjunto: 'SG Matheus / CB Marla',
        sacramento: 'SO Sacramento'
    };

    const novaMeta = {
        id: 'proc_' + Date.now(),
        ordem: processosData.length + 1,
        titulo,
        responsavel_id: respId,
        responsavel_nome: respNomes[respId] || 'ComSoc',
        prazo_critico: prazo,
        prazo_label: new Date(prazo + 'T12:00:00').toLocaleDateString('pt-BR'),
        categoria,
        foco,
        urgencia: 'media',
        status: 'pendente',
        anotacoes: '',
        criado_em: new Date().toISOString()
    };

    processosData.push(novaMeta);

    if (typeof salvarProcessoComsoc === 'function') {
        await salvarProcessoComsoc(novaMeta);
    } else {
        localStorage.setItem(`comsoc_processos_${(currentOrg && currentOrg.id) || 'cft'}`, JSON.stringify(processosData));
    }

    fecharModalNovaMeta();
    if (typeof showToast === 'function') showToast('Nova ação cadastrada com sucesso!');
    renderProcessosDashboard();
}

// ─────────────────────────────────────────────────────────────────────────────
// IMPRESSÃO / EXPORTAÇÃO DO QUADRO DE ORDENS
// ─────────────────────────────────────────────────────────────────────────────
function imprimirQuadroProcessos() {
    const jan = window.open('', '_blank');
    if (!jan) {
        alert('Por favor, autorize pop-ups para imprimir o quadro.');
        return;
    }

    const agora = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    jan.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Quadro de Ordens — Gestão de Processos ComSoc CFT</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 30px; color: #1e293b; }
                h1, h2, h3 { margin-bottom: 4px; color: #002b5b; }
                .header { text-align: center; border-bottom: 2px solid #002b5b; padding-bottom: 12px; margin-bottom: 20px; }
                .sub { font-size: 12px; color: #64748b; font-weight: bold; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 25px; font-size: 11px; }
                th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
                th { background-color: #f1f5f9; color: #0f172a; font-weight: bold; text-transform: uppercase; font-size: 10px; }
                .badge { font-weight: bold; padding: 2px 6px; border-radius: 4px; font-size: 9px; display: inline-block; }
                .status-pendente { background: #f1f5f9; color: #475569; }
                .status-em_andamento { background: #fef3c7; color: #92400e; }
                .status-concluido { background: #d1fae5; color: #065f46; }
                .section-title { background: #002b5b; color: white; padding: 6px 10px; font-size: 12px; font-weight: bold; border-radius: 4px; margin-top: 20px; }
                @media print {
                    body { margin: 15mm; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>MARINHA DO BRASIL</h2>
                <h3>CAPITANIA FLUVIAL DE TABATINGA</h3>
                <p class="sub">SEÇÃO DE COMUNICAÇÃO SOCIAL (ComSoc) • DIVISÃO 40 (EMBARCAÇÕES E VIATURAS)</p>
                <p style="font-size: 11px; margin-top: 6px;"><b>QUADRO DE ORDENS, DELEGAÇÃO E PROCESSOS — ÚLTIMO TRIMESTRE DE 2026</b></p>
                <p style="font-size: 10px; color: #64748b;">Emitido em: ${agora}</p>
            </div>

            <div class="section-title">1. ESTRUTURA DE DELEGAÇÃO E TRANSIÇÃO</div>
            <table>
                <tr>
                    <th style="width: 25%">Militar</th>
                    <th style="width: 25%">Função / Encargo</th>
                    <th>Principais Responsabilidades</th>
                </tr>
                ${EQUIPE_COMSOC_CFT.map(m => `
                    <tr>
                        <td><b>${m.nome}</b><br><span style="color:#64748b; font-size:10px;">${m.posto_grad}</span></td>
                        <td><b>${m.funcao}</b></td>
                        <td>${m.atribuicoes.join('; ')}</td>
                    </tr>
                `).join('')}
            </table>

            <div class="section-title">2. MATRIZ DE GESTÃO — PRÓXIMOS 15 DIAS (01 A 16 DE OUTUBRO DE 2026)</div>
            <table>
                <tr>
                    <th style="width: 5%">#</th>
                    <th style="width: 28%">Ação / Meta</th>
                    <th style="width: 15%">Prazo Crítico</th>
                    <th style="width: 20%">Responsável</th>
                    <th style="width: 12%">Status</th>
                    <th>Detalhamento</th>
                </tr>
                ${processosData.map(p => `
                    <tr>
                        <td style="text-align: center;">${p.ordem}</td>
                        <td><b>${p.titulo}</b></td>
                        <td>${p.prazo_label}</td>
                        <td>${p.responsavel_nome}</td>
                        <td><span class="badge status-${p.status}">${p.status.toUpperCase()}</span></td>
                        <td>${p.foco}${p.anotacoes ? ` (Obs: ${p.anotacoes})` : ''}</td>
                    </tr>
                `).join('')}
            </table>

            <div class="section-title">3. CALENDÁRIO OFICIAL & DECISÕES DO COMANDO (OUTUBRO A DEZEMBRO DE 2026)</div>
            <table>
                <tr>
                    <th style="width: 12%">Data</th>
                    <th style="width: 25%">Evento / Cerimônia</th>
                    <th style="width: 18%">Horário & Local</th>
                    <th style="width: 10%">Uniforme</th>
                    <th>Decisão do Comando / Diretrizes</th>
                </tr>
                ${CALENDARIO_EVENTOS_2026.map(e => {
                    const dec = decisoesData[e.id];
                    return `
                        <tr>
                            <td><b>${e.date.split('-').reverse().join('/')}</b><br><span style="font-size:10px; color:#64748b;">${e.dia_semana}</span></td>
                            <td><b>${e.name}</b></td>
                            <td>${e.time} • ${e.location}</td>
                            <td><b>${e.uniform}</b></td>
                            <td>
                                <b>Formato:</b> ${e.formato_sugerido}<br>
                                ${dec && dec.opcao_titulo ? `<span style="color: #002b5b; font-weight: bold;">[Decisão]: ${dec.opcao_titulo}</span>` : '<span style="color:#b45309;">[Pendente de Despacho]</span>'}
                            </td>
                        </tr>
                    `;
                }).join('')}
            </table>

            <div style="margin-top: 40px; display: flex; justify-content: space-around; text-align: center; font-size: 11px;">
                <div>
                    ____________________________________________<br>
                    <b>SO-CI-SB SACRAMENTO</b><br>
                    Encarregado da ComSoc • Suboficial-Mor
                </div>
                <div>
                    ____________________________________________<br>
                    <b>COMANDANTE / IMEDIATO</b><br>
                    Capitania Fluvial de Tabatinga
                </div>
            </div>
            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `);
    jan.document.close();
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function obterMesAbrev(dataISO) {
    const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const parts = dataISO.split('-');
    if (parts.length === 3) {
        const m = parseInt(parts[1], 10) - 1;
        return meses[m] || '';
    }
    return '';
}

function formatarDataHoraBR(isoStr) {
    if (!isoStr) return '';
    try {
        const d = new Date(isoStr);
        return d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch(e) {
        return isoStr;
    }
}
