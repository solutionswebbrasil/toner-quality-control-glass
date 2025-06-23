
export interface Certificado {
  id?: number;
  nome_certificado: string;
  arquivo_pdf?: string;
  data_emissao: string;
  data_registro?: string;
  user_id: string; // Added user_id field
}
