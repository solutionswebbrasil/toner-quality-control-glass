

import { Certificado } from '@/types/certificado';

export const certificadoService = {
  async getAll(): Promise<Certificado[]> {
    const { data, error } = await supabase
      .from('certificados')
      .select('*')
      .order('data_registro', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar certificados: ${error.message}`);
    }

    return data || [];
  },

  async create(certificado: Omit<Certificado, 'id' | 'data_registro' | 'user_id'>): Promise<Certificado> {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const certificadoData = {
      ...certificado,
      user_id: user.id,
      data_registro: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('certificados')
      .insert(certificadoData)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar certificado: ${error.message}`);
    }

    return data;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('certificados')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao excluir certificado: ${error.message}`);
    }
  }
};
