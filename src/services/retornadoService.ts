
import { supabase } from '@/integrations/supabase/client';
import type { Retornado } from '@/types';
import { tonerService } from './tonerService';

export const retornadoService = {
  async getAll(): Promise<Retornado[]> {
    const { data, error } = await supabase
      .from('retornados')
      .select(`
        *,
        toners!inner(modelo, peso_vazio, gramatura, capacidade_folhas, valor_por_folha)
      `)
      .order('data_registro', { ascending: false });

    if (error) {
      console.error('Error fetching retornados:', error);
      throw error;
    }

    // Transform data to match Retornado interface with proper types and calculate valor_recuperado
    return data.map(item => {
      let valorRecuperadoCalculado = item.valor_recuperado;

      // Calcular valor recuperado se destino for estoque e não tiver valor já calculado
      if ((item.destino_final === 'Estoque' || item.destino_final === 'Estoque Semi Novo') && !item.valor_recuperado) {
        const gramaturaRestante = item.peso - item.toners.peso_vazio;
        const percentualGramatura = (gramaturaRestante / item.toners.gramatura) * 100;
        const folhasRestantes = (percentualGramatura / 100) * item.toners.capacidade_folhas;
        valorRecuperadoCalculado = folhasRestantes * item.toners.valor_por_folha;
      }

      return {
        ...item,
        modelo: item.toners.modelo,
        destino_final: item.destino_final as Retornado['destino_final'],
        valor_recuperado: valorRecuperadoCalculado,
        // Campos adicionais para cálculos
        peso_vazio: item.toners.peso_vazio,
        gramatura: item.toners.gramatura,
        capacidade_folhas: item.toners.capacidade_folhas,
        valor_por_folha: item.toners.valor_por_folha,
      };
    });
  },

  async getById(id: number): Promise<Retornado> {
    const { data, error } = await supabase
      .from('retornados')
      .select(`
        *,
        toners!inner(modelo, peso_vazio, gramatura, capacidade_folhas, valor_por_folha)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching retornado:', error);
      throw error;
    }

    let valorRecuperadoCalculado = data.valor_recuperado;

    // Calcular valor recuperado se destino for estoque e não tiver valor já calculado
    if ((data.destino_final === 'Estoque' || data.destino_final === 'Estoque Semi Novo') && !data.valor_recuperado) {
      const gramaturaRestante = data.peso - data.toners.peso_vazio;
      const percentualGramatura = (gramaturaRestante / data.toners.gramatura) * 100;
      const folhasRestantes = (percentualGramatura / 100) * data.toners.capacidade_folhas;
      valorRecuperadoCalculado = folhasRestantes * data.toners.valor_por_folha;
    }

    // Transform data to match Retornado interface with proper types
    return {
      ...data,
      modelo: data.toners.modelo,
      destino_final: data.destino_final as Retornado['destino_final'],
      valor_recuperado: valorRecuperadoCalculado,
      peso_vazio: data.toners.peso_vazio,
      gramatura: data.toners.gramatura,
      capacidade_folhas: data.toners.capacidade_folhas,
      valor_por_folha: data.toners.valor_por_folha,
    };
  },

  async create(retornado: Omit<Retornado, 'id' | 'modelo'>): Promise<Retornado> {
    // Buscar dados do toner para calcular valor recuperado se necessário
    let valorRecuperado = retornado.valor_recuperado;
    
    if ((retornado.destino_final === 'Estoque' || retornado.destino_final === 'Estoque Semi Novo') && !valorRecuperado) {
      const toner = await tonerService.getById(retornado.id_modelo);
      if (toner) {
        const gramaturaRestante = retornado.peso - toner.peso_vazio;
        const percentualGramatura = (gramaturaRestante / toner.gramatura) * 100;
        const folhasRestantes = (percentualGramatura / 100) * toner.capacidade_folhas;
        valorRecuperado = folhasRestantes * toner.valor_por_folha;
      }
    }

    const { data, error } = await supabase
      .from('retornados')
      .insert([{ ...retornado, valor_recuperado: valorRecuperado }])
      .select(`
        *,
        toners!inner(modelo, peso_vazio, gramatura, capacidade_folhas, valor_por_folha)
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
      destino_final: data.destino_final as Retornado['destino_final'],
      valor_recuperado: data.valor_recuperado,
      peso_vazio: data.toners.peso_vazio,
      gramatura: data.toners.gramatura,
      capacidade_folhas: data.toners.capacidade_folhas,
      valor_por_folha: data.toners.valor_por_folha,
    };
  },

  async update(id: number, updates: Partial<Retornado>): Promise<Retornado> {
    // Se estiver atualizando para destino estoque, calcular valor recuperado
    let valorRecuperado = updates.valor_recuperado;
    
    if ((updates.destino_final === 'Estoque' || updates.destino_final === 'Estoque Semi Novo') && !valorRecuperado && updates.peso && updates.id_modelo) {
      const toner = await tonerService.getById(updates.id_modelo);
      if (toner) {
        const gramaturaRestante = updates.peso - toner.peso_vazio;
        const percentualGramatura = (gramaturaRestante / toner.gramatura) * 100;
        const folhasRestantes = (percentualGramatura / 100) * toner.capacidade_folhas;
        valorRecuperado = folhasRestantes * toner.valor_por_folha;
      }
    }

    const { data, error } = await supabase
      .from('retornados')
      .update({ ...updates, valor_recuperado: valorRecuperado })
      .eq('id', id)
      .select(`
        *,
        toners!inner(modelo, peso_vazio, gramatura, capacidade_folhas, valor_por_folha)
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
      destino_final: data.destino_final as Retornado['destino_final'],
      valor_recuperado: data.valor_recuperado,
      peso_vazio: data.toners.peso_vazio,
      gramatura: data.toners.gramatura,
      capacidade_folhas: data.toners.capacidade_folhas,
      valor_por_folha: data.toners.valor_por_folha,
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
        toners!inner(modelo, peso_vazio, gramatura, capacidade_folhas, valor_por_folha)
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

    // Transform data to match Retornado interface with proper types and calculate valor_recuperado
    return data.map(item => {
      let valorRecuperadoCalculado = item.valor_recuperado;

      // Calcular valor recuperado se destino for estoque e não tiver valor já calculado
      if ((item.destino_final === 'Estoque' || item.destino_final === 'Estoque Semi Novo') && !item.valor_recuperado) {
        const gramaturaRestante = item.peso - item.toners.peso_vazio;
        const percentualGramatura = (gramaturaRestante / item.toners.gramatura) * 100;
        const folhasRestantes = (percentualGramatura / 100) * item.toners.capacidade_folhas;
        valorRecuperadoCalculado = folhasRestantes * item.toners.valor_por_folha;
      }

      return {
        ...item,
        modelo: item.toners.modelo,
        destino_final: item.destino_final as Retornado['destino_final'],
        valor_recuperado: valorRecuperadoCalculado,
        peso_vazio: item.toners.peso_vazio,
        gramatura: item.toners.gramatura,
        capacidade_folhas: item.toners.capacidade_folhas,
        valor_por_folha: item.toners.valor_por_folha,
      };
    });
  }
};
