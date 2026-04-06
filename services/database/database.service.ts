// Expo SQLite
import * as SQLite from "expo-sqlite";

/**
 * Nome do banco de dados
 */
const DATABASE_NAME = "plants.db" as const;

/**
 * Tabelas do banco de dados
 */
export const TABLES = {
  plants: "plants",
  care_schedule: "care_schedule",
  care_history: "care_history",
  notifications: "notifications",
} as const;

/**
 * Serviço responsável por gerenciar o banco de dados SQLite
 * - Criação de tabelas (plants, care_schedule, care_history, notifications)
 * - Execução de consultas SQL
 * - Abstração do acesso ao banco para os demais serviços
 */
export class DatabaseService {
  private db!: SQLite.SQLiteDatabase;

  /**
   * Inicializa o banco de dados e cria as tabelas necessárias
   */
  async init(): Promise<void> {
    this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await this.createTables();
  }

  /**
   * Obtém a instância do banco de dados
   * @returns Instância do banco de dados
   */
  private get database(): SQLite.SQLiteDatabase {
    if (!this.db) throw new Error("Instância do banco de dados não inicializada");
    return this.db;
  }

  /**
   * Cria as tabelas no banco de dados
   * Caso as tabelas já existam, elas não serão recriadas.
   */
  private async createTables() {
    await this.database.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS ${TABLES.plants} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        image TEXT,
        temperature_min TEXT,
        temperature_max TEXT,
        humidity TEXT,
        sunlight TEXT,
        location TEXT,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS ${TABLES.care_schedule} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plant_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        interval_days INTEGER NOT NULL,
        last_done TEXT,
        next_due TEXT NOT NULL,
        created_at TEXT NOT NULL,

        FOREIGN KEY (plant_id) REFERENCES ${TABLES.plants}(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS ${TABLES.care_history} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plant_id INTEGER NOT NULL,
        care_schedule_id INTEGER,
        type TEXT NOT NULL,
        interval_days INTEGER NOT NULL,
        done_at TEXT NOT NULL,

        FOREIGN KEY (plant_id) REFERENCES ${TABLES.plants}(id) ON DELETE CASCADE,
        FOREIGN KEY (care_schedule_id) REFERENCES ${TABLES.care_schedule}(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS ${TABLES.notifications} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plant_id INTEGER,
        care_schedule_id INTEGER,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        type TEXT NOT NULL,
        read INTEGER DEFAULT 0,
        scheduled_for TEXT,
        expo_notification_id TEXT,
        created_at TEXT NOT NULL,

        FOREIGN KEY (plant_id) REFERENCES ${TABLES.plants}(id) ON DELETE CASCADE,
        FOREIGN KEY (care_schedule_id) REFERENCES ${TABLES.care_schedule}(id) ON DELETE SET NULL
      );
    `);
  }

  /**
   * Executa uma instrução SQL no banco de dados
   * @param sql SQL a ser executado
   * @param params Parâmetros da consulta
   * @returns Resultado da execução
   */
  async run(sql: string, params: any[] = []) {
    return this.database.runAsync(sql, params);
  }

  /**
   * Executa uma consulta SQL que retorna múltiplos resultados
   * @param sql SQL a ser executado
   * @param params Parâmetros da consulta
   * @returns Resultados da consulta
   */
  async getAll<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    return this.database.getAllAsync<T>(sql, params);
  }

  /**
   * Executa uma consulta SQL que retorna um único resultado
   * @param sql SQL a ser executado
   * @param params Parâmetros da consulta
   * @returns Resultado da consulta
   */
  async getOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const result = await this.database.getFirstAsync<T>(sql, params);
    return result ?? null;
  }
}
