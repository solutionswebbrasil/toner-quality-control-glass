
import { createServer as createViteServer } from 'vite';
import { createServer as createHttpServer } from 'http';

export async function createServer() {
  const httpServer = createHttpServer();
  
  const vite = await createViteServer({
    server: { 
      middlewareMode: true,
      hmr: { server: httpServer },
    },
  });

  return { vite, httpServer };
}
