import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FilialForm } from './FilialForm';
import { FilialGrid } from './FilialGrid';
import { UserManagementImproved } from './UserManagementImproved';
import { Building2, Users, Settings } from 'lucide-react';

export const ConfiguracoesPage: React.FC = () => {
  const [refreshFiliais, setRefreshFiliais] = useState(0);

  const handleFilialSuccess = () => {
    setRefreshFiliais(prev => prev + 1);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center space-x-2">
        <Settings className="h-8 w-8 text-slate-600 dark:text-slate-400" />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
          Configurações
        </h1>
      </div>

      <Tabs defaultValue="filiais" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="filiais" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>Filiais</span>
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Usuários</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="filiais" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Cadastrar Nova Filial</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilialForm onSuccess={handleFilialSuccess} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Filiais Cadastradas</CardTitle>
              </CardHeader>
              <CardContent>
                <FilialGrid key={refreshFiliais} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Gerenciamento de Usuários</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserManagementImproved />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};