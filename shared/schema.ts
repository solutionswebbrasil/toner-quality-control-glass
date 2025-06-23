import { pgTable, text, serial, integer, boolean, timestamp, decimal, date, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (basic auth)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Profiles table (replacing auth.users from Supabase)
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome_completo: text("nome_completo").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("user"),
  created_at: timestamp("created_at").defaultNow(),
});

// Fornecedores table
export const fornecedores = pgTable("fornecedores", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  telefone: text("telefone").notNull(),
  link_rma: text("link_rma").notNull(),
  data_cadastro: timestamp("data_cadastro").defaultNow().notNull(),
  user_id: uuid("user_id").references(() => profiles.id),
});

// Toners table
export const toners = pgTable("toners", {
  id: serial("id").primaryKey(),
  modelo: text("modelo").notNull(),
  peso_cheio: decimal("peso_cheio", { precision: 10, scale: 2 }).notNull(),
  peso_vazio: decimal("peso_vazio", { precision: 10, scale: 2 }).notNull(),
  gramatura: decimal("gramatura", { precision: 10, scale: 2 }).notNull(),
  preco_produto: decimal("preco_produto", { precision: 10, scale: 2 }).notNull(),
  capacidade_folhas: integer("capacidade_folhas").notNull(),
  valor_por_folha: decimal("valor_por_folha", { precision: 10, scale: 4 }).notNull(),
  impressoras_compat: text("impressoras_compat").notNull(),
  cor: text("cor").notNull(),
  registrado_por: integer("registrado_por").notNull(),
  data_registro: timestamp("data_registro").defaultNow().notNull(),
  user_id: uuid("user_id").references(() => profiles.id),
});

// Retornados table
export const retornados = pgTable("retornados", {
  id: serial("id").primaryKey(),
  id_modelo: integer("id_modelo").notNull().references(() => toners.id),
  id_cliente: integer("id_cliente").notNull(),
  peso: decimal("peso", { precision: 10, scale: 2 }).notNull(),
  destino_final: text("destino_final").notNull(),
  filial: text("filial").notNull(),
  data_registro: timestamp("data_registro").defaultNow().notNull(),
  valor_recuperado: decimal("valor_recuperado", { precision: 10, scale: 2 }),
  user_id: uuid("user_id").references(() => profiles.id),
});

// Garantias table
export const garantias = pgTable("garantias", {
  id: serial("id").primaryKey(),
  item: text("item").notNull(),
  quantidade: integer("quantidade").notNull(),
  defeito: text("defeito").notNull(),
  fornecedor_id: integer("fornecedor_id").notNull().references(() => fornecedores.id),
  nf_compra_pdf: text("nf_compra_pdf"),
  nf_remessa_pdf: text("nf_remessa_pdf"),
  nf_devolucao_pdf: text("nf_devolucao_pdf"),
  status: text("status").notNull().default("aberta"),
  resultado: text("resultado"),
  valor_unitario: decimal("valor_unitario", { precision: 10, scale: 2 }).notNull(),
  valor_total: decimal("valor_total", { precision: 10, scale: 2 }).notNull(),
  data_registro: timestamp("data_registro").defaultNow().notNull(),
  ns: text("ns"),
  user_id: uuid("user_id").references(() => profiles.id),
});

// Garantias Toners table
export const garantias_toners = pgTable("garantias_toners", {
  id: serial("id").primaryKey(),
  ticket_numero: text("ticket_numero").notNull().unique(),
  modelo_toner: text("modelo_toner").notNull(),
  filial_origem: text("filial_origem").notNull(),
  fornecedor: text("fornecedor").notNull(),
  defeito: text("defeito").notNull(),
  responsavel_envio: text("responsavel_envio").notNull(),
  status: text("status").notNull().default("Pendente"),
  data_envio: timestamp("data_envio").notNull(),
  data_registro: timestamp("data_registro").defaultNow().notNull(),
  observacoes: text("observacoes"),
  ns: text("ns"),
  lote: text("lote"),
  user_id: uuid("user_id").references(() => profiles.id),
});

