
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, Usuario, Permissao, LoginCredentials } from '@/types/auth';
import { authService } from '@/services/authService';

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
    // Verificar se há uma sessão ativa
    const checkSession = () => {
      const sessionData = localStorage.getItem('sgq_auth_session');
      if (sessionData) {
        try {
          const { usuario, permissoes, timestamp } = JSON.parse(sessionData);
          
          // Verificar se a sessão não expirou (4 horas)
          const now = Date.now();
          const sessionAge = now - timestamp;
          const maxAge = 4 * 60 * 60 * 1000; // 4 horas
          
          if (sessionAge < maxAge) {
            setAuthState({
              isAuthenticated: true,
              usuario,
              permissoes
            });
          } else {
            // Sessão expirada, remover
            localStorage.removeItem('sgq_auth_session');
          }
        } catch (error) {
          console.error('Erro ao verificar sessão:', error);
          localStorage.removeItem('sgq_auth_session');
        }
      }
    };

    checkSession();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('=== INICIANDO LOGIN NO AUTHCONTEXT ===');
      console.log('Credenciais:', credentials);
      
      const result = await authService.login(credentials);
      console.log('Resultado do authService.login:', result);
      
      if (!result.success) {
        return { success: false, error: result.error };
      }

      // Salvar sessão no localStorage
      const sessionData = {
        usuario: result.usuario,
        permissoes: result.permissoes,
        timestamp: Date.now()
      };
      
      localStorage.setItem('sgq_auth_session', JSON.stringify(sessionData));
      
      setAuthState({
        isAuthenticated: true,
        usuario: result.usuario!,
        permissoes: result.permissoes!
      });

      console.log('Login realizado com sucesso no AuthContext');
      return { success: true };
    } catch (error) {
      console.error('Erro no login do AuthContext:', error);
      return { success: false, error: 'Erro interno no servidor' };
    }
  };

  const logout = () => {
    localStorage.removeItem('sgq_auth_session');
    setAuthState({
      isAuthenticated: false,
      usuario: null,
      permissoes: []
    });
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
