
import { useState, useMemo } from 'react';
import { Retornado } from '@/types';

export const useRetornadoFilters = (retornados: Retornado[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedFilial, setSelectedFilial] = useState('');

  const filteredData = useMemo(() => {
    return retornados.filter(item => {
      const matchesSearch = !searchTerm || 
        item.id_cliente.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.filial.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilial = !selectedFilial || item.filial === selectedFilial;
      
      const matchesDate = !dateRange.from || !dateRange.to || 
        (item.data_registro >= dateRange.from && item.data_registro <= dateRange.to);
      
      return matchesSearch && matchesFilial && matchesDate;
    });
  }, [retornados, searchTerm, selectedFilial, dateRange]);

  return {
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    selectedFilial,
    setSelectedFilial,
    filteredData
  };
};
