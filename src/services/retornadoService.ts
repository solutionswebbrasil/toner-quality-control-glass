
import { supabase } from '@/integrations/supabase/client';
import type { Retornado } from '@/types';

export const retornadoService = {
  getAll: async (): Promise<Retornado[]> => {
    const { data, error } = await supabase
      .from('retornados')
      .select(`
        *,
        toners:id_modelo (
          modelo
        )
      `)
      .order('data_registro', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar retornados:', error);
      throw error;
    }
    
    return (data || []).map(item => ({
      ...item,
      modelo: item.toners?.modelo || 'N/A'
    }));
  },

  create: async (retornado: Omit<Retornado, 'id'>): Promise<Retornado> => {
    const { data, error } = await supabase
      .from('retornados')
      .insert([retornado])
      .select(`
        *,
        toners:id_modelo (
          modelo
        )
      `)
      .single();
    
    if (error) {
      console.error('Erro ao criar retornado:', error);
      throw error;
    }
    
    return {
      ...data,
      modelo: data.toners?.modelo || 'N/A'
    };
  },

  update: async (id: number, retornado: Partial<Retornado>): Promise<Retornado | null> => {
    const { data, error } = await supabase
      .from('retornados')
      .update(retornado)
      .eq('id', id)
      .select(`
        *,
        toners:id_modelo (
          modelo
        )
      `)
      .single();
    
    if (error) {
      console.error('Erro ao atualizar retornado:', error);
      return null;
    }
    
    return {
      ...data,
      modelo: data.toners?.modelo || 'N/A'
    };
  },

  bulkCreate: async (retornadosList: Omit<Retornado, 'id'>[]): Promise<Retornado[]> => {
    const { data, error } = await supabase
      .from('retornados')
      .insert(retornadosList)
      .select(`
        *,
        toners:id_modelo (
          modelo
        )
      `);
    
    if (error) {
      console.error('Erro ao criar retornados em lote:', error);
      throw error;
    }
    
    return (data || []).map(item => ({
      ...item,
      modelo: item.toners?.modelo || 'N/A'
    }));
  },

  delete: async (id: number): Promise<boolean> => {
    const { error } = await supabase
      .from('retornados')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar retornado:', error);
      return false;
    }
    
    return true;
  },

  getStats: async () => {
    const { data: retornados, error } = await supabase
      .from('retornados')
      .select(`
        *,
        toners:id_modelo (
          modelo
        )
      `);
    
    if (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const currentMonthData = retornados?.filter(r => {
      const date = new Date(r.data_registro);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }) || [];

    const previousMonthData = retornados?.filter(r => {
      const date = new Date(r.data_registro);
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
    }) || [];

    const byDestination = (retornados || []).reduce((acc, r) => {
      acc[r.destino_final] = (acc[r.destino_final] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byModel = (retornados || []).reduce((acc, r) => {
      const model = r.toners?.modelo || 'N/A';
      acc[model] = (acc[model] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Promise.resolve({
      currentMonth: currentMonthData,
      previousMonth: previousMonthData,
      byDestination,
      byModel
    });
  }
};
