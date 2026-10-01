// Módulo de Manipulação de Dados no Firebase Firestore (Multi-Inquilino e Auditoria)

// --- MÓDULO DE LOGS DE AUDITORIA ---
async function registrarLogAlteracao(tabela, acao, detalhes) {
    if (!firebaseDb || !currentProfile || !currentOrg) return;

    try {
        await firebaseDb.collection('historico_alteracoes').add({
            org_id: currentOrg.id,
            usuario_id: currentProfile.id,
            usuario_nome: currentProfile.nome || '',
            org_nome: currentOrg.nome_curto || '',
            tabela: tabela,
            acao: acao,
            detalhes: detalhes,
            criado_em: new Date().toISOString()
        });
    } catch (e) {
        console.warn("Erro ao registrar log de auditoria no Firestore:", e);
    }
}

// Obter logs recentes da região (compartilhado)
async function obterLogsAuditoriaRegiao() {
    if (!firebaseDb) return [];

    try {
        const snap = await firebaseDb.collection('historico_alteracoes')
            .orderBy('criado_em', 'desc')
            .limit(30)
            .get();

        const logs = [];
        snap.forEach(doc => {
            logs.push({ id: doc.id, ...doc.data() });
        });
        return logs;
    } catch (e) {
        console.warn("Erro ao carregar logs de auditoria:", e);
        return [];
    }
}


// --- CRUD DE CONFIGURAÇÕES DE IDENTIDADE DO COMSOC ---
async function salvarIdentidadeVisualNuvem(unitConfig) {
    if (!firebaseDb || !currentOrg) return;

    try {
        const payload = {
            nome_curto: unitConfig.shortName,
            nome_completo: unitConfig.fullName,
            orgao_superior: unitConfig.parentOrg,
            slogan: unitConfig.slogan,
            tema: unitConfig.theme,
            logo_base64: unitConfig.logoBase64 || '',
            localizacao: unitConfig.locationName || '',
            atualizado_em: new Date().toISOString()
        };

        await firebaseDb.collection('organizacoes').doc(currentOrg.id).set(payload, { merge: true });

        // Atualizar organização em cache local
        Object.assign(currentOrg, payload);

        await registrarLogAlteracao('organizacoes', 'editar', `Atualizou a identidade visual do ComSoc: ${unitConfig.shortName}`);
    } catch (e) {
        console.error("Erro ao salvar identidade visual no Firestore:", e);
        throw e;
    }
}


// Semeador em lote de contatos oficiais no Firestore
async function seederContatosIniciaisFirestore(initialData) {
    if (!firebaseDb || !currentOrg) return;
    try {
        console.log("[Firestore] Semeando autoridades oficiais no Firestore...");
        const batch = firebaseDb.batch();
        let count = 0;
        for (const c of initialData) {
            if (count >= 400) break; // limite de segurança por batch
            const docId = (c.no || c.id || ('ct_' + count)).toString();
            const ref = firebaseDb.collection('contatos_v5').doc(docId);
            const dbContact = { ...c };
            dbContact.id = docId;
            dbContact.no = Number(c.no);
            dbContact.org_id = currentOrg.id;
            delete dbContact.rsvpByEvent;
            delete dbContact.notesByEvent;
            delete dbContact.rsvp;
            batch.set(ref, dbContact, { merge: true });
            count++;
        }
        await batch.commit();
        console.log(`[Firestore] ${count} autoridades oficiais semeadas com sucesso na nuvem.`);
    } catch (e) {
        console.warn("[Firestore] Semeamento em nuvem pendente de regras no console:", e.message || e);
    }
}

// --- CRUD DE CONTATOS (AUTORIDADES) ---

