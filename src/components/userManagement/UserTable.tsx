
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, User, Edit, Trash2, Users } from 'lucide-react';

interface Profile {
  id: string;
  nome_completo: string;
  email: string;
  role: string;
  created_at: string;
}

interface UserTableProps {
  profiles: Profile[];
  onEditUser: (user: Profile) => void;
  onDeleteUser: (userId: string, userEmail: string) => void;
  onRefresh: () => void;
  loading: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({
  profiles,
  onEditUser,
  onDeleteUser,
  onRefresh,
  loading
}) => {
  const { hasPermission } = useAuth();

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge variant="destructive" className="flex items-center gap-1 w-fit">
            <Crown className="h-3 w-3" />
            Admin
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
            <User className="h-3 w-3" />
            Usuário
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando usuários...</p>
        </CardContent>
      </Card>
    );
  }

  if (profiles.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">Nenhum usuário encontrado</p>
          <Button onClick={onRefresh} variant="outline">
            Sincronizar Usuários
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome Completo</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Criado em</TableHead>
              {hasPermission('Configurações', 'Usuários', 'editar') && (
                <TableHead>Ações</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((userProfile) => (
              <TableRow key={userProfile.id}>
                <TableCell className="font-medium">
                  {userProfile.nome_completo}
                </TableCell>
                <TableCell>{userProfile.email}</TableCell>
                <TableCell>{getRoleBadge(userProfile.role)}</TableCell>
                <TableCell>
                  {new Date(userProfile.created_at).toLocaleDateString('pt-BR')}
                </TableCell>
                {hasPermission('Configurações', 'Usuários', 'editar') && (
                  <TableCell>
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
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
