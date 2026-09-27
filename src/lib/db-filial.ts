import { initDb } from './db-selector';

// Inicializa o banco da filial (isFilial = true)
export const db = initDb(true);

// Schema simplificado para Filiais (focado no player)
db.exec(`
  -- Tabela de músicas da filial
  CREATE TABLE IF NOT EXISTS musicas (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    artista TEXT NOT NULL,
    arquivo_local TEXT NOT NULL,
    duracao REAL NOT NULL
  );

  -- Tabela de playlists locais
  CREATE TABLE IF NOT EXISTS playlists (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL
  );

  -- Mapeamento local
  CREATE TABLE IF NOT EXISTS playlist_musicas (
    playlist_id TEXT,
    musica_id TEXT,
    PRIMARY KEY (playlist_id, musica_id)
  );

  -- Status de reprodução local
  CREATE TABLE IF NOT EXISTS status_player (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

export default db;
