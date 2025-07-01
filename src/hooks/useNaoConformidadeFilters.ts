
import { useState, useMemo } from 'react';

export const useNaoConformidadeFilters = (naoConformidades: any[]) => {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [unidadeSelecionada, setUnidadeSelecionada] = useState('');
  const [setorSelecionado, setSetorSelecionado] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState('');
  const [classificacaoSelecionada, setClassificacaoSelecionada] = useState('');
  const [statusSelecionado, setStatusSelecionado] = useState('');

  const filteredNaoConformidades = useMemo(() => {
    return naoConformidades.filter(nc => {
      const matchDataInicio = !dataInicio || nc.data_ocorrencia >= dataInicio;
      const matchDataFim = !dataFim || nc.data_ocorrencia <= dataFim;
      const matchUnidade = !unidadeSelecionada || nc.unidade_filial === unidadeSelecionada;
      const matchSetor = !setorSelecionado || nc.setor_responsavel === setorSelecionado;
      const matchTipo = !tipoSelecionado || nc.tipo_nc === tipoSelecionado;
      const matchClassificacao = !classificacaoSelecionada || nc.classificacao === classificacaoSelecionada;
      const matchStatus = !statusSelecionado || nc.status === statusSelecionado;

      return matchDataInicio && matchDataFim && matchUnidade && matchSetor && 
             matchTipo && matchClassificacao && matchStatus;
    });
  }, [naoConformidades, dataInicio, dataFim, unidadeSelecionada, setorSelecionado, 
      tipoSelecionado, classificacaoSelecionada, statusSelecionado]);

  const clearFilters = () => {
    setDataInicio('');
    setDataFim('');
    setUnidadeSelecionada('');
    setSetorSelecionado('');
    setTipoSelecionado('');
    setClassificacaoSelecionada('');
    setStatusSelecionado('');
  };

  return {
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
    unidadeSelecionada,
    setUnidadeSelecionada,
    setorSelecionado,
    setSetorSelecionado,
    tipoSelecionado,
    setTipoSelecionado,
    classificacaoSelecionada,
    setClassificacaoSelecionada,
    statusSelecionado,
    setStatusSelecionado,
    filteredNaoConformidades,
    clearFilters
  };
};
