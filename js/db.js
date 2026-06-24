// Módulo de Manipulação de Dados no Supabase (Multi-Inquilino e Auditoria)

// --- MÓDULO DE LOGS DE AUDITORIA ---
async function registrarLogAlteracao(tabela, acao, detalhes) {
    if (!supabaseClient || !currentProfile || !currentOrg) return;

    try {
        await supabaseClient
            .from('historico_alteracoes')
            .insert({
                org_id: currentOrg.id,
                usuario_id: currentProfile.id,
                usuario_nome: currentProfile.nome,
                org_nome: currentOrg.nome_curto,
                tabela: tabela,
                acao: acao,
                detalhes: detalhes
            });
    } catch (e) {
        console.error("Erro ao registrar log de auditoria:", e);
    }
}

// Obter logs recentes da região (compartilhado)
async function obterLogsAuditoriaRegiao() {
    if (!supabaseClient) return [];

    try {
        const { data, error } = await supabaseClient
            .from('historico_alteracoes')
            .select('*')
            .order('criado_em', { ascending: false })
            .limit(30);

        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error("Erro ao carregar logs de auditoria:", e);
        return [];
    }
}


// --- CRUD DE CONFIGURAÇÕES DE IDENTIDADE DO COMSOC ---
async function salvarIdentidadeVisualNuvem(unitConfig) {
    if (!supabaseClient || !currentOrg) return;

    try {
        const { error } = await supabaseClient
            .from('organizacoes')
            .update({
                nome_curto: unitConfig.shortName,
                nome_completo: unitConfig.fullName,
                orgao_superior: unitConfig.parentOrg,
                slogan: unitConfig.slogan,
                tema: unitConfig.theme,
                logo_base64: unitConfig.logoBase64
            })
            .eq('id', currentOrg.id);

        if (error) throw error;

        // Atualizar organização em cache local
        currentOrg.nome_curto = unitConfig.shortName;
        currentOrg.nome_completo = unitConfig.fullName;
        currentOrg.orgao_superior = unitConfig.parentOrg;
        currentOrg.slogan = unitConfig.slogan;
        currentOrg.tema = unitConfig.theme;
        currentOrg.logo_base64 = unitConfig.logoBase64;

        await registrarLogAlteracao('organizacoes', 'editar', `Atualizou a identidade visual do ComSoc: ${unitConfig.shortName}`);
    } catch (e) {
        console.error("Erro ao salvar identidade visual na nuvem:", e);
        throw e;
    }
}


// --- CRUD DE CONTATOS (AUTORIDADES) ---

// Carregar contatos (próprios + compartilhados da região)
async function carregarContatosNuvem() {
    if (!supabaseClient || !currentOrg) return [];

    try {
        // Puxar contatos do próprio órgão OU contatos de outros órgãos com compartilhar = true
        const { data, error } = await supabaseClient
            .from('contatos_v5')
            .select('*');

        if (error) throw error;

        // Filtragem no cliente (caso o RLS ainda não esteja aplicando a regra estrita)
        // Regra: Meus contatos OU (Contatos de outros com compartilhar == true)
        const contatosFiltrados = (data || []).filter(c => 
            c.org_id === currentOrg.id || c.compartilhar === true
        );

        return contatosFiltrados.map(c => {
            c.no = Number(c.no);
            return c;
        });
    } catch (e) {
        console.error("Erro ao carregar contatos da nuvem:", e);
        throw e;
    }
}

// Salvar ou Editar Contato
async function salvarContatoNuvem(contactObj, isEdit = false) {
    if (!supabaseClient || !currentOrg || !currentProfile) return;

    // Clonar o objeto para não modificar o objeto original em uso na UI
    const dbContact = { ...contactObj };

    // Garantir amarração da organização atual
    dbContact.org_id = currentOrg.id;
    if (isEdit) {
        dbContact.atualizado_por = currentProfile.id;
        dbContact.atualizado_em = new Date().toISOString();
    } else {
        dbContact.criado_por = currentProfile.id;
        dbContact.atualizado_por = currentProfile.id;
    }

    // Remover campos de controle de UI/Client-side que não existem na tabela do banco
    delete dbContact.rsvpByEvent;
    delete dbContact.notesByEvent;
    delete dbContact.rsvp;

    try {
        const { error } = await supabaseClient
            .from('contatos_v5')
            .upsert(dbContact);

        if (error) throw error;

        const acao = isEdit ? 'editar' : 'inserir';
        const detalhes = `${isEdit ? 'Editou' : 'Cadastrou'} a autoridade: ${contactObj.name} (${contactObj.role})`;
        await registrarLogAlteracao('contatos_v5', acao, detalhes);
    } catch (e) {
        console.error("Erro ao salvar contato no Supabase:", e);
        throw e;
    }
}

