
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
  data_registro: Date;
}

export interface Retornado {
  id?: number;
  id_modelo: number;
  id_cliente: number;
  peso: number;
  destino_final: 'Descarte' | 'Garantia' | 'Estoque' | 'Uso Interno';
  filial: string;
  data_registro: Date;
  valor_recuperado?: number;
  modelo?: string; // Para joins
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
  data_cadastro: Date;
}

export interface Garantia {
  id?: number;
  item: string;
  quantidade: number;
  defeito: string;
  fornecedor_id: number;
  fornecedor?: string; // Para joins
  nf_compra_pdf?: File | string;
  nf_remessa_pdf?: File | string;
  nf_devolucao_pdf?: File | string;
  status: 'aberta' | 'em_analise' | 'concluida' | 'recusada' | 'aguardando_fornecedor';
  resultado?: 'devolucao_credito' | 'trocado' | 'consertado' | '';
  valor_unitario: number;
  valor_total: number;
  data_registro: Date;
}
