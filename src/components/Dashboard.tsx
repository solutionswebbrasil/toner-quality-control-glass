
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, Shield, AlertTriangle, Users } from 'lucide-react';

// Mock data for dashboard
const mockStats = {
  totalRetornados: 145,
  totalGarantias: 89,
  totalNaoConformidades: 23,
  totalFornecedores: 12,
  monthlyData: [
    { month: 'Jan', retornados: 12, garantias: 8, naoConformidades: 2 },
    { month: 'Fev', retornados: 19, garantias: 12, naoConformidades: 3 },
    { month: 'Mar', retornados: 23, garantias: 15, naoConformidades: 4 },
    { month: 'Abr', retornados: 18, garantias: 11, naoConformidades: 3 },
    { month: 'Mai', retornados: 25, garantias: 18, naoConformidades: 5 },
    { month: 'Jun', retornados: 28, garantias: 20, naoConformidades: 6 }
  ]
};

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Visão geral do sistema de controle de qualidade
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Retornados
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalRetornados}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Garantias
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalGarantias}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Não Conformidades
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalNaoConformidades}</div>
            <p className="text-xs text-muted-foreground">
              -5.2% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fornecedores
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalFornecedores}</div>
            <p className="text-xs text-muted-foreground">
              +2 novos este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico Mensal */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle>Evolução Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={mockStats.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="retornados" fill="#3b82f6" name="Retornados" />
              <Bar dataKey="garantias" fill="#10b981" name="Garantias" />
              <Bar dataKey="naoConformidades" fill="#f59e0b" name="Não Conformidades" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
