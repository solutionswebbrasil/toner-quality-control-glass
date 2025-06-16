
import { supabase } from '@/integrations/supabase/client';
import { Usuario, Permissao, LoginCredentials } from '@/types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ success: boolean; usuario?: Usuario; permissoes?: Permissao[]; error?: string }> {
    try {
      // Buscar usuário pelas credenciais
      const { data: usuario, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('usuario', credentials.usuario)
        .eq('senha', credentials.senha)
        .single();

      if (userError || !usuario) {
        return { success: false, error: 'Credenciais inválidas' };
      }

      // Buscar permissões do usuário
      const { data: permissoes, error: permError } = await supabase
        .from('permissoes')
        .select('*')
        .eq('usuario_id', usuario.id);

      if (permError) {
        return { success: false, error: 'Erro ao carregar permissões' };
      }

      return { success: true, usuario, permissoes: permissoes || [] };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  },

  async getAllUsuarios(): Promise<Usuario[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('nome_completo');

    if (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }

    return data || [];
  },

  async getPermissoesByUsuario(usuarioId: string): Promise<Permissao[]> {
    const { data, error } = await supabase
      .from('permissoes')
      .select('*')
      .eq('usuario_id', usuarioId);

    if (error) {
      console.error('Erro ao buscar permissões:', error);
      return [];
    }

    return data || [];
  },

  async createUser(userData: { nome_completo: string; usuario: string; senha: string }): Promise<Usuario> {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([userData])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar usuário:', error);
      throw new Error('Erro ao criar usuário');
    }

    return data;
  },

  async deleteUser(usuarioId: string): Promise<void> {
    // Primeiro, excluir todas as permissões do usuário
    await supabase
      .from('permissoes')
      .delete()
      .eq('usuario_id', usuarioId);

    // Depois, excluir o usuário
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', usuarioId);

    if (error) {
      console.error('Erro ao excluir usuário:', error);
      throw new Error('Erro ao excluir usuário');
    }
  },

  async updateUserPermissions(usuarioId: string, permissoes: Permissao[]): Promise<void> {
    // Primeiro, excluir todas as permissões existentes do usuário
    await supabase
      .from('permissoes')
      .delete()
      .eq('usuario_id', usuarioId);

    // Depois, inserir as novas permissões (apenas as que têm pelo menos uma permissão verdadeira)
    const permissoesParaInserir = permissoes
      .filter(p => p.pode_ver || p.pode_editar || p.pode_excluir || p.pode_cadastrar || p.pode_baixar)
      .map(p => ({
        usuario_id: usuarioId,
        modulo: p.modulo,
        submenu: p.submenu,
        pode_ver: p.pode_ver,
        pode_editar: p.pode_editar,
        pode_excluir: p.pode_excluir,
        pode_cadastrar: p.pode_cadastrar,
        pode_baixar: p.pode_baixar
      }));

    if (permissoesParaInserir.length > 0) {
      const { error } = await supabase
        .from('permissoes')
        .insert(permissoesParaInserir);

      if (error) {
        console.error('Erro ao atualizar permissões:', error);
        throw new Error('Erro ao atualizar permissões');
      }
    }
  }
};
