// =============================================================================
// MÓDULO DE BANCO DE DADOS — ComSoc Fase 3 (Firebase Firestore)
// CRUD Firestore para: checklists, releases, clipping, histórico, avaliações, prazos
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// CHECKLIST DE TAREFAS
// ─────────────────────────────────────────────────────────────────────────────

async function carregarChecklistEvento(eventoId) {
    if (!firebaseDb || !currentOrg) return {};
    try {
        const snap = await firebaseDb.collection('comsoc_checklists')
            .where('org_id', '==', currentOrg.id)
            .where('evento_id', '==', eventoId)
            .get();

        const map = {};
        snap.forEach(doc => {
            const item = { id: doc.id, ...doc.data() };
            if (item.tarefa_id) {
                map[item.tarefa_id] = item;
            }
        });
        return map;
    } catch (e) {
        console.error('Erro ao carregar checklist do Firestore:', e);
        return {};
    }
}

async function salvarItemChecklist(eventoId, eventoNome, tarefaId, tarefaNome, fase, status, anotacoes) {
    if (!firebaseDb || !currentOrg || !currentProfile) return;
    try {
        const docId = `${currentOrg.id}_${eventoId}_${tarefaId}`;
        const payload = {
            id: docId,
            org_id: currentOrg.id,
            evento_id: eventoId,
            evento_nome: eventoNome,
            fase,
            tarefa_id: tarefaId,
            tarefa_nome: tarefaNome,
            status,
            anotacoes: anotacoes || '',
            responsavel_nome: currentProfile.nome || '',
            atualizado_em: new Date().toISOString()
        };
        if (status === 'concluido') {
            payload.concluido_em = new Date().toISOString();
            payload.concluido_por = currentProfile.id;
        }

        await firebaseDb.collection('comsoc_checklists').doc(docId).set(payload, { merge: true });

        if (typeof registrarLogAlteracao === 'function') {
            await registrarLogAlteracao('comsoc_checklists', 'editar',
                `Atualizou tarefa "${tarefaNome}" para "${status}" (Evento: ${eventoNome})`);
        }
    } catch (e) {
        console.error('Erro ao salvar item do checklist no Firestore:', e);
        throw e;
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// RELEASES E PRESS RELEASES
// ─────────────────────────────────────────────────────────────────────────────

async function carregarReleasesEvento(eventoId) {
    if (!firebaseDb || !currentOrg) return [];
    try {
        const snap = await firebaseDb.collection('comsoc_releases')
            .where('org_id', '==', currentOrg.id)
            .where('evento_id', '==', eventoId)
            .get();

        const list = [];
        snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
        list.sort((a,b) => (b.criado_em || '').localeCompare(a.criado_em || ''));
        return list;
    } catch (e) {
        console.error('Erro ao carregar releases do Firestore:', e);
        return [];
    }
}

async function salvarRelease(releaseObj) {
    if (!firebaseDb || !currentOrg || !currentProfile) return null;
    try {
        releaseObj.org_id = currentOrg.id;
        releaseObj.criado_por = releaseObj.criado_por || currentProfile.id;
        releaseObj.atualizado_em = new Date().toISOString();

        const docRef = releaseObj.id 
            ? firebaseDb.collection('comsoc_releases').doc(releaseObj.id)
            : firebaseDb.collection('comsoc_releases').doc();

        releaseObj.id = docRef.id;
        if (!releaseObj.criado_em) releaseObj.criado_em = new Date().toISOString();

        await docRef.set(releaseObj, { merge: true });

        if (typeof registrarLogAlteracao === 'function') {
            await registrarLogAlteracao('comsoc_releases', releaseObj.id ? 'editar' : 'inserir',
                `${releaseObj.id ? 'Editou' : 'Criou'} release: "${releaseObj.titulo}" (${releaseObj.tipo})`);
        }
        return releaseObj;
    } catch (e) {
        console.error('Erro ao salvar release no Firestore:', e);
        throw e;
    }
}

async function excluirRelease(releaseId, titulo) {
    if (!firebaseDb || !currentOrg) return;
    try {
        await firebaseDb.collection('comsoc_releases').doc(releaseId).delete();
        if (typeof registrarLogAlteracao === 'function') {
            await registrarLogAlteracao('comsoc_releases', 'deletar', `Excluiu release: "${titulo}"`);
        }
    } catch (e) {
        console.error('Erro ao excluir release no Firestore:', e);
        throw e;
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// CLIPPING DE MÍDIA
// ─────────────────────────────────────────────────────────────────────────────

async function carregarClippingEvento(eventoId) {
    if (!firebaseDb || !currentOrg) return [];
    try {
        const snap = await firebaseDb.collection('comsoc_clipping')
            .where('org_id', '==', currentOrg.id)
            .where('evento_id', '==', eventoId)
            .get();

        const list = [];
        snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
        list.sort((a,b) => (b.data_publicacao || '').localeCompare(a.data_publicacao || ''));
        return list;
    } catch (e) {
        console.error('Erro ao carregar clipping do Firestore:', e);
        return [];
    }
}

async function carregarTodoClipping() {
    if (!firebaseDb || !currentOrg) return [];
    try {
        const snap = await firebaseDb.collection('comsoc_clipping')
            .where('org_id', '==', currentOrg.id)
            .get();

        const list = [];
        snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
        list.sort((a,b) => (b.data_publicacao || '').localeCompare(a.data_publicacao || ''));
        return list;
    } catch (e) {
        console.error('Erro ao carregar todo clipping:', e);
        return [];
    }
}

async function salvarClipping(clippingObj) {
    if (!firebaseDb || !currentOrg) return null;
    try {
        clippingObj.org_id = currentOrg.id;
        const docRef = clippingObj.id 
            ? firebaseDb.collection('comsoc_clipping').doc(clippingObj.id)
            : firebaseDb.collection('comsoc_clipping').doc();

        clippingObj.id = docRef.id;
        if (!clippingObj.criado_em) clippingObj.criado_em = new Date().toISOString();

        await docRef.set(clippingObj, { merge: true });

        if (typeof registrarLogAlteracao === 'function') {
            await registrarLogAlteracao('comsoc_clipping', clippingObj.id ? 'editar' : 'inserir',
                `Registrou clipping: "${clippingObj.titulo_materia}" em "${clippingObj.veiculo}"`);
        }
        return clippingObj;
    } catch (e) {
        console.error('Erro ao salvar clipping no Firestore:', e);
        throw e;
    }
}

async function excluirClipping(clippingId, titulo) {
    if (!firebaseDb || !currentOrg) return;
    try {
        await firebaseDb.collection('comsoc_clipping').doc(clippingId).delete();
        if (typeof registrarLogAlteracao === 'function') {
            await registrarLogAlteracao('comsoc_clipping', 'deletar', `Excluiu clipping: "${titulo}"`);
        }
    } catch (e) {
        console.error('Erro ao excluir clipping do Firestore:', e);
        throw e;
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// REGISTRO HISTÓRICO
// ─────────────────────────────────────────────────────────────────────────────

async function carregarHistoricoEvento(eventoId) {
    if (!firebaseDb || !currentOrg) return null;
    try {
        const docId = `${currentOrg.id}_${eventoId}`;
        const docSnap = await firebaseDb.collection('comsoc_historico').doc(docId).get();
        if (docSnap.exists) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (e) {
        console.error('Erro ao carregar histórico do Firestore:', e);
        return null;
    }
}

async function salvarHistorico(historicoObj) {
    if (!firebaseDb || !currentOrg) return null;
    try {
        historicoObj.org_id = currentOrg.id;
        historicoObj.atualizado_em = new Date().toISOString();
        const docId = `${currentOrg.id}_${historicoObj.evento_id}`;
        historicoObj.id = docId;

        await firebaseDb.collection('comsoc_historico').doc(docId).set(historicoObj, { merge: true });

        if (typeof registrarLogAlteracao === 'function') {
            await registrarLogAlteracao('comsoc_historico', 'editar',
                `Atualizou registro histórico do evento: ${historicoObj.evento_id}`);
        }
        return historicoObj;
    } catch (e) {
        console.error('Erro ao salvar histórico no Firestore:', e);
        throw e;
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// AVALIAÇÃO DE RESULTADOS
// ─────────────────────────────────────────────────────────────────────────────

async function carregarAvaliacaoEvento(eventoId) {
    if (!firebaseDb || !currentOrg) return null;
    try {
        const docId = `${currentOrg.id}_${eventoId}`;
        const docSnap = await firebaseDb.collection('comsoc_avaliacoes').doc(docId).get();
        if (docSnap.exists) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (e) {
        console.error('Erro ao carregar avaliação do Firestore:', e);
        return null;
    }
}

async function carregarTodasAvaliacoes() {
    if (!firebaseDb || !currentOrg) return [];
    try {
        const snap = await firebaseDb.collection('comsoc_avaliacoes')
            .where('org_id', '==', currentOrg.id)
            .get();

        const list = [];
        snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
        return list;
    } catch (e) {
        console.error('Erro ao carregar avaliações do Firestore:', e);
        return [];
    }
}

async function salvarAvaliacao(avaliacaoObj) {
    if (!firebaseDb || !currentOrg) return null;
    try {
        avaliacaoObj.org_id = currentOrg.id;
        const docId = `${currentOrg.id}_${avaliacaoObj.evento_id}`;
        avaliacaoObj.id = docId;
        if (!avaliacaoObj.criado_em) avaliacaoObj.criado_em = new Date().toISOString();

        await firebaseDb.collection('comsoc_avaliacoes').doc(docId).set(avaliacaoObj, { merge: true });

        if (typeof registrarLogAlteracao === 'function') {
            await registrarLogAlteracao('comsoc_avaliacoes', 'editar',
                `Salvou avaliação do evento: ${avaliacaoObj.evento_id}`);
        }
        return avaliacaoObj;
    } catch (e) {
        console.error('Erro ao salvar avaliação no Firestore:', e);
        throw e;
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// PRAZOS SAZONAIS (GRÁFICO DE GANTT)
// ─────────────────────────────────────────────────────────────────────────────

async function carregarPrazosGantt() {
    if (!currentOrg) return [];

    if (firebaseDb) {
        try {
            const snap = await firebaseDb.collection('comsoc_gantt_prazos')
                .where('org_id', '==', currentOrg.id)
                .get();

            const list = [];
            snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
            list.sort((a,b) => (a.data_inicio || '').localeCompare(b.data_inicio || ''));
            return list;
        } catch (e) {
            console.warn('Erro ao ler prazos Gantt do Firestore, recorrendo ao local storage:', e);
        }
    }

    // Fallback para LocalStorage
    try {
        const localData = localStorage.getItem(`comsoc_gantt_prazos_${currentOrg.id}`);
        return localData ? JSON.parse(localData) : [];
    } catch (e) {
        console.error('Erro ao ler do localStorage:', e);
        return [];
    }
}

async function salvarPrazoGantt(prazoObj) {
    if (!currentOrg) return null;
    prazoObj.org_id = currentOrg.id;
    prazoObj.atualizado_em = new Date().toISOString();

    if (firebaseDb) {
        try {
            const docRef = prazoObj.id 
                ? firebaseDb.collection('comsoc_gantt_prazos').doc(prazoObj.id)
                : firebaseDb.collection('comsoc_gantt_prazos').doc();

            prazoObj.id = docRef.id;
            if (!prazoObj.criado_em) prazoObj.criado_em = new Date().toISOString();

            await docRef.set(prazoObj, { merge: true });

            if (typeof registrarLogAlteracao === 'function') {
                await registrarLogAlteracao('comsoc_gantt_prazos', prazoObj.id ? 'editar' : 'inserir',
                    `Salvou prazo sazonal: "${prazoObj.titulo}"`);
            }
            return prazoObj;
        } catch (e) {
            console.warn('Falha ao gravar prazo no Firestore, recorrendo ao local:', e);
        }
    }

    // Fallback para LocalStorage
    try {
        if (!prazoObj.id) {
            prazoObj.id = 'gantt_' + Math.random().toString(36).substr(2, 9);
            prazoObj.criado_em = new Date().toISOString();
        }
        const key = `comsoc_gantt_prazos_${currentOrg.id}`;
        const localData = localStorage.getItem(key);
        let lista = localData ? JSON.parse(localData) : [];
        const index = lista.findIndex(p => p.id === prazoObj.id);
        if (index >= 0) lista[index] = prazoObj;
        else lista.push(prazoObj);
        localStorage.setItem(key, JSON.stringify(lista));
        return prazoObj;
    } catch (e) {
        console.error('Erro ao gravar no localStorage:', e);
        throw e;
    }
}

async function excluirPrazoGantt(prazoId) {
    if (!currentOrg) return;

    if (firebaseDb) {
        try {
            await firebaseDb.collection('comsoc_gantt_prazos').doc(prazoId).delete();
            if (typeof registrarLogAlteracao === 'function') {
                await registrarLogAlteracao('comsoc_gantt_prazos', 'deletar', `Excluiu prazo Gantt ID: ${prazoId}`);
            }
            return;
        } catch (e) {
            console.warn('Falha ao excluir no Firestore:', e);
        }
    }

    try {
        const key = `comsoc_gantt_prazos_${currentOrg.id}`;
        const localData = localStorage.getItem(key);
        if (localData) {
            let lista = JSON.parse(localData);
            lista = lista.filter(p => p.id !== prazoId);
            localStorage.setItem(key, JSON.stringify(lista));
        }
    } catch (e) {
        console.error('Erro ao excluir no localStorage:', e);
        throw e;
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// GESTÃO DE PROCESSOS E METAS (15 DIAS / AUSÊNCIA SOMOR)
// ─────────────────────────────────────────────────────────────────────────────

async function carregarProcessosComsoc() {
    const orgId = (currentOrg && currentOrg.id) ? currentOrg.id : 'cft';

    if (firebaseDb) {
        try {
            const snap = await firebaseDb.collection('comsoc_processos')
                .where('org_id', '==', orgId)
                .get();

            if (!snap.empty) {
                const list = [];
                snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
                list.sort((a,b) => (a.ordem || 99) - (b.ordem || 99));
                return list;
            }
        } catch (e) {
            console.warn('Erro ao ler processos do Firestore, usando fallback local:', e);
        }
    }

    try {
        const localData = localStorage.getItem(`comsoc_processos_${orgId}`);
        return localData ? JSON.parse(localData) : [];
    } catch (e) {
        console.error('Erro ao ler processos do localStorage:', e);
        return [];
    }
}

async function salvarProcessoComsoc(procObj) {
    const orgId = (currentOrg && currentOrg.id) ? currentOrg.id : 'cft';
    const profileNome = (currentProfile && currentProfile.nome) ? currentProfile.nome : 'ComSoc';

    procObj.org_id = orgId;
    procObj.atualizado_em = new Date().toISOString();
    procObj.atualizado_por = profileNome;

    const docId = procObj.id || ('proc_' + Date.now());
    procObj.id = docId;

    if (firebaseDb) {
        try {
            await firebaseDb.collection('comsoc_processos').doc(docId).set(procObj, { merge: true });
            if (typeof registrarLogAlteracao === 'function') {
                await registrarLogAlteracao('comsoc_processos', 'editar',
                    `Atualizou processo "${procObj.titulo}" para "${procObj.status}"`);
            }
        } catch (e) {
            console.warn('Erro ao gravar processo no Firestore, usando fallback local:', e);
        }
    }

    try {
        const key = `comsoc_processos_${orgId}`;
        const localData = localStorage.getItem(key);
        let lista = localData ? JSON.parse(localData) : [];
        const idx = lista.findIndex(p => p.id === docId);
        if (idx >= 0) lista[idx] = procObj;
        else lista.push(procObj);
        localStorage.setItem(key, JSON.stringify(lista));
        return procObj;
    } catch (e) {
        console.error('Erro ao salvar processo no localStorage:', e);
        return procObj;
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// DECISÕES DO COMANDO (CALENDÁRIO DE EVENTOS OUT/DEZ)
// ─────────────────────────────────────────────────────────────────────────────

async function carregarDecisoesComsoc() {
    const orgId = (currentOrg && currentOrg.id) ? currentOrg.id : 'cft';

    if (firebaseDb) {
        try {
            const snap = await firebaseDb.collection('comsoc_decisoes')
                .where('org_id', '==', orgId)
                .get();

            if (!snap.empty) {
                const map = {};
                snap.forEach(doc => {
                    const data = doc.data();
                    map[data.evento_id || doc.id] = { id: doc.id, ...data };
                });
                return map;
            }
        } catch (e) {
            console.warn('Erro ao ler decisões do Firestore, usando fallback local:', e);
        }
    }

    try {
        const localData = localStorage.getItem(`comsoc_decisoes_${orgId}`);
        return localData ? JSON.parse(localData) : {};
    } catch (e) {
        console.error('Erro ao ler decisões do localStorage:', e);
        return {};
    }
}

async function salvarDecisaoComsoc(decisaoObj) {
    const orgId = (currentOrg && currentOrg.id) ? currentOrg.id : 'cft';
    const profileNome = (currentProfile && currentProfile.nome) ? currentProfile.nome : 'Comandante/ComSoc';

    decisaoObj.org_id = orgId;
    decisaoObj.atualizado_em = new Date().toISOString();
    decisaoObj.registrado_por = profileNome;

    const docId = decisaoObj.evento_id || decisaoObj.id || ('dec_' + Date.now());
    decisaoObj.id = docId;

    if (firebaseDb) {
        try {
            await firebaseDb.collection('comsoc_decisoes').doc(docId).set(decisaoObj, { merge: true });
            if (typeof registrarLogAlteracao === 'function') {
                await registrarLogAlteracao('comsoc_decisoes', 'editar',
                    `Registrou decisão para evento "${decisaoObj.evento_nome || docId}": ${decisaoObj.opcao_selecionada}`);
            }
        } catch (e) {
            console.warn('Erro ao gravar decisão no Firestore, usando fallback local:', e);
        }
    }

    try {
        const key = `comsoc_decisoes_${orgId}`;
        const localData = localStorage.getItem(key);
        let mapa = localData ? JSON.parse(localData) : {};
        mapa[docId] = decisaoObj;
        localStorage.setItem(key, JSON.stringify(mapa));
        return decisaoObj;
    } catch (e) {
        console.error('Erro ao salvar decisão no localStorage:', e);
        return decisaoObj;
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// PASSOS PRÁTICOS DE PASSAGEM DE SERVIÇO / TRANSIÇÃO
// ─────────────────────────────────────────────────────────────────────────────

async function carregarPassosTransicao() {
    const orgId = (currentOrg && currentOrg.id) ? currentOrg.id : 'cft';

    if (firebaseDb) {
        try {
            const snap = await firebaseDb.collection('comsoc_passos_transicao')
                .where('org_id', '==', orgId)
                .get();

            if (!snap.empty) {
                const map = {};
                snap.forEach(doc => {
                    const data = doc.data();
                    map[data.passo_id || doc.id] = { id: doc.id, ...data };
                });
                return map;
            }
        } catch (e) {
            console.warn('Erro ao ler passos de transição do Firestore, usando fallback local:', e);
        }
    }

    try {
        const localData = localStorage.getItem(`comsoc_passos_transicao_${orgId}`);
        return localData ? JSON.parse(localData) : {};
    } catch (e) {
        console.error('Erro ao ler passos de transição do localStorage:', e);
        return {};
    }
}

async function salvarPassoTransicao(passoObj) {
    const orgId = (currentOrg && currentOrg.id) ? currentOrg.id : 'cft';
    const profileNome = (currentProfile && currentProfile.nome) ? currentProfile.nome : 'ComSoc';

    passoObj.org_id = orgId;
    passoObj.atualizado_em = new Date().toISOString();
    passoObj.atualizado_por = profileNome;

    const docId = passoObj.passo_id || passoObj.id || ('passo_' + Date.now());
    passoObj.id = docId;

    if (firebaseDb) {
        try {
            await firebaseDb.collection('comsoc_passos_transicao').doc(docId).set(passoObj, { merge: true });
            if (typeof registrarLogAlteracao === 'function') {
                await registrarLogAlteracao('comsoc_passos_transicao', 'editar',
                    `Atualizou passo de transição "${passoObj.titulo}": ${passoObj.concluido ? 'Concluído' : 'Pendente'}`);
            }
        } catch (e) {
            console.warn('Erro ao salvar passo no Firestore, usando fallback local:', e);
        }
    }

    try {
        const key = `comsoc_passos_transicao_${orgId}`;
        const localData = localStorage.getItem(key);
        let mapa = localData ? JSON.parse(localData) : {};
        mapa[docId] = passoObj;
        localStorage.setItem(key, JSON.stringify(mapa));
        return passoObj;
    } catch (e) {
        console.error('Erro ao salvar passo no localStorage:', e);
        return passoObj;
    }
}
