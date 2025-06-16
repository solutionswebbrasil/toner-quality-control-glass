
import { Retornado } from '@/types';

export const exportToCSV = (filteredRetornados: Retornado[], onSuccess: () => void, onError: () => void) => {
  try {
    const headers = ['ID Cliente', 'Modelo', 'Filial', 'Destino Final', 'Valor Recuperado', 'Data Registro'];
    const csvContent = [
      headers.join(','),
      ...filteredRetornados.map(row => [
        row.id_cliente,
        `"${row.modelo || ''}"`,
        `"${row.filial}"`,
        `"${row.destino_final}"`,
        row.valor_recuperado || '',
        new Date(row.data_registro).toLocaleDateString('pt-BR')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `retornados_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onSuccess();
  } catch (error) {
    onError();
  }
};
