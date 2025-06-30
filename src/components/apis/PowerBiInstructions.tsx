
import React from 'react';
import { Label } from '@/components/ui/label';

export const PowerBiInstructions: React.FC = () => {
  return (
    <div>
      <Label>Instruções para Power BI</Label>
      <div className="mt-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
        <ol className="text-sm space-y-1 text-blue-800 dark:text-blue-200">
          <li>1. Abra o Power BI Desktop</li>
          <li>2. Vá em "Obter Dados" → "Web"</li>
          <li>3. Cole a URL da API acima</li>
          <li>4. Em "Opções Avançadas", adicione header:</li>
          <li className="ml-4">• Nome: X-API-Key</li>
          <li className="ml-4">• Valor: powerbi-access-2024</li>
          <li>5. Clique em "OK" e configure os dados</li>
          <li>6. Use os campos para criar seus dashboards</li>
        </ol>
      </div>
    </div>
  );
};
