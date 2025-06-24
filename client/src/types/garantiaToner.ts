
export interface GarantiaToner {
  id?: number;
  ticket_numero: string;
  modelo_toner: string;
  fornecedor: string;
  defeito: string;
  filial_origem: string;
  responsavel_envio: string;
  data_envio: string;
  status: 'Pendente' | 'Em Análise' | 'Aguardando Toner Chegar no Laboratório' | 'Enviado para Fornecedor' | 'Concluído';
  observacoes?: string;
  ns?: string;
  lote?: string;
  data_registro?: string;
  user_id?: string;
}

export interface GarantiaTonerData {
  modelo_toner: string;
  fornecedor: string;
  defeito: string;
  responsavel_envio: string;
  data_envio: string;
  ns?: string;
  lote?: string;
  observacoes?: string;
}
