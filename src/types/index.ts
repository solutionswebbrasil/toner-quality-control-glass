export interface Toner {
  id?: number;
  modelo: string;
  peso_cheio: number;
  peso_vazio: number;
  gramatura: number;
  preco_produto: number;
  capacidade_folhas: number;
  valor_por_folha: number;
  impressoras_compat: string;
  cor: string;
  registrado_por: number;
  data_registro: string; // Changed from Date to string
}

export interface Retornado {
  id?: number;
  id_modelo: number;
  id_cliente: number;
  peso: number;
  destino_final: string; // Changed from union type to string to match Supabase
  filial: string;
  data_registro: string; // Changed from Date to string
  valor_recuperado?: number;
  modelo?: string; // Para joins
  // Campos adicionais para cálculos de valor recuperado
  peso_vazio?: number;
  gramatura?: number;
  capacidade_folhas?: number;
  valor_por_folha?: number;
}

export interface RetornadoCSV {
  id_cliente: number;
  modelo: string;
  destino_final: 'Descarte' | 'Garantia' | 'Estoque' | 'Uso Interno';
  data_registro: string;
  filial: string;
}

export interface Fornecedor {
  id?: number;
  nome: string;
  telefone: string;
  link_rma: string;
  data_cadastro: string; // Changed from Date to string
}

export interface Garantia {
  id?: number;
  item: string;
  quantidade: number;
  defeito: string;
  fornecedor_id: number;
  fornecedor?: string; // Para joins
  nf_compra_pdf?: string; // Changed from File | string to string
  nf_remessa_pdf?: string; // Changed from File | string to string
  nf_devolucao_pdf?: string; // Changed from File | string to string
  status: string; // Changed from union type to string to match Supabase
  resultado?: string; // Changed from union type to string to match Supabase
  valor_unitario: number;
  valor_total: number;
  data_registro: string; // Changed from Date to string
}

export interface Auditoria {
  id?: number;
  data_inicio: string; // Changed from Date to string
  data_fim: string; // Changed from Date to string
  unidade_auditada: string;
  formulario_pdf?: string; // Changed from File | string to string
  data_registro: string; // Changed from Date to string
}

export interface TituloItPop {
  id?: number;
  titulo: string;
  descricao?: string;
  data_cadastro: string; // Changed from Date to string
}

export interface RegistroItPop {
  id?: number;
  titulo_id: number;
  titulo?: string; // Para joins
  versao: number;
  arquivo_pdf?: string; // Changed from File | string to string
  arquivo_ppt?: string; // Changed from File | string to string
  data_registro: string; // Changed from Date to string
  registrado_por?: string;
}

export interface TituloBpmn {
  id?: number;
  titulo: string;
  descricao?: string;
  data_cadastro: string; // Changed from Date to string
}

export interface RegistroBpmn {
  id?: number;
  titulo_id: number;
  titulo?: string; // Para joins
  versao: number;
  arquivo_png?: string; // Only PNG files allowed
  data_registro: string; // Changed from Date to string
  registrado_por?: string;
}

export type { Filial } from './filial';
