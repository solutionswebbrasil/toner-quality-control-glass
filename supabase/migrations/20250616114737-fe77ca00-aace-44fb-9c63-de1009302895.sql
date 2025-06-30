
-- Criar bucket para armazenar os PDFs das garantias
INSERT INTO storage.buckets (id, name, public) 
VALUES ('garantia-pdfs', 'garantia-pdfs', true);

-- Criar política para permitir upload de arquivos
CREATE POLICY "Permitir upload de PDFs de garantia" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'garantia-pdfs');

-- Criar política para permitir visualização dos PDFs
CREATE POLICY "Permitir visualização de PDFs de garantia" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'garantia-pdfs');

-- Criar política para permitir download dos PDFs
CREATE POLICY "Permitir download de PDFs de garantia" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'garantia-pdfs');
