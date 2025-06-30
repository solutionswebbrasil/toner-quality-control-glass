
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, RefreshCw, Key, Shield, Plus } from 'lucide-react';

interface UserManagementActionsProps {
  profilesCount: number;
  refreshing: boolean;
  onRefresh: () => void;
  onOpenPassword: () => void;
  onOpenPermissions: () => void;
  onOpenCreateUser: () => void;
}

export const UserManagementActions: React.FC<UserManagementActionsProps> = ({
  profilesCount,
  refreshing,
  onRefresh,
  onOpenPassword,
  onOpenPermissions,
  onOpenCreateUser
}) => {
  const { hasPermission } = useAuth();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
        <Badge variant="outline">{profilesCount} usuários</Badge>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Sincronizando...' : 'Atualizar Lista'}
        </Button>

        <Button
          variant="outline"
          onClick={onOpenPassword}
          className="flex items-center gap-2"
        >
          <Key className="h-4 w-4" />
          Alterar Minha Senha
        </Button>

        {hasPermission('Configurações', 'Usuários', 'editar') && (
          <>
            <Button
              variant="outline"
              onClick={onOpenPermissions}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Gerenciar Permissões
            </Button>

            <Button
              onClick={onOpenCreateUser}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Criar Usuário
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
