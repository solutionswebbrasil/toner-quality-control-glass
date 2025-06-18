
-- Phase 1: Critical Security Fixes - RLS Policy Cleanup and User Ownership Enforcement

-- First, drop all overly permissive policies that bypass security
DROP POLICY IF EXISTS "Users can access retornados with permissions" ON public.retornados;
DROP POLICY IF EXISTS "Users can access garantias with permissions" ON public.garantias;
DROP POLICY IF EXISTS "Users can access garantias_toners with permissions" ON public.garantias_toners;
DROP POLICY IF EXISTS "Users can access toners with permissions" ON public.toners;
DROP POLICY IF EXISTS "Users can access fornecedores with permissions" ON public.fornecedores;
DROP POLICY IF EXISTS "Users can access nao_conformidades with permissions" ON public.nao_conformidades;
DROP POLICY IF EXISTS "Users can access auditorias with permissions" ON public.auditorias;
DROP POLICY IF EXISTS "Users can access certificados with permissions" ON public.certificados;
DROP POLICY IF EXISTS "Users can access filiais with permissions" ON public.filiais;

-- Create secure RLS policies with proper user ownership and permission checks
-- Retornados policies
CREATE POLICY "Users can view retornados with permissions"
  ON public.retornados FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Retornados', NULL, 'visualizar')
  );

CREATE POLICY "Users can insert retornados with permissions"
  ON public.retornados FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Retornados', 'Registro', 'editar') AND
    user_id = auth.uid()
  );

CREATE POLICY "Users can update retornados with permissions"
  ON public.retornados FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Retornados', 'Registro', 'editar') AND
    user_id = auth.uid()
  );

CREATE POLICY "Users can delete retornados with permissions"
  ON public.retornados FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Retornados', 'Consulta', 'excluir') AND
    user_id = auth.uid()
  );

-- Garantias policies
CREATE POLICY "Users can view garantias with permissions"
  ON public.garantias FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Garantias', NULL, 'visualizar')
  );

CREATE POLICY "Users can insert garantias with permissions"
  ON public.garantias FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Garantias', 'Registro', 'editar') AND
    user_id = auth.uid()
  );

CREATE POLICY "Users can update garantias with permissions"
  ON public.garantias FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Garantias', 'Registro', 'editar') AND
    user_id = auth.uid()
  );

CREATE POLICY "Users can delete garantias with permissions"
  ON public.garantias FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Garantias', 'Consulta', 'excluir') AND
    user_id = auth.uid()
  );

-- Garantias Toners policies
CREATE POLICY "Users can view garantias_toners with permissions"
  ON public.garantias_toners FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Garantias', 'Garantias Toners', 'visualizar')
  );

CREATE POLICY "Users can insert garantias_toners with permissions"
  ON public.garantias_toners FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Garantias', 'Garantias Toners', 'editar') AND
    user_id = auth.uid()
  );

CREATE POLICY "Users can update garantias_toners with permissions"
  ON public.garantias_toners FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Garantias', 'Garantias Toners', 'editar') AND
    user_id = auth.uid()
  );

CREATE POLICY "Users can delete garantias_toners with permissions"
  ON public.garantias_toners FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Garantias', 'Garantias Toners', 'excluir') AND
    user_id = auth.uid()
  );

-- Toners policies
CREATE POLICY "Users can view toners with permissions"
  ON public.toners FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Toners', NULL, 'visualizar')
  );

CREATE POLICY "Users can insert toners with permissions"
  ON public.toners FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Toners', 'Cadastro', 'editar') AND
    user_id = auth.uid()
  );

CREATE POLICY "Users can update toners with permissions"
  ON public.toners FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Toners', 'Cadastro', 'editar') AND
    user_id = auth.uid()
  );

CREATE POLICY "Users can delete toners with permissions"
  ON public.toners FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Toners', 'Consulta', 'excluir') AND
    user_id = auth.uid()
  );

-- Fornecedores policies (shared resource, less restrictive on user_id)
CREATE POLICY "Users can view fornecedores with permissions"
  ON public.fornecedores FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Garantias', 'Fornecedores Consulta', 'visualizar')
  );

CREATE POLICY "Users can insert fornecedores with permissions"
  ON public.fornecedores FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Garantias', 'Fornecedores Cadastro', 'editar') AND
    user_id = auth.uid()
  );

CREATE POLICY "Users can update fornecedores with permissions"
  ON public.fornecedores FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Garantias', 'Fornecedores Cadastro', 'editar')
  );

CREATE POLICY "Users can delete fornecedores with permissions"
  ON public.fornecedores FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Garantias', 'Fornecedores Cadastro', 'excluir')
  );

