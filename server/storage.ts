import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

// Initialize database connection
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

export interface IStorage {
  getUser(id: number): Promise<typeof schema.users.$inferSelect | undefined>;
  getUserByUsername(username: string): Promise<typeof schema.users.$inferSelect | undefined>;
  createUser(user: typeof schema.insertUserSchema._type): Promise<typeof schema.users.$inferSelect>;
  
  // Add methods for all tables
  getUsuarioByCredentials(usuario: string): Promise<typeof schema.usuarios.$inferSelect | undefined>;
  createUsuario(data: typeof schema.usuarios.$inferInsert): Promise<typeof schema.usuarios.$inferSelect>;
  getPermissoesByUserId(userId: string): Promise<typeof schema.permissoes.$inferSelect[]>;
  
  // Fornecedores
  getFornecedores(): Promise<typeof schema.fornecedores.$inferSelect[]>;
  createFornecedor(data: typeof schema.fornecedores.$inferInsert): Promise<typeof schema.fornecedores.$inferSelect>;
  
  // Toners
  getToners(): Promise<typeof schema.toners.$inferSelect[]>;
  createToner(data: typeof schema.toners.$inferInsert): Promise<typeof schema.toners.$inferSelect>;
  
  // Retornados
  getRetornados(): Promise<any[]>;
  createRetornado(data: typeof schema.retornados.$inferInsert): Promise<typeof schema.retornados.$inferSelect>;
  
  // Garantias
  getGarantias(): Promise<any[]>;
  createGarantia(data: typeof schema.garantias.$inferInsert): Promise<typeof schema.garantias.$inferSelect>;
  updateGarantia(id: number, data: Partial<typeof schema.garantias.$inferInsert>): Promise<void>;
  
  // Filiais
  getFiliais(): Promise<typeof schema.filiais.$inferSelect[]>;
  createFilial(data: typeof schema.filiais.$inferInsert): Promise<typeof schema.filiais.$inferSelect>;
  
  // Certificados
  getCertificados(): Promise<typeof schema.certificados.$inferSelect[]>;
  createCertificado(data: typeof schema.certificados.$inferInsert): Promise<typeof schema.certificados.$inferSelect>;
  
  // Auditorias
  getAuditorias(): Promise<typeof schema.auditorias.$inferSelect[]>;
  createAuditoria(data: typeof schema.auditorias.$inferInsert): Promise<typeof schema.auditorias.$inferSelect>;
  
  // Não Conformidades
  getNaoConformidades(): Promise<typeof schema.nao_conformidades.$inferSelect[]>;
  createNaoConformidade(data: typeof schema.nao_conformidades.$inferInsert): Promise<typeof schema.nao_conformidades.$inferSelect>;
  
  // IT/POP
  getTitulosItPop(): Promise<typeof schema.titulos_itpop.$inferSelect[]>;
  getRegistrosItPop(): Promise<any[]>;
  
  // BPMN
  getTitulosBpmn(): Promise<typeof schema.titulos_bpmn.$inferSelect[]>;
  getRegistrosBpmn(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<typeof schema.users.$inferSelect | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<typeof schema.users.$inferSelect | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return result[0];
  }

  async createUser(user: typeof schema.insertUserSchema._type): Promise<typeof schema.users.$inferSelect> {
    const result = await db.insert(schema.users).values(user).returning();
    return result[0];
  }

  async getUsuarioByCredentials(usuario: string): Promise<typeof schema.usuarios.$inferSelect | undefined> {
    const result = await db.select().from(schema.usuarios).where(eq(schema.usuarios.usuario, usuario));
    return result[0];
  }

  async createUsuario(data: typeof schema.usuarios.$inferInsert): Promise<typeof schema.usuarios.$inferSelect> {
    const result = await db.insert(schema.usuarios).values(data).returning();
    return result[0];
  }

  async getPermissoesByUserId(userId: string): Promise<typeof schema.permissoes.$inferSelect[]> {
    return await db.select().from(schema.permissoes).where(eq(schema.permissoes.usuario_id, userId));
  }

  async getFornecedores(): Promise<typeof schema.fornecedores.$inferSelect[]> {
    return await db.select().from(schema.fornecedores);
  }

  async createFornecedor(data: typeof schema.fornecedores.$inferInsert): Promise<typeof schema.fornecedores.$inferSelect> {
    const result = await db.insert(schema.fornecedores).values(data).returning();
    return result[0];
  }

  async getToners(): Promise<typeof schema.toners.$inferSelect[]> {
    return await db.select().from(schema.toners);
  }

  async createToner(data: typeof schema.toners.$inferInsert): Promise<typeof schema.toners.$inferSelect> {
    const result = await db.insert(schema.toners).values(data).returning();
    return result[0];
  }

  async getRetornados(): Promise<any[]> {
    return await db
      .select({
        id: schema.retornados.id,
        id_cliente: schema.retornados.id_cliente,
        peso: schema.retornados.peso,
        destino_final: schema.retornados.destino_final,
        filial: schema.retornados.filial,
        data_registro: schema.retornados.data_registro,
        valor_recuperado: schema.retornados.valor_recuperado,
        toner: {
          id: schema.toners.id,
          modelo: schema.toners.modelo,
          peso_vazio: schema.toners.peso_vazio,
          gramatura: schema.toners.gramatura,
          capacidade_folhas: schema.toners.capacidade_folhas,
          valor_por_folha: schema.toners.valor_por_folha,
          cor: schema.toners.cor,
        }
      })
      .from(schema.retornados)
      .leftJoin(schema.toners, eq(schema.retornados.id_modelo, schema.toners.id));
  }

