
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GarantiaTonerForm } from '@/components/GarantiaTonerForm';
import { GarantiaTonerGrid } from '@/components/GarantiaTonerGrid';
import { GarantiaTonerConsulta } from '@/components/GarantiaTonerConsulta';
import { GarantiaTonerCharts } from '@/components/GarantiaTonerCharts';

const GarantiaTonerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pendentes');

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Garantias de Toners
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Gestão completa de garantias de toners e insumos
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur">
            <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
            <TabsTrigger value="registrar">Registrar</TabsTrigger>
            <TabsTrigger value="consultar">Consultar</TabsTrigger>
            <TabsTrigger value="graficos">Gráficos</TabsTrigger>
          </TabsList>

          <TabsContent value="pendentes" className="space-y-6">
            <GarantiaTonerGrid />
          </TabsContent>

          <TabsContent value="registrar" className="space-y-6">
            <GarantiaTonerForm onSuccess={() => setActiveTab('pendentes')} />
          </TabsContent>

          <TabsContent value="consultar" className="space-y-6">
            <GarantiaTonerConsulta />
          </TabsContent>

          <TabsContent value="graficos" className="space-y-6">
            <GarantiaTonerCharts />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default GarantiaTonerPage;
