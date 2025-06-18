
-- Verificar se o trigger handle_new_user existe e está funcionando
-- Se não existir, vamos criá-lo

-- Criar ou atualizar a função que cria o perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome_completo, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nome_completo', new.email),
    new.email,
    CASE 
      WHEN new.email = 'admin@sgqpro.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN new;
END;
$$;

-- Criar o trigger se não existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sincronizar usuários existentes que podem não ter perfil
INSERT INTO public.profiles (id, nome_completo, email, role)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'nome_completo', au.email) as nome_completo,
  au.email,
  CASE 
    WHEN au.email = 'admin@sgqpro.com' THEN 'admin'
    ELSE 'user'
  END as role
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
