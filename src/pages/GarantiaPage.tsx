
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const GarantiaPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Garantias Gerais
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Gestão de garantias de equipamentos e peças
          </p>
        </div>

        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Garantias de Equipamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Módulo de garantias gerais em desenvolvimento.
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GarantiaPage;
