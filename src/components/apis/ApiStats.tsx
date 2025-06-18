
import React from 'react';
import { Shield, Clock, Key } from 'lucide-react';

export const ApiStats: React.FC = () => {
  return (
    <div className="border-t pt-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
            <Shield className="h-5 w-5" />
            Segura
          </div>
          <div className="text-sm text-green-700 dark:text-green-300">Com autenticação</div>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">JSON</div>
          <div className="text-sm text-blue-700 dark:text-blue-300">Formato de resposta</div>
        </div>
        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-md">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 flex items-center justify-center gap-1">
            <Clock className="h-5 w-5" />
            Completa
          </div>
          <div className="text-sm text-orange-700 dark:text-orange-300">Todos os dados</div>
        </div>
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Tempo Real</div>
          <div className="text-sm text-purple-700 dark:text-purple-300">Dados atualizados</div>
        </div>
      </div>
    </div>
  );
};
