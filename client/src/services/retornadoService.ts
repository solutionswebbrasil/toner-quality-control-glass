
import { supabase } from '@/integrations/supabase/client';
import type { Retornado, Toner, Filial } from '@/types';

interface RetornadoWithDetails extends Retornado {
  toner?: Toner;
  filial_nome?: string;
  peso_vazio?: number;
}

export const retornadoService = {
  async getAll(): Promise<RetornadoWithDetails[]> {
    const { data, error } = await supabase
      .from('retornados')
      .select('*')
      .order('data_registro', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar retornados: ${error.message}`);
    }

    return data || [];
  },

  async getAllWithDetails(): Promise<RetornadoWithDetails[]> {
    // Get retornados
    const retornados = await this.getAll();
    
    // Get toners and filiais for details
    const { data: toners } = await supabase.from('toners').select('*');
    const { data: filiais } = await supabase.from('filiais').select('*');
    
    // Combine data
    return retornados.map(retornado => {
      const toner = toners?.find(t => t.id === retornado.id_modelo);
      const filial = filiais?.find(f => f.id === parseInt(retornado.filial));
      
      return {
        ...retornado,
        toner,
        filial_nome: filial?.nome,
        peso_vazio: toner?.peso_vazio
      };
    });
  },

  async getStats() {
    const data = await this.getAll();
    
    const monthlyData: Record<string, { quantidade: number; peso: number }> = {};
    const filialData: Record<string, number> = {};
    
    data.forEach((retornado: any) => {
      const date = new Date(retornado.data_registro);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { quantidade: 0, peso: 0 };
      }
      monthlyData[monthKey].quantidade += 1;
      monthlyData[monthKey].peso += Number(retornado.peso || 0);
      
      filialData[retornado.filial] = (filialData[retornado.filial] || 0) + 1;
    });

    return {
      monthlyData,
      filialData,
      total: data.length
    };
  },

  async create(retornado: Omit<Retornado, 'id' | 'data_registro' | 'user_id'>): Promise<Retornado> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const retornadoData = {
      ...retornado,
      user_id: user.id,
      data_registro: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('retornados')
      .insert(retornadoData)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar retornado: ${error.message}`);
    }

    return data;
  },

  async update(id: number, retornado: Partial<Retornado>): Promise<Retornado | null> {
    const { data, error } = await supabase
      .from('retornados')
      .update(retornado)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar retornado:', error);
      return null;
    }

    return data;
  },

  async delete(id: number): Promise<boolean> {
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

  async deleteAll(): Promise<boolean> {
    const { error } = await supabase
      .from('retornados')
      .delete()
      .neq('id', 0);

    if (error) {
      console.error('Erro ao deletar todos os retornados:', error);
      return false;
    }

    return true;
  },

  async exportToCsv(): Promise<string> {
    const data = await this.getAllWithDetails();
    
    const headers = ['ID', 'Modelo', 'Cliente', 'Peso', 'Filial', 'Destino Final', 'Data Registro'];
    const csvContent = [
      headers.join(','),
      ...data.map((item: any) => [
        item.id,
        item.toner?.modelo || 'N/A',
        item.id_cliente,
        item.peso,
        item.filial_nome || item.filial,
        item.destino_final,
        new Date(item.data_registro).toLocaleDateString('pt-BR')
      ].join(','))
    ].join('\n');

    return csvContent;
  }
};
