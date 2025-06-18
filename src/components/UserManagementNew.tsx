import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Crown, User, Trash2, AlertTriangle, Plus, Edit, Key, Shield, RefreshCw } from 'lucide-react';

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

export const UserManagementNew: React.FC = () => {
  const { profile, hasPermission } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Create user states
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', nome_completo: '', role: 'user' });
  
  // Edit user states
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  
  // Permissions states
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user');
  
  // Change password states
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Verificar se o usuário tem permissão para gerenciar usuários
  if (!hasPermission('Configurações', 'Usuários', 'visualizar')) {
    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Você não tem permissão para acessar o gerenciamento de usuários.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  useEffect(() => {
    loadProfiles();
    loadPermissions();
  }, []);

  // Função para sincronizar todos os usuários do auth com profiles
  const syncAllUsers = async () => {
    try {
      console.log('Executando sincronização completa de usuários...');
      
      // Primeiro, tentar buscar usuários do auth se temos permissões admin
      try {
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
        if (!authError && authUsers) {
          console.log(`Encontrados ${authUsers.users.length} usuários no auth`);
          
          // Para cada usuário do auth, garantir que existe no profiles
          for (const authUser of authUsers.users) {
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
                  email: authUser.email || '',
                  nome_completo: authUser.user_metadata?.nome_completo || authUser.email || '',
                  role: authUser.email === 'admin@sgqpro.com' ? 'admin' : 'user'
                });

              if (insertError) {
                console.error('Erro ao criar profile:', insertError);
              } else {
                console.log(`Profile criado para: ${authUser.email}`);
              }
            }
          }
        }
      } catch (authError) {
        console.log('Não foi possível acessar usuários do auth (esperado para não-admin):', authError);
      }

      // Forçar reload das permissões para garantir que tudo está sincronizado
      await loadPermissions();

    } catch (error) {
      console.error('Erro na sincronização:', error);
    }
  };

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Carregando profiles...');
      
      // Sincronizar usuários antes de carregar
      await syncAllUsers();
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError('Erro ao carregar usuários: ' + error.message);
        console.error('Erro ao carregar profiles:', error);
      } else {
        setProfiles(data || []);
        console.log('Profiles carregados:', data?.length || 0);
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

  const loadPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('modulo', { ascending: true });

      if (error) {
        console.error('Erro ao carregar permissões:', error);
      } else {
        setPermissions(data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
    }
  };

  const createUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.nome_completo) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    if (newUser.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      console.log('Criando usuário:', newUser.email);
      setError('');
      
      // Usar signUp normal
      const { data, error } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            nome_completo: newUser.nome_completo,
            role: newUser.role
          }
        }
      });

      if (error) {
        console.error('Erro ao criar usuário:', error);
        setError('Erro ao criar usuário: ' + error.message);
        return;
      }

      if (data.user) {
        console.log('Usuário criado:', data.user.email);
        
        // Aguardar um pouco para o trigger processar
        setTimeout(async () => {
          try {
            // Tentar criar o profile manualmente se não foi criado pelo trigger
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', data.user!.id)
              .single();

            if (!existingProfile) {
              console.log('Criando profile manualmente...');
              await supabase
                .from('profiles')
                .insert({
                  id: data.user!.id,
                  email: newUser.email,
                  nome_completo: newUser.nome_completo,
                  role: newUser.role
                });
            }

            // Recarregar a lista
            await refreshProfiles();
          } catch (syncError) {
            console.error('Erro na sincronização manual:', syncError);
          }
        }, 2000);

        setSuccess('Usuário criado com sucesso! O usuário receberá um email de confirmação.');
        setNewUser({ email: '', password: '', nome_completo: '', role: 'user' });
        setCreateUserOpen(false);
      }

    } catch (error) {
      console.error('Erro interno ao criar usuário:', error);
      setError('Erro interno ao criar usuário');
    }
  };

  const updateUser = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nome_completo: editingUser.nome_completo,
          email: editingUser.email,
          role: editingUser.role
        })
        .eq('id', editingUser.id);

      if (error) {
        setError('Erro ao atualizar usuário');
        console.error('Erro:', error);
        return;
      }

      setSuccess('Usuário atualizado com sucesso!');
      setEditUserOpen(false);
      setEditingUser(null);
      refreshProfiles();
    } catch (error) {
      setError('Erro interno');
      console.error('Erro:', error);
    }
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário ${userEmail}?`)) {
      return;
    }

    try {
      // Primeiro deletar o perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('Erro ao deletar perfil:', profileError);
        setError('Erro ao excluir usuário');
        return;
      }

      // Tentar deletar do auth (isso pode falhar se não tivermos permissões admin)
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

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Senhas não conferem');
      return;
    }

    if (newPassword.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        setError('Erro ao alterar senha: ' + error.message);
        return;
      }

      setSuccess('Senha alterada com sucesso!');
      setPasswordOpen(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError('Erro interno');
      console.error('Erro:', error);
    }
  };

  const updatePermission = async (permissionId: string, field: keyof Permission, value: boolean) => {
    try {
      const { error } = await supabase
        .from('permissions')
        .update({ [field]: value })
        .eq('id', permissionId);

      if (error) {
        setError('Erro ao atualizar permissão');
        console.error('Erro:', error);
        return;
      }

      // Atualizar estado local
      setPermissions(prev => prev.map(p => 
        p.id === permissionId ? { ...p, [field]: value } : p
      ));
    } catch (error) {
      setError('Erro interno');
      console.error('Erro:', error);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Crown className="h-3 w-3" />
            Admin
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <User className="h-3 w-3" />
            Usuário
          </Badge>
        );
    }
  };

  const rolePermissions = permissions.filter(p => p.role === selectedRole);

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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
          <Badge variant="outline">{profiles.length} usuários</Badge>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={refreshProfiles}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Sincronizando...' : 'Atualizar Lista'}
          </Button>

          <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Alterar Minha Senha
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Alterar Senha</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={changePassword}>Alterar Senha</Button>
                  <Button variant="outline" onClick={() => setPasswordOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {hasPermission('Configurações', 'Usuários', 'editar') && (
            <>
              <Dialog open={permissionsOpen} onOpenChange={setPermissionsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Gerenciar Permissões
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Gerenciar Permissões</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="role-select">Selecionar Role</Label>
                      <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Usuário</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="max-h-96 overflow-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr>
                            <th className="border border-gray-300 p-2 text-left">Módulo</th>
                            <th className="border border-gray-300 p-2 text-left">Submenu</th>
                            <th className="border border-gray-300 p-2 text-center">Ver</th>
                            <th className="border border-gray-300 p-2 text-center">Editar</th>
                            <th className="border border-gray-300 p-2 text-center">Excluir</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rolePermissions.map((permission) => (
                            <tr key={permission.id}>
                              <td className="border border-gray-300 p-2">{permission.modulo}</td>
                              <td className="border border-gray-300 p-2">{permission.submenu}</td>
                              <td className="border border-gray-300 p-2 text-center">
                                <Switch
                                  checked={permission.pode_visualizar}
                                  onCheckedChange={(checked) => 
                                    updatePermission(permission.id, 'pode_visualizar', checked)
                                  }
                                />
                              </td>
                              <td className="border border-gray-300 p-2 text-center">
                                <Switch
                                  checked={permission.pode_editar}
                                  onCheckedChange={(checked) => 
                                    updatePermission(permission.id, 'pode_editar', checked)
                                  }
                                />
                              </td>
                              <td className="border border-gray-300 p-2 text-center">
                                <Switch
                                  checked={permission.pode_excluir}
                                  onCheckedChange={(checked) => 
                                    updatePermission(permission.id, 'pode_excluir', checked)
                                  }
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={createUserOpen} onOpenChange={setCreateUserOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Criar Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Novo Usuário</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        value={newUser.nome_completo}
                        onChange={(e) => setNewUser(prev => ({ ...prev, nome_completo: e.target.value }))}
                        placeholder="Digite o nome completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Digite o email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Senha *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Usuário</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={createUser}>Criar Usuário</Button>
                      <Button variant="outline" onClick={() => setCreateUserOpen(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

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

      <div className="grid gap-4">
        {profiles.map((userProfile) => (
          <Card key={userProfile.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{userProfile.nome_completo}</h3>
                    {getRoleBadge(userProfile.role)}
                  </div>
                  <p className="text-sm text-gray-600">{userProfile.email}</p>
                  <p className="text-xs text-gray-500">
                    Criado em: {new Date(userProfile.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                {hasPermission('Configurações', 'Usuários', 'editar') && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingUser(userProfile);
                        setEditUserOpen(true);
                      }}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                    
                    {userProfile.role !== 'admin' && hasPermission('Configurações', 'Usuários', 'excluir') && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteUser(userProfile.id, userProfile.email)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {profiles.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhum usuário encontrado</p>
              <Button 
                onClick={refreshProfiles} 
                className="mt-4"
                variant="outline"
              >
                Sincronizar Usuários
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editUserOpen} onOpenChange={setEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nome Completo</Label>
                <Input
                  id="edit-name"
                  value={editingUser.nome_completo}
                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, nome_completo: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Role</Label>
                <Select 
                  value={editingUser.role} 
                  onValueChange={(value) => setEditingUser(prev => prev ? { ...prev, role: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={updateUser}>Salvar</Button>
                <Button variant="outline" onClick={() => setEditUserOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
