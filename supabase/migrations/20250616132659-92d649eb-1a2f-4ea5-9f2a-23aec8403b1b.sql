
-- Criar tabela para filiais
CREATE TABLE public.filiais (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  codigo TEXT,
  endereco TEXT,
  telefone TEXT,
  email TEXT,
  data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ativo BOOLEAN NOT NULL DEFAULT true
);

-- Inserir filiais pré-cadastradas
INSERT INTO public.filiais (nome, codigo) VALUES 
  ('Caçapava', 'CAC'),
  ('Jundiaí', 'JUN'),
  ('Franca', 'FRA'),
  ('Santos', 'SAN');

-- Habilitar RLS (opcional, caso queira controle de acesso)
ALTER TABLE public.filiais ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura para todos (já que filiais são dados compartilhados)
CREATE POLICY "Todos podem visualizar filiais" 
  ON public.filiais 
  FOR SELECT 
  USING (true);

-- Política para permitir inserção para todos
CREATE POLICY "Todos podem criar filiais" 
  ON public.filiais 
  FOR INSERT 
  WITH CHECK (true);

-- Política para permitir atualização para todos
CREATE POLICY "Todos podem atualizar filiais" 
  ON public.filiais 
  FOR UPDATE 
  USING (true);

-- Política para permitir exclusão para todos
CREATE POLICY "Todos podem excluir filiais" 
  ON public.filiais 
  FOR DELETE 
  USING (true);
