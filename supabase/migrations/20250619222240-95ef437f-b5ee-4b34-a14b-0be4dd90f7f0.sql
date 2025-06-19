
-- Criar tabela para configurações SMTP
CREATE TABLE public.smtp_configuracoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  servidor_tipo TEXT NOT NULL CHECK (servidor_tipo IN ('Gmail', 'Outlook', 'Personalizado')),
  host_smtp TEXT NOT NULL,
  porta_smtp INTEGER NOT NULL,
  email_remetente TEXT NOT NULL,
  senha_email TEXT NOT NULL, -- Será criptografada no backend
  nome_remetente TEXT NOT NULL,
  usar_tls BOOLEAN NOT NULL DEFAULT true,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.smtp_configuracoes ENABLE ROW LEVEL SECURITY;

-- Política para apenas admins terem acesso
CREATE POLICY "Apenas admins podem gerenciar SMTP" 
  ON public.smtp_configuracoes 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_smtp_configuracoes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_smtp_configuracoes_updated_at
    BEFORE UPDATE ON public.smtp_configuracoes
    FOR EACH ROW
    EXECUTE FUNCTION update_smtp_configuracoes_updated_at();
