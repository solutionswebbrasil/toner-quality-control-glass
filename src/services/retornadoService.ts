
import { supabase } from '@/integrations/supabase/client';
import type { Retornado } from '@/types';

export const retornadoService = {
  async getAll(): Promise<Retornado[]> {
    const { data, error } = await supabase
      .from('retornados')
      .select(`
        *,
        toners!inner(modelo)
      `)
      .order('data_registro', { ascending: false });

    if (error) {
      console.error('Error fetching retornados:', error);
      throw error;
    }

    // Transform data to match Retornado interface with proper types
    return data.map(item => ({
      ...item,
      modelo: item.toners.modelo,
      destino_final: item.destino_final as Retornado['destino_final'], // Type assertion for destino_final
    }));
  },

  async getById(id: number): Promise<Retornado> {
    const { data, error } = await supabase
      .from('retornados')
      .select(`
        *,
        toners!inner(modelo)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching retornado:', error);
      throw error;
    }

    // Transform data to match Retornado interface with proper types
    return {
      ...data,
      modelo: data.toners.modelo,
      destino_final: data.destino_final as Retornado['destino_final'], // Type assertion for destino_final
    };
  },

  async create(retornado: Omit<Retornado, 'id' | 'modelo'>): Promise<Retornado> {
    const { data, error } = await supabase
      .from('retornados')
      .insert([retornado])
      .select(`
        *,
        toners!inner(modelo)
      `)
      .single();

    if (error) {
      console.error('Error creating retornado:', error);
      throw error;
    }

    // Transform data to match Retornado interface with proper types
    return {
      ...data,
      modelo: data.toners.modelo,
      destino_final: data.destino_final as Retornado['destino_final'], // Type assertion for destino_final
    };
  },

  async update(id: number, updates: Partial<Retornado>): Promise<Retornado> {
    const { data, error } = await supabase
      .from('retornados')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        toners!inner(modelo)
      `)
      .single();

    if (error) {
      console.error('Error updating retornado:', error);
      throw error;
    }

    // Transform data to match Retornado interface with proper types
    return {
      ...data,
      modelo: data.toners.modelo,
      destino_final: data.destino_final as Retornado['destino_final'], // Type assertion for destino_final
    };
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('retornados')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting retornado:', error);
      throw error;
    }
  },

  async getByFilters(filters: {
    dataInicio?: string;
    dataFim?: string;
    destino?: string;
    filial?: string;
  }): Promise<Retornado[]> {
    let query = supabase
      .from('retornados')
      .select(`
        *,
        toners!inner(modelo)
      `);

    if (filters.dataInicio) {
      query = query.gte('data_registro', filters.dataInicio);
    }

    if (filters.dataFim) {
      query = query.lte('data_registro', filters.dataFim);
    }

    if (filters.destino && filters.destino !== 'Todos') {
      query = query.eq('destino_final', filters.destino);
    }

    if (filters.filial && filters.filial !== 'Todas') {
      query = query.eq('filial', filters.filial);
    }

    const { data, error } = await query.order('data_registro', { ascending: false });

    if (error) {
      console.error('Error fetching filtered retornados:', error);
      throw error;
    }

    // Transform data to match Retornado interface with proper types
    return data.map(item => ({
      ...item,
      modelo: item.toners.modelo,
      destino_final: item.destino_final as Retornado['destino_final'], // Type assertion for destino_final
    }));
  }
};
