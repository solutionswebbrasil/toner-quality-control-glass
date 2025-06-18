
import React from 'react';
import { Label } from '@/components/ui/label';

interface ApiTestResultProps {
  apiTestResult: any;
}

export const ApiTestResult: React.FC<ApiTestResultProps> = ({
  apiTestResult
}) => {
  if (!apiTestResult) return null;

  return (
    <div className="mt-4">
      <Label>Resultado do Teste</Label>
      <div className={`mt-1 p-3 rounded-md border ${
        apiTestResult.success 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-red-50 border-red-200 text-red-800'
      }`}>
        {apiTestResult.success ? (
          <div>
            <p className="font-semibold">✅ Teste bem-sucedido!</p>
            <p className="text-sm">Status HTTP: {apiTestResult.status}</p>
            <p className="text-sm">Total de registros: {apiTestResult.data?.total_registros || 0}</p>
            <p className="text-sm">Última atualização: {apiTestResult.data?.data_atualizacao ? new Date(apiTestResult.data.data_atualizacao).toLocaleString('pt-BR') : 'N/A'}</p>
          </div>
        ) : (
          <div>
            <p className="font-semibold">❌ Erro no teste</p>
            <p className="text-sm">{apiTestResult.error}</p>
            {apiTestResult.status && <p className="text-sm">Status HTTP: {apiTestResult.status}</p>}
          </div>
        )}
      </div>
    </div>
  );
};
