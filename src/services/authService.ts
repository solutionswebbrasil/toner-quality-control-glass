
import { supabase } from '@/integrations/supabase/client';
import { Usuario, Permissao, LoginCredentials } from '@/types/auth';

class AuthService {
  private sessionTimeout = 4 * 60 * 60 * 1000; // 4 hours
  private sessionKey = 'sgq_auth_session';

  async login(credentials: LoginCredentials) {
    try {
      // Use the new password verification function
      const { data, error } = await supabase.rpc('verify_login', {
        input_usuario: credentials.usuario,
        input_senha: credentials.senha
      });

      if (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Erro interno no servidor' };
      }

      if (!data || data.length === 0) {
        return { success: false, error: 'Credenciais inválidas' };
      }

      const usuario = data[0];

      // Buscar permissões do usuário
      const permissoes = await this.getPermissoesByUsuario(usuario.id);

      // Create secure session with expiry
      const session = {
        usuario,
        permissoes,
        timestamp: Date.now(),
        expiresAt: Date.now() + this.sessionTimeout
      };

      // Store session with encryption-like obfuscation
      localStorage.setItem(this.sessionKey, btoa(JSON.stringify(session)));

      return { 
        success: true, 
        usuario, 
        permissoes 
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erro interno no servidor' };
    }
  }

  isSessionValid(): boolean {
    try {
      const sessionData = localStorage.getItem(this.sessionKey);
      if (!sessionData) return false;

      const session = JSON.parse(atob(sessionData));
      return Date.now() < session.expiresAt;
    } catch {
      return false;
    }
  }

  getStoredSession() {
    try {
      const sessionData = localStorage.getItem(this.sessionKey);
      if (!sessionData) return null;

      const session = JSON.parse(atob(sessionData));
      if (Date.now() >= session.expiresAt) {
        this.clearSession();
        return null;
      }

      return {
        usuario: session.usuario,
        permissoes: session.permissoes
      };
    } catch {
      this.clearSession();
      return null;
    }
  }

  clearSession() {
    localStorage.removeItem(this.sessionKey);
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
    // Hash password before storing
    const { data, error } = await supabase.rpc('create_user_with_hashed_password', {
      input_nome: userData.nome_completo,
      input_usuario: userData.usuario,
      input_senha: userData.senha
    });

    if (error) throw error;
    return data;
  }

  async updateUser(userId: string, userData: Partial<Usuario>): Promise<Usuario> {
    const updateData: any = {
      nome_completo: userData.nome_completo,
      usuario: userData.usuario
    };

    // If password is being updated, hash it
    if (userData.senha) {
      const { data, error } = await supabase.rpc('update_user_with_hashed_password', {
        input_user_id: userId,
        input_nome: userData.nome_completo,
        input_usuario: userData.usuario,
        input_senha: userData.senha
      });

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
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