// Excluir Contato
async function excluirContatoNuvem(contactId, contactNo, contactName) {
    if (!supabaseClient || !currentOrg) return;

    try {
        const { error } = await supabaseClient
            .from('contatos_v5')
            .delete()
            .eq('id', contactId)
            .eq('org_id', currentOrg.id); // Segurança: só deleta do próprio órgão

        if (error) throw error;

        await registrarLogAlteracao('contatos_v5', 'deletar', `Excluiu a autoridade: ${contactName} (Nº Registro: ${contactNo})`);
    } catch (e) {
        console.error("Erro ao excluir contato no Supabase:", e);
        throw e;
    }
}


// --- CRUD DE EVENTOS ---

// Carregar eventos (próprios + compartilhados da região)
async function carregarEventosNuvem() {
    if (!supabaseClient || !currentOrg) return [];

    try {
        const { data, error } = await supabaseClient
            .from('eventos_v5')
            .select('*');

        if (error) throw error;

        // Filtrar: Meus eventos OU (Eventos de outros com compartilhar == true)
        const eventosFiltrados = (data || []).filter(e => 
            e.org_id === currentOrg.id || e.compartilhar === true
        );

        return eventosFiltrados;
    } catch (e) {
        console.error("Erro ao carregar eventos da nuvem:", e);
        throw e;
    }
}

// Salvar ou Editar Evento
async function salvarEventoNuvem(eventObj, isEdit = false) {
    if (!supabaseClient || !currentOrg || !currentProfile) return;

    eventObj.org_id = currentOrg.id;
    if (!isEdit) {
        eventObj.criado_por = currentProfile.id;
    }

    try {
        const { error } = await supabaseClient
            .from('eventos_v5')
            .upsert(eventObj);

        if (error) throw error;

        const acao = isEdit ? 'editar' : 'inserir';
        const detalhes = `${isEdit ? 'Editou' : 'Criou'} o evento: ${eventObj.name} (Data: ${eventObj.date})`;
        await registrarLogAlteracao('eventos_v5', acao, detalhes);
    } catch (e) {
        console.error("Erro ao salvar evento no Supabase:", e);
        throw e;
    }
}

// Excluir Evento
async function excluirEventoNuvem(eventId, eventName) {
    if (!supabaseClient || !currentOrg) return;

    try {
        const { error } = await supabaseClient
            .from('eventos_v5')
            .delete()
            .eq('id', eventId)
            .eq('org_id', currentOrg.id); // Segurança: só deleta do próprio órgão

        if (error) throw error;

        await registrarLogAlteracao('eventos_v5', 'deletar', `Excluiu o evento: ${eventName}`);
    } catch (e) {
        console.error("Erro ao excluir evento no Supabase:", e);
        throw e;
    }
}


// --- CONTROLE DE CONVITES DE EVENTOS (RSVP AVANÇADO) ---

// Carregar convites de um evento específico
async function carregarConvitesEvento(eventId) {
    if (!supabaseClient) return [];

    try {
        const { data, error } = await supabaseClient
            .from('convites_eventos')
            .select(`
                *,
                contatos_v5 (
                    id,
                    name,
                    role,
                    email,
                    phone
                )
            `)
            .eq('evento_id', eventId);

        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error("Erro ao carregar convites do evento:", e);
        return [];
    }
}

// Enviar / Atualizar Convite de Evento
async function salvarConviteEvento(conviteObj) {
    if (!supabaseClient || !currentProfile) return;

    conviteObj.atualizado_por = currentProfile.id;
    conviteObj.atualizado_em = new Date().toISOString();

    try {
        const { error } = await supabaseClient
            .from('convites_eventos')
            .upsert(conviteObj);

        if (error) throw error;

        await registrarLogAlteracao('convites_eventos', 'editar', `Atualizou status do convite (Contato ID: ${conviteObj.contato_id}) para: ${conviteObj.status}`);
    } catch (e) {
        console.error("Erro ao salvar convite de evento:", e);
        throw e;
    }
}
