
-- Criar tabela para configurações de status por módulo
CREATE TABLE public.status_configuracoes (
  id SERIAL PRIMARY KEY,
  modulo TEXT NOT NULL,
  status_nome TEXT NOT NULL,
  cor TEXT DEFAULT '#6B7280',
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(modulo, status_nome)
);

-- Criar tabela para configurações de resultados por módulo
CREATE TABLE public.resultados_configuracoes (
  id SERIAL PRIMARY KEY,
  modulo TEXT NOT NULL,
  resultado_nome TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(modulo, resultado_nome)
);

-- Inserir status padrão para o módulo Garantias
INSERT INTO public.status_configuracoes (modulo, status_nome, cor, ordem) VALUES
('Garantias', 'Aberta', '#F59E0B', 1),
('Garantias', 'Em Análise', '#3B82F6', 2),
('Garantias', 'Concluída', '#10B981', 3),
('Garantias', 'Recusada', '#EF4444', 4),
('Garantias', 'Aguardando Fornecedor', '#8B5CF6', 5);

-- Inserir resultados padrão para o módulo Garantias
INSERT INTO public.resultados_configuracoes (modulo, resultado_nome, ordem) VALUES
('Garantias', 'Não definido', 1),
('Garantias', 'Devolução em Crédito', 2),
('Garantias', 'Trocado', 3),
('Garantias', 'Consertado', 4);

-- Criar bucket para armazenamento de arquivos NF
INSERT INTO storage.buckets (id, name, public) VALUES ('garantias-nf', 'garantias-nf', true);

-- Política para permitir upload de arquivos
CREATE POLICY "Permitir upload de NF" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'garantias-nf');
CREATE POLICY "Permitir visualização de NF" ON storage.objects FOR SELECT USING (bucket_id = 'garantias-nf');
CREATE POLICY "Permitir atualização de NF" ON storage.objects FOR UPDATE USING (bucket_id = 'garantias-nf');
CREATE POLICY "Permitir exclusão de NF" ON storage.objects FOR DELETE USING (bucket_id = 'garantias-nf');

-- Atualizar estrutura de permissões simplificada
ALTER TABLE public.permissoes DROP COLUMN IF EXISTS pode_ver;
ALTER TABLE public.permissoes DROP COLUMN IF EXISTS pode_editar;
ALTER TABLE public.permissoes DROP COLUMN IF EXISTS pode_excluir;
ALTER TABLE public.permissoes DROP COLUMN IF EXISTS pode_cadastrar;
ALTER TABLE public.permissoes DROP COLUMN IF EXISTS pode_baixar;

ALTER TABLE public.permissoes ADD COLUMN IF NOT EXISTS pode_visualizar BOOLEAN DEFAULT false;
ALTER TABLE public.permissoes ADD COLUMN IF NOT EXISTS pode_editar BOOLEAN DEFAULT false;
ALTER TABLE public.permissoes ADD COLUMN IF NOT EXISTS pode_excluir BOOLEAN DEFAULT false;

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_status_configuracoes_modulo ON public.status_configuracoes(modulo);
CREATE INDEX IF NOT EXISTS idx_resultados_configuracoes_modulo ON public.resultados_configuracoes(modulo);
CREATE INDEX IF NOT EXISTS idx_permissoes_usuario_modulo ON public.permissoes(usuario_id, modulo);
