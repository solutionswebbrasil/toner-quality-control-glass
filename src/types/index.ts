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
  data_registro: string;
  user_id: string; // Added user_id field
}

export interface Retornado {
  id?: number;
  id_modelo: number;
  id_cliente: number;
  peso: number;
  destino_final: string;
  filial: string;
  data_registro: string;
  valor_recuperado?: number;
  modelo?: string;
  peso_vazio?: number;
  gramatura?: number;
  capacidade_folhas?: number;
  valor_por_folha?: number;
  user_id: string; // Added user_id field
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
  data_cadastro: string;
  user_id?: string; // Added user_id field as optional
}

export interface Garantia {
  id?: number;
  item: string;
  quantidade: number;
  defeito: string;
  fornecedor_id: number;
  fornecedor?: string;
  nf_compra_pdf?: string;
  nf_remessa_pdf?: string;
  nf_devolucao_pdf?: string;
  status: string;
  resultado?: string;
  valor_unitario: number;
  valor_total: number;
  data_registro: string;
  ns?: string;
  email_notificacao?: string;
  user_id: string; // Added user_id field
}

export interface Auditoria {
  id?: number;
  data_inicio: string;
  data_fim: string;
  unidade_auditada: string;
  formulario_pdf?: string;
  data_registro: string;
  user_id: string; // Added user_id field
}

export interface TituloItPop {
  id?: number;
  titulo: string;
  descricao?: string;
  data_cadastro: string;
}

export interface RegistroItPop {
  id?: number;
  titulo_id: number;
  titulo?: string;
  versao: number;
  arquivo_pdf?: string;
  arquivo_ppt?: string;
  data_registro: string;
  registrado_por?: string;
}

export interface TituloBpmn {
  id?: number;
  titulo: string;
  descricao?: string;
  data_cadastro: string;
}

export interface RegistroBpmn {
  id?: number;
  titulo_id: number;
  titulo?: string;
  versao: number;
  arquivo_png?: string;
  data_registro: string;
  registrado_por?: string;
}

export type { Filial } from './filial';
export type { NaoConformidade } from './naoConformidade';
export type { Certificado } from './certificado';
export type { SmtpConfig } from './smtpConfig';
