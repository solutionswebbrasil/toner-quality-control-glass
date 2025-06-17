
import { supabase } from '@/integrations/supabase/client';
import { Usuario, Permissao, LoginCredentials } from '@/types/auth';

class AuthService {
  async login(credentials: LoginCredentials) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('usuario', credentials.usuario)
      .eq('senha', credentials.senha)
      .single();

    if (error || !data) {
      throw new Error('Credenciais inválidas');
    }

    return data;
  }

  async getPermissoesByUsuario(usuarioId: string): Promise<Permissao[]> {
    const { data, error } = await supabase
      .from('permissoes')
      .select('*')
      .eq('usuario_id', usuarioId);

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      usuario_id: item.usuario_id,
      modulo: item.modulo,
      submenu: item.submenu,
      pode_visualizar: item.pode_visualizar || false,
      pode_editar: item.pode_editar || false,
      pode_excluir: item.pode_excluir || false
    }));
  }

  async getAllUsuarios(): Promise<Usuario[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) throw error;
    return data;
  }

  async createUser(userData: { nome_completo: string; usuario: string; senha: string }): Promise<Usuario> {
    const { data, error } = await supabase
      .from('usuarios')
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateUser(userId: string, userData: Partial<Usuario>): Promise<Usuario> {
    const { data, error } = await supabase
      .from('usuarios')
      .update(userData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', userId);

    if (error) throw error;
  }

  async updateUserPermissions(usuarioId: string, permissoes: Permissao[]): Promise<void> {
    // Primeiro, deletar todas as permissões existentes do usuário
    await supabase
      .from('permissoes')
      .delete()
      .eq('usuario_id', usuarioId);

    // Filtrar apenas permissões que têm pelo menos uma ação marcada
    const permissoesAtivas = permissoes.filter(p => 
      p.pode_visualizar || p.pode_editar || p.pode_excluir
    );

    if (permissoesAtivas.length > 0) {
      // Inserir as novas permissões
      const { error } = await supabase
        .from('permissoes')
        .insert(
          permissoesAtivas.map(p => ({
            usuario_id: usuarioId,
            modulo: p.modulo,
            submenu: p.submenu,
            pode_visualizar: p.pode_visualizar || false,
            pode_editar: p.pode_editar || false,
            pode_excluir: p.pode_excluir || false
          }))
        );

      if (error) throw error;
    }
  }
}

export const authService = new AuthService();
