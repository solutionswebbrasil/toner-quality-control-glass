
-- Criar tabela de títulos IT/POP
CREATE TABLE public.titulos_itpop (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de registros IT/POP
CREATE TABLE public.registros_itpop (
  id SERIAL PRIMARY KEY,
  titulo_id INTEGER NOT NULL REFERENCES public.titulos_itpop(id),
  versao INTEGER NOT NULL,
  arquivo_pdf TEXT,
  arquivo_ppt TEXT,
  data_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  registrado_por TEXT
);

-- Criar tabela de títulos BPMN
CREATE TABLE public.titulos_bpmn (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de registros BPMN
CREATE TABLE public.registros_bpmn (
  id SERIAL PRIMARY KEY,
  titulo_id INTEGER NOT NULL REFERENCES public.titulos_bpmn(id),
  versao INTEGER NOT NULL,
  arquivo_pdf TEXT,
  arquivo_jpg TEXT,
  arquivo_png TEXT,
  arquivo_bizagi TEXT,
  data_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  registrado_por TEXT
);

-- Habilitar Row Level Security nas novas tabelas
ALTER TABLE public.titulos_itpop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registros_itpop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.titulos_bpmn ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registros_bpmn ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para permitir acesso completo
CREATE POLICY "Allow all operations on titulos_itpop" ON public.titulos_itpop FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on registros_itpop" ON public.registros_itpop FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on titulos_bpmn" ON public.titulos_bpmn FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on registros_bpmn" ON public.registros_bpmn FOR ALL USING (true) WITH CHECK (true);

-- Inserir dados iniciais para IT/POP
INSERT INTO public.titulos_itpop (titulo, descricao) VALUES
('Procedimento de Backup', 'Procedimentos para backup de dados'),
('Instalação de Software', 'Guia de instalação de softwares corporativos'),
('Configuração de Rede', 'Configurações de rede e conectividade');

-- Inserir dados iniciais para BPMN
INSERT INTO public.titulos_bpmn (titulo, descricao) VALUES
('Processo de Aprovação', 'Fluxo de aprovação de documentos'),
('Fluxo de Vendas', 'Processo completo de vendas'),
('Gestão de Projetos', 'Fluxo de gestão e acompanhamento de projetos');
