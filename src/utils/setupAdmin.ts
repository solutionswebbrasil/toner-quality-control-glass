
import { supabase } from '@/integrations/supabase/client';

export const ensureAdminUser = async () => {
  try {
    // Verificar se o usuário admin existe
    const { data: existingUsers, error: checkError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('usuario', 'admin@admin.com');

    console.log('Verificando usuário admin:', { existingUsers, checkError });

    if (checkError) {
      console.error('Erro ao verificar usuário admin:', checkError);
      return;
    }

    if (existingUsers && existingUsers.length > 0) {
      console.log('Usuário admin já existe');
      return;
    }

    console.log('Criando usuário admin...');

    // Criar usuário admin usando a edge function
    const { data: newUser, error: createError } = await supabase.functions.invoke('auth-helpers', {
      body: {
        action: 'create_user_with_hashed_password',
        input_nome: 'Administrador do Sistema',
        input_usuario: 'admin@admin.com',
        input_senha: 'Pandora@1989'
      }
    });

    if (createError) {
      console.error('Erro ao criar usuário admin:', createError);
      return;
    }

    console.log('Usuário admin criado com sucesso:', newUser);

    // Criar permissões admin
    const modulosPermissoes = [
      { modulo: 'Retornados', submenu: 'Registro' },
      { modulo: 'Retornados', submenu: 'Consulta' },
      { modulo: 'Retornados', submenu: 'Gráficos' },
      { modulo: 'Garantias', submenu: 'Fornecedores Cadastro' },
      { modulo: 'Garantias', submenu: 'Fornecedores Consulta' },
      { modulo: 'Garantias', submenu: 'Registro' },
      { modulo: 'Garantias', submenu: 'Consulta' },
      { modulo: 'Garantias', submenu: 'Gráficos Gerais' },
      { modulo: 'Garantias', submenu: 'Garantias Toners' },
      { modulo: 'Garantias', submenu: 'Toners Consulta' },
      { modulo: 'Garantias', submenu: 'Toners Gráficos' },
      { modulo: 'Auditorias', submenu: 'Registro' },
      { modulo: 'Auditorias', submenu: 'Consulta' },
      { modulo: 'Não Conformidades', submenu: 'Registro' },
      { modulo: 'Não Conformidades', submenu: 'Consulta' },
      { modulo: 'Não Conformidades', submenu: 'Gráficos' },
      { modulo: 'Certificados', submenu: 'Registro' },
      { modulo: 'Certificados', submenu: 'Consulta' },
      { modulo: 'Configurações', submenu: 'Filiais Cadastro' },
      { modulo: 'Configurações', submenu: 'Filiais Consulta' },
      { modulo: 'Configurações', submenu: 'Retornado' },
      { modulo: 'Configurações', submenu: 'Usuários' }
    ];

    const permissoes = modulosPermissoes.map(p => ({
      usuario_id: newUser.id,
      modulo: p.modulo,
      submenu: p.submenu,
      pode_visualizar: true,
      pode_editar: true,
      pode_excluir: true
    }));

    const { error: permError } = await supabase
      .from('permissoes')
      .insert(permissoes);

    if (permError) {
      console.error('Erro ao criar permissões admin:', permError);
    } else {
      console.log('Permissões admin criadas com sucesso');
    }

  } catch (error) {
    console.error('Erro geral ao configurar admin:', error);
  }
};
