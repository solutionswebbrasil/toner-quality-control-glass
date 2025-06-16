
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
  }
};
