
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
    // Verificar se há uma sessão salva no localStorage
    const savedAuth = localStorage.getItem('sgq_auth');
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        setAuthState(parsedAuth);
      } catch (error) {
        console.error('Erro ao recuperar sessão:', error);
        localStorage.removeItem('sgq_auth');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    const result = await authService.login(credentials);
    
    if (result.success && result.usuario && result.permissoes) {
      const newAuthState = {
        isAuthenticated: true,
        usuario: result.usuario,
        permissoes: result.permissoes
      };
      
      setAuthState(newAuthState);
      localStorage.setItem('sgq_auth', JSON.stringify(newAuthState));
      
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
    localStorage.removeItem('sgq_auth');
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
