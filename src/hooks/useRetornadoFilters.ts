
import { useState, useEffect } from 'react';
import { Retornado } from '@/types';

export const useRetornadoFilters = (retornados: Retornado[]) => {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [filialSelecionada, setFilialSelecionada] = useState('Todas');
  const [destinoSelecionado, setDestinoSelecionado] = useState('Todos');
  const [filteredRetornados, setFilteredRetornados] = useState<Retornado[]>([]);

  const filterRetornados = () => {
    console.log('Aplicando filtros aos dados:', retornados.length, 'registros');
    console.log('Filtros:', { dataInicio, dataFim, filialSelecionada, destinoSelecionado });
    
    let filtered = [...retornados];

    if (dataInicio) {
      const startDate = new Date(dataInicio);
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.data_registro);
        return itemDate >= startDate;
      });
      console.log('Após filtro data início:', filtered.length, 'registros');
    }

    if (dataFim) {
      const endDate = new Date(dataFim);
      endDate.setHours(23, 59, 59, 999); // Incluir todo o dia final
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.data_registro);
        return itemDate <= endDate;
      });
      console.log('Após filtro data fim:', filtered.length, 'registros');
    }

    if (filialSelecionada !== 'Todas') {
      filtered = filtered.filter(item => item.filial === filialSelecionada);
      console.log('Após filtro filial:', filtered.length, 'registros');
    }

    if (destinoSelecionado !== 'Todos') {
      filtered = filtered.filter(item => item.destino_final === destinoSelecionado);
      console.log('Após filtro destino:', filtered.length, 'registros');
    }

    console.log('Total após todos os filtros:', filtered.length, 'registros');
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

  // Sempre mostrar todos os dados quando não há filtros aplicados
  useEffect(() => {
    if (!dataInicio && !dataFim && filialSelecionada === 'Todas' && destinoSelecionado === 'Todos') {
      console.log('Nenhum filtro aplicado, mostrando todos os dados:', retornados.length);
      setFilteredRetornados(retornados);
    }
  }, [retornados]);

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
