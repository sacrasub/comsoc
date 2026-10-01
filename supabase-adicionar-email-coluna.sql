-- =============================================================================
-- MIGRAÇÃO: Adiciona coluna email na tabela perfis_usuarios e cria a RPC
-- Execute este script no SQL Editor do painel Supabase:
-- https://supabase.com/dashboard/project/<SEU-PROJECT>/sql
-- =============================================================================

-- 1. Adicionar coluna email na tabela perfis_usuarios se ela não existir
ALTER TABLE public.perfis_usuarios
ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Popular a nova coluna email com base nos dados do auth.users
UPDATE public.perfis_usuarios p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;

-- 3. Criar ou Atualizar a RPC para Alterar E-mail (Somente Admins)
-- Ela altera tanto no auth.users quanto na tabela perfis_usuarios
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
    -- Obter a organização do usuário que está executando a função (deve ser admin)
    SELECT org_id INTO v_caller_org
    FROM public.perfis_usuarios
    WHERE id = auth.uid() AND role = 'admin';

    IF v_caller_org IS NULL THEN
        RETURN jsonb_build_object('ok', false, 'erro', 'Apenas administradores podem alterar dados de membros.');
    END IF;

    -- Obter a organização do usuário alvo
    SELECT org_id INTO v_target_org
    FROM public.perfis_usuarios
    WHERE id = p_user_id;

    IF v_target_org IS NULL OR v_target_org != v_caller_org THEN
        RETURN jsonb_build_object('ok', false, 'erro', 'Usuário não pertence à sua organização.');
    END IF;

    -- Atualizar o email no Auth.Users
    UPDATE auth.users
    SET email = p_novo_email,
        email_confirmed_at = now(),
        updated_at = now()
    WHERE id = p_user_id;

    -- Atualizar o email no perfil público (perfis_usuarios)
    UPDATE public.perfis_usuarios
    SET email = p_novo_email
    WHERE id = p_user_id;

    RETURN jsonb_build_object('ok', true);
END;
$$;

-- Conceder permissão de execução à role authenticated
GRANT EXECUTE ON FUNCTION public.atualizar_email_membro(UUID, TEXT) TO authenticated;
