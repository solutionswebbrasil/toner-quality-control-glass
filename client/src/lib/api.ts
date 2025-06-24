
import { mockData2 } from './mockData';

export interface DashboardData {
  totalRetornados: number;
  valorRecuperado: number;
  totalGarantias: number;
  valorGarantias: number;
  totalToners: number;
  totalNaoConformidades: number;
  retornadosPorMes: Array<{ mes: string; quantidade: number; valor: number }>;
  garantiasPorMes: Array<{ mes: string; quantidade: number }>;
  garantiasPorFornecedor: Array<{ fornecedor: string; quantidade: number; valor: number }>;
  naoConformidadesPorTipo: Array<{ tipo: string; quantidade: number }>;
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Retornar dados mock para demonstração
  return {
    totalRetornados: 1247,
    valorRecuperado: 89450.75,
    totalGarantias: 156,
    valorGarantias: 45230.50,
    totalToners: 89,
    totalNaoConformidades: 23,
    retornadosPorMes: [
      { mes: 'Jan 2023', quantidade: 45, valor: 7800 },
      { mes: 'Fev 2023', quantidade: 52, valor: 8200 },
      { mes: 'Mar 2023', quantidade: 38, valor: 6900 },
      { mes: 'Abr 2023', quantidade: 61, valor: 9100 },
      { mes: 'Mai 2023', quantidade: 47, valor: 7600 },
      { mes: 'Jun 2023', quantidade: 55, valor: 8400 },
      { mes: 'Jul 2023', quantidade: 43, valor: 7200 },
      { mes: 'Ago 2023', quantidade: 58, valor: 8800 },
      { mes: 'Set 2023', quantidade: 49, valor: 7500 },
      { mes: 'Out 2023', quantidade: 64, valor: 9300 },
      { mes: 'Nov 2023', quantidade: 52, valor: 8100 },
      { mes: 'Dez 2023', quantidade: 46, valor: 7400 },
      { mes: 'Jan 2024', quantidade: 48, valor: 7900 },
      { mes: 'Fev 2024', quantidade: 53, valor: 8300 },
      { mes: 'Mar 2024', quantidade: 41, valor: 7100 },
      { mes: 'Abr 2024', quantidade: 59, valor: 8900 },
      { mes: 'Mai 2024', quantidade: 45, valor: 7700 },
      { mes: 'Jun 2024', quantidade: 57, valor: 8500 }
    ],
    garantiasPorMes: [
      { mes: 'Jan 2023', quantidade: 8 },
      { mes: 'Fev 2023', quantidade: 12 },
      { mes: 'Mar 2023', quantidade: 6 },
      { mes: 'Abr 2023', quantidade: 15 },
      { mes: 'Mai 2023', quantidade: 9 },
      { mes: 'Jun 2023', quantidade: 11 },
      { mes: 'Jul 2023', quantidade: 7 },
      { mes: 'Ago 2023', quantidade: 13 },
      { mes: 'Set 2023', quantidade: 10 },
      { mes: 'Out 2023', quantidade: 14 },
      { mes: 'Nov 2023', quantidade: 8 },
      { mes: 'Dez 2023', quantidade: 6 },
      { mes: 'Jan 2024', quantidade: 9 },
      { mes: 'Fev 2024', quantidade: 11 },
      { mes: 'Mar 2024', quantidade: 7 },
      { mes: 'Abr 2024', quantidade: 13 },
      { mes: 'Mai 2024', quantidade: 8 },
      { mes: 'Jun 2024', quantidade: 12 }
    ],
    garantiasPorFornecedor: [
      { fornecedor: 'HP Inc.', quantidade: 25, valor: 12500 },
      { fornecedor: 'Canon Brasil', quantidade: 18, valor: 8900 },
      { fornecedor: 'Lexmark', quantidade: 15, valor: 7200 },
      { fornecedor: 'Brother', quantidade: 12, valor: 5800 },
      { fornecedor: 'Xerox', quantidade: 10, valor: 4900 },
      { fornecedor: 'Samsung', quantidade: 7, valor: 3400 }
    ],
    naoConformidadesPorTipo: [
      { tipo: 'Qualidade do Produto', quantidade: 8 },
      { tipo: 'Processo Operacional', quantidade: 6 },
      { tipo: 'Documentação', quantidade: 4 },
      { tipo: 'Atendimento ao Cliente', quantidade: 3 },
      { tipo: 'Logística', quantidade: 2 }
    ]
  };
};
