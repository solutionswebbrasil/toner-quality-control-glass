
import { supabase } from '@/integrations/supabase/client';

export const ensureAdminUser = async () => {
  try {
    console.log('=== INICIANDO VERIFICAÇÃO DO USUÁRIO ADMIN ===');
    
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
      console.log('Usuário admin já existe:', existingUsers[0]);
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

    console.log('Resultado da criação do usuário:', { newUser, createError });

    if (createError) {
      console.error('Erro ao criar usuário admin:', createError);
      return;
    }

    console.log('Usuário admin criado com sucesso:', newUser);

    // Verificar se o usuário foi criado
    const { data: verifyUser, error: verifyError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('usuario', 'admin@admin.com');

    console.log('Verificação após criação:', { verifyUser, verifyError });

    if (!verifyUser || verifyUser.length === 0) {
      console.error('Usuário não foi criado corretamente');
      return;
    }

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
      usuario_id: verifyUser[0].id,
      modulo: p.modulo,
      submenu: p.submenu,
      pode_visualizar: true,
      pode_editar: true,
      pode_excluir: true
    }));

    console.log('Criando permissões para usuário:', verifyUser[0].id);

    const { error: permError } = await supabase
      .from('permissoes')
      .insert(permissoes);

    if (permError) {
      console.error('Erro ao criar permissões admin:', permError);
    } else {
      console.log('Permissões admin criadas com sucesso');
    }

    console.log('=== FINALIZADA CONFIGURAÇÃO DO USUÁRIO ADMIN ===');

  } catch (error) {
    console.error('Erro geral ao configurar admin:', error);
  }
};
