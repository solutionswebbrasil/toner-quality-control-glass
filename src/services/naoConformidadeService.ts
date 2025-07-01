
export const naoConformidadeService = {
  getAll: async () => {
    const data = localStorage.getItem('nao_conformidades');
    return data ? JSON.parse(data) : [
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
    const naoConformidades = await naoConformidadeService.getAll();
    const newNC = { id: Date.now(), ...data };
    naoConformidades.push(newNC);
    localStorage.setItem('nao_conformidades', JSON.stringify(naoConformidades));
    return newNC;
  },
  update: async (id: number, data: any) => {
    const naoConformidades = await naoConformidadeService.getAll();
    const index = naoConformidades.findIndex((nc: any) => nc.id === id);
    if (index !== -1) {
      naoConformidades[index] = { ...naoConformidades[index], ...data };
      localStorage.setItem('nao_conformidades', JSON.stringify(naoConformidades));
    }
    return { id, ...data };
  },
  delete: async (id: number) => {
    const naoConformidades = await naoConformidadeService.getAll();
    const filtered = naoConformidades.filter((nc: any) => nc.id !== id);
    localStorage.setItem('nao_conformidades', JSON.stringify(naoConformidades));
    return { success: true };
  }
};
