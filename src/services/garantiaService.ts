
import { supabase } from '@/integrations/supabase/client';
import type { Garantia } from '@/types';

export const garantiaService = {
  getAll: async (): Promise<Garantia[]> => {
    const { data, error } = await supabase
      .from('garantias')
      .select(`
        *,
        fornecedores:fornecedor_id (
          nome
        )
      `)
      .order('data_registro', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar garantias:', error);
      throw error;
    }
    
    return (data || []).map(item => ({
      ...item,
      fornecedor: item.fornecedores?.nome || 'N/A'
    }));
  },

  getById: async (id: number): Promise<Garantia | undefined> => {
    const { data, error } = await supabase
      .from('garantias')
      .select(`
        *,
        fornecedores:fornecedor_id (
          nome
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar garantia:', error);
      return undefined;
    }
    
    return {
      ...data,
      fornecedor: data.fornecedores?.nome || 'N/A'
    };
  },

  create: async (garantia: Omit<Garantia, 'id'>): Promise<Garantia> => {
    const { data, error } = await supabase
      .from('garantias')
      .insert([garantia])
      .select(`
        *,
        fornecedores:fornecedor_id (
          nome
        )
      `)
      .single();
    
    if (error) {
      console.error('Erro ao criar garantia:', error);
      throw error;
    }
    
    return {
      ...data,
      fornecedor: data.fornecedores?.nome || 'N/A'
    };
  },

  update: async (id: number, garantia: Partial<Garantia>): Promise<Garantia | null> => {
    const { data, error } = await supabase
      .from('garantias')
      .update(garantia)
      .eq('id', id)
      .select(`
        *,
        fornecedores:fornecedor_id (
          nome
        )
      `)
      .single();
    
    if (error) {
      console.error('Erro ao atualizar garantia:', error);
      return null;
    }
    
    return {
      ...data,
      fornecedor: data.fornecedores?.nome || 'N/A'
    };
  },

  delete: async (id: number): Promise<boolean> => {
    const { error } = await supabase
      .from('garantias')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar garantia:', error);
      return false;
    }
    
    return true;
  },

  getStats: async () => {
    const { data: garantias, error } = await supabase
      .from('garantias')
      .select(`
        *,
        fornecedores:fornecedor_id (
          nome
        )
      `);
    
    if (error) {
      console.error('Erro ao buscar estatísticas de garantias:', error);
      throw error;
    }
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Dados por mês para gráficos
    const monthlyData = (garantias || []).reduce((acc, g) => {
      const date = new Date(g.data_registro);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { quantidade: 0, valor: 0 };
      }
      
      acc[monthKey].quantidade += g.quantidade;
      acc[monthKey].valor += g.valor_total;
      
      return acc;
    }, {} as Record<string, { quantidade: number; valor: number }>);

    // Dados por fornecedor no mês atual
    const currentMonthByFornecedor = (garantias || [])
      .filter(g => {
        const date = new Date(g.data_registro);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((acc, g) => {
        const fornecedor = g.fornecedores?.nome || 'N/A';
        acc[fornecedor] = (acc[fornecedor] || 0) + g.quantidade;
        return acc;
      }, {} as Record<string, number>);

    return Promise.resolve({
      monthlyData,
      currentMonthByFornecedor
    });
  }
};
