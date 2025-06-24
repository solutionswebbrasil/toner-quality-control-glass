
import express from 'express';
import { supabase } from '../client/src/integrations/supabase/client';

export function setupRoutes(app: any) {
  app.get('/api/filiais', async (req: any, res: any) => {
    try {
      const { data, error } = await supabase
        .from('filiais')
        .select('*');

      if (error) {
        console.error("Erro ao buscar filiais:", error);
        return res.status(500).send("Erro ao buscar filiais");
      }

      res.json(data);
    } catch (error) {
      console.error("Erro inesperado ao buscar filiais:", error);
      res.status(500).send("Erro inesperado ao buscar filiais");
    }
  });

  app.use((err: any, req: any, res: any, next: any) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });
}
