import { db } from './db-filial';
import { getDbPath } from './db-selector';
import Database from 'better-sqlite3';

// Função auxiliar para executar múltiplos inserts em uma transação
function bulkInsert(db: Database, table: string, records: any[], columns: string[]) {
  if (records.length === 0) return;

  const placeholders = columns.map(() => '?').join(', ');
  const insertStmt = db.prepare(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`);

  const transaction = db.transaction((records: any[]) => {
    for (const record of records) {
      const values = columns.map(col => record[col]);
      insertStmt.run(...values);
    }
  });

  transaction(records);
}

// Função para limpar tabelas antes de inserir novos dados (sincronização completa)
function clearTables(db: Database) {
  db.exec(`
    DELETE FROM playlist_musicas;
    DELETE FROM playlists;
    DELETE FROM musicas;
    -- Não limpamos o status_player aqui, pois pode ter configs locais
  `);
}

export async function syncFromMatriz() {
  try {
    // 1. Buscar dados da matriz
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/sync`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Falha ao sincronizar com a matriz: ${res.status}`);
    }

    const data = await res.json();

    // 2. Abrir conexão com o banco local da filial
    const localDb = getDbPath(true);
    const filialDb = new Database(localDb);

    try {
      // 3. Iniciar transação para garantir consistência
      filialDb.exec('BEGIN TRANSACTION');

      // 4. Limpar tabelas relevantes para sincronização limpa
      clearTables(filialDb);

      // 5. Inserir músicas
      if (data.musicas && Array.isArray(data.musicas)) {
        bulkInsert(filialDb, 'musicas', data.musicas, [
          'id', 'titulo', 'artista', 'album', 'duracao', 'arquivo_url', 'genero', 'favorita'
        ]);
      }

      // 6. Inserir playlists
      if (data.playlists && Array.isArray(data.playlists)) {
        bulkInsert(filialDb, 'playlists', data.playlists, [
          'id', 'nome', 'descricao', 'intervalo_chamadas', 'ativa'
        ]);
      }

      // 7. Inserir relação playlist_musicas
      if (data.playlist_musicas && Array.isArray(data.playlist_musicas)) {
        bulkInsert(filialDb, 'playlist_musicas', data.playlist_musicas, [
          'playlist_id', 'musica_id', 'ordem'
        ]);
      }

      // 8. Opcional: inserir chamadas se o player da filial for suportá-las
      // Por enquanto, vamos focar apenas em músicas e playlists para o player básico.

      // 9. Commit da transação
      filialDb.exec('COMMIT');

      console.info('[SyncWorker] Sincronização com a matriz concluída com sucesso.');
      return { success: true, timestamp: new Date().toISOString() };
    } catch (error) {
      // Em caso de erro, fazer rollback
      filialDb.exec('ROLLBACK');
      console.error('[SyncWorker] Erro durante a sincronização, rollback executado:', error);
      throw error;
    } finally {
      filialDb.close();
    }
  } catch (error) {
    console.error('[SyncWorker] Falha na sincronização com a matriz:', error);
    return { success: false, error: error.message };
  }
}

// Função para agendar a sincronização periódica (ex: a cada 6 horas)
// Esta função seria chamada pelo service worker ou por um useEffect no layout da filial
export function startPeriodicSync(intervalMs = 6 * 60 * 60 * 1000) { // 6 horas padrão
  console.info(`[SyncWorker] Iniciando sincronização periódica a cada ${intervalMs / 1000 / 60} minutos`);

  // Executar imediatamente na primeira chamada
  syncFromMatriz().then(() => {
    // Agendar próximas execuções
    setInterval(() => {
      syncFromMatriz().catch(console.error);
    }, intervalMs);
  }).catch(console.error);
}

export default { syncFromMatriz, startPeriodicSync };
