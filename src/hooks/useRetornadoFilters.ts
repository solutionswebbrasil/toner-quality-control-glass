
import { useState, useMemo } from 'react';

export const useRetornadoFilters = (retornados: any[]) => {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [filialSelecionada, setFilialSelecionada] = useState('');
  const [destinoSelecionado, setDestinoSelecionado] = useState('');

  const filteredRetornados = useMemo(() => {
    return retornados.filter(retornado => {
      const matchDataInicio = !dataInicio || retornado.data_registro >= dataInicio;
      const matchDataFim = !dataFim || retornado.data_registro <= dataFim;
      const matchFilial = !filialSelecionada || retornado.filial === filialSelecionada;
      const matchDestino = !destinoSelecionado || retornado.destino_final === destinoSelecionado;

      return matchDataInicio && matchDataFim && matchFilial && matchDestino;
    });
  }, [retornados, dataInicio, dataFim, filialSelecionada, destinoSelecionado]);

  const clearFilters = () => {
    setDataInicio('');
    setDataFim('');
    setFilialSelecionada('');
    setDestinoSelecionado('');
  };

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