-- Nao Conformidades policies
CREATE POLICY "Users can view nao_conformidades with permissions"
  ON public.nao_conformidades FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Não Conformidades', NULL, 'visualizar')
  );

CREATE POLICY "Users can insert nao_conformidades with permissions"
  ON public.nao_conformidades FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Não Conformidades', 'Registro', 'editar') AND
    user_id = auth.uid()
  );

CREATE POLICY "Users can update nao_conformidades with permissions"
  ON public.nao_conformidades FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Não Conformidades', 'Registro', 'editar') AND
    user_id = auth.uid()
  );

CREATE POLICY "Users can delete nao_conformidades with permissions"
  ON public.nao_conformidades FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Não Conformidades', 'Consulta', 'excluir') AND
    user_id = auth.uid()
  );

-- Auditorias policies
CREATE POLICY "Users can view auditorias with permissions"
  ON public.auditorias FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Auditorias', NULL, 'visualizar')
  );

CREATE POLICY "Users can insert auditorias with permissions"
  ON public.auditorias FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Auditorias', 'Registro', 'editar') AND
    user_id = auth.uid()
  );

CREATE POLICY "Users can update auditorias with permissions"
  ON public.auditorias FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Auditorias', 'Registro', 'editar') AND
    user_id = auth.uid()
  );

CREATE POLICY "Users can delete auditorias with permissions"
  ON public.auditorias FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Auditorias', 'Consulta', 'excluir') AND
    user_id = auth.uid()
  );

-- Certificados policies
CREATE POLICY "Users can view certificados with permissions"
  ON public.certificados FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Certificados', NULL, 'visualizar')
  );

CREATE POLICY "Users can insert certificados with permissions"
  ON public.certificados FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Certificados', 'Registro', 'editar') AND
    user_id = auth.uid()
  );

CREATE POLICY "Users can update certificados with permissions"
  ON public.certificados FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Certificados', 'Registro', 'editar') AND
    user_id = auth.uid()
  );

CREATE POLICY "Users can delete certificados with permissions"
  ON public.certificados FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Certificados', 'Consulta', 'excluir') AND
    user_id = auth.uid()
  );

-- Filiais policies (shared organizational resource)
CREATE POLICY "Users can view filiais with permissions"
  ON public.filiais FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Configurações', 'Filiais Consulta', 'visualizar')
  );

CREATE POLICY "Users can insert filiais with permissions"
  ON public.filiais FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Configurações', 'Filiais Cadastro', 'editar') AND
    user_id = auth.uid()
  );

CREATE POLICY "Users can update filiais with permissions"
  ON public.filiais FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Configurações', 'Filiais Cadastro', 'editar')
  );

CREATE POLICY "Users can delete filiais with permissions"
  ON public.filiais FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Configurações', 'Filiais Cadastro', 'excluir')
  );

-- Make user_id columns NOT NULL where they should be (for data integrity)
-- Update existing records to set user_id to a default admin user if null
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get the first admin user ID from profiles
    SELECT id INTO admin_user_id 
    FROM public.profiles 
    WHERE role = 'admin' 
    LIMIT 1;
    
    -- If we found an admin user, update null user_id fields
    IF admin_user_id IS NOT NULL THEN
        UPDATE public.retornados SET user_id = admin_user_id WHERE user_id IS NULL;
        UPDATE public.garantias SET user_id = admin_user_id WHERE user_id IS NULL;
        UPDATE public.garantias_toners SET user_id = admin_user_id WHERE user_id IS NULL;
        UPDATE public.toners SET user_id = admin_user_id WHERE user_id IS NULL;
        UPDATE public.fornecedores SET user_id = admin_user_id WHERE user_id IS NULL;
        UPDATE public.nao_conformidades SET user_id = admin_user_id WHERE user_id IS NULL;
        UPDATE public.auditorias SET user_id = admin_user_id WHERE user_id IS NULL;
        UPDATE public.certificados SET user_id = admin_user_id WHERE user_id IS NULL;
        UPDATE public.filiais SET user_id = admin_user_id WHERE user_id IS NULL;
    END IF;
END $$;

-- Make user_id NOT NULL for data integrity (except for shared resources like fornecedores and filiais)
ALTER TABLE public.retornados ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.garantias ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.garantias_toners ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.toners ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.nao_conformidades ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.auditorias ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.certificados ALTER COLUMN user_id SET NOT NULL;

-- Create audit log table for sensitive operations
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    action text NOT NULL,
    table_name text NOT NULL,
    record_id text,
    old_values jsonb,
    new_values jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    public.check_user_permission(auth.uid(), 'Configurações', 'Usuários', 'visualizar')
  );

-- Users can insert their own audit logs (for system logging)
CREATE POLICY "Users can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (user_id = auth.uid());
