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
      auditorias: {
        Row: {
          data_fim: string
          data_inicio: string
          data_registro: string
          formulario_pdf: string | null
          id: number
          unidade_auditada: string
        }
        Insert: {
          data_fim: string
          data_inicio: string
          data_registro?: string
          formulario_pdf?: string | null
          id?: number
          unidade_auditada: string
        }
        Update: {
          data_fim?: string
          data_inicio?: string
          data_registro?: string
          formulario_pdf?: string | null
          id?: number
          unidade_auditada?: string
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
        }
        Insert: {
          data_cadastro?: string
          id?: number
          link_rma: string
          nome: string
          telefone: string
        }
        Update: {
          data_cadastro?: string
          id?: number
          link_rma?: string
          nome?: string
          telefone?: string
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
          quantidade: number
          resultado: string | null
          status: string
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
          quantidade: number
          resultado?: string | null
          status?: string
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
          quantidade?: number
          resultado?: string | null
          status?: string
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
      registros_bpmn: {
        Row: {
          arquivo_bizagi: string | null
          arquivo_jpg: string | null
          arquivo_pdf: string | null
          arquivo_png: string | null
          data_registro: string
          id: number
          registrado_por: string | null
          titulo_id: number
          versao: number
        }
        Insert: {
          arquivo_bizagi?: string | null
          arquivo_jpg?: string | null
          arquivo_pdf?: string | null
          arquivo_png?: string | null
          data_registro?: string
          id?: number
          registrado_por?: string | null
          titulo_id: number
          versao: number
        }
        Update: {
          arquivo_bizagi?: string | null
          arquivo_jpg?: string | null
          arquivo_pdf?: string | null
          arquivo_png?: string | null
          data_registro?: string
          id?: number
          registrado_por?: string | null
          titulo_id?: number
          versao?: number
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
      retornados: {
        Row: {
          data_registro: string
          destino_final: string
          filial: string
          id: number
          id_cliente: number
          id_modelo: number
          peso: number
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
          valor_por_folha?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
