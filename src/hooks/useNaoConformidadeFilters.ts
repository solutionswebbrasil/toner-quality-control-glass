
import { useState, useEffect } from 'react';
import { NaoConformidade } from '@/types/naoConformidade';

export const useNaoConformidadeFilters = (naoConformidades: NaoConformidade[]) => {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [unidadeSelecionada, setUnidadeSelecionada] = useState('Todas');
  const [setorSelecionado, setSetorSelecionado] = useState('Todos');
  const [tipoSelecionado, setTipoSelecionado] = useState('Todos');
  const [classificacaoSelecionada, setClassificacaoSelecionada] = useState('Todas');
  const [statusSelecionado, setStatusSelecionado] = useState('Todos');
  const [filteredNaoConformidades, setFilteredNaoConformidades] = useState<NaoConformidade[]>([]);

  const filterNaoConformidades = () => {
    let filtered = [...naoConformidades];

    if (dataInicio) {
      const startDate = new Date(dataInicio);
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.data_ocorrencia);
        return itemDate >= startDate;
      });
    }

    if (dataFim) {
      const endDate = new Date(dataFim);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.data_ocorrencia);
        return itemDate <= endDate;
      });
    }

    if (unidadeSelecionada !== 'Todas') {
      filtered = filtered.filter(item => item.unidade_filial === unidadeSelecionada);
    }

    if (setorSelecionado !== 'Todos') {
      filtered = filtered.filter(item => item.setor_responsavel === setorSelecionado);
    }

    if (tipoSelecionado !== 'Todos') {
      filtered = filtered.filter(item => item.tipo_nc === tipoSelecionado);
    }

    if (classificacaoSelecionada !== 'Todas') {
      filtered = filtered.filter(item => item.classificacao === classificacaoSelecionada);
    }

    if (statusSelecionado !== 'Todos') {
      filtered = filtered.filter(item => item.status === statusSelecionado);
    }

    setFilteredNaoConformidades(filtered);
  };

  const clearFilters = () => {
    setDataInicio('');
    setDataFim('');
    setUnidadeSelecionada('Todas');
    setSetorSelecionado('Todos');
    setTipoSelecionado('Todos');
    setClassificacaoSelecionada('Todas');
    setStatusSelecionado('Todos');
  };

  useEffect(() => {
    filterNaoConformidades();
  }, [naoConformidades, dataInicio, dataFim, unidadeSelecionada, setorSelecionado, tipoSelecionado, classificacaoSelecionada, statusSelecionado]);

  useEffect(() => {
    if (!dataInicio && !dataFim && unidadeSelecionada === 'Todas' && setorSelecionado === 'Todos' && 
        tipoSelecionado === 'Todos' && classificacaoSelecionada === 'Todas' && statusSelecionado === 'Todos') {
      setFilteredNaoConformidades(naoConformidades);
    }
  }, [naoConformidades]);

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
