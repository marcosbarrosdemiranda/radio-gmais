import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';

export async function GET() {
  try {
    const playlists = db.prepare('SELECT * FROM playlists ORDER BY criado_em DESC').all();

    // Add songs/chamadas to each playlist
    const playlistsComItens = playlists.map(playlist => {
      const musicas = db.prepare(`
        SELECT m.*, pm.ordem
        FROM musicas m
        JOIN playlist_musicas pm ON m.id = pm.musica_id
        WHERE pm.playlist_id = ?
        ORDER BY pm.ordem ASC
      `).all(playlist.id);

      const chamadas = db.prepare(`
        SELECT c.*, pc.ordem
        FROM chamadas c
        JOIN playlist_chamadas pc ON c.id = pc.chamada_id
        WHERE pc.playlist_id = ?
        ORDER BY pc.ordem ASC
      `).all(playlist.id);

      return { ...playlist, musicas, chamadas };
    });

    return NextResponse.json(playlistsComItens);
  } catch (error) {
    console.error('Erro ao buscar playlists:', error);
    return NextResponse.json({ error: 'Erro ao buscar playlists' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, descricao, intervaloChamadas, musicas, chamadas } = body;

    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }

    const playlistId = crypto.randomUUID();

    // Iniciar transação
    db.transaction(() => {
      // Inserir playlist
      db.prepare(`
        INSERT INTO playlists (id, nome, descricao, intervalo_chamadas)
        VALUES (?, ?, ?, ?)
      `).run(playlistId, nome, descricao, intervaloChamadas || 15);

      // Inserir músicas
      if (musicas && musicas.length > 0) {
        const stmt = db.prepare(`
          INSERT INTO playlist_musicas (playlist_id, musica_id, ordem)
          VALUES (?, ?, ?)
        `);
        musicas.forEach((m: { id: string }, index: number) => {
          stmt.run(playlistId, m.id, index);
        });
      }

      // Inserir chamadas
      if (chamadas && chamadas.length > 0) {
        const stmt = db.prepare(`
          INSERT INTO playlist_chamadas (playlist_id, chamada_id, ordem)
          VALUES (?, ?, ?)
        `);
        chamadas.forEach((c: { id: string }, index: number) => {
          stmt.run(playlistId, c.id, index);
        });
      }
    })();

    const novaPlaylist = db.prepare('SELECT * FROM playlists WHERE id = ?').get(playlistId);
    return NextResponse.json(novaPlaylist, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar playlist:', error);
    return NextResponse.json({ error: 'Erro ao criar playlist' }, { status: 500 });
  }
}
