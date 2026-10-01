-- =============================================================================
-- MIGRAÇÃO: Visualização e edição de e-mails dos membros
-- Execute no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/<SEU-PROJECT>/sql
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. RPC: Buscar membros com e-mail real (somente da org do usuário logado)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_membros_com_email(p_org_id UUID)
RETURNS TABLE (
    id       UUID,
    nome     TEXT,
    email    TEXT,
    role     TEXT,
    forcar_troca_senha BOOLEAN,
    criado_em TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Verificar se o usuário logado pertence à mesma org e é admin/editor
    IF NOT EXISTS (
        SELECT 1 FROM public.perfis_usuarios
        WHERE perfis_usuarios.id = auth.uid()
          AND perfis_usuarios.org_id = p_org_id
          AND perfis_usuarios.role IN ('admin', 'editor')
    ) THEN
        RAISE EXCEPTION 'Acesso negado.';
    END IF;

    RETURN QUERY
    SELECT
        p.id,
        p.nome,
        u.email,
        p.role,
        p.forcar_troca_senha,
        p.criado_em
    FROM public.perfis_usuarios p
    JOIN auth.users u ON u.id = p.id
    WHERE p.org_id = p_org_id
    ORDER BY p.nome;
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. RPC: Atualizar e-mail de um membro (somente admin da mesma org)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.atualizar_email_membro(
    p_user_id UUID,
    p_novo_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_caller_org UUID;
    v_target_org UUID;
BEGIN
    -- Organização do usuário que está chamando
    SELECT org_id INTO v_caller_org
    FROM public.perfis_usuarios
    WHERE id = auth.uid() AND role = 'admin';

    IF v_caller_org IS NULL THEN
        RETURN jsonb_build_object('ok', false, 'erro', 'Apenas administradores podem alterar e-mails.');
    END IF;

    -- Organização do usuário alvo
    SELECT org_id INTO v_target_org
    FROM public.perfis_usuarios
    WHERE id = p_user_id;

    IF v_target_org IS NULL OR v_target_org != v_caller_org THEN
        RETURN jsonb_build_object('ok', false, 'erro', 'Usuário não pertence à sua organização.');
    END IF;

    -- Atualizar o e-mail no auth.users
    UPDATE auth.users
    SET email = p_novo_email,
        email_confirmed_at = now(),
        updated_at = now()
    WHERE id = p_user_id;

    RETURN jsonb_build_object('ok', true);
END;
$$;
