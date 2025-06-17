
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  nome_completo: string;
  email: string;
  role: string;
  created_at: string;
}

interface Permission {
  id: string;
  role: string;
  modulo: string;
  submenu: string;
  pode_visualizar: boolean;
  pode_editar: boolean;
  pode_excluir: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  permissions: Permission[];
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, nomeCompleto: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar perfil e permissões do usuário
  const loadUserData = async (userId: string) => {
    try {
      // Carregar perfil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Erro ao carregar perfil:', profileError);
        return;
      }

      setProfile(profileData);

      // Carregar permissões baseadas no role
      if (profileData?.role) {
        const { data: permissionsData, error: permissionsError } = await supabase
          .from('permissions')
          .select('*')
          .eq('role', profileData.role);

        if (permissionsError) {
          console.error('Erro ao carregar permissões:', permissionsError);
        } else {
          setPermissions(permissionsData || []);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  useEffect(() => {
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Usuário logado - carregar dados
          await loadUserData(session.user.id);
        } else {
          // Usuário deslogado - limpar dados
          setProfile(null);
          setPermissions([]);
        }
        
        setLoading(false);
      }
    );

    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Sessão inicial:', session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Tentando fazer login com:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
        return { error: error.message };
      }

      console.log('Login bem-sucedido:', data.user?.email);
      return { error: null };
    } catch (error) {
      console.error('Erro geral no login:', error);
      return { error: 'Erro interno no servidor' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, nomeCompleto: string) => {
    try {
      setLoading(true);
      console.log('Tentando criar conta:', email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome_completo: nomeCompleto,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('Erro no registro:', error);
        return { error: error.message };
      }

      console.log('Registro bem-sucedido:', data.user?.email);
      return { error: null };
    } catch (error) {
      console.error('Erro geral no registro:', error);
      return { error: 'Erro interno no servidor' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Fazendo logout...');
      await supabase.auth.signOut();
      console.log('Logout realizado');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const hasPermission = (modulo: string, submenu: string, acao: 'visualizar' | 'editar' | 'excluir'): boolean => {
    // Admin tem acesso total
    if (profile?.role === 'admin') {
      return true;
    }

    // Verificar permissão específica
    const permission = permissions.find(p => p.modulo === modulo && p.submenu === submenu);
    if (!permission) return false;

    switch (acao) {
      case 'visualizar': return permission.pode_visualizar;
      case 'editar': return permission.pode_editar;
      case 'excluir': return permission.pode_excluir;
      default: return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      permissions,
      loading,
      signIn,
      signUp,
      signOut,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};
