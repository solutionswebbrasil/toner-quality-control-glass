
-- Criar tabela para garantias de toners
CREATE TABLE public.garantias_toners (
  id SERIAL PRIMARY KEY,
  ticket_numero TEXT NOT NULL UNIQUE,
  modelo_toner TEXT NOT NULL,
  filial_origem TEXT NOT NULL,
  fornecedor TEXT NOT NULL,
  defeito TEXT NOT NULL,
  responsavel_envio TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Em Análise', 'Aprovada', 'Recusada', 'Concluída')),
  data_envio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  observacoes TEXT
);

-- Habilitar Row Level Security
ALTER TABLE public.garantias_toners ENABLE ROW LEVEL SECURITY;

-- Criar política RLS para permitir acesso completo
CREATE POLICY "Allow all operations on garantias_toners" ON public.garantias_toners FOR ALL USING (true) WITH CHECK (true);

-- Criar índice para melhor performance na busca por tickets
CREATE INDEX idx_garantias_toners_ticket ON public.garantias_toners(ticket_numero);
CREATE INDEX idx_garantias_toners_status ON public.garantias_toners(status);
