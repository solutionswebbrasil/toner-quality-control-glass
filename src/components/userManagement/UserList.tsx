
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Crown, User, Trash2, Edit } from 'lucide-react';

interface Profile {
  id: string;
  nome_completo: string;
  email: string;
  role: string;
  created_at: string;
}

interface UserListProps {
  profiles: Profile[];
  onEditUser: (user: Profile) => void;
  onDeleteUser: (userId: string, userEmail: string) => void;
  onRefresh: () => void;
}

export const UserList: React.FC<UserListProps> = ({
  profiles,
  onEditUser,
  onDeleteUser,
  onRefresh
}) => {
  const { hasPermission } = useAuth();

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

  if (profiles.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Nenhum usuário encontrado</p>
          <Button 
            onClick={onRefresh} 
            className="mt-4"
            variant="outline"
          >
            Sincronizar Usuários
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
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
                    onClick={() => onEditUser(userProfile)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                  
                  {userProfile.role !== 'admin' && hasPermission('Configurações', 'Usuários', 'excluir') && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteUser(userProfile.id, userProfile.email)}
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
    </div>
  );
};
