-- =============================================================================
-- MIGRAÇÃO SUPABASE — Sistema Eletrônico de Votação (SEV-CFT)
-- Execute este script no SQL Editor do seu projeto Supabase:
-- https://supabase.com/dashboard/project/<SEU-PROJETO>/sql
-- =============================================================================

-- 1. TABELA DE EVENTOS DE VOTAÇÃO
CREATE TABLE IF NOT EXISTS public.sev_eventos (
    id          TEXT PRIMARY KEY,
    nome        TEXT NOT NULL,
    tipo        TEXT NOT NULL,
    data        TEXT NOT NULL,
    status      TEXT NOT NULL CHECK (status IN ('rascunho', 'ativo', 'encerrado')),
    descricao   TEXT,
    criado_em   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.sev_eventos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública de eventos" ON public.sev_eventos FOR SELECT USING (true);
CREATE POLICY "Gestão total de eventos" ON public.sev_eventos FOR ALL USING (true); -- Permite operações do admin

-- 2. TABELA DE OFICIAIS (ELEITORES)
CREATE TABLE IF NOT EXISTS public.sev_eleitores (
    id              TEXT PRIMARY KEY,
    evento_id       TEXT REFERENCES public.sev_eventos(id) ON DELETE CASCADE,
    nome_completo   TEXT NOT NULL,
    posto           TEXT NOT NULL,
    especialidade   TEXT,
    nip             TEXT NOT NULL,
    votou           BOOLEAN DEFAULT false,
    antiguidade     SMALLINT DEFAULT 9999
);

ALTER TABLE public.sev_eleitores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública de eleitores" ON public.sev_eleitores FOR SELECT USING (true);
CREATE POLICY "Atualização pública de eleitor (voto)" ON public.sev_eleitores FOR UPDATE USING (true);
CREATE POLICY "Gestão total de eleitores" ON public.sev_eleitores FOR ALL USING (true);

-- 3. TABELA DE CANDIDATOS
CREATE TABLE IF NOT EXISTS public.sev_candidatos (
    id              TEXT PRIMARY KEY,
    evento_id       TEXT REFERENCES public.sev_eventos(id) ON DELETE CASCADE,
    nome            TEXT NOT NULL,
    posto           TEXT NOT NULL,
    especialidade   TEXT,
    nip             TEXT NOT NULL,
    numero          SMALLINT NOT NULL,
    foto            TEXT, -- Base64 da imagem
    grupo           TEXT NOT NULL CHECK (grupo IN ('so', 'cb'))
);

ALTER TABLE public.sev_candidatos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública de candidatos" ON public.sev_candidatos FOR SELECT USING (true);
CREATE POLICY "Gestão total de candidatos" ON public.sev_candidatos FOR ALL USING (true);

-- 4. TABELA DE URNA (VOTOS COMPUTADOS)
CREATE TABLE IF NOT EXISTS public.sev_votos (
    id              TEXT PRIMARY KEY,
    evento_id       TEXT REFERENCES public.sev_eventos(id) ON DELETE CASCADE,
    eleitor         TEXT NOT NULL,
    candidato_so    TEXT,
    candidato_cb    TEXT,
    data            TEXT NOT NULL,
    hora            TEXT NOT NULL,
    timestamp       BIGINT NOT NULL
);

ALTER TABLE public.sev_votos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública de votos" ON public.sev_votos FOR SELECT USING (true);
CREATE POLICY "Inserção pública de votos" ON public.sev_votos FOR INSERT WITH CHECK (true);
CREATE POLICY "Gestão total de votos" ON public.sev_votos FOR ALL USING (true);

-- 5. TABELA DE LOGS DE SEGURANÇA
CREATE TABLE IF NOT EXISTS public.sev_logs (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    evento_id       TEXT REFERENCES public.sev_eventos(id) ON DELETE CASCADE,
    tipo            TEXT NOT NULL,
    descricao       TEXT NOT NULL,
    data            TEXT NOT NULL,
    hora            TEXT NOT NULL,
    timestamp       BIGINT NOT NULL
);

ALTER TABLE public.sev_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública de logs" ON public.sev_logs FOR SELECT USING (true);
CREATE POLICY "Inserção pública de logs" ON public.sev_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Gestão total de logs" ON public.sev_logs FOR ALL USING (true);

-- 6. TABELA DE HISTÓRICO DE ELEIÇÕES CONCLUÍDAS
CREATE TABLE IF NOT EXISTS public.sev_historico (
    id              TEXT PRIMARY KEY,
    nome            TEXT NOT NULL,
    periodo         TEXT NOT NULL,
    data            TEXT NOT NULL,
    evento_id       TEXT,
    total_votos     INTEGER NOT NULL,
    total_eleitores INTEGER NOT NULL,
    vencedor_so     TEXT NOT NULL,
    vencedor_cb     TEXT NOT NULL,
    snap_so         JSONB NOT NULL,
    snap_cb         JSONB NOT NULL,
    registrado_em   TEXT NOT NULL
);

ALTER TABLE public.sev_historico ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública de histórico" ON public.sev_historico FOR SELECT USING (true);
CREATE POLICY "Gestão total de histórico" ON public.sev_historico FOR ALL USING (true);
