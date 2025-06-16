
// Função para normalizar data - foco no formato brasileiro DD/MM/YYYY
export const normalizeDate = (dateValue: any): string => {
  if (!dateValue) {
    return new Date().toISOString().split('T')[0];
  }

  console.log('Processando data:', dateValue, 'Tipo:', typeof dateValue);

  // Se já é uma string no formato correto YYYY-MM-DD
  if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }

  // Se é uma data do Excel (número)
  if (typeof dateValue === 'number') {
    const excelDate = new Date((dateValue - 25569) * 86400 * 1000);
    return excelDate.toISOString().split('T')[0];
  }

  // Se é string, priorizar formato brasileiro DD/MM/YYYY
  if (typeof dateValue === 'string') {
    const dateStr = dateValue.trim();
    
    // Formato DD/MM/YYYY (formato brasileiro preferido)
    const brDateMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (brDateMatch) {
      const [, day, month, year] = brDateMatch;
      const normalizedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      console.log(`Data convertida de ${dateStr} para ${normalizedDate}`);
      return normalizedDate;
    }

    // Formato DD-MM-YYYY (alternativo)
    const brDateDashMatch = dateStr.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    if (brDateDashMatch) {
      const [, day, month, year] = brDateDashMatch;
      const normalizedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      console.log(`Data convertida de ${dateStr} para ${normalizedDate}`);
      return normalizedDate;
    }

    // Formato YYYY/MM/DD ou YYYY-MM-DD
    const isoDateMatch = dateStr.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
    if (isoDateMatch) {
      const [, year, month, day] = isoDateMatch;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Tentar parser nativo como último recurso
    try {
      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().split('T')[0];
      }
    } catch (e) {
      console.log('Erro ao parsear data:', e);
    }
  }

  // Se chegou aqui, usar data atual
  console.log('Usando data atual como fallback para:', dateValue);
  return new Date().toISOString().split('T')[0];
};
