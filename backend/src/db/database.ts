import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

export async function openDb(): Promise<Database> {
  return open({
    filename: "src/db/database.db",
    driver: sqlite3.Database,
  });
}

export async function createTables() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS pessoas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      telefone TEXT
    );
  `);

  await db.exec(`
  CREATE TABLE IF NOT EXISTS carros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    marca TEXT NOT NULL,
    modelo TEXT NOT NULL,
    ano INTEGER NOT NULL,
    precoPorDia REAL NOT NULL,
    disponivel INTEGER NOT NULL DEFAULT 1,
    placa TEXT NOT NULL UNIQUE,
    kmRodado REAL NOT NULL
  );
`);

  await db.exec(`
  CREATE TABLE IF NOT EXISTS alugueis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    personId TEXT NOT NULL,
    carId TEXT NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    kmInicial REAL NOT NULL
  );
`);

  await db.exec(`
  CREATE TABLE IF NOT EXISTS pagamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aluguelId TEXT NOT NULL,
    valor REAL NOT NULL,
    status TEXT CHECK(status IN ('PAGO', 'PENDENTE')) NOT NULL
  );
`);

  await db.close();
}
