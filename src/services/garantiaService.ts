
import { supabase } from '@/integrations/supabase/client';
import { Garantia } from '@/types';

export class GarantiaService {
  async getAll(): Promise<Garantia[]> {
    const { data, error } = await supabase
      .from('garantias')
      .select(`
        *,
        fornecedores!inner(nome)
      `)
      .order('data_registro', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      ...item,
      fornecedor: item.fornecedores.nome
    }));
  }

  async getById(id: number): Promise<Garantia> {
    const { data, error } = await supabase
      .from('garantias')
      .select(`
        *,
        fornecedores!inner(nome)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      fornecedor: data.fornecedores.nome
    };
  }

  async create(garantia: Omit<Garantia, 'id'>): Promise<Garantia> {
    const { data, error } = await supabase
      .from('garantias')
      .insert(garantia)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, garantia: Partial<Garantia>): Promise<Garantia> {
    const { data, error } = await supabase
      .from('garantias')
      .update(garantia)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('garantias')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getStatusConfiguracoes(modulo: string = 'Garantias') {
    const { data, error } = await supabase
      .from('status_configuracoes')
      .select('*')
      .eq('modulo', modulo)
      .eq('ativo', true)
      .order('ordem');

    if (error) throw error;
    return data || [];
  }

  async getResultadoConfiguracoes(modulo: string = 'Garantias') {
    const { data, error } = await supabase
      .from('resultados_configuracoes')
      .select('*')
      .eq('modulo', modulo)
      .eq('ativo', true)
      .order('ordem');

    if (error) throw error;
    return data || [];
  }

  async uploadFile(file: File, bucket: string = 'garantias-nf'): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  }

  async deleteFile(url: string, bucket: string = 'garantias-nf'): Promise<void> {
    const fileName = url.split('/').pop();
    if (!fileName) return;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) throw error;
  }
}

export const garantiaService = new GarantiaService();
