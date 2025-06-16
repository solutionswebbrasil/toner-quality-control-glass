
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Upload, Download } from 'lucide-react';
import { ImportModal } from './ImportModal';
import * as XLSX from 'xlsx';

interface RmaData {
  fornecedor: string;
  percentualRma: number;
  garantias: number;
  compras: number;
}

export const RmaChart: React.FC = () => {
  const [rmaData, setRmaData] = useState<RmaData[]>([]);
  const [isGarantiaModalOpen, setIsGarantiaModalOpen] = useState(false);
  const [isComprasModalOpen, setIsComprasModalOpen] = useState(false);
  const [garantiaData, setGarantiaData] = useState<any[]>([]);
  const [comprasData, setComprasData] = useState<any[]>([]);

  const chartConfig = {
    percentualRma: {
      label: "% RMA",
      color: "#ef4444",
    },
  };

  const calculateRmaPercentage = () => {
    if (garantiaData.length === 0 || comprasData.length === 0) return;

    const fornecedores = new Set([
      ...garantiaData.map(item => item.fornecedor),
      ...comprasData.map(item => item.fornecedor)
    ]);

    const rmaResults: RmaData[] = Array.from(fornecedores).map(fornecedor => {
      const garantias = garantiaData
        .filter(item => item.fornecedor === fornecedor)
        .reduce((sum, item) => sum + (item.quantidade || 0), 0);
      
      const compras = comprasData
        .filter(item => item.fornecedor === fornecedor)
        .reduce((sum, item) => sum + (item.quantidade || 0), 0);

      const percentualRma = compras > 0 ? (garantias / compras) * 100 : 0;

      return {
        fornecedor,
        percentualRma: Number(percentualRma.toFixed(2)),
        garantias,
        compras
      };
    }).filter(item => item.compras > 0);

    setRmaData(rmaResults);
  };

  const downloadGarantiaTemplate = () => {
    const template = [
      { modelo: 'Exemplo Modelo 1', quantidade: 10, fornecedor: 'Fornecedor A' },
      { modelo: 'Exemplo Modelo 2', quantidade: 5, fornecedor: 'Fornecedor B' }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Garantias');
    XLSX.writeFile(wb, 'template_garantias.xlsx');
  };

  const downloadComprasTemplate = () => {
    const template = [
      { modelo: 'Exemplo Modelo 1', quantidade: 100, fornecedor: 'Fornecedor A' },
      { modelo: 'Exemplo Modelo 2', quantidade: 80, fornecedor: 'Fornecedor B' }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Compras');
    XLSX.writeFile(wb, 'template_compras.xlsx');
  };

  const handleGarantiaUpload = (data: any[]) => {
    setGarantiaData(data);
    setIsGarantiaModalOpen(false);
    console.log('Dados de garantia carregados:', data);
  };

  const handleComprasUpload = (data: any[]) => {
    setComprasData(data);
    setIsComprasModalOpen(false);
    console.log('Dados de compras carregados:', data);
  };

  React.useEffect(() => {
    if (garantiaData.length > 0 && comprasData.length > 0) {
      calculateRmaPercentage();
    }
  }, [garantiaData, comprasData]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">% de RMA por Fornecedor</h2>
      
      {/* Controles de Upload */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle>Importar Planilhas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => setIsGarantiaModalOpen(true)}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Upload className="w-4 h-4" />
              Importar Planilha de Garantia
            </Button>
            
            <Button
              onClick={() => setIsComprasModalOpen(true)}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Upload className="w-4 h-4" />
              Importar Planilha de Compras
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Status: 
            <span className={`ml-2 ${garantiaData.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
              Garantias: {garantiaData.length > 0 ? 'Carregadas' : 'Não carregadas'}
            </span>
            <span className={`ml-4 ${comprasData.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
              Compras: {comprasData.length > 0 ? 'Carregadas' : 'Não carregadas'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de RMA */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle>Percentual de RMA por Fornecedor</CardTitle>
        </CardHeader>
        <CardContent>
          {rmaData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-64">
              <BarChart data={rmaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fornecedor" />
                <YAxis />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value, name, props) => [
                    `${Number(value).toFixed(2)}%`,
                    '% RMA',
                    `Garantias: ${props.payload?.garantias || 0} | Compras: ${props.payload?.compras || 0}`
                  ]}
                />
                <Bar dataKey="percentualRma" fill="var(--color-percentualRma)" />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500">
              Importe as planilhas de garantia e compras para visualizar o gráfico
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals de Import */}
      <ImportModal
        isOpen={isGarantiaModalOpen}
        onClose={() => setIsGarantiaModalOpen(false)}
        onUpload={handleGarantiaUpload}
        onDownloadTemplate={downloadGarantiaTemplate}
        title="Importar Planilha de Garantia"
        templateDescription="A planilha deve conter as colunas: modelo, quantidade, fornecedor"
      />

      <ImportModal
        isOpen={isComprasModalOpen}
        onClose={() => setIsComprasModalOpen(false)}
        onUpload={handleComprasUpload}
        onDownloadTemplate={downloadComprasTemplate}
        title="Importar Planilha de Compras"
        templateDescription="A planilha deve conter as colunas: modelo, quantidade, fornecedor"
      />
    </div>
  );
};
