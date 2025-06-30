
-- Criar tabela para não conformidades
CREATE TABLE public.nao_conformidades (
  id SERIAL PRIMARY KEY,
  data_ocorrencia DATE NOT NULL,
  unidade_filial TEXT NOT NULL,
  setor_responsavel TEXT NOT NULL,
  tipo_nc TEXT NOT NULL CHECK (tipo_nc IN ('Produto', 'Processo', 'Serviço', 'Sistema', 'Outros')),
  descricao TEXT NOT NULL,
  evidencias JSONB DEFAULT '[]'::jsonb,
  classificacao TEXT NOT NULL CHECK (classificacao IN ('Leve', 'Moderada', 'Grave', 'Crítica')),
  identificado_por TEXT NOT NULL,
  responsavel_tratamento TEXT NOT NULL,
  data_limite_correcao DATE NOT NULL,
  acao_imediata TEXT,
  necessita_acao_corretiva BOOLEAN DEFAULT false,
  acao_corretiva_proposta TEXT,
  observacoes TEXT,
  status TEXT NOT NULL DEFAULT 'Aberta' CHECK (status IN ('Aberta', 'Em andamento', 'Corrigida', 'Recusada', 'Reaberta')),
  data_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar índices para melhorar performance das consultas
CREATE INDEX idx_nao_conformidades_data_ocorrencia ON public.nao_conformidades(data_ocorrencia);
CREATE INDEX idx_nao_conformidades_unidade ON public.nao_conformidades(unidade_filial);
CREATE INDEX idx_nao_conformidades_setor ON public.nao_conformidades(setor_responsavel);
CREATE INDEX idx_nao_conformidades_tipo ON public.nao_conformidades(tipo_nc);
CREATE INDEX idx_nao_conformidades_status ON public.nao_conformidades(status);
CREATE INDEX idx_nao_conformidades_classificacao ON public.nao_conformidades(classificacao);

-- Trigger para atualizar data_atualizacao automaticamente
CREATE OR REPLACE FUNCTION update_nao_conformidades_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_nao_conformidades_updated_at
    BEFORE UPDATE ON public.nao_conformidades
    FOR EACH ROW
    EXECUTE FUNCTION update_nao_conformidades_updated_at();
