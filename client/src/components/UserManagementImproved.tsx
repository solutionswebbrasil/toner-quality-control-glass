
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import {
  UserManagementPermissionCheck,
  UserManagementActions,
  CreateUserDialog,
  EditUserDialog,
  PermissionsDialog,
  ChangePasswordDialog
} from './userManagement';
import { UserTable } from './userManagement/UserTable';

interface Profile {
  id: string;
  nome_completo: string;
  email: string;
  role: string;
  created_at: string;
}

export const UserManagementImproved: React.FC = () => {
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

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Carregando profiles...');
      
      // Primeiro, verificar o usuário atual e suas permissões
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Erro ao verificar usuário:', userError);
        setError('Erro ao verificar usuário atual');
        return;
      }

      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      console.log('Usuário atual:', user.email);

      // Buscar profile do usuário atual para verificar role
      const { data: currentProfile, error: currentProfileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (currentProfileError) {
        console.error('Erro ao buscar profile atual:', currentProfileError);
        setError('Erro ao verificar permissões');
        return;
      }

      console.log('Profile atual:', currentProfile);

      // Buscar todos os profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Erro ao carregar profiles:', profilesError);
        setError('Erro ao carregar usuários: ' + profilesError.message);
        return;
      }

      console.log('Profiles encontrados:', profilesData?.length || 0);
      console.log('Dados dos profiles:', profilesData);
      
      // Se admin não conseguir ver outros profiles, pode ser problema de RLS
      if (currentProfile.role === 'admin' && (!profilesData || profilesData.length <= 1)) {
        console.log('Admin não está vendo outros profiles, tentando sincronização...');
        await syncAllUsers();
        
        // Tentar buscar novamente após sincronização
        const { data: newProfilesData, error: newProfilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (newProfilesError) {
          console.error('Erro após sincronização:', newProfilesError);
          setError('Erro ao carregar usuários após sincronização: ' + newProfilesError.message);
          return;
        }

        setProfiles(newProfilesData || []);
        console.log('Profiles após sincronização:', newProfilesData?.length || 0);
      } else {
        setProfiles(profilesData || []);
      }

    } catch (error) {
      console.error('Erro interno ao carregar profiles:', error);
      setError('Erro interno ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const syncAllUsers = async () => {
    try {
      console.log('Iniciando sincronização de usuários...');
      
      // Verificar se há usuários no auth que não estão na tabela profiles
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Erro ao buscar usuário para sincronização:', userError);
        return;
      }

      // Criar profile para o usuário atual se não existir
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        console.log('Criando profile para usuário atual:', user.email);
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            nome_completo: user.user_metadata?.nome_completo || 
                          user.user_metadata?.full_name || 
                          user.email.split('@')[0],
            role: user.email === 'admin@sgqpro.com' ? 'admin' : 'user'
          });

        if (insertError) {
          console.error('Erro ao criar profile:', insertError);
        } else {
          console.log('Profile criado com sucesso para:', user.email);
        }
      }
    } catch (error) {
      console.error('Erro na sincronização:', error);
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
      // Deletar o profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('Erro ao deletar perfil:', profileError);
        setError('Erro ao excluir usuário do perfil: ' + profileError.message);
        return;
      }

      setSuccess('Usuário excluído com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
      refreshProfiles();
    } catch (error) {
      setError('Erro interno ao excluir usuário');
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
    refreshProfiles(); // Atualizar lista após sucesso
  };

  const handleError = (message: string) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

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
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <UserTable
          profiles={profiles}
          onEditUser={handleEditUser}
          onDeleteUser={deleteUser}
          onRefresh={refreshProfiles}
          loading={loading}
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
