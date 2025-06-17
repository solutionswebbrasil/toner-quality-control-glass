
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
    // Check for existing valid session
    if (authService.isSessionValid()) {
      const savedAuth = authService.getStoredSession();
      if (savedAuth) {
        setAuthState({
          isAuthenticated: true,
          usuario: savedAuth.usuario,
          permissoes: savedAuth.permissoes
        });
      }
    }

    // Set up session validation interval
    const intervalId = setInterval(() => {
      if (!authService.isSessionValid() && authState.isAuthenticated) {
        logout();
      }
    }, 60000); // Check every minute

    // Clear session on page unload for security
    const handleBeforeUnload = () => {
      if (authState.isAuthenticated) {
        authService.clearSession();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [authState.isAuthenticated]);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    const result = await authService.login(credentials);
    
    if (result.success && result.usuario && result.permissoes) {
      setAuthState({
        isAuthenticated: true,
        usuario: result.usuario,
        permissoes: result.permissoes
      });
      
      return { success: true };
    }
    
    return { success: false, error: result.error };
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      usuario: null,
      permissoes: []
    });
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
