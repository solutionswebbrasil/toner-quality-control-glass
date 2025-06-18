
import React from 'react';
import { Label } from '@/components/ui/label';

export const ApiResponseFormat: React.FC = () => {
  return (
    <div>
      <Label>Formato de Resposta</Label>
      <div className="mt-1 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
        <pre className="text-xs text-slate-700 dark:text-slate-300 overflow-x-auto">
{`{
  "success": true,
  "total_registros": 1000,
  "data_atualizacao": "2024-01-01T00:00:00Z",
  "dados": [
    {
      "id": 1,
      "id_cliente": 12345,
      "modelo_toner": "CF410A",
      "cor_toner": "Preto",
      "filial": "Matriz",
      "destino_final": "Estoque",
      "valor_recuperado": 45.50,
      "data_registro": "2024-01-01",
      "ano": 2024,
      "mes": 1,
      "mes_nome": "janeiro",
      "trimestre": 1,
      "peso": 1.2,
      "peso_vazio": 0.8,
      "gramatura": 85.5,
      "capacidade_folhas": 2300,
      "valor_por_folha": 0.02
    }
  ]
}`}
        </pre>
      </div>
    </div>
  );
};
