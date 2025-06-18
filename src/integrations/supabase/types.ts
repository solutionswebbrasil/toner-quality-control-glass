export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      auditorias: {
        Row: {
          data_fim: string
          data_inicio: string
          data_registro: string
          formulario_pdf: string | null
          id: number
          unidade_auditada: string
          user_id: string
        }
        Insert: {
          data_fim: string
          data_inicio: string
          data_registro?: string
          formulario_pdf?: string | null
          id?: number
          unidade_auditada: string
          user_id: string
        }
        Update: {
          data_fim?: string
          data_inicio?: string
          data_registro?: string
          formulario_pdf?: string | null
          id?: number
          unidade_auditada?: string
          user_id?: string
        }
        Relationships: []
      }
      certificados: {
        Row: {
          arquivo_pdf: string | null
          data_emissao: string
          data_registro: string
          id: number
          nome_certificado: string
          user_id: string
        }
        Insert: {
          arquivo_pdf?: string | null
          data_emissao: string
          data_registro?: string
          id?: number
          nome_certificado: string
          user_id: string
        }
        Update: {
          arquivo_pdf?: string | null
          data_emissao?: string
          data_registro?: string
          id?: number
          nome_certificado?: string
          user_id?: string
        }
        Relationships: []
      }
      filiais: {
        Row: {
          ativo: boolean
          codigo: string | null
          data_cadastro: string
          email: string | null
          endereco: string | null
          id: number
          nome: string
          telefone: string | null
          user_id: string | null
        }
        Insert: {
          ativo?: boolean
          codigo?: string | null
          data_cadastro?: string
          email?: string | null
          endereco?: string | null
          id?: number
          nome: string
          telefone?: string | null
          user_id?: string | null
        }
        Update: {
          ativo?: boolean
          codigo?: string | null
          data_cadastro?: string
          email?: string | null
          endereco?: string | null
          id?: number
          nome?: string
          telefone?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      fornecedores: {
        Row: {
          data_cadastro: string
          id: number
          link_rma: string
          nome: string
          telefone: string
          user_id: string | null
        }
        Insert: {
          data_cadastro?: string
          id?: number
          link_rma: string
          nome: string
          telefone: string
          user_id?: string | null
        }
        Update: {
          data_cadastro?: string
          id?: number
          link_rma?: string
          nome?: string
          telefone?: string
          user_id?: string | null
        }
        Relationships: []
      }
      garantias: {
        Row: {
          data_registro: string
          defeito: string
          fornecedor_id: number
          id: number
          item: string
          nf_compra_pdf: string | null
          nf_devolucao_pdf: string | null
          nf_remessa_pdf: string | null
          ns: string | null
          quantidade: number
          resultado: string | null
          status: string
          user_id: string
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          data_registro?: string
          defeito: string
          fornecedor_id: number
          id?: number
          item: string
          nf_compra_pdf?: string | null
          nf_devolucao_pdf?: string | null
          nf_remessa_pdf?: string | null
          ns?: string | null
          quantidade: number
          resultado?: string | null
          status?: string
          user_id: string
          valor_total: number
          valor_unitario: number
        }
        Update: {
          data_registro?: string
          defeito?: string
          fornecedor_id?: number
          id?: number
          item?: string
          nf_compra_pdf?: string | null
          nf_devolucao_pdf?: string | null
          nf_remessa_pdf?: string | null
          ns?: string | null
          quantidade?: number
          resultado?: string | null
          status?: string
          user_id?: string
          valor_total?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "garantias_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      garantias_toners: {
        Row: {
          data_envio: string
          data_registro: string
          defeito: string
          filial_origem: string
          fornecedor: string
          id: number
          lote: string | null
          modelo_toner: string
          ns: string | null
          observacoes: string | null
          responsavel_envio: string
          status: string
          ticket_numero: string
          user_id: string
        }
        Insert: {
          data_envio: string
          data_registro?: string
          defeito: string
          filial_origem: string
          fornecedor: string
          id?: number
          lote?: string | null
          modelo_toner: string
          ns?: string | null
          observacoes?: string | null
          responsavel_envio: string
          status?: string
          ticket_numero: string
          user_id: string
        }
        Update: {
          data_envio?: string
          data_registro?: string
          defeito?: string
          filial_origem?: string
          fornecedor?: string
          id?: number
          lote?: string | null
          modelo_toner?: string
          ns?: string | null
          observacoes?: string | null
          responsavel_envio?: string
          status?: string
          ticket_numero?: string
          user_id?: string
        }
        Relationships: []
      }
      nao_conformidades: {
        Row: {
          acao_corretiva_proposta: string | null
          acao_imediata: string | null
          classificacao: string
          data_atualizacao: string | null
          data_limite_correcao: string
          data_ocorrencia: string
          data_registro: string
          descricao: string
          evidencias: Json | null
          id: number
          identificado_por: string
          necessita_acao_corretiva: boolean | null
          observacoes: string | null
          responsavel_tratamento: string
          setor_responsavel: string
          status: string
          tipo_nc: string
          unidade_filial: string
          user_id: string
        }
        Insert: {
          acao_corretiva_proposta?: string | null
          acao_imediata?: string | null
          classificacao: string
          data_atualizacao?: string | null
          data_limite_correcao: string
          data_ocorrencia: string
          data_registro?: string
          descricao: string
          evidencias?: Json | null
          id?: number
          identificado_por: string
          necessita_acao_corretiva?: boolean | null
          observacoes?: string | null
          responsavel_tratamento: string
          setor_responsavel: string
          status?: string
          tipo_nc: string
          unidade_filial: string
          user_id: string
        }
        Update: {
          acao_corretiva_proposta?: string | null
          acao_imediata?: string | null
          classificacao?: string
          data_atualizacao?: string | null
          data_limite_correcao?: string
          data_ocorrencia?: string
          data_registro?: string
          descricao?: string
          evidencias?: Json | null
          id?: number
          identificado_por?: string
          necessita_acao_corretiva?: boolean | null
          observacoes?: string | null
          responsavel_tratamento?: string
          setor_responsavel?: string
          status?: string
          tipo_nc?: string
          unidade_filial?: string
          user_id?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          id: string
          modulo: string
          pode_editar: boolean | null
          pode_excluir: boolean | null
          pode_visualizar: boolean | null
          role: string
          submenu: string
        }
        Insert: {
          id?: string
          modulo: string
          pode_editar?: boolean | null
          pode_excluir?: boolean | null
          pode_visualizar?: boolean | null
          role: string
          submenu: string
        }
        Update: {
          id?: string
          modulo?: string
          pode_editar?: boolean | null
          pode_excluir?: boolean | null
          pode_visualizar?: boolean | null
          role?: string
          submenu?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          nome_completo: string
          role: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          nome_completo: string
          role?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          nome_completo?: string
          role?: string
        }
        Relationships: []
      }
      registros_bpmn: {
        Row: {
          arquivo_png: string | null
          data_registro: string
          id: number
          registrado_por: string | null
          titulo_id: number
          versao: number | null
        }
        Insert: {
          arquivo_png?: string | null
          data_registro?: string
          id?: number
          registrado_por?: string | null
          titulo_id: number
          versao?: number | null
        }
        Update: {
          arquivo_png?: string | null
          data_registro?: string
          id?: number
          registrado_por?: string | null
          titulo_id?: number
          versao?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "registros_bpmn_titulo_id_fkey"
            columns: ["titulo_id"]
            isOneToOne: false
            referencedRelation: "titulos_bpmn"
            referencedColumns: ["id"]
          },
        ]
      }
      registros_itpop: {
        Row: {
          arquivo_pdf: string | null
          arquivo_ppt: string | null
          data_registro: string
          id: number
          registrado_por: string | null
          titulo_id: number
          versao: number
        }
        Insert: {
          arquivo_pdf?: string | null
          arquivo_ppt?: string | null
          data_registro?: string
          id?: number
          registrado_por?: string | null
          titulo_id: number
          versao: number
        }
        Update: {
          arquivo_pdf?: string | null
          arquivo_ppt?: string | null
          data_registro?: string
          id?: number
          registrado_por?: string | null
          titulo_id?: number
          versao?: number
        }
        Relationships: [
          {
            foreignKeyName: "registros_itpop_titulo_id_fkey"
            columns: ["titulo_id"]
            isOneToOne: false
            referencedRelation: "titulos_itpop"
            referencedColumns: ["id"]
          },
        ]
      }
      resultados_configuracoes: {
        Row: {
          ativo: boolean | null
          data_criacao: string | null
          id: number
          modulo: string
          ordem: number | null
          resultado_nome: string
        }
        Insert: {
          ativo?: boolean | null
          data_criacao?: string | null
          id?: number
          modulo: string
          ordem?: number | null
          resultado_nome: string
        }
        Update: {
          ativo?: boolean | null
          data_criacao?: string | null
          id?: number
          modulo?: string
          ordem?: number | null
          resultado_nome?: string
        }
        Relationships: []
      }
      retornados: {
        Row: {
          data_registro: string
          destino_final: string
          filial: string
          id: number
          id_cliente: number
          id_modelo: number
          peso: number
          user_id: string
          valor_recuperado: number | null
        }
        Insert: {
          data_registro?: string
          destino_final: string
          filial: string
          id?: number
          id_cliente: number
          id_modelo: number
          peso: number
          user_id: string
          valor_recuperado?: number | null
        }
        Update: {
          data_registro?: string
          destino_final?: string
          filial?: string
          id?: number
          id_cliente?: number
          id_modelo?: number
          peso?: number
          user_id?: string
          valor_recuperado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "retornados_id_modelo_fkey"
            columns: ["id_modelo"]
            isOneToOne: false
            referencedRelation: "toners"
            referencedColumns: ["id"]
          },
        ]
      }
      status_configuracoes: {
        Row: {
          ativo: boolean | null
          cor: string | null
          data_criacao: string | null
          id: number
          modulo: string
          ordem: number | null
          status_nome: string
        }
        Insert: {
          ativo?: boolean | null
          cor?: string | null
          data_criacao?: string | null
          id?: number
          modulo: string
          ordem?: number | null
          status_nome: string
        }
        Update: {
          ativo?: boolean | null
          cor?: string | null
          data_criacao?: string | null
          id?: number
          modulo?: string
          ordem?: number | null
          status_nome?: string
        }
        Relationships: []
      }
      titulos_bpmn: {
        Row: {
          data_cadastro: string
          descricao: string | null
          id: number
          titulo: string
        }
        Insert: {
          data_cadastro?: string
          descricao?: string | null
          id?: number
          titulo: string
        }
        Update: {
          data_cadastro?: string
          descricao?: string | null
          id?: number
          titulo?: string
        }
        Relationships: []
      }
      titulos_itpop: {
        Row: {
          data_cadastro: string
          descricao: string | null
          id: number
          titulo: string
        }
        Insert: {
          data_cadastro?: string
          descricao?: string | null
          id?: number
          titulo: string
        }
        Update: {
          data_cadastro?: string
          descricao?: string | null
          id?: number
          titulo?: string
        }
        Relationships: []
      }
      toners: {
        Row: {
          capacidade_folhas: number
          cor: string
          data_registro: string
          gramatura: number
          id: number
          impressoras_compat: string
          modelo: string
          peso_cheio: number
          peso_vazio: number
          preco_produto: number
          registrado_por: number
          user_id: string
          valor_por_folha: number
        }
        Insert: {
          capacidade_folhas: number
          cor: string
          data_registro?: string
          gramatura: number
          id?: number
          impressoras_compat: string
          modelo: string
          peso_cheio: number
          peso_vazio: number
          preco_produto: number
          registrado_por: number
          user_id: string
          valor_por_folha: number
        }
        Update: {
          capacidade_folhas?: number
          cor?: string
          data_registro?: string
          gramatura?: number
          id?: number
          impressoras_compat?: string
          modelo?: string
          peso_cheio?: number
          peso_vazio?: number
          preco_produto?: number
          registrado_por?: number
          user_id?: string
          valor_por_folha?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_permission: {
        Args: {
          user_id_param: string
          modulo_param: string
          submenu_param: string
          acao_param: string
        }
        Returns: boolean
      }
      get_next_bpmn_version: {
        Args: { titulo_id_param: number }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