// Auditorias table
export const auditorias = pgTable("auditorias", {
  id: serial("id").primaryKey(),
  data_inicio: date("data_inicio").notNull(),
  data_fim: date("data_fim").notNull(),
  unidade_auditada: text("unidade_auditada").notNull(),
  formulario_pdf: text("formulario_pdf"),
  data_registro: timestamp("data_registro").defaultNow().notNull(),
  user_id: uuid("user_id").references(() => profiles.id),
});

// Não Conformidades table
export const nao_conformidades = pgTable("nao_conformidades", {
  id: serial("id").primaryKey(),
  data_ocorrencia: date("data_ocorrencia").notNull(),
  unidade_filial: text("unidade_filial").notNull(),
  setor_responsavel: text("setor_responsavel").notNull(),
  tipo_nc: text("tipo_nc").notNull(),
  descricao: text("descricao").notNull(),
  evidencias: jsonb("evidencias").default('[]'),
  classificacao: text("classificacao").notNull(),
  identificado_por: text("identificado_por").notNull(),
  responsavel_tratamento: text("responsavel_tratamento").notNull(),
  data_limite_correcao: date("data_limite_correcao").notNull(),
  acao_imediata: text("acao_imediata"),
  necessita_acao_corretiva: boolean("necessita_acao_corretiva").default(false),
  acao_corretiva_proposta: text("acao_corretiva_proposta"),
  observacoes: text("observacoes"),
  status: text("status").notNull().default("Aberta"),
  data_registro: timestamp("data_registro").defaultNow().notNull(),
  data_atualizacao: timestamp("data_atualizacao").defaultNow(),
  user_id: uuid("user_id").references(() => profiles.id),
});

// IT/POP tables
export const titulos_itpop = pgTable("titulos_itpop", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  data_cadastro: timestamp("data_cadastro").defaultNow().notNull(),
});

export const registros_itpop = pgTable("registros_itpop", {
  id: serial("id").primaryKey(),
  titulo_id: integer("titulo_id").notNull().references(() => titulos_itpop.id),
  versao: integer("versao").notNull(),
  arquivo_pdf: text("arquivo_pdf"),
  arquivo_ppt: text("arquivo_ppt"),
  data_registro: timestamp("data_registro").defaultNow().notNull(),
  registrado_por: text("registrado_por"),
});

// BPMN tables
export const titulos_bpmn = pgTable("titulos_bpmn", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  data_cadastro: timestamp("data_cadastro").defaultNow().notNull(),
});

export const registros_bpmn = pgTable("registros_bpmn", {
  id: serial("id").primaryKey(),
  titulo_id: integer("titulo_id").notNull().references(() => titulos_bpmn.id),
  versao: integer("versao").default(1),
  arquivo_png: text("arquivo_png"),
  data_registro: timestamp("data_registro").defaultNow().notNull(),
  registrado_por: text("registrado_por"),
});

// Certificados table
export const certificados = pgTable("certificados", {
  id: serial("id").primaryKey(),
  nome_certificado: text("nome_certificado").notNull(),
  arquivo_pdf: text("arquivo_pdf"),
  data_emissao: date("data_emissao").notNull(),
  data_registro: timestamp("data_registro").defaultNow().notNull(),
  user_id: uuid("user_id").references(() => profiles.id),
});

// Filiais table
export const filiais = pgTable("filiais", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull().unique(),
  codigo: text("codigo"),
  endereco: text("endereco"),
  telefone: text("telefone"),
  email: text("email"),
  data_cadastro: timestamp("data_cadastro").defaultNow().notNull(),
  ativo: boolean("ativo").notNull().default(true),
  user_id: uuid("user_id").references(() => profiles.id),
});

// Usuarios table (custom auth system)
export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome_completo: text("nome_completo").notNull(),
  usuario: text("usuario").notNull().unique(),
  senha: text("senha").notNull(),
  criado_em: timestamp("criado_em").defaultNow().notNull(),
});

// Permissoes table
export const permissoes = pgTable("permissoes", {
  id: uuid("id").primaryKey().defaultRandom(),
  usuario_id: uuid("usuario_id").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  modulo: text("modulo").notNull(),
  submenu: text("submenu").notNull(),
  pode_visualizar: boolean("pode_visualizar").notNull().default(false),
  pode_editar: boolean("pode_editar").notNull().default(false),
  pode_excluir: boolean("pode_excluir").notNull().default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
