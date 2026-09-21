import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'radio-gmais.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  -- Tabela de usuários
  CREATE TABLE IF NOT EXISTS usuarios (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    nome TEXT NOT NULL,
    perfil TEXT DEFAULT 'operador', -- admin, operador, locutor
    loja_id TEXT,
    ativo INTEGER DEFAULT 1,
    ultimo_login TEXT,
    criado_em TEXT DEFAULT (datetime('now')),
    atualizado_em TEXT DEFAULT (datetime('now'))
  );

  -- Tabela de chamadas
  CREATE TABLE IF NOT EXISTS chamadas (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    texto TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'locutor-virtual',
    voz_id TEXT,
    audio_url TEXT,
    duracao REAL,
    ativa INTEGER DEFAULT 1,
    criado_em TEXT DEFAULT (datetime('now')),
    atualizado_em TEXT DEFAULT (datetime('now'))
  );

  -- Tabela de músicas
  CREATE TABLE IF NOT EXISTS musicas (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    artista TEXT NOT NULL,
    album TEXT,
    duracao REAL NOT NULL,
    arquivo_url TEXT NOT NULL,
    genero TEXT,
    favorita INTEGER DEFAULT 0,
    criado_em TEXT DEFAULT (datetime('now'))
  );

  -- Tabela de playlists
  CREATE TABLE IF NOT EXISTS playlists (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT,
    intervalo_chamadas INTEGER DEFAULT 15, -- minutos entre chamadas
    ativa INTEGER DEFAULT 1,
    criado_em TEXT DEFAULT (datetime('now'))
  );

  -- Relação playlist <-> músicas
  CREATE TABLE IF NOT EXISTS playlist_musicas (
    playlist_id TEXT,
    musica_id TEXT,
    ordem INTEGER,
    PRIMARY KEY (playlist_id, musica_id),
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
    FOREIGN KEY (musica_id) REFERENCES musicas(id) ON DELETE CASCADE
  );

  -- Relação playlist <-> chamadas
  CREATE TABLE IF NOT EXISTS playlist_chamadas (
    playlist_id TEXT,
    chamada_id TEXT,
    ordem INTEGER,
    PRIMARY KEY (playlist_id, chamada_id),
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
    FOREIGN KEY (chamada_id) REFERENCES chamadas(id) ON DELETE CASCADE
  );

  -- Tabela de locutores (vozes)
  CREATE TABLE IF NOT EXISTS locutores (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    voz_id TEXT NOT NULL,
    idioma TEXT DEFAULT 'pt-BR',
    genero TEXT DEFAULT 'masculino',
    provedor TEXT DEFAULT 'elevenlabs',
    configuracoes TEXT DEFAULT '{}',
    criado_em TEXT DEFAULT (datetime('now'))
  );

  -- Tabela de histórico de reprodução
  CREATE TABLE IF NOT EXISTS historico (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL, -- musica, chamada
    referencia_id TEXT,
    titulo TEXT,
    duracao REAL,
    tocado_em TEXT DEFAULT (datetime('now'))
  );

  -- Tabela de lojas
  CREATE TABLE IF NOT EXISTS lojas (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    endereco TEXT,
    telefone TEXT,
    email TEXT,
    configuracoes TEXT DEFAULT '{}',
    criado_em TEXT DEFAULT (datetime('now'))
  );
`);

// Create default admin user if not exists
try {
  const adminExists = db.prepare('SELECT id FROM usuarios WHERE email = ?').get('admin@radiogmais.com.br');

  if (!adminExists) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    
    db.prepare(
      'INSERT INTO usuarios (id, email, senha, nome, perfil) VALUES (?, ?, ?, ?, ?)'
    ).run(
      crypto.randomUUID(),
      'admin@radiogmais.com.br',
      hashedPassword,
      'Administrador',
      'admin'
    );
    
    console.log('✅ Usuário admin criado: admin@radiogmais.com.br / admin123');
  }
} catch (error) {
  // Ignore unique constraint errors during concurrent module loading
  if (!(error instanceof Error && error.message.includes('UNIQUE constraint'))) {
    console.error('Erro ao criar usuário admin:', error);
  }
}

export default db;

// Helper functions
export function getAll(table: string) {
  return db.prepare(`SELECT * FROM ${table}`).all();
}

export function getById(table: string, id: string) {
  return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
}

export function insert(table: string, data: Record<string, any>) {
  const id = crypto.randomUUID();
  const fields = ['id', ...Object.keys(data)];
  const values = [id, ...Object.values(data)];
  const placeholders = fields.map(() => '?').join(', ');

  db.prepare(
    `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders})`
  ).run(...values);

  return getById(table, id);
}

export function update(table: string, id: string, data: Record<string, any>) {
  const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const values = Object.values(data);

  db.prepare(
    `UPDATE ${table} SET ${fields}, atualizado_em = datetime('now') WHERE id = ?`
  ).run(...values, id);

  return getById(table, id);
}

export function remove(table: string, id: string) {
  const result = db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
  return result.changes > 0;
}
