
-- Adicionar todas as permissões faltantes para o usuário admin.admin
INSERT INTO public.permissoes (usuario_id, modulo, submenu, pode_ver, pode_editar, pode_excluir, pode_cadastrar, pode_baixar)
SELECT 
  u.id,
  modulo_submenu.modulo,
  modulo_submenu.submenu,
  true, true, true, true, true
FROM public.usuarios u
CROSS JOIN (
  VALUES 
    ('Retornados', 'Registro'),
    ('Retornados', 'Consulta'),
    ('Retornados', 'Gráficos'),
    ('Garantias', 'Fornecedores Cadastro'),
    ('Garantias', 'Fornecedores Consulta'),
    ('Garantias', 'Registro'),
    ('Garantias', 'Consulta'),
    ('Garantias', 'Gráficos Gerais'),
    ('Garantias', 'Garantias Toners'),
    ('Garantias', 'Toners Consulta'),
    ('Garantias', 'Toners Gráficos'),
    ('Auditorias', 'Registro'),
    ('Auditorias', 'Consulta'),
    ('Não Conformidades', 'Registro'),
    ('Não Conformidades', 'Consulta'),
    ('Não Conformidades', 'Gráficos'),
    ('IT/POP', 'Título Cadastro'),
    ('IT/POP', 'Título Consulta'),
    ('IT/POP', 'Registro'),
    ('IT/POP', 'Registros Consulta'),
    ('IT/POP', 'Visualizar'),
    ('BPMN', 'Título Cadastro'),
    ('BPMN', 'Título Consulta'),
    ('BPMN', 'Registro'),
    ('BPMN', 'Registros Consulta'),
    ('BPMN', 'Visualizar'),
    ('Certificados', 'Registro'),
    ('Certificados', 'Consulta'),
    ('Configurações', 'Filiais Cadastro'),
    ('Configurações', 'Filiais Consulta'),
    ('Configurações', 'Retornado'),
    ('Configurações', 'Usuários')
) AS modulo_submenu(modulo, submenu)
WHERE u.usuario = 'admin.admin'
ON CONFLICT (usuario_id, modulo, submenu) DO UPDATE SET
  pode_ver = true,
  pode_editar = true,
  pode_excluir = true,
  pode_cadastrar = true,
  pode_baixar = true;
