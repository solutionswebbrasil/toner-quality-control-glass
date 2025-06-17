
import React, { useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { Usuario } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { UserPlus, Trash2, Edit, Shield, Users } from 'lucide-react';
import { UserPermissionsModal } from './UserPermissionsModal';
import { UserEditModal } from './UserEditModal';

export const UserManagement: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nome_completo: '',
    usuario: '',
    senha: ''
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      const data = await authService.getAllUsuarios();
      setUsuarios(data);
    } catch (error) {
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      await authService.createUser(formData);
      setIsCreateModalOpen(false);
      setFormData({ nome_completo: '', usuario: '', senha: '' });
      loadUsuarios();
    } catch (error) {
      setError('Erro ao criar usuário');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await authService.deleteUser(userId);
        loadUsuarios();
      } catch (error) {
        setError('Erro ao excluir usuário');
      }
    }
  };

  const openPermissionsModal = (user: Usuario) => {
    setSelectedUser(user);
    setIsPermissionsModalOpen(true);
  };

  const openEditModal = (user: Usuario) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return <div className="p-6">Carregando usuários...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome_completo">Nome Completo</Label>
                <Input
                  id="nome_completo"
                  value={formData.nome_completo}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome_completo: e.target.value }))}
                  placeholder="Digite o nome completo"
                />
              </div>
              <div>
                <Label htmlFor="usuario">Usuário</Label>
                <Input
                  id="usuario"
                  value={formData.usuario}
                  onChange={(e) => setFormData(prev => ({ ...prev, usuario: e.target.value }))}
                  placeholder="Digite o nome de usuário"
                />
              </div>
              <div>
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
                  placeholder="Digite a senha"
                />
              </div>
              <Button onClick={handleCreateUser} className="w-full">
                Criar Usuário
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {usuarios.map((usuario) => (
          <Card key={usuario.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{usuario.nome_completo}</h3>
                  <p className="text-sm text-gray-600">@{usuario.usuario}</p>
                  <p className="text-xs text-gray-500">
                    Criado em: {new Date(usuario.criado_em).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(usuario)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openPermissionsModal(usuario)}
                    className="flex items-center gap-1"
                  >
                    <Shield className="h-4 w-4" />
                    Permissões
                  </Button>
                  
                  {usuario.usuario !== 'admin.admin' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(usuario.id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedUser && (
        <>
          <UserPermissionsModal
            user={selectedUser}
            isOpen={isPermissionsModalOpen}
            onClose={() => {
              setIsPermissionsModalOpen(false);
              setSelectedUser(null);
            }}
          />
          
          <UserEditModal
            user={selectedUser}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}
            onSuccess={loadUsuarios}
          />
        </>
      )}
    </div>
  );
};
