
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, Usuario, Permissao, LoginCredentials } from '@/types/auth';
import { authService } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasPermission: (modulo: string, submenu: string, acao: 'visualizar' | 'editar' | 'excluir') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    usuario: null,
    permissoes: []
  });

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Get user data from usuarios table
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userData && !userError) {
          // Get user permissions
          const permissoes = await authService.getPermissoesByUsuario(userData.id);
          
          setAuthState({
            isAuthenticated: true,
            usuario: userData,
            permissoes
          });
        }
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        setAuthState({
          isAuthenticated: false,
          usuario: null,
          permissoes: []
        });
      } else if (event === 'SIGNED_IN' && session?.user) {
        // Get user data from usuarios table
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userData && !userError) {
          // Get user permissions
          const permissoes = await authService.getPermissoesByUsuario(userData.id);
          
          setAuthState({
            isAuthenticated: true,
            usuario: userData,
            permissoes
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      // First verify credentials with custom auth
      const result = await authService.login(credentials);
      
      if (!result.success) {
        return { success: false, error: result.error };
      }

      // If custom auth succeeds, sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${credentials.usuario}@sgq.local`, // Create a local email format
        password: credentials.senha
      });

      if (error) {
        // If Supabase user doesn't exist, create it
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: `${credentials.usuario}@sgq.local`,
          password: credentials.senha,
          options: {
            data: {
              user_id: result.usuario?.id
            }
          }
        });

        if (signUpError) {
          console.error('Error creating Supabase user:', signUpError);
          return { success: false, error: 'Erro ao criar sessão' };
        }

        // Update the usuarios table with the Supabase auth ID
        if (signUpData.user && result.usuario) {
          await supabase
            .from('usuarios')
            .update({ id: signUpData.user.id })
            .eq('id', result.usuario.id);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erro interno no servidor' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    authService.clearSession();
  };

  const hasPermission = (modulo: string, submenu: string, acao: 'visualizar' | 'editar' | 'excluir'): boolean => {
    const permissao = authState.permissoes.find(p => p.modulo === modulo && p.submenu === submenu);
    if (!permissao) return false;

    switch (acao) {
      case 'visualizar': return permissao.pode_visualizar;
      case 'editar': return permissao.pode_editar;
      case 'excluir': return permissao.pode_excluir;
      default: return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};