// Carregar contatos (próprios + compartilhados da região)
async function carregarContatosNuvem() {
    let contatos = [];
    if (firebaseDb && currentOrg) {
        try {
            const snap = await firebaseDb.collection('contatos_v5').get();
            const todosContatos = [];
            snap.forEach(doc => {
                const data = doc.data();
                data.id = data.id || doc.id;
                data.no = Number(data.no);
                todosContatos.push(data);
            });

            if (todosContatos.length > 0) {
                // Filtragem: Meus contatos OU (Contatos de outros com compartilhar == true)
                contatos = todosContatos.filter(c => 
                    c.org_id === currentOrg.id || c.compartilhar === true
                );
            } else if (typeof initialContactsData !== 'undefined' && initialContactsData.length > 0) {
                // Nuvem vazia: semear contatos iniciais no Firestore
                console.log("[Firestore] Coleção contatos_v5 vazia na nuvem. Semeando dados oficiais...");
                seederContatosIniciaisFirestore(initialContactsData);
                contatos = initialContactsData.map(c => ({ ...c, org_id: currentOrg.id }));
            }
        } catch (e) {
            console.warn("[Firestore] Aviso ao carregar contatos da nuvem (ativando modo local):", e.message || e);
        }
    }

    // Se a nuvem não retornou contatos (permissão ou offline), resgata cache ou base oficial
    if (contatos.length === 0) {
        const stored = localStorage.getItem('cft_contacts_v5');
        if (stored) {
            try {
                contatos = JSON.parse(stored);
            } catch(err) {}
        }
    }

    if (contatos.length === 0 && typeof initialContactsData !== 'undefined') {
        const orgId = currentOrg ? currentOrg.id : 'cft';
        contatos = initialContactsData.map(c => ({ ...c, org_id: orgId }));
    }

    return contatos;
}

// Salvar ou Editar Contato
async function salvarContatoNuvem(contactObj, isEdit = false) {
    const orgId = currentOrg ? currentOrg.id : 'cft';
    const profileId = currentProfile ? currentProfile.id : 'sistema';

    const dbContact = { ...contactObj };
    dbContact.org_id = orgId;

    if (isEdit) {
        dbContact.atualizado_por = profileId;
        dbContact.atualizado_em = new Date().toISOString();
    } else {
        dbContact.criado_por = profileId;
        dbContact.atualizado_por = profileId;
        dbContact.criado_em = new Date().toISOString();
    }

    // Remover campos de controle de UI locais
    delete dbContact.rsvpByEvent;
    delete dbContact.notesByEvent;
    delete dbContact.rsvp;

    const docId = (dbContact.id || dbContact.no || Date.now()).toString();
    dbContact.id = docId;

    if (firebaseDb) {
        try {
            await firebaseDb.collection('contatos_v5').doc(docId).set(dbContact, { merge: true });

            const acao = isEdit ? 'editar' : 'inserir';
            const detalhes = `${isEdit ? 'Editou' : 'Cadastrou'} a autoridade: ${contactObj.name} (${contactObj.role})`;
            await registrarLogAlteracao('contatos_v5', acao, detalhes);
        } catch (e) {
            console.warn("[Firestore] Não foi possível salvar contato na nuvem (permissão ou offline):", e.message);
        }
    }
}

// Excluir Contato
async function excluirContatoNuvem(contactId, contactNo, contactName) {
    if (firebaseDb) {
        try {
            const docId = (contactId || contactNo).toString();
            await firebaseDb.collection('contatos_v5').doc(docId).delete();
            await registrarLogAlteracao('contatos_v5', 'deletar', `Excluiu a autoridade: ${contactName} (Nº Registro: ${contactNo})`);
        } catch (e) {
            console.warn("[Firestore] Não foi possível excluir contato na nuvem:", e.message);
        }
    }
}


// --- CRUD DE EVENTOS ---

