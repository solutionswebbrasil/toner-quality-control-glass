// Centralized mock data generator for all modules
export const generateMockData = () => {
  const filiais = ['Jundiaí', 'Franca'];
  
  // Mock Fornecedores
  const fornecedores = [
    { id: 1, nome: 'HP Inc.', telefone: '(11) 3456-7890', link_rma: 'https://hp.com/rma' },
    { id: 2, nome: 'Samsung', telefone: '(11) 3456-7891', link_rma: 'https://samsung.com/rma' },
    { id: 3, nome: 'Canon', telefone: '(11) 3456-7892', link_rma: 'https://canon.com/rma' },
    { id: 4, nome: 'Brother', telefone: '(11) 3456-7893', link_rma: 'https://brother.com/rma' },
    { id: 5, nome: 'Xerox', telefone: '(11) 3456-7894', link_rma: 'https://xerox.com/rma' },
    { id: 6, nome: 'Ricoh', telefone: '(11) 3456-7895', link_rma: 'https://ricoh.com/rma' },
    { id: 7, nome: 'Kyocera', telefone: '(11) 3456-7896', link_rma: 'https://kyocera.com/rma' }
  ];

  // Mock Toners
  const toners = [
    { id: 1, modelo: 'HP CF280A', peso_cheio: 500, peso_vazio: 50, gramatura: 450, capacidade_folhas: 2700, valor_por_folha: 0.05, cor: 'Preto', impressoras_compat: 'LaserJet Pro 400 M401, M425' },
    { id: 2, modelo: 'Samsung MLT-D111S', peso_cheio: 560, peso_vazio: 60, gramatura: 500, capacidade_folhas: 1000, valor_por_folha: 0.08, cor: 'Preto', impressoras_compat: 'Xpress SL-M2020, M2070' },
    { id: 3, modelo: 'Canon 725', peso_cheio: 400, peso_vazio: 45, gramatura: 355, capacidade_folhas: 1600, valor_por_folha: 0.06, cor: 'Preto', impressoras_compat: 'LBP6000, LBP6020' },
    { id: 4, modelo: 'Brother TN-2340', peso_cheio: 520, peso_vazio: 55, gramatura: 465, capacidade_folhas: 2600, valor_por_folha: 0.04, cor: 'Preto', impressoras_compat: 'HL-L2360DW, MFC-L2720DW' },
    { id: 5, modelo: 'Xerox 106R03623', peso_cheio: 532, peso_vazio: 52, gramatura: 480, capacidade_folhas: 3000, valor_por_folha: 0.07, cor: 'Preto', impressoras_compat: 'Phaser 3330, WorkCentre 3335' }
  ];

  // Mock Filiais
  const filiaisData = [
    { id: 1, nome: 'Jundiaí', endereco: 'Av. 9 de Julho, 1000', cidade: 'Jundiaí', estado: 'SP', cep: '13201-001' },
    { id: 2, nome: 'Franca', endereco: 'Rua Capitão Mor Jerônimo, 500', cidade: 'Franca', estado: 'SP', cep: '14400-670' }
  ];

  // Generate mock retornados
  const generateRetornados = () => {
    const destinos = ['Estoque', 'Garantia', 'Descarte', 'Estoque Semi Novo', 'Uso Interno'];
    const mockData = [];
    let id = 1;
    
    for (let monthsBack = 23; monthsBack >= 0; monthsBack--) {
      const date = new Date();
      date.setMonth(date.getMonth() - monthsBack);
      const recordsThisMonth = Math.floor(Math.random() * 11) + 5;
      
      for (let i = 0; i < recordsThisMonth; i++) {
        const randomDay = Math.floor(Math.random() * 28) + 1;
        const recordDate = new Date(date.getFullYear(), date.getMonth(), randomDay);
        const toner = toners[Math.floor(Math.random() * toners.length)];
        const filial = filiais[Math.floor(Math.random() * filiais.length)];
        const destino = destinos[Math.floor(Math.random() * destinos.length)];
        const peso = (Math.random() * 400 + 200).toFixed(0);
        
        let valor_recuperado = 0;
        if (destino === 'Estoque' || destino === 'Estoque Semi Novo') {
          const gramaturaRestante = parseFloat(peso) - toner.peso_vazio;
          const percentualGramatura = (gramaturaRestante / toner.gramatura) * 100;
          const folhasRestantes = (percentualGramatura / 100) * toner.capacidade_folhas;
          valor_recuperado = folhasRestantes * toner.valor_por_folha;
        } else if (destino === 'Garantia') {
          valor_recuperado = Math.random() * 300 + 100;
        }
        
        mockData.push({
          id: id++,
          id_cliente: `CLI${String(Math.floor(Math.random() * 9999) + 1000)}`,
          id_modelo: toner.id,
          peso,
          destino_final: destino,
          filial,
          valor_recuperado,
          data_registro: recordDate,
          toner
        });
      }
    }
    return mockData;
  };

  // Generate mock garantias
  const generateGarantias = () => {
    const status = ['Aguardando', 'Em Andamento', 'Concluída', 'Cancelada'];
    const resultados = ['Aprovada', 'Negada', 'Pendente'];
    const mockData = [];
    let id = 1;
    
    for (let monthsBack = 23; monthsBack >= 0; monthsBack--) {
      const date = new Date();
      date.setMonth(date.getMonth() - monthsBack);
      const recordsThisMonth = Math.floor(Math.random() * 6) + 3;
      
      for (let i = 0; i < recordsThisMonth; i++) {
        const randomDay = Math.floor(Math.random() * 28) + 1;
        const recordDate = new Date(date.getFullYear(), date.getMonth(), randomDay);
        const fornecedor = fornecedores[Math.floor(Math.random() * fornecedores.length)];
        const filial = filiais[Math.floor(Math.random() * filiais.length)];
        const quantidade = Math.floor(Math.random() * 5) + 1;
        const valor_unitario = Math.random() * 200 + 50;
        
        mockData.push({
          id: id++,
          item: `Toner ${toners[Math.floor(Math.random() * toners.length)].modelo}`,
          quantidade,
          defeito: 'Vazamento de toner',
          status: status[Math.floor(Math.random() * status.length)],
          resultado: resultados[Math.floor(Math.random() * resultados.length)],
          valor_unitario,
          valor_total: quantidade * valor_unitario,
          data_registro: recordDate,
          ns: `NS${String(Math.floor(Math.random() * 999999) + 100000)}`,
          fornecedor_id: fornecedor.id,
          filial,
          fornecedor
        });
      }
    }
    return mockData;
  };

  // Generate mock auditorias
  const generateAuditorias = () => {
    const mockData = [];
    let id = 1;
    
    for (let monthsBack = 11; monthsBack >= 0; monthsBack--) {
      const date = new Date();
      date.setMonth(date.getMonth() - monthsBack);
      const recordsThisMonth = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < recordsThisMonth; i++) {
        const startDay = Math.floor(Math.random() * 25) + 1;
        const endDay = startDay + Math.floor(Math.random() * 5) + 1;
        const startDate = new Date(date.getFullYear(), date.getMonth(), startDay);
        const endDate = new Date(date.getFullYear(), date.getMonth(), endDay);
        const filial = filiais[Math.floor(Math.random() * filiais.length)];
        
        mockData.push({
          id: id++,
          data_inicio: startDate,
          data_fim: endDate,
          unidade_auditada: filial,
          formulario_pdf: `auditoria_${id}_${filial.toLowerCase()}.pdf`
        });
      }
    }
    return mockData;
  };

  // Generate mock certificados
  const generateCertificados = () => {
    const tipos = ['ISO 9001', 'ISO 14001', 'OHSAS 18001', 'FSC', 'ENERGY STAR'];
    const mockData = [];
    let id = 1;
    
    tipos.forEach(tipo => {
      for (let year = 2022; year <= 2024; year++) {
        const emissao = new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        const validade = new Date(year + 3, emissao.getMonth(), emissao.getDate());
        
        mockData.push({
          id: id++,
          nome: `Certificação ${tipo}`,
          tipo,
          data_emissao: emissao,
          data_validade: validade,
          arquivo_pdf: `certificado_${tipo.replace(/\s+/g, '_').toLowerCase()}_${year}.pdf`
        });
      }
    });
    return mockData;
  };

  return {
    fornecedores,
    toners,
    filiais: filiaisData,
    retornados: generateRetornados(),
    garantias: generateGarantias(),
    auditorias: generateAuditorias(),
    certificados: generateCertificados()
  };
};