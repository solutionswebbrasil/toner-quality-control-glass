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
  updateFornecedor(id: number, data: Partial<typeof schema.fornecedores.$inferInsert>): Promise<void>;
  deleteFornecedor(id: number): Promise<void>;
  
  // Toners
  getToners(): Promise<typeof schema.toners.$inferSelect[]>;
  createToner(data: typeof schema.toners.$inferInsert): Promise<typeof schema.toners.$inferSelect>;
  updateToner(id: number, data: Partial<typeof schema.toners.$inferInsert>): Promise<void>;
  deleteToner(id: number): Promise<void>;
  
  // Retornados
  getRetornados(): Promise<any[]>;
  createRetornado(data: typeof schema.retornados.$inferInsert): Promise<typeof schema.retornados.$inferSelect>;
  updateRetornado(id: number, data: Partial<typeof schema.retornados.$inferInsert>): Promise<void>;
  deleteRetornado(id: number): Promise<void>;
  
  // Garantias
  getGarantias(): Promise<any[]>;
  createGarantia(data: typeof schema.garantias.$inferInsert): Promise<typeof schema.garantias.$inferSelect>;
  updateGarantia(id: number, data: Partial<typeof schema.garantias.$inferInsert>): Promise<void>;
  deleteGarantia(id: number): Promise<void>;
  
  // Filiais
  getFiliais(): Promise<typeof schema.filiais.$inferSelect[]>;
  createFilial(data: typeof schema.filiais.$inferInsert): Promise<typeof schema.filiais.$inferSelect>;
  updateFilial(id: number, data: Partial<typeof schema.filiais.$inferInsert>): Promise<void>;
  deleteFilial(id: number): Promise<void>;
  
  // Certificados
  getCertificados(): Promise<typeof schema.certificados.$inferSelect[]>;
  createCertificado(data: typeof schema.certificados.$inferInsert): Promise<typeof schema.certificados.$inferSelect>;
  updateCertificado(id: number, data: Partial<typeof schema.certificados.$inferInsert>): Promise<void>;
  deleteCertificado(id: number): Promise<void>;
  
  // Auditorias
  getAuditorias(): Promise<typeof schema.auditorias.$inferSelect[]>;
  createAuditoria(data: typeof schema.auditorias.$inferInsert): Promise<typeof schema.auditorias.$inferSelect>;
  updateAuditoria(id: number, data: Partial<typeof schema.auditorias.$inferInsert>): Promise<void>;
  deleteAuditoria(id: number): Promise<void>;
  
  // Não Conformidades
  getNaoConformidades(): Promise<typeof schema.nao_conformidades.$inferSelect[]>;
  createNaoConformidade(data: typeof schema.nao_conformidades.$inferInsert): Promise<typeof schema.nao_conformidades.$inferSelect>;
  updateNaoConformidade(id: number, data: Partial<typeof schema.nao_conformidades.$inferInsert>): Promise<void>;
  deleteNaoConformidade(id: number): Promise<void>;
  
  // IT/POP
  getTitulosItPop(): Promise<typeof schema.titulos_itpop.$inferSelect[]>;
  createTituloItPop(data: typeof schema.titulos_itpop.$inferInsert): Promise<typeof schema.titulos_itpop.$inferSelect>;
  updateTituloItPop(id: number, data: Partial<typeof schema.titulos_itpop.$inferInsert>): Promise<void>;
  deleteTituloItPop(id: number): Promise<void>;
  getRegistrosItPop(): Promise<any[]>;
  createRegistroItPop(data: typeof schema.registros_itpop.$inferInsert): Promise<typeof schema.registros_itpop.$inferSelect>;
  updateRegistroItPop(id: number, data: Partial<typeof schema.registros_itpop.$inferInsert>): Promise<void>;
  deleteRegistroItPop(id: number): Promise<void>;
  
  // BPMN
  getTitulosBpmn(): Promise<typeof schema.titulos_bpmn.$inferSelect[]>;
  createTituloBpmn(data: typeof schema.titulos_bpmn.$inferInsert): Promise<typeof schema.titulos_bpmn.$inferSelect>;
  updateTituloBpmn(id: number, data: Partial<typeof schema.titulos_bpmn.$inferInsert>): Promise<void>;
  deleteTituloBpmn(id: number): Promise<void>;
  getRegistrosBpmn(): Promise<any[]>;
  createRegistroBpmn(data: typeof schema.registros_bpmn.$inferInsert): Promise<typeof schema.registros_bpmn.$inferSelect>;
  updateRegistroBpmn(id: number, data: Partial<typeof schema.registros_bpmn.$inferInsert>): Promise<void>;
  deleteRegistroBpmn(id: number): Promise<void>;
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

  async updateFornecedor(id: number, data: Partial<typeof schema.fornecedores.$inferInsert>): Promise<void> {
    await db.update(schema.fornecedores).set(data).where(eq(schema.fornecedores.id, id));
  }

  async deleteFornecedor(id: number): Promise<void> {
    await db.delete(schema.fornecedores).where(eq(schema.fornecedores.id, id));
  }

  async getToners(): Promise<typeof schema.toners.$inferSelect[]> {
    return await db.select().from(schema.toners);
  }

  async createToner(data: typeof schema.toners.$inferInsert): Promise<typeof schema.toners.$inferSelect> {
    const result = await db.insert(schema.toners).values(data).returning();
    return result[0];
  }

  async updateToner(id: number, data: Partial<typeof schema.toners.$inferInsert>): Promise<void> {
    await db.update(schema.toners).set(data).where(eq(schema.toners.id, id));
  }

  async deleteToner(id: number): Promise<void> {
    await db.delete(schema.toners).where(eq(schema.toners.id, id));
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

  async updateRetornado(id: number, data: Partial<typeof schema.retornados.$inferInsert>): Promise<void> {
    await db.update(schema.retornados).set(data).where(eq(schema.retornados.id, id));
  }

  async deleteRetornado(id: number): Promise<void> {
    await db.delete(schema.retornados).where(eq(schema.retornados.id, id));
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

  async deleteGarantia(id: number): Promise<void> {
    await db.delete(schema.garantias).where(eq(schema.garantias.id, id));
  }

  async getFiliais(): Promise<typeof schema.filiais.$inferSelect[]> {
    return await db.select().from(schema.filiais);
  }

  async createFilial(data: typeof schema.filiais.$inferInsert): Promise<typeof schema.filiais.$inferSelect> {
    const result = await db.insert(schema.filiais).values(data).returning();
    return result[0];
  }

  async updateFilial(id: number, data: Partial<typeof schema.filiais.$inferInsert>): Promise<void> {
    await db.update(schema.filiais).set(data).where(eq(schema.filiais.id, id));
  }

  async deleteFilial(id: number): Promise<void> {
    await db.delete(schema.filiais).where(eq(schema.filiais.id, id));
  }

  async getCertificados(): Promise<typeof schema.certificados.$inferSelect[]> {
    return await db.select().from(schema.certificados);
  }

  async createCertificado(data: typeof schema.certificados.$inferInsert): Promise<typeof schema.certificados.$inferSelect> {
    const result = await db.insert(schema.certificados).values(data).returning();
    return result[0];
  }

  async updateCertificado(id: number, data: Partial<typeof schema.certificados.$inferInsert>): Promise<void> {
    await db.update(schema.certificados).set(data).where(eq(schema.certificados.id, id));
  }

  async deleteCertificado(id: number): Promise<void> {
    await db.delete(schema.certificados).where(eq(schema.certificados.id, id));
  }

  async getAuditorias(): Promise<typeof schema.auditorias.$inferSelect[]> {
    return await db.select().from(schema.auditorias);
  }

  async createAuditoria(data: typeof schema.auditorias.$inferInsert): Promise<typeof schema.auditorias.$inferSelect> {
    const result = await db.insert(schema.auditorias).values(data).returning();
    return result[0];
  }

  async updateAuditoria(id: number, data: Partial<typeof schema.auditorias.$inferInsert>): Promise<void> {
    await db.update(schema.auditorias).set(data).where(eq(schema.auditorias.id, id));
  }

  async deleteAuditoria(id: number): Promise<void> {
    await db.delete(schema.auditorias).where(eq(schema.auditorias.id, id));
  }

  async getNaoConformidades(): Promise<typeof schema.nao_conformidades.$inferSelect[]> {
    return await db.select().from(schema.nao_conformidades);
  }

  async createNaoConformidade(data: typeof schema.nao_conformidades.$inferInsert): Promise<typeof schema.nao_conformidades.$inferSelect> {
    const result = await db.insert(schema.nao_conformidades).values(data).returning();
    return result[0];
  }

  async updateNaoConformidade(id: number, data: Partial<typeof schema.nao_conformidades.$inferInsert>): Promise<void> {
    await db.update(schema.nao_conformidades).set(data).where(eq(schema.nao_conformidades.id, id));
  }

  async deleteNaoConformidade(id: number): Promise<void> {
    await db.delete(schema.nao_conformidades).where(eq(schema.nao_conformidades.id, id));
  }

  async getTitulosItPop(): Promise<typeof schema.titulos_itpop.$inferSelect[]> {
    return await db.select().from(schema.titulos_itpop);
  }

  async createTituloItPop(data: typeof schema.titulos_itpop.$inferInsert): Promise<typeof schema.titulos_itpop.$inferSelect> {
    const result = await db.insert(schema.titulos_itpop).values(data).returning();
    return result[0];
  }

  async updateTituloItPop(id: number, data: Partial<typeof schema.titulos_itpop.$inferInsert>): Promise<void> {
    await db.update(schema.titulos_itpop).set(data).where(eq(schema.titulos_itpop.id, id));
  }

  async deleteTituloItPop(id: number): Promise<void> {
    await db.delete(schema.titulos_itpop).where(eq(schema.titulos_itpop.id, id));
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

  async createRegistroItPop(data: typeof schema.registros_itpop.$inferInsert): Promise<typeof schema.registros_itpop.$inferSelect> {
    const result = await db.insert(schema.registros_itpop).values(data).returning();
    return result[0];
  }

  async updateRegistroItPop(id: number, data: Partial<typeof schema.registros_itpop.$inferInsert>): Promise<void> {
    await db.update(schema.registros_itpop).set(data).where(eq(schema.registros_itpop.id, id));
  }

  async deleteRegistroItPop(id: number): Promise<void> {
    await db.delete(schema.registros_itpop).where(eq(schema.registros_itpop.id, id));
  }

  async getTitulosBpmn(): Promise<typeof schema.titulos_bpmn.$inferSelect[]> {
    return await db.select().from(schema.titulos_bpmn);
  }

  async createTituloBpmn(data: typeof schema.titulos_bpmn.$inferInsert): Promise<typeof schema.titulos_bpmn.$inferSelect> {
    const result = await db.insert(schema.titulos_bpmn).values(data).returning();
    return result[0];
  }

  async updateTituloBpmn(id: number, data: Partial<typeof schema.titulos_bpmn.$inferInsert>): Promise<void> {
    await db.update(schema.titulos_bpmn).set(data).where(eq(schema.titulos_bpmn.id, id));
  }

  async deleteTituloBpmn(id: number): Promise<void> {
    await db.delete(schema.titulos_bpmn).where(eq(schema.titulos_bpmn.id, id));
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

  async createRegistroBpmn(data: typeof schema.registros_bpmn.$inferInsert): Promise<typeof schema.registros_bpmn.$inferSelect> {
    const result = await db.insert(schema.registros_bpmn).values(data).returning();
    return result[0];
  }

  async updateRegistroBpmn(id: number, data: Partial<typeof schema.registros_bpmn.$inferInsert>): Promise<void> {
    await db.update(schema.registros_bpmn).set(data).where(eq(schema.registros_bpmn.id, id));
  }

  async deleteRegistroBpmn(id: number): Promise<void> {
    await db.delete(schema.registros_bpmn).where(eq(schema.registros_bpmn.id, id));
  }
}

export const storage = new DatabaseStorage();