
-- Criar todas as tabelas que estão faltando nos tipos do Supabase
-- Estas tabelas foram mencionadas na primeira migração mas não foram criadas

-- Criar tabela de fornecedores
CREATE TABLE public.fornecedores (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  link_rma TEXT NOT NULL,
  data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de toners
CREATE TABLE public.toners (
  id SERIAL PRIMARY KEY,
  modelo TEXT NOT NULL,
  peso_cheio DECIMAL(10,2) NOT NULL,
  peso_vazio DECIMAL(10,2) NOT NULL,
  gramatura DECIMAL(10,2) NOT NULL,
  preco_produto DECIMAL(10,2) NOT NULL,
  capacidade_folhas INTEGER NOT NULL,
  valor_por_folha DECIMAL(10,4) NOT NULL,
  impressoras_compat TEXT NOT NULL,
  cor TEXT NOT NULL,
  registrado_por INTEGER NOT NULL,
  data_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de retornados
CREATE TABLE public.retornados (
  id SERIAL PRIMARY KEY,
  id_modelo INTEGER NOT NULL REFERENCES public.toners(id),
  id_cliente INTEGER NOT NULL,
  peso DECIMAL(10,2) NOT NULL,
  destino_final TEXT NOT NULL CHECK (destino_final IN ('Descarte', 'Garantia', 'Estoque', 'Uso Interno')),
  filial TEXT NOT NULL,
  data_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valor_recuperado DECIMAL(10,2)
);

-- Criar tabela de garantias
CREATE TABLE public.garantias (
  id SERIAL PRIMARY KEY,
  item TEXT NOT NULL,
  quantidade INTEGER NOT NULL,
  defeito TEXT NOT NULL,
  fornecedor_id INTEGER NOT NULL REFERENCES public.fornecedores(id),
  nf_compra_pdf TEXT,
  nf_remessa_pdf TEXT,
  nf_devolucao_pdf TEXT,
  status TEXT NOT NULL DEFAULT 'aberta' CHECK (status IN ('aberta', 'em_analise', 'concluida', 'recusada', 'aguardando_fornecedor')),
  resultado TEXT CHECK (resultado IN ('devolucao_credito', 'trocado', 'consertado', '')),
  valor_unitario DECIMAL(10,2) NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  data_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de auditorias
CREATE TABLE public.auditorias (
  id SERIAL PRIMARY KEY,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  unidade_auditada TEXT NOT NULL,
  formulario_pdf TEXT,
  data_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security (RLS) em todas as tabelas
ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retornados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garantias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditorias ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para permitir acesso completo
CREATE POLICY "Allow all operations on fornecedores" ON public.fornecedores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on toners" ON public.toners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on retornados" ON public.retornados FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on garantias" ON public.garantias FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on auditorias" ON public.auditorias FOR ALL USING (true) WITH CHECK (true);

-- Inserir dados iniciais para teste
INSERT INTO public.fornecedores (nome, telefone, link_rma) VALUES
('HP Brasil', '(11) 3456-7890', 'https://support.hp.com/br-pt/rma'),
('Canon Brasil', '(11) 2345-6789', 'https://canon.com.br/suporte/rma');

INSERT INTO public.toners (modelo, peso_cheio, peso_vazio, gramatura, preco_produto, capacidade_folhas, valor_por_folha, impressoras_compat, cor, registrado_por) VALUES
('HP 85A', 850.5, 120.0, 730.5, 89.90, 1600, 0.056, 'HP LaserJet P1102, P1102w, M1130, M1132, M1134, M1136, M1137, M1138, M1210, M1212nf, M1213nf, M1214nfh, M1216nfh, M1217nfw', 'Preto', 1),
('Canon 725', 780.0, 110.0, 670.0, 95.50, 1600, 0.060, 'Canon LBP6000, LBP6020, LBP6030, MF3010', 'Preto', 1);

INSERT INTO public.retornados (id_modelo, id_cliente, peso, destino_final, filial, valor_recuperado) VALUES
(1, 101, 125.5, 'Estoque', 'Matriz', 25.50),
(2, 102, 115.0, 'Descarte', 'Filial 1', null);

INSERT INTO public.garantias (item, quantidade, defeito, fornecedor_id, status, resultado, valor_unitario, valor_total) VALUES
('Impressora HP LaserJet P1102', 2, 'Não está imprimindo, display com erro', 1, 'em_analise', '', 450.00, 900.00),
('Scanner Canon LiDE 300', 1, 'Não reconhece documentos, luz não acende', 2, 'concluida', 'trocado', 180.00, 180.00);

INSERT INTO public.auditorias (data_inicio, data_fim, unidade_auditada, formulario_pdf) VALUES
('2024-02-01', '2024-02-03', 'Matriz - São Paulo', 'auditoria_matriz_feb2024.pdf'),
('2024-01-15', '2024-01-17', 'Filial Rio de Janeiro', 'auditoria_rj_jan2024.pdf');

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
