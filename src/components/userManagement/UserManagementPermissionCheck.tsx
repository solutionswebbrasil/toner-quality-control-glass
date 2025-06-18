
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const UserManagementPermissionCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Administrador tem acesso total
  if (profile?.role === 'admin') {
    return <>{children}</>;
  }

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
};
