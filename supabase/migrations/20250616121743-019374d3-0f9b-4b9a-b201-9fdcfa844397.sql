
-- Criar bucket para armazenar os PDFs das auditorias
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true);

-- Criar política para permitir upload de arquivos
CREATE POLICY "Permitir upload de PDFs de auditoria" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'documents');

-- Criar política para permitir visualização dos PDFs
CREATE POLICY "Permitir visualização de PDFs de auditoria" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'documents');

-- Criar política para permitir download dos PDFs
CREATE POLICY "Permitir download de PDFs de auditoria" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'documents');

-- Criar política para permitir deletar PDFs
CREATE POLICY "Permitir deletar PDFs de auditoria" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'documents');