// Carregar eventos (próprios + compartilhados da região)
async function carregarEventosNuvem() {
    let eventos = [];
    if (firebaseDb && currentOrg) {
        try {
            const snap = await firebaseDb.collection('eventos_v5').get();
            const todosEventos = [];
            snap.forEach(doc => {
                const data = doc.data();
                data.id = data.id || doc.id;
                todosEventos.push(data);
            });

            if (todosEventos.length > 0) {
                eventos = todosEventos.filter(e => 
                    e.org_id === currentOrg.id || e.compartilhar === true
                );
            }
        } catch (e) {
            console.warn("[Firestore] Aviso ao carregar eventos da nuvem:", e.message || e);
        }
    }

    if (eventos.length === 0) {
        const stored = localStorage.getItem('cft_events_v5');
        if (stored) {
            try {
                eventos = JSON.parse(stored);
            } catch(err) {}
        }
    }

    if (eventos.length === 0) {
        eventos = [{ id: 'evt-default', name: 'Evento Geral CFT 2026', date: '2026-12-31' }];
    }

    return eventos;
}

// Salvar ou Editar Evento
async function salvarEventoNuvem(eventObj, isEdit = false) {
    const orgId = currentOrg ? currentOrg.id : 'cft';
    const profileId = currentProfile ? currentProfile.id : 'sistema';

    eventObj.org_id = orgId;
    if (!isEdit) {
        eventObj.criado_por = profileId;
        eventObj.criado_em = new Date().toISOString();
    }
    eventObj.atualizado_em = new Date().toISOString();

    const docId = (eventObj.id || 'evt_' + Date.now()).toString();
    eventObj.id = docId;

    if (firebaseDb) {
        try {
            await firebaseDb.collection('eventos_v5').doc(docId).set(eventObj, { merge: true });

            const acao = isEdit ? 'editar' : 'inserir';
            const detalhes = `${isEdit ? 'Editou' : 'Criou'} o evento: ${eventObj.name} (Data: ${eventObj.date})`;
            await registrarLogAlteracao('eventos_v5', acao, detalhes);
        } catch (e) {
            console.warn("[Firestore] Não foi possível salvar evento na nuvem:", e.message);
        }
    }
}

// Excluir Evento
async function excluirEventoNuvem(eventId, eventName) {
    if (firebaseDb) {
        try {
            await firebaseDb.collection('eventos_v5').doc(eventId.toString()).delete();
            await registrarLogAlteracao('eventos_v5', 'deletar', `Excluiu o evento: ${eventName}`);
        } catch (e) {
            console.warn("[Firestore] Não foi possível excluir evento na nuvem:", e.message);
        }
    }
}


// --- CONTROLE DE CONVITES DE EVENTOS (RSVP AVANÇADO) ---

// Carregar convites de um evento específico
async function carregarConvitesEvento(eventId) {
    if (!firebaseDb) return [];

    try {
        const snap = await firebaseDb.collection('convites_eventos')
            .where('evento_id', '==', eventId)
            .get();

        const convites = [];
        snap.forEach(doc => {
            convites.push({ id: doc.id, ...doc.data() });
        });
        return convites;
    } catch (e) {
        console.warn("[Firestore] Aviso ao carregar convites do evento:", e.message || e);
        return [];
    }
}

// Enviar / Atualizar Convite de Evento
async function salvarConviteEvento(conviteObj) {
    if (!firebaseDb || !currentProfile) return;

    conviteObj.atualizado_por = currentProfile.id;
    conviteObj.atualizado_em = new Date().toISOString();

    const docId = (conviteObj.id || `${conviteObj.evento_id}_${conviteObj.contato_id}`).toString();
    conviteObj.id = docId;

    try {
        await firebaseDb.collection('convites_eventos').doc(docId).set(conviteObj, { merge: true });
        await registrarLogAlteracao('convites_eventos', 'editar', `Atualizou status do convite (Contato ID: ${conviteObj.contato_id}) para: ${conviteObj.status}`);
    } catch (e) {
        console.warn("[Firestore] Aviso ao salvar convite de evento:", e.message);
    }
}
