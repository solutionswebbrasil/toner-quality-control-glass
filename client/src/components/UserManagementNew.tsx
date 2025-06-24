import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import {
  UserManagementPermissionCheck,
  UserManagementActions,
  UserList,
  CreateUserDialog,
  EditUserDialog,
  PermissionsDialog,
  ChangePasswordDialog
} from './userManagement';

interface Profile {
  id: string;
  nome_completo: string;
  email: string;
  role: string;
  created_at: string;
}

export const UserManagementNew: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dialog states
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  const syncAllUsers = async () => {
    try {
      console.log('Executando sincronização completa de usuários...');
      
      // Buscar todos os usuários do auth usando a API admin (se disponível)
      try {
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
        if (!authError && authUsers?.users) {
          console.log(`Encontrados ${authUsers.users.length} usuários no auth`);
          
          for (const authUser of authUsers.users) {
            if (authUser.email) {
              const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', authUser.id)
                .single();

              if (!existingProfile) {
                console.log(`Criando profile para usuário: ${authUser.email}`);
                const { error: insertError } = await supabase
                  .from('profiles')
                  .insert({
                    id: authUser.id,
                    email: authUser.email,
                    nome_completo: authUser.user_metadata?.nome_completo || 
                                  authUser.user_metadata?.full_name || 
                                  authUser.email.split('@')[0],
                    role: authUser.email === 'admin@sgqpro.com' ? 'admin' : 'user'
                  });

                if (insertError) {
                  console.error('Erro ao criar profile:', insertError);
                } else {
                  console.log(`Profile criado para: ${authUser.email}`);
                }
              } else {
                // Atualizar dados do profile existente se necessário
                const { error: updateError } = await supabase
                  .from('profiles')
                  .update({
                    email: authUser.email,
                    nome_completo: authUser.user_metadata?.nome_completo || 
                                  authUser.user_metadata?.full_name || 
                                  authUser.email.split('@')[0]
                  })
                  .eq('id', authUser.id);

                if (updateError) {
                  console.error('Erro ao atualizar profile:', updateError);
                }
              }
            }
          }
        }
      } catch (authError) {
        console.log('Admin API não disponível, tentando método alternativo...');
        
        // Método alternativo: verificar se há usuários no profiles que não estão sincronizados
        const { data: currentProfiles } = await supabase
          .from('profiles')
          .select('*');
        
        console.log(`Profiles atuais: ${currentProfiles?.length || 0}`);
      }
    } catch (error) {
      console.error('Erro na sincronização:', error);
    }
  };

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Carregando profiles...');
      
      // Primeira sincronização
      await syncAllUsers();
      
      // Buscar todos os profiles
      const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (error) {
        setError('Erro ao carregar usuários: ' + error.message);
        console.error('Erro ao carregar profiles:', error);
      } else {
        setProfiles(data || []);
        console.log(`Profiles carregados: ${data?.length || 0} (total no banco: ${count})`);
      }
    } catch (error) {
      setError('Erro interno ao carregar usuários');
      console.error('Erro interno:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfiles = async () => {
    setRefreshing(true);
    setError('');
    setSuccess('');
    
    try {
      await loadProfiles();
      setSuccess('Lista de usuários atualizada com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Erro ao atualizar lista de usuários');
    } finally {
      setRefreshing(false);
    }
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário ${userEmail}?`)) {
      return;
    }

    try {
      // Primeiro deletar o profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('Erro ao deletar perfil:', profileError);
        setError('Erro ao excluir usuário do perfil');
        return;
      }

      // Tentar deletar do auth (pode falhar se não for admin)
      try {
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);
        if (authError) {
          console.log('Não foi possível deletar do auth (normal para usuários não-admin):', authError);
        }
      } catch (authErr) {
        console.log('Erro esperado ao tentar deletar do auth:', authErr);
      }

      setSuccess('Usuário excluído com sucesso!');
      refreshProfiles();
    } catch (error) {
      setError('Erro interno');
      console.error('Erro:', error);
    }
  };

  const handleEditUser = (user: Profile) => {
    setEditingUser(user);
    setEditUserOpen(true);
  };

  const handleSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleError = (message: string) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <UserManagementPermissionCheck>
      <div className="p-6 space-y-6">
        <UserManagementActions
          profilesCount={profiles.length}
          refreshing={refreshing}
          onRefresh={refreshProfiles}
          onOpenPassword={() => setPasswordOpen(true)}
          onOpenPermissions={() => setPermissionsOpen(true)}
          onOpenCreateUser={() => setCreateUserOpen(true)}
        />

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <UserList
          profiles={profiles}
          onEditUser={handleEditUser}
          onDeleteUser={deleteUser}
          onRefresh={refreshProfiles}
        />

        <CreateUserDialog
          open={createUserOpen}
          onOpenChange={setCreateUserOpen}
          onSuccess={handleSuccess}
          onError={handleError}
          onRefresh={refreshProfiles}
        />

        <EditUserDialog
          open={editUserOpen}
          onOpenChange={setEditUserOpen}
          user={editingUser}
          onSuccess={handleSuccess}
          onError={handleError}
          onRefresh={refreshProfiles}
        />

        <PermissionsDialog
          open={permissionsOpen}
          onOpenChange={setPermissionsOpen}
          onError={handleError}
        />

        <ChangePasswordDialog
          open={passwordOpen}
          onOpenChange={setPasswordOpen}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </UserManagementPermissionCheck>
  );
};
