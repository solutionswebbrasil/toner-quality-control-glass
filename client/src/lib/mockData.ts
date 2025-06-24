
// Mock data for dashboard demonstration purposes
export interface MockRetornado {
  mes: string;
  quantidade: number;
  valor: number;
}

export interface MockGarantia {
  mes: string;
  quantidade: number;
}

export interface MockFornecedor {
  fornecedor: string;
  quantidade: number;
  valor: number;
}

export interface MockNaoConformidade {
  tipo: string;
  quantidade: number;
}

const mockData: Array<MockRetornado | MockGarantia | MockFornecedor | MockNaoConformidade> = [];

// Generate 2 years of mock data
const months = [
  'Jan 2023', 'Fev 2023', 'Mar 2023', 'Abr 2023', 'Mai 2023', 'Jun 2023',
  'Jul 2023', 'Ago 2023', 'Set 2023', 'Out 2023', 'Nov 2023', 'Dez 2023',
  'Jan 2024', 'Fev 2024', 'Mar 2024', 'Abr 2024', 'Mai 2024', 'Jun 2024'
];

export const mockData2 = mockData;

export const retornadosPorMes: MockRetornado[] = months.map(mes => ({
  mes,
  quantidade: Math.floor(Math.random() * 50) + 30,
  valor: Math.floor(Math.random() * 5000) + 7000
}));

export const garantiasPorMes: MockGarantia[] = months.map(mes => ({
  mes,
  quantidade: Math.floor(Math.random() * 20) + 5
}));

export const garantiasPorFornecedor: MockFornecedor[] = [
  { fornecedor: 'HP Inc.', quantidade: 25, valor: 12500 },
  { fornecedor: 'Canon Brasil', quantidade: 18, valor: 8900 },
  { fornecedor: 'Lexmark', quantidade: 15, valor: 7200 },
  { fornecedor: 'Brother', quantidade: 12, valor: 5800 },
  { fornecedor: 'Xerox', quantidade: 10, valor: 4900 },
  { fornecedor: 'Samsung', quantidade: 7, valor: 3400 }
];

export const naoConformidadesPorTipo: MockNaoConformidade[] = [
  { tipo: 'Qualidade do Produto', quantidade: 8 },
  { tipo: 'Processo Operacional', quantidade: 6 },
  { tipo: 'Documentação', quantidade: 4 },
  { tipo: 'Atendimento ao Cliente', quantidade: 3 },
  { tipo: 'Logística', quantidade: 2 }
];
