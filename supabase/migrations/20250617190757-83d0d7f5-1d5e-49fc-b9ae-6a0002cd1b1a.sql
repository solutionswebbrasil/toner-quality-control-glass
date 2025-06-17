
-- Fix infinite recursion in RLS policies by creating SECURITY DEFINER functions

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their own permissions" ON public.permissoes;
DROP POLICY IF EXISTS "Admins can manage all permissions" ON public.permissoes;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.usuarios;
DROP POLICY IF EXISTS "Admins can view all users" ON public.usuarios;
DROP POLICY IF EXISTS "Admins can manage users" ON public.usuarios;

-- Drop existing data table policies that use permissoes
DROP POLICY IF EXISTS "Users can access retornados with permissions" ON public.retornados;
DROP POLICY IF EXISTS "Users can access garantias with permissions" ON public.garantias;
DROP POLICY IF EXISTS "Users can access garantias_toners with permissions" ON public.garantias_toners;
DROP POLICY IF EXISTS "Users can access toners with permissions" ON public.toners;
DROP POLICY IF EXISTS "Users can access fornecedores with permissions" ON public.fornecedores;
DROP POLICY IF EXISTS "Users can access nao_conformidades with permissions" ON public.nao_conformidades;
DROP POLICY IF EXISTS "Users can access auditorias with permissions" ON public.auditorias;
DROP POLICY IF EXISTS "Users can access certificados with permissions" ON public.certificados;
DROP POLICY IF EXISTS "Users can access filiais with permissions" ON public.filiais;

-- Create SECURITY DEFINER function to check user permissions (bypasses RLS)
CREATE OR REPLACE FUNCTION public.check_user_permission(
  user_id_param uuid,
  modulo_param text,
  submenu_param text,
  acao_param text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- Check if user has the specified permission
  RETURN EXISTS (
    SELECT 1 
    FROM public.permissoes p 
    WHERE p.usuario_id = user_id_param 
    AND p.modulo = modulo_param 
    AND (submenu_param IS NULL OR p.submenu = submenu_param)
    AND (
      (acao_param = 'visualizar' AND p.pode_visualizar = true) OR
      (acao_param = 'editar' AND p.pode_editar = true) OR
      (acao_param = 'excluir' AND p.pode_excluir = true) OR
      (acao_param IS NULL AND p.pode_visualizar = true)
    )
  );
END;
$$;

-- Create SECURITY DEFINER function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_user_admin(user_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN public.check_user_permission(
    user_id_param, 
    'Configurações', 
    'Usuários', 
    'editar'
  );
END;
$$;

-- Create secure RLS policies for usuarios table
CREATE POLICY "Users can view their own profile" 
  ON public.usuarios 
  FOR SELECT 
  USING (auth.uid() = id::uuid);

CREATE POLICY "Admins can view all users" 
  ON public.usuarios 
  FOR SELECT 
  USING (public.is_user_admin(auth.uid()));

CREATE POLICY "Admins can manage users" 
  ON public.usuarios 
  FOR ALL 
  USING (public.is_user_admin(auth.uid()));

-- Create secure RLS policies for permissoes table
CREATE POLICY "Users can view their own permissions" 
  ON public.permissoes 
  FOR SELECT 
  USING (usuario_id = auth.uid());

CREATE POLICY "Admins can manage all permissions" 
  ON public.permissoes 
  FOR ALL 
  USING (public.is_user_admin(auth.uid()));

-- Create RLS policies for data tables using the new function
CREATE POLICY "Users can access retornados with permissions" 
  ON public.retornados 
  FOR ALL 
  USING (public.check_user_permission(auth.uid(), 'Retornados', NULL, 'visualizar'));

CREATE POLICY "Users can access garantias with permissions" 
  ON public.garantias 
  FOR ALL 
  USING (public.check_user_permission(auth.uid(), 'Garantias', NULL, 'visualizar'));

CREATE POLICY "Users can access garantias_toners with permissions" 
  ON public.garantias_toners 
  FOR ALL 
  USING (public.check_user_permission(auth.uid(), 'Garantias', NULL, 'visualizar'));

CREATE POLICY "Users can access toners with permissions" 
  ON public.toners 
  FOR ALL 
  USING (public.check_user_permission(auth.uid(), 'Toners', NULL, 'visualizar'));

CREATE POLICY "Users can access fornecedores with permissions" 
  ON public.fornecedores 
  FOR ALL 
  USING (public.check_user_permission(auth.uid(), 'Garantias', NULL, 'visualizar'));

CREATE POLICY "Users can access nao_conformidades with permissions" 
  ON public.nao_conformidades 
  FOR ALL 
  USING (public.check_user_permission(auth.uid(), 'Não Conformidades', NULL, 'visualizar'));

CREATE POLICY "Users can access auditorias with permissions" 
  ON public.auditorias 
  FOR ALL 
  USING (public.check_user_permission(auth.uid(), 'Auditorias', NULL, 'visualizar'));

CREATE POLICY "Users can access certificados with permissions" 
  ON public.certificados 
  FOR ALL 
  USING (public.check_user_permission(auth.uid(), 'Certificados', NULL, 'visualizar'));

CREATE POLICY "Users can access filiais with permissions" 
  ON public.filiais 
  FOR ALL 
  USING (public.check_user_permission(auth.uid(), 'Configurações', NULL, 'visualizar'));
