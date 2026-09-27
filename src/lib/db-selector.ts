import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Função para obter o caminho baseado no modo da instância
export function getDbPath(isFilial: boolean) {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  return isFilial 
    ? path.join(dataDir, 'filial-local.db') 
    : path.join(dataDir, 'radio-gmais.db');
}

export function initDb(isFilial: boolean) {
  const dbPath = getDbPath(isFilial);
  const db = new Database(dbPath);
  
  // Habilitar WAL mode
  db.pragma('journal_mode = WAL');
  
  return db;
}
