import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import crypto from "crypto";

// Hash password function
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'salt123').digest('hex');
}

// Verify password function
function verifyPassword(inputPassword: string, storedHash: string): boolean {
  return storedHash === hashPassword(inputPassword);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { usuario, senha } = req.body;
      
      if (!usuario || !senha) {
        return res.status(400).json({ error: "Usuário e senha são obrigatórios" });
      }

      const user = await storage.getUsuarioByCredentials(usuario);
      if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const isValidPassword = verifyPassword(senha, user.senha);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      // Get user permissions
      const permissions = await storage.getPermissoesByUserId(user.id);

      res.json({
        user: {
          id: user.id,
          nome_completo: user.nome_completo,
          usuario: user.usuario,
        },
        permissions
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Data routes
  app.get("/api/fornecedores", async (req, res) => {
    try {
      const fornecedores = await storage.getFornecedores();
      res.json(fornecedores);
    } catch (error) {
      console.error("Error fetching fornecedores:", error);
      res.status(500).json({ error: "Erro ao buscar fornecedores" });
    }
  });

  app.post("/api/fornecedores", async (req, res) => {
    try {
      const fornecedor = await storage.createFornecedor(req.body);
      res.json(fornecedor);
    } catch (error) {
      console.error("Error creating fornecedor:", error);
      res.status(500).json({ error: "Erro ao criar fornecedor" });
    }
  });

  app.get("/api/toners", async (req, res) => {
    try {
      const toners = await storage.getToners();
      res.json(toners);
    } catch (error) {
      console.error("Error fetching toners:", error);
      res.status(500).json({ error: "Erro ao buscar toners" });
    }
  });

  app.post("/api/toners", async (req, res) => {
    try {
      const toner = await storage.createToner(req.body);
      res.json(toner);
    } catch (error) {
      console.error("Error creating toner:", error);
      res.status(500).json({ error: "Erro ao criar toner" });
    }
  });

  app.get("/api/retornados", async (req, res) => {
    try {
      const retornados = await storage.getRetornados();
      res.json(retornados);
    } catch (error) {
      console.error("Error fetching retornados:", error);
      res.status(500).json({ error: "Erro ao buscar retornados" });
    }
  });

  app.post("/api/retornados", async (req, res) => {
    try {
      const retornado = await storage.createRetornado(req.body);
      res.json(retornado);
    } catch (error) {
      console.error("Error creating retornado:", error);
      res.status(500).json({ error: "Erro ao criar retornado" });
    }
  });

  app.get("/api/garantias", async (req, res) => {
    try {
      const garantias = await storage.getGarantias();
      res.json(garantias);
    } catch (error) {
      console.error("Error fetching garantias:", error);
      res.status(500).json({ error: "Erro ao buscar garantias" });
    }
  });

  app.post("/api/garantias", async (req, res) => {
    try {
      const garantia = await storage.createGarantia(req.body);
      res.json(garantia);
    } catch (error) {
      console.error("Error creating garantia:", error);
      res.status(500).json({ error: "Erro ao criar garantia" });
    }
  });

  app.put("/api/garantias/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.updateGarantia(parseInt(id), req.body);
      res.json({ message: "Garantia atualizada com sucesso" });
    } catch (error) {
      console.error("Error updating garantia:", error);
      res.status(500).json({ error: "Erro ao atualizar garantia" });
    }
  });

  app.delete("/api/garantias/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteGarantia(parseInt(id));
      res.json({ message: "Garantia excluída com sucesso" });
    } catch (error) {
      console.error("Error deleting garantia:", error);
      res.status(500).json({ error: "Erro ao excluir garantia" });
    }
  });

  // Additional CRUD routes for other entities
  app.put("/api/fornecedores/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.updateFornecedor(parseInt(id), req.body);
      res.json({ message: "Fornecedor atualizado com sucesso" });
    } catch (error) {
      console.error("Error updating fornecedor:", error);
      res.status(500).json({ error: "Erro ao atualizar fornecedor" });
    }
  });

  app.delete("/api/fornecedores/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteFornecedor(parseInt(id));
      res.json({ message: "Fornecedor excluído com sucesso" });
    } catch (error) {
      console.error("Error deleting fornecedor:", error);
      res.status(500).json({ error: "Erro ao excluir fornecedor" });
    }
  });

  app.put("/api/toners/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.updateToner(parseInt(id), req.body);
      res.json({ message: "Toner atualizado com sucesso" });
    } catch (error) {
      console.error("Error updating toner:", error);
      res.status(500).json({ error: "Erro ao atualizar toner" });
    }
  });

  app.delete("/api/toners/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteToner(parseInt(id));
      res.json({ message: "Toner excluído com sucesso" });
    } catch (error) {
      console.error("Error deleting toner:", error);
      res.status(500).json({ error: "Erro ao excluir toner" });
    }
  });

  app.put("/api/retornados/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.updateRetornado(parseInt(id), req.body);
      res.json({ message: "Retornado atualizado com sucesso" });
    } catch (error) {
      console.error("Error updating retornado:", error);
      res.status(500).json({ error: "Erro ao atualizar retornado" });
    }
  });

  app.delete("/api/retornados/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteRetornado(parseInt(id));
      res.json({ message: "Retornado excluído com sucesso" });
    } catch (error) {
      console.error("Error deleting retornado:", error);
      res.status(500).json({ error: "Erro ao excluir retornado" });
    }
  });

  // Análises Ishikawa routes
  app.get("/api/analises-ishikawa", async (req, res) => {
    try {
      const analises = await storage.getAnalesesIshikawa();
      res.json(analises);
    } catch (error) {
      console.error("Error fetching ishikawa analyses:", error);
      res.status(500).json({ error: "Erro ao buscar análises Ishikawa" });
    }
  });

  app.post("/api/analises-ishikawa", async (req, res) => {
    try {
      const analise = await storage.createAnaliseIshikawa(req.body);
      res.json(analise);
    } catch (error) {
      console.error("Error creating ishikawa analysis:", error);
      res.status(500).json({ error: "Erro ao criar análise Ishikawa" });
    }
  });

  app.get("/api/analises-ishikawa/:id/categorias", async (req, res) => {
    try {
      const { id } = req.params;
      const categorias = await storage.getCategoriasIshikawa(parseInt(id));
      res.json(categorias);
    } catch (error) {
      console.error("Error fetching ishikawa categories:", error);
      res.status(500).json({ error: "Erro ao buscar categorias Ishikawa" });
    }
  });

  app.post("/api/categorias-ishikawa", async (req, res) => {
    try {
      const categoria = await storage.createCategoriaIshikawa(req.body);
      res.json(categoria);
    } catch (error) {
      console.error("Error creating ishikawa category:", error);
      res.status(500).json({ error: "Erro ao criar categoria Ishikawa" });
    }
  });

  // Análises Pareto routes
  app.get("/api/analises-pareto", async (req, res) => {
    try {
      const analises = await storage.getAnalesesPareto();
      res.json(analises);
    } catch (error) {
      console.error("Error fetching pareto analyses:", error);
      res.status(500).json({ error: "Erro ao buscar análises Pareto" });
    }
  });

  app.post("/api/analises-pareto", async (req, res) => {
    try {
      const analise = await storage.createAnalisePareto(req.body);
      res.json(analise);
    } catch (error) {
      console.error("Error creating pareto analysis:", error);
      res.status(500).json({ error: "Erro ao criar análise Pareto" });
    }
  });

  app.get("/api/analises-pareto/:id/itens", async (req, res) => {
    try {
      const { id } = req.params;
      const itens = await storage.getItensPareto(parseInt(id));
      res.json(itens);
    } catch (error) {
      console.error("Error fetching pareto items:", error);
      res.status(500).json({ error: "Erro ao buscar itens Pareto" });
    }
  });

  app.post("/api/itens-pareto", async (req, res) => {
    try {
      const item = await storage.createItemPareto(req.body);
      res.json(item);
    } catch (error) {
      console.error("Error creating pareto item:", error);
      res.status(500).json({ error: "Erro ao criar item Pareto" });
    }
  });

  app.get("/api/filiais", async (req, res) => {
    try {
      const filiais = await storage.getFiliais();
      res.json(filiais);
    } catch (error) {
      console.error("Error fetching filiais:", error);
      res.status(500).json({ error: "Erro ao buscar filiais" });
    }
  });

  app.post("/api/filiais", async (req, res) => {
    try {
      const filial = await storage.createFilial(req.body);
      res.json(filial);
    } catch (error) {
      console.error("Error creating filial:", error);
      res.status(500).json({ error: "Erro ao criar filial" });
    }
  });

  app.get("/api/certificados", async (req, res) => {
    try {
      const certificados = await storage.getCertificados();
      res.json(certificados);
    } catch (error) {
      console.error("Error fetching certificados:", error);
      res.status(500).json({ error: "Erro ao buscar certificados" });
    }
  });

  app.post("/api/certificados", async (req, res) => {
    try {
      const certificado = await storage.createCertificado(req.body);
      res.json(certificado);
    } catch (error) {
      console.error("Error creating certificado:", error);
      res.status(500).json({ error: "Erro ao criar certificado" });
    }
  });

  app.get("/api/auditorias", async (req, res) => {
    try {
      const auditorias = await storage.getAuditorias();
      res.json(auditorias);
    } catch (error) {
      console.error("Error fetching auditorias:", error);
      res.status(500).json({ error: "Erro ao buscar auditorias" });
    }
  });

  app.post("/api/auditorias", async (req, res) => {
    try {
      const auditoria = await storage.createAuditoria(req.body);
      res.json(auditoria);
    } catch (error) {
      console.error("Error creating auditoria:", error);
      res.status(500).json({ error: "Erro ao criar auditoria" });
    }
  });

  app.get("/api/nao-conformidades", async (req, res) => {
    try {
      const naoConformidades = await storage.getNaoConformidades();
      res.json(naoConformidades);
    } catch (error) {
      console.error("Error fetching não conformidades:", error);
      res.status(500).json({ error: "Erro ao buscar não conformidades" });
    }
  });

  app.post("/api/nao-conformidades", async (req, res) => {
    try {
      const naoConformidade = await storage.createNaoConformidade(req.body);
      res.json(naoConformidade);
    } catch (error) {
      console.error("Error creating não conformidade:", error);
      res.status(500).json({ error: "Erro ao criar não conformidade" });
    }
  });

  app.get("/api/titulos-itpop", async (req, res) => {
    try {
      const titulos = await storage.getTitulosItPop();
      res.json(titulos);
    } catch (error) {
      console.error("Error fetching títulos IT/POP:", error);
      res.status(500).json({ error: "Erro ao buscar títulos IT/POP" });
    }
  });

  app.get("/api/registros-itpop", async (req, res) => {
    try {
      const registros = await storage.getRegistrosItPop();
      res.json(registros);
    } catch (error) {
      console.error("Error fetching registros IT/POP:", error);
      res.status(500).json({ error: "Erro ao buscar registros IT/POP" });
    }
  });

  app.get("/api/titulos-bpmn", async (req, res) => {
    try {
      const titulos = await storage.getTitulosBpmn();
      res.json(titulos);
    } catch (error) {
      console.error("Error fetching títulos BPMN:", error);
      res.status(500).json({ error: "Erro ao buscar títulos BPMN" });
    }
  });

  app.get("/api/registros-bpmn", async (req, res) => {
    try {
      const registros = await storage.getRegistrosBpmn();
      res.json(registros);
    } catch (error) {
      console.error("Error fetching registros BPMN:", error);
      res.status(500).json({ error: "Erro ao buscar registros BPMN" });
    }
  });

  // Retornados API for Power BI (migrated from Supabase Edge Function)
  app.get("/api/retornados-powerbi", async (req, res) => {
    try {
      const apiKey = req.headers['x-api-key'];
      if (apiKey && apiKey !== 'powerbi-access-2024') {
        return res.status(401).json({
          success: false,
          error: 'API Key inválida',
          total_registros: 0,
          dados: []
        });
      }

      const retornados = await storage.getRetornados();

      // Transform data like the original Supabase function
      const transformedData = retornados.map(item => {
        let valorRecuperadoCalculado = item.valor_recuperado;

        if ((item.destino_final === 'Estoque' || item.destino_final === 'Estoque Semi Novo') && !item.valor_recuperado) {
          const gramaturaRestante = parseFloat(item.peso) - parseFloat(item.toner.peso_vazio);
          const percentualGramatura = (gramaturaRestante / parseFloat(item.toner.gramatura)) * 100;
          const folhasRestantes = (percentualGramatura / 100) * item.toner.capacidade_folhas;
          valorRecuperadoCalculado = folhasRestantes * parseFloat(item.toner.valor_por_folha);
        }

        const dataRegistro = new Date(item.data_registro);
        const ano = dataRegistro.getFullYear();
        const mes = dataRegistro.getMonth() + 1;
        const trimestre = Math.ceil(mes / 3);
        
        const mesesNomes = [
          'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
          'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
        ];

        return {
          id: item.id,
          id_cliente: item.id_cliente,
          modelo_toner: item.toner.modelo,
          cor_toner: item.toner.cor || 'N/A',
          filial: item.filial,
          destino_final: item.destino_final,
          valor_recuperado: valorRecuperadoCalculado,
          data_registro: item.data_registro.toISOString().split('T')[0],
          ano: ano,
          mes: mes,
          mes_nome: mesesNomes[mes - 1],
          trimestre: trimestre,
          peso: item.peso,
          peso_vazio: item.toner.peso_vazio,
          gramatura: item.toner.gramatura,
          capacidade_folhas: item.toner.capacidade_folhas,
          valor_por_folha: item.toner.valor_por_folha,
        };
      });

      const response = {
        success: true,
        total_registros: transformedData.length,
        data_atualizacao: new Date().toISOString(),
        dados: transformedData
      };

      res.json(response);
    } catch (error) {
      console.error("Error in retornados PowerBI API:", error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: error.message,
        total_registros: 0,
        dados: []
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
