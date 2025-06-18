
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const UserManagementPermissionCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { hasPermission } = useAuth();

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

  return <>{children}</>;
};
