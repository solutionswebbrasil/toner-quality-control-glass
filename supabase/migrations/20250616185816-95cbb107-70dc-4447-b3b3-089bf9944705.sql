
-- Adicionar campo NS (Número de Série) na tabela de garantias existente
ALTER TABLE public.garantias 
ADD COLUMN ns TEXT;

-- Adicionar campos NS e Lote na tabela de garantias de toners
ALTER TABLE public.garantias_toners 
ADD COLUMN ns TEXT,
ADD COLUMN lote TEXT;
