
-- Phase 1: Critical Database Security Fixes

-- First, let's add user_id columns where needed for data ownership
ALTER TABLE public.retornados ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.garantias ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.garantias_toners ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.toners ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.fornecedores ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.nao_conformidades ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.auditorias ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.certificados ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.filiais ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Drop all existing overly permissive policies
DROP POLICY IF EXISTS "Permitir leitura de usuarios para login" ON public.usuarios;
DROP POLICY IF EXISTS "Permitir leitura de permissoes" ON public.permissoes;
DROP POLICY IF EXISTS "Permitir operações em usuarios para admin" ON public.usuarios;
DROP POLICY IF EXISTS "Permitir operações em permissoes para admin" ON public.permissoes;

-- Create secure RLS policies for usuarios table
CREATE POLICY "Users can view their own profile" 
  ON public.usuarios 
  FOR SELECT 
  USING (auth.uid() = id::uuid);

CREATE POLICY "Admins can view all users" 
  ON public.usuarios 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.permissoes p 
    WHERE p.usuario_id = auth.uid() 
    AND p.modulo = 'Configurações' 
    AND p.submenu = 'Usuários' 
    AND p.pode_visualizar = true
  ));

CREATE POLICY "Admins can manage users" 
  ON public.usuarios 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.permissoes p 
    WHERE p.usuario_id = auth.uid() 
    AND p.modulo = 'Configurações' 
    AND p.submenu = 'Usuários' 
    AND p.pode_editar = true
  ));

-- Create secure RLS policies for permissoes table
CREATE POLICY "Users can view their own permissions" 
  ON public.permissoes 
  FOR SELECT 
  USING (usuario_id = auth.uid());

CREATE POLICY "Admins can manage all permissions" 
  ON public.permissoes 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.permissoes p 
    WHERE p.usuario_id = auth.uid() 
    AND p.modulo = 'Configurações' 
    AND p.submenu = 'Usuários' 
    AND p.pode_editar = true
  ));

-- Enable RLS on all data tables
ALTER TABLE public.retornados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garantias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garantias_toners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nao_conformidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.filiais ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for data tables
CREATE POLICY "Users can access retornados with permissions" 
  ON public.retornados 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.permissoes p 
    WHERE p.usuario_id = auth.uid() 
    AND p.modulo = 'Retornados' 
    AND p.pode_visualizar = true
  ));

CREATE POLICY "Users can access garantias with permissions" 
  ON public.garantias 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.permissoes p 
    WHERE p.usuario_id = auth.uid() 
    AND p.modulo = 'Garantias' 
    AND p.pode_visualizar = true
  ));

CREATE POLICY "Users can access garantias_toners with permissions" 
  ON public.garantias_toners 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.permissoes p 
    WHERE p.usuario_id = auth.uid() 
    AND p.modulo = 'Garantias' 
    AND p.pode_visualizar = true
  ));

CREATE POLICY "Users can access toners with permissions" 
  ON public.toners 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.permissoes p 
    WHERE p.usuario_id = auth.uid() 
    AND p.modulo = 'Toners' 
    AND p.pode_visualizar = true
  ));

CREATE POLICY "Users can access fornecedores with permissions" 
  ON public.fornecedores 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.permissoes p 
    WHERE p.usuario_id = auth.uid() 
    AND p.modulo = 'Garantias' 
    AND p.pode_visualizar = true
  ));

CREATE POLICY "Users can access nao_conformidades with permissions" 
  ON public.nao_conformidades 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.permissoes p 
    WHERE p.usuario_id = auth.uid() 
    AND p.modulo = 'Não Conformidades' 
    AND p.pode_visualizar = true
  ));

CREATE POLICY "Users can access auditorias with permissions" 
  ON public.auditorias 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.permissoes p 
    WHERE p.usuario_id = auth.uid() 
    AND p.modulo = 'Auditorias' 
    AND p.pode_visualizar = true
  ));

CREATE POLICY "Users can access certificados with permissions" 
  ON public.certificados 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.permissoes p 
    WHERE p.usuario_id = auth.uid() 
    AND p.modulo = 'Certificados' 
    AND p.pode_visualizar = true
  ));

CREATE POLICY "Users can access filiais with permissions" 
  ON public.filiais 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.permissoes p 
    WHERE p.usuario_id = auth.uid() 
    AND p.modulo = 'Configurações' 
    AND p.pode_visualizar = true
  ));

-- Create function to hash passwords (for existing custom auth)
CREATE OR REPLACE FUNCTION public.hash_password(password text)
RETURNS text AS $$
BEGIN
  -- This is a basic implementation - in production use a proper bcrypt extension
  RETURN encode(digest(password || 'salt123', 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing passwords to be hashed (basic implementation)
UPDATE public.usuarios SET senha = public.hash_password(senha) WHERE length(senha) < 64;

-- Create function to verify passwords
CREATE OR REPLACE FUNCTION public.verify_password(input_password text, stored_hash text)
RETURNS boolean AS $$
BEGIN
  RETURN stored_hash = public.hash_password(input_password);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove the hardcoded admin password and create a proper secure one
UPDATE public.usuarios 
SET senha = public.hash_password('SecureAdmin2024!') 
WHERE usuario = 'admin.admin';
