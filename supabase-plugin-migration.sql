-- =============================================================================
-- MIGRAÇÃO — Sistema de Módulos Externos (Plugin System) + Exclusão de OM
-- Execute no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/uoeeqvqotwytvzryavqj/sql
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. COLUNA modulos_externos NA TABELA organizacoes
--    Armazena a lista de plugins instalados por org
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.organizacoes
    ADD COLUMN IF NOT EXISTS modulos_externos JSONB DEFAULT '[]'::jsonb;

-- Inicializar registros existentes com array vazio
UPDATE public.organizacoes
SET modulos_externos = '[]'::jsonb
WHERE modulos_externos IS NULL;


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. FUNÇÃO RPC super_admin_delete_org
--    Exclui uma OM completa e todos seus dados (SECURITY DEFINER)
--    Apenas o Super Admin (sacrasub@gmail.com) pode executar
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.super_admin_delete_org(target_org_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    calling_user_email TEXT;
    super_admin_email  TEXT := 'sacrasub@gmail.com';
    org_nome           TEXT;
    deleted_counts     JSONB;
    del_perfis         INT := 0;
    del_checklists     INT := 0;
    del_releases       INT := 0;
    del_clipping       INT := 0;
    del_historico      INT := 0;
    del_avaliacoes     INT := 0;
    del_gantt          INT := 0;
BEGIN
    -- Verificar identidade do chamador
    calling_user_email := (SELECT email FROM auth.users WHERE id = auth.uid());
    IF calling_user_email IS NULL OR calling_user_email != super_admin_email THEN
        RAISE EXCEPTION 'Acesso negado. Apenas o Super Admin pode excluir organizações.';
    END IF;

    -- Verificar que a org existe e obter nome
    SELECT nome_curto INTO org_nome
    FROM public.organizacoes WHERE id = target_org_id;

    IF org_nome IS NULL THEN
        RAISE EXCEPTION 'Organização não encontrada: %', target_org_id;
    END IF;

    -- Excluir dados em cascata (tabelas filhas primeiro)
    DELETE FROM public.comsoc_checklists   WHERE org_id = target_org_id; GET DIAGNOSTICS del_checklists = ROW_COUNT;
    DELETE FROM public.comsoc_releases     WHERE org_id = target_org_id; GET DIAGNOSTICS del_releases   = ROW_COUNT;
    DELETE FROM public.comsoc_clipping     WHERE org_id = target_org_id; GET DIAGNOSTICS del_clipping   = ROW_COUNT;
    DELETE FROM public.comsoc_historico    WHERE org_id = target_org_id; GET DIAGNOSTICS del_historico  = ROW_COUNT;
    DELETE FROM public.comsoc_avaliacoes   WHERE org_id = target_org_id; GET DIAGNOSTICS del_avaliacoes = ROW_COUNT;
    DELETE FROM public.comsoc_gantt_prazos WHERE org_id = target_org_id; GET DIAGNOSTICS del_gantt      = ROW_COUNT;
    DELETE FROM public.perfis_usuarios     WHERE org_id = target_org_id; GET DIAGNOSTICS del_perfis     = ROW_COUNT;

    -- Excluir a organização
    DELETE FROM public.organizacoes WHERE id = target_org_id;

    -- Retornar relatório
    deleted_counts := jsonb_build_object(
        'org_nome',      org_nome,
        'perfis',        del_perfis,
        'checklists',    del_checklists,
        'releases',      del_releases,
        'clipping',      del_clipping,
        'historico',     del_historico,
        'avaliacoes',    del_avaliacoes,
        'gantt_prazos',  del_gantt
    );
    RETURN deleted_counts;
END;
$$;

GRANT EXECUTE ON FUNCTION public.super_admin_delete_org(UUID) TO authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- VERIFICAÇÃO
-- ─────────────────────────────────────────────────────────────────────────────
SELECT id, nome_curto, modulos_habilitados, modulos_externos
FROM public.organizacoes
ORDER BY nome_curto;
