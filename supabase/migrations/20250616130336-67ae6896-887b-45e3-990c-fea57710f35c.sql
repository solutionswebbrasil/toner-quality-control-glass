
-- Primeiro, remover o trigger para evitar conflitos
DROP TRIGGER IF EXISTS trigger_set_bpmn_version ON public.registros_bpmn;

-- Remover colunas uma por vez para evitar deadlock
ALTER TABLE public.registros_bpmn DROP COLUMN IF EXISTS arquivo_pdf;
ALTER TABLE public.registros_bpmn DROP COLUMN IF EXISTS arquivo_jpg;
ALTER TABLE public.registros_bpmn DROP COLUMN IF EXISTS arquivo_bizagi;

-- Garantir que a coluna arquivo_png existe
ALTER TABLE public.registros_bpmn ADD COLUMN IF NOT EXISTS arquivo_png text;

-- Recriar a função de trigger
CREATE OR REPLACE FUNCTION public.set_bpmn_version()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Sempre calcular a próxima versão baseada no título_id
    NEW.versao := public.get_next_bpmn_version(NEW.titulo_id);
    RETURN NEW;
END;
$$;

-- Recriar o trigger
CREATE TRIGGER trigger_set_bpmn_version
    BEFORE INSERT ON public.registros_bpmn
    FOR EACH ROW
    EXECUTE FUNCTION public.set_bpmn_version();
