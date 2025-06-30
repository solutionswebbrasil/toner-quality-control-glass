
-- Criar tabela de usuarios
CREATE TABLE public.usuarios (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo text NOT NULL,
  usuario text NOT NULL UNIQUE,
  senha text NOT NULL,
  criado_em timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar tabela de permissoes
CREATE TABLE public.permissoes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id uuid NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  modulo text NOT NULL,
  submenu text NOT NULL,
  pode_ver boolean NOT NULL DEFAULT false,
  pode_editar boolean NOT NULL DEFAULT false,
  pode_excluir boolean NOT NULL DEFAULT false,
  pode_cadastrar boolean NOT NULL DEFAULT false,
  pode_baixar boolean NOT NULL DEFAULT false,
  UNIQUE(usuario_id, modulo, submenu)
);

-- Inserir usuário administrador padrão
INSERT INTO public.usuarios (nome_completo, usuario, senha) 
VALUES ('Administrador do Sistema', 'admin.admin', 'admin123');

-- Obter o ID do usuário admin para inserir as permissões
INSERT INTO public.permissoes (usuario_id, modulo, submenu, pode_ver, pode_editar, pode_excluir, pode_cadastrar, pode_baixar)
SELECT 
  u.id,
  'Dashboard',
  'Visualização Geral',
  true, true, true, true, true
FROM public.usuarios u WHERE u.usuario = 'admin.admin'
UNION ALL
SELECT 
  u.id,
  'Não Conformidades',
  'Cadastro',
  true, true, true, true, true
FROM public.usuarios u WHERE u.usuario = 'admin.admin'
UNION ALL
SELECT 
  u.id,
  'Não Conformidades',
  'Consulta',
  true, true, true, true, true
FROM public.usuarios u WHERE u.usuario = 'admin.admin'
UNION ALL
SELECT 
  u.id,
  'Garantias',
  'Cadastro',
  true, true, true, true, true
FROM public.usuarios u WHERE u.usuario = 'admin.admin'
UNION ALL
SELECT 
  u.id,
  'Garantias',
  'Consulta',
  true, true, true, true, true
FROM public.usuarios u WHERE u.usuario = 'admin.admin'
UNION ALL
SELECT 
  u.id,
  'Toners',
  'Cadastro',
  true, true, true, true, true
FROM public.usuarios u WHERE u.usuario = 'admin.admin'
UNION ALL
SELECT 
  u.id,
  'Toners',
  'Consulta',
  true, true, true, true, true
FROM public.usuarios u WHERE u.usuario = 'admin.admin'
UNION ALL
SELECT 
  u.id,
  'Configurações',
  'Usuários',
  true, true, true, true, true
FROM public.usuarios u WHERE u.usuario = 'admin.admin';

-- Habilitar RLS nas tabelas
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissoes ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS que permitem acesso completo para operações de login
CREATE POLICY "Permitir leitura de usuarios para login" 
  ON public.usuarios 
  FOR SELECT 
  USING (true);

CREATE POLICY "Permitir leitura de permissoes" 
  ON public.permissoes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Permitir operações em usuarios para admin" 
  ON public.usuarios 
  FOR ALL 
  USING (true);

CREATE POLICY "Permitir operações em permissoes para admin" 
  ON public.permissoes 
  FOR ALL 
  USING (true);
