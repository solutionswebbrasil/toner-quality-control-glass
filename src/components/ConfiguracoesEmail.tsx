
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SmtpConfigForm } from '@/components/smtp';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

export const ConfiguracoesEmail: React.FC = () => {
  const { profile } = useAuth();

  if (profile?.role !== 'admin') {
    return (
      <div className="p-6">
        <Alert className="border-amber-200 bg-amber-50">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Acesso restrito. Esta funcionalidade está disponível apenas para administradores.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <SmtpConfigForm />;
};
