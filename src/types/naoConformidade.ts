
export interface NaoConformidade {
  id?: number;
  data_ocorrencia: string;
  unidade_filial: string;
  setor_responsavel: string;
  tipo_nc: string; // Changed from union type to string to match Supabase
  descricao: string;
  evidencias?: string[];
  classificacao: string; // Changed from union type to string to match Supabase
  identificado_por: string;
  responsavel_tratamento: string;
  data_limite_correcao: string;
  acao_imediata?: string;
  necessita_acao_corretiva?: boolean;
  acao_corretiva_proposta?: string;
  observacoes?: string;
  status: string; // Changed from union type to string to match Supabase
  data_registro: string;
  data_atualizacao?: string;
}
