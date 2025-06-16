
export interface NaoConformidade {
  id?: number;
  data_ocorrencia: string;
  unidade_filial: string;
  setor_responsavel: string;
  tipo_nc: 'Produto' | 'Processo' | 'Serviço' | 'Sistema' | 'Outros';
  descricao: string;
  evidencias?: string[];
  classificacao: 'Leve' | 'Moderada' | 'Grave' | 'Crítica';
  identificado_por: string;
  responsavel_tratamento: string;
  data_limite_correcao: string;
  acao_imediata?: string;
  necessita_acao_corretiva?: boolean;
  acao_corretiva_proposta?: string;
  observacoes?: string;
  status: 'Aberta' | 'Em andamento' | 'Corrigida' | 'Recusada' | 'Reaberta';
  data_registro: string;
  data_atualizacao?: string;
}