  async createRetornado(data: typeof schema.retornados.$inferInsert): Promise<typeof schema.retornados.$inferSelect> {
    const result = await db.insert(schema.retornados).values(data).returning();
    return result[0];
  }

  async getGarantias(): Promise<any[]> {
    return await db
      .select({
        id: schema.garantias.id,
        item: schema.garantias.item,
        quantidade: schema.garantias.quantidade,
        defeito: schema.garantias.defeito,
        status: schema.garantias.status,
        resultado: schema.garantias.resultado,
        valor_unitario: schema.garantias.valor_unitario,
        valor_total: schema.garantias.valor_total,
        data_registro: schema.garantias.data_registro,
        ns: schema.garantias.ns,
        nf_compra_pdf: schema.garantias.nf_compra_pdf,
        nf_remessa_pdf: schema.garantias.nf_remessa_pdf,
        nf_devolucao_pdf: schema.garantias.nf_devolucao_pdf,
        fornecedor: {
          id: schema.fornecedores.id,
          nome: schema.fornecedores.nome,
          telefone: schema.fornecedores.telefone,
          link_rma: schema.fornecedores.link_rma,
        }
      })
      .from(schema.garantias)
      .leftJoin(schema.fornecedores, eq(schema.garantias.fornecedor_id, schema.fornecedores.id));
  }

  async createGarantia(data: typeof schema.garantias.$inferInsert): Promise<typeof schema.garantias.$inferSelect> {
    const result = await db.insert(schema.garantias).values(data).returning();
    return result[0];
  }

  async updateGarantia(id: number, data: Partial<typeof schema.garantias.$inferInsert>): Promise<void> {
    await db.update(schema.garantias).set(data).where(eq(schema.garantias.id, id));
  }

  async getFiliais(): Promise<typeof schema.filiais.$inferSelect[]> {
    return await db.select().from(schema.filiais);
  }

  async createFilial(data: typeof schema.filiais.$inferInsert): Promise<typeof schema.filiais.$inferSelect> {
    const result = await db.insert(schema.filiais).values(data).returning();
    return result[0];
  }

  async getCertificados(): Promise<typeof schema.certificados.$inferSelect[]> {
    return await db.select().from(schema.certificados);
  }

  async createCertificado(data: typeof schema.certificados.$inferInsert): Promise<typeof schema.certificados.$inferSelect> {
    const result = await db.insert(schema.certificados).values(data).returning();
    return result[0];
  }

  async getAuditorias(): Promise<typeof schema.auditorias.$inferSelect[]> {
    return await db.select().from(schema.auditorias);
  }

  async createAuditoria(data: typeof schema.auditorias.$inferInsert): Promise<typeof schema.auditorias.$inferSelect> {
    const result = await db.insert(schema.auditorias).values(data).returning();
    return result[0];
  }

  async getNaoConformidades(): Promise<typeof schema.nao_conformidades.$inferSelect[]> {
    return await db.select().from(schema.nao_conformidades);
  }

  async createNaoConformidade(data: typeof schema.nao_conformidades.$inferInsert): Promise<typeof schema.nao_conformidades.$inferSelect> {
    const result = await db.insert(schema.nao_conformidades).values(data).returning();
    return result[0];
  }

  async getTitulosItPop(): Promise<typeof schema.titulos_itpop.$inferSelect[]> {
    return await db.select().from(schema.titulos_itpop);
  }

  async getRegistrosItPop(): Promise<any[]> {
    return await db
      .select({
        id: schema.registros_itpop.id,
        titulo_id: schema.registros_itpop.titulo_id,
        versao: schema.registros_itpop.versao,
        arquivo_pdf: schema.registros_itpop.arquivo_pdf,
        arquivo_ppt: schema.registros_itpop.arquivo_ppt,
        data_registro: schema.registros_itpop.data_registro,
        registrado_por: schema.registros_itpop.registrado_por,
        titulo: {
          titulo: schema.titulos_itpop.titulo,
          descricao: schema.titulos_itpop.descricao,
        }
      })
      .from(schema.registros_itpop)
      .leftJoin(schema.titulos_itpop, eq(schema.registros_itpop.titulo_id, schema.titulos_itpop.id));
  }

  async getTitulosBpmn(): Promise<typeof schema.titulos_bpmn.$inferSelect[]> {
    return await db.select().from(schema.titulos_bpmn);
  }

  async getRegistrosBpmn(): Promise<any[]> {
    return await db
      .select({
        id: schema.registros_bpmn.id,
        titulo_id: schema.registros_bpmn.titulo_id,
        versao: schema.registros_bpmn.versao,
        arquivo_png: schema.registros_bpmn.arquivo_png,
        data_registro: schema.registros_bpmn.data_registro,
        registrado_por: schema.registros_bpmn.registrado_por,
        titulo: {
          titulo: schema.titulos_bpmn.titulo,
          descricao: schema.titulos_bpmn.descricao,
        }
      })
      .from(schema.registros_bpmn)
      .leftJoin(schema.titulos_bpmn, eq(schema.registros_bpmn.titulo_id, schema.titulos_bpmn.id));
  }
}

export const storage = new DatabaseStorage();
