-- =============================================================================
-- MIGRAÇÃO SUPABASE — ComSoc Fase 3
-- Execute este script no SQL Editor do painel Supabase:
-- https://supabase.com/dashboard/project/<SEU-PROJECT>/sql
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. CHECKLISTS DE TAREFAS POR EVENTO
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comsoc_checklists (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id          UUID NOT NULL,
    evento_id       TEXT,
    evento_nome     TEXT,
    fase            TEXT NOT NULL CHECK (fase IN ('planejamento','execucao','pos_evento','gestao_institucional','apoio_operacional','gestao_crise')),
    tarefa_id       TEXT NOT NULL,
    tarefa_nome     TEXT NOT NULL,
    status          TEXT DEFAULT 'pendente' CHECK (status IN ('pendente','em_andamento','concluido','nao_aplicavel')),
    anotacoes       TEXT,
    responsavel_nome TEXT,
    concluido_em    TIMESTAMPTZ,
    concluido_por   UUID,
    criado_em       TIMESTAMPTZ DEFAULT now(),
    atualizado_em   TIMESTAMPTZ DEFAULT now(),
    UNIQUE (org_id, evento_id, tarefa_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_comsoc_checklists_org ON public.comsoc_checklists(org_id);
CREATE INDEX IF NOT EXISTS idx_comsoc_checklists_evento ON public.comsoc_checklists(evento_id);

-- Row Level Security (RLS)
ALTER TABLE public.comsoc_checklists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso total comsoc_checklists" ON public.comsoc_checklists;
CREATE POLICY "Acesso total comsoc_checklists" ON public.comsoc_checklists
    FOR ALL USING (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. RELEASES E PRESS RELEASES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comsoc_releases (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id          UUID NOT NULL,
    evento_id       TEXT,
    tipo            TEXT NOT NULL CHECK (tipo IN ('aviso_pauta','release_pos')),
    titulo          TEXT,
    lead            TEXT,
    corpo           TEXT,
    enquadramento   TEXT,
    status          TEXT DEFAULT 'rascunho' CHECK (status IN ('rascunho','aprovado','enviado')),
    criado_por      UUID,
    criado_em       TIMESTAMPTZ DEFAULT now(),
    atualizado_em   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comsoc_releases_org ON public.comsoc_releases(org_id);
CREATE INDEX IF NOT EXISTS idx_comsoc_releases_evento ON public.comsoc_releases(evento_id);

ALTER TABLE public.comsoc_releases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso total comsoc_releases" ON public.comsoc_releases;
CREATE POLICY "Acesso total comsoc_releases" ON public.comsoc_releases
    FOR ALL USING (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. CLIPPING DE MÍDIA
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comsoc_clipping (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id          UUID NOT NULL,
    evento_id       TEXT,
    veiculo         TEXT NOT NULL,
    tipo_veiculo    TEXT CHECK (tipo_veiculo IN ('tv','radio','site','jornal','rede_social')),
    titulo_materia  TEXT,
    link_url        TEXT,
    data_publicacao DATE,
    sentimento      TEXT DEFAULT 'neutro' CHECK (sentimento IN ('positivo','neutro','negativo')),
    observacoes     TEXT,
    criado_em       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comsoc_clipping_org ON public.comsoc_clipping(org_id);
CREATE INDEX IF NOT EXISTS idx_comsoc_clipping_evento ON public.comsoc_clipping(evento_id);
CREATE INDEX IF NOT EXISTS idx_comsoc_clipping_data ON public.comsoc_clipping(data_publicacao);

ALTER TABLE public.comsoc_clipping ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso total comsoc_clipping" ON public.comsoc_clipping;
CREATE POLICY "Acesso total comsoc_clipping" ON public.comsoc_clipping
    FOR ALL USING (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. REGISTRO HISTÓRICO
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comsoc_historico (
    id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id                  UUID NOT NULL,
    evento_id               TEXT,
    narrativa               TEXT,
    autoridades_presentes   TEXT,
    destaques               TEXT,
    criado_em               TIMESTAMPTZ DEFAULT now(),
    atualizado_em           TIMESTAMPTZ DEFAULT now(),
    UNIQUE (org_id, evento_id)
);

CREATE INDEX IF NOT EXISTS idx_comsoc_historico_org ON public.comsoc_historico(org_id);

ALTER TABLE public.comsoc_historico ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso total comsoc_historico" ON public.comsoc_historico;
CREATE POLICY "Acesso total comsoc_historico" ON public.comsoc_historico
    FOR ALL USING (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. AVALIAÇÃO DE RESULTADOS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comsoc_avaliacoes (
    id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id              UUID NOT NULL,
    evento_id           TEXT,
    nota_planejamento   SMALLINT CHECK (nota_planejamento BETWEEN 0 AND 5),
    nota_execucao       SMALLINT CHECK (nota_execucao BETWEEN 0 AND 5),
    nota_pos_evento     SMALLINT CHECK (nota_pos_evento BETWEEN 0 AND 5),
    pontos_positivos    TEXT,
    pontos_negativos    TEXT,
    licoes_aprendidas   TEXT,
    criado_em           TIMESTAMPTZ DEFAULT now(),
    UNIQUE (org_id, evento_id)
);

CREATE INDEX IF NOT EXISTS idx_comsoc_avaliacoes_org ON public.comsoc_avaliacoes(org_id);

ALTER TABLE public.comsoc_avaliacoes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso total comsoc_avaliacoes" ON public.comsoc_avaliacoes;
CREATE POLICY "Acesso total comsoc_avaliacoes" ON public.comsoc_avaliacoes
    FOR ALL USING (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────────────────────────────────────
-- 6. PRAZOS SAZONAIS (GRÁFICO DE GANTT)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comsoc_gantt_prazos (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id          UUID NOT NULL,
    titulo          TEXT NOT NULL,
    descricao       TEXT,
    data_inicio     DATE NOT NULL,
    data_fim        DATE NOT NULL,
    categoria       TEXT DEFAULT 'administrativo' CHECK (categoria IN ('administrativo', 'evento', 'campanha')),
    responsavel     TEXT,
    criado_em       TIMESTAMPTZ DEFAULT now(),
    atualizado_em   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comsoc_gantt_prazos_org ON public.comsoc_gantt_prazos(org_id);

ALTER TABLE public.comsoc_gantt_prazos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acesso total comsoc_gantt_prazos" ON public.comsoc_gantt_prazos;
CREATE POLICY "Acesso total comsoc_gantt_prazos" ON public.comsoc_gantt_prazos
    FOR ALL USING (auth.role() = 'authenticated');




-- =============================================================================
-- MIGRAÇÃO ADICIONAL — Módulos Habilitados e Reset de Senha (Super Admin)
-- Execute este script APÓS o anterior, no SQL Editor do Supabase:
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. COLUNA modulos_habilitados NA TABELA organizacoes
--    Permite que o Super Admin controle quais abas cada ComSoc pode acessar
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.organizacoes
    ADD COLUMN IF NOT EXISTS modulos_habilitados JSONB DEFAULT '["directory","agenda","comsoc","comsoc-controles"]'::jsonb;

-- Inicializar todos os registros existentes com todos os módulos habilitados
UPDATE public.organizacoes
SET modulos_habilitados = '["directory","agenda","comsoc","comsoc-controles"]'::jsonb
WHERE modulos_habilitados IS NULL;


-- ─────────────────────────────────────────────────────────────────────────────
-- 8. FUNÇÃO RPC admin_reset_user_password (Somente Super Admin)
--    Permite que um usuário com permissão especial redefina a senha de outro
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_reset_user_password(
    target_user_id UUID,
    new_password TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    calling_user_email TEXT;
    super_admin_email TEXT := 'sacrasub@gmail.com'; -- E-mail do Super Admin
BEGIN
    -- Verificar se quem chama é o Super Admin
    calling_user_email := (SELECT email FROM auth.users WHERE id = auth.uid());
    
    IF calling_user_email IS NULL OR calling_user_email != super_admin_email THEN
        RAISE EXCEPTION 'Acesso negado. Apenas o Super Admin pode resetar senhas.';
    END IF;
    
    -- Atualizar a senha do usuário alvo
    UPDATE auth.users
    SET encrypted_password = crypt(new_password, gen_salt('bf'))
    WHERE id = target_user_id;
    
    -- Marcar para forçar troca de senha
    UPDATE public.perfis_usuarios
    SET forcar_troca_senha = true
    WHERE id = target_user_id;
END;
$$;

-- Conceder execução à role anon e authenticated
GRANT EXECUTE ON FUNCTION public.admin_reset_user_password(UUID, TEXT) TO authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- VERIFICAÇÃO
-- ─────────────────────────────────────────────────────────────────────────────
SELECT id, nome_curto, modulos_habilitados
FROM public.organizacoes
ORDER BY nome_curto;
