
export interface NaoConformidade {
  id?: number;
  tipo_nc: string;
  classificacao: string;
  descricao: string;
  data_ocorrencia: string;
  data_limite_correcao: string;
  unidade_filial: string;
  setor_responsavel: string;
  identificado_por: string;
  responsavel_tratamento: string;
  status: string;
  acao_imediata?: string;
  acao_corretiva_proposta?: string;
  necessita_acao_corretiva?: boolean;
  observacoes?: string;
  evidencias?: any[];
  data_registro?: string;
  data_atualizacao?: string;
  user_id?: string;
}
