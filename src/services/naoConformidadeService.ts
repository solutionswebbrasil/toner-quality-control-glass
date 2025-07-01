
// Mock não conformidade service
export const naoConformidadeService = {
  getAll: async () => {
    return [
      {
        id: 1,
        unidade_filial: 'São Paulo',
        setor_responsavel: 'Produção',
        tipo_nc: 'Produto',
        classificacao: 'Crítica',
        descricao: 'Defeito na impressão',
        data_ocorrencia: '2024-01-15',
        status: 'Aberta',
        responsavel_registro: 'João Silva',
        responsavel_analise: 'Maria Santos',
        prazo_acao: '2024-02-15',
        acao_corretiva: '',
        data_finalizacao: null,
        identificado_por: 'João Silva',
        responsavel_tratamento: 'Maria Santos',
        data_limite_correcao: '2024-02-15',
        data_registro: '2024-01-15',
        user_id: 'user1'
      }
    ];
  },
  create: async (data: any) => {
    return { id: Date.now(), ...data };
  },
  update: async (id: number, data: any) => {
    return { id, ...data };
  },
  delete: async (id: number) => {
    return { success: true };
  }
};
