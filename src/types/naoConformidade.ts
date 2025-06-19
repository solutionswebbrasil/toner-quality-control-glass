
import { Json } from '@/integrations/supabase/types';

export interface NaoConformidade {
  id?: number;
  data_ocorrencia: string;
  unidade_filial: string;
  setor_responsavel: string;
  tipo_nc: string;
  descricao: string;
  evidencias?: Json;
  classificacao: string;
  identificado_por: string;
  responsavel_tratamento: string;
  data_limite_correcao: string;
  acao_imediata?: string;
  necessita_acao_corretiva?: boolean;
  acao_corretiva_proposta?: string;
  observacoes?: string;
  status: string;
  data_registro: string;
  data_atualizacao?: string;
  user_id: string; // Added user_id field
}
