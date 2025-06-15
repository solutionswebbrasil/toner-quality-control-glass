
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
  destino_final: 'Estoque' | 'Descarte' | 'Manutencao';
  filial: string;
  data_registro: Date;
  valor_recuperado?: number;
  modelo?: string; // Para joins
}

export interface RetornadoCSV {
  modelo: string;
  id_cliente: number;
  peso: number;
  destino_final: 'Estoque' | 'Descarte' | 'Manutencao';
  filial: string;
  valor_recuperado?: number;
}
