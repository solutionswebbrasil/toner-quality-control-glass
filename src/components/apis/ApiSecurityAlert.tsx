
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

export const ApiSecurityAlert: React.FC = () => {
  return (
    <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200">
      <Shield className="h-4 w-4" />
      <AlertDescription>
        <strong>Segurança Implementada:</strong> Esta API agora inclui autenticação por chave, rate limiting (100 req/15min) e logs de auditoria para garantir segurança e monitoramento de acesso.
      </AlertDescription>
    </Alert>
  );
};
