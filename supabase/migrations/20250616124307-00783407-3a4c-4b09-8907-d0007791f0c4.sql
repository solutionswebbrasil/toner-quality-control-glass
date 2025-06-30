
-- Atualizar tabela registros_bpmn para calcular versão automaticamente
ALTER TABLE public.registros_bpmn ALTER COLUMN versao DROP NOT NULL;
ALTER TABLE public.registros_bpmn ALTER COLUMN versao SET DEFAULT 1;

-- Criar função para calcular próxima versão BPMN
CREATE OR REPLACE FUNCTION public.get_next_bpmn_version(titulo_id_param INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    next_version INTEGER;
BEGIN
    SELECT COALESCE(MAX(versao), 0) + 1
    INTO next_version
    FROM public.registros_bpmn
    WHERE titulo_id = titulo_id_param;
    
    RETURN next_version;
END;
$$;

-- Criar trigger para calcular versão automaticamente
CREATE OR REPLACE FUNCTION public.set_bpmn_version()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.versao IS NULL THEN
        NEW.versao := public.get_next_bpmn_version(NEW.titulo_id);
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_bpmn_version
    BEFORE INSERT ON public.registros_bpmn
    FOR EACH ROW
    EXECUTE FUNCTION public.set_bpmn_version();
