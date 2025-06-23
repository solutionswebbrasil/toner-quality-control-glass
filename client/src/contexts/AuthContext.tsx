
import React, { createContext, useContext, useState } from 'react';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';

interface User {
  id: string;
  nome_completo: string;
  usuario: string;
}

interface Permission {
  id: string;
  modulo: string;
  submenu: string;
  pode_visualizar: boolean;
  pode_editar: boolean;
  pode_excluir: boolean;
}

interface AuthContextType {
  user: User | null;
  permissions: Permission[];
  loading: boolean;
  signIn: (usuario: string, senha: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  hasPermission: (modulo: string, submenu: string, acao: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);

  const hasPermission = (modulo: string, submenu: string, acao: string): boolean => {
    if (!user || !permissions.length) return false;
    
    // Find permission for the module/submenu
    const permission = permissions.find(p => 
      p.modulo === modulo && p.submenu === submenu
    );
    
    if (!permission) return false;
    
    switch (acao) {
      case 'visualizar':
        return permission.pode_visualizar;
      case 'editar':
        return permission.pode_editar;
      case 'excluir':
        return permission.pode_excluir;
      default:
        return false;
    }
  };

  const signIn = async (usuario: string, senha: string) => {
    try {
      setLoading(true);
      
      const response = await authApi.login(usuario, senha);
      
      setUser(response.user);
      setPermissions(response.permissions || []);
      
      toast.success('Login realizado com sucesso!');
      return { error: null };
    } catch (error: any) {
      console.error('Error during login:', error);
      return { error: error.message || 'Erro durante o login' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setPermissions([]);
      localStorage.clear();
      sessionStorage.clear();
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Unexpected error during logout:', error);
    }
  };

  const value = {
    user,
    permissions,
    loading,
    signIn,
    signOut,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
