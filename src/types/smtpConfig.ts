
export interface SmtpConfig {
  id?: string;
  servidor_tipo: 'Gmail' | 'Outlook' | 'Personalizado';
  host_smtp: string;
  porta_smtp: number;
  email_remetente: string;
  senha_email: string;
  nome_remetente: string;
  usar_tls: boolean;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
  user_id: string;
}
