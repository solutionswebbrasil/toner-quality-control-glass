
import { useState, useEffect } from 'react';
import { Retornado } from '@/types';

export const useRetornadoFilters = (retornados: Retornado[]) => {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [filialSelecionada, setFilialSelecionada] = useState('Todas');
  const [destinoSelecionado, setDestinoSelecionado] = useState('Todos');
  const [filteredRetornados, setFilteredRetornados] = useState<Retornado[]>([]);

  const filterRetornados = () => {
    let filtered = [...retornados];

    if (dataInicio) {
      filtered = filtered.filter(item => item.data_registro >= dataInicio);
    }

    if (dataFim) {
      filtered = filtered.filter(item => item.data_registro <= dataFim);
    }

    if (filialSelecionada !== 'Todas') {
      filtered = filtered.filter(item => item.filial === filialSelecionada);
    }

    if (destinoSelecionado !== 'Todos') {
      filtered = filtered.filter(item => item.destino_final === destinoSelecionado);
    }

    setFilteredRetornados(filtered);
  };

  const clearFilters = () => {
    setDataInicio('');
    setDataFim('');
    setFilialSelecionada('Todas');
    setDestinoSelecionado('Todos');
  };

  useEffect(() => {
    filterRetornados();
  }, [retornados, dataInicio, dataFim, filialSelecionada, destinoSelecionado]);

  return {
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
    filialSelecionada,
    setFilialSelecionada,
    destinoSelecionado,
    setDestinoSelecionado,
    filteredRetornados,
    clearFilters
  };
};
