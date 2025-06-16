
import * as XLSX from 'xlsx';

export const generateExcelTemplate = (onSuccess: () => void, onError: () => void) => {
  try {
    // Modelo sem a coluna peso, já que não é necessária
    const template = [
      { 
        id_cliente: 12345, 
        modelo: 'HP CF217A', 
        filial: 'Matriz', 
        destino_final: 'Estoque',
        valor_recuperado: 25.50, 
        data_registro: '16/06/2024' // Formato brasileiro
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Retornados');
    XLSX.writeFile(wb, 'template_importacao_retornados.xlsx');

    onSuccess();
  } catch (error) {
    onError();
  }
};
