import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const playlist = db.prepare('SELECT * FROM playlists WHERE id = ?').get(id);

    if (!playlist) {
      return NextResponse.json({ error: 'Playlist não encontrada' }, { status: 404 });
    }

    const musicas = db.prepare(`
      SELECT m.*, pm.ordem
      FROM musicas m
      JOIN playlist_musicas pm ON m.id = pm.musica_id
      WHERE pm.playlist_id = ?
      ORDER BY pm.ordem ASC
    `).all(id);

    const chamadas = db.prepare(`
      SELECT c.*, pc.ordem
      FROM chamadas c
      JOIN playlist_chamadas pc ON c.id = pc.chamada_id
      WHERE pc.playlist_id = ?
      ORDER BY pc.ordem ASC
    `).all(id);

    return NextResponse.json({ ...playlist, musicas, chamadas });
  } catch (error) {
    console.error('Erro ao buscar playlist:', error);
    return NextResponse.json({ error: 'Erro ao buscar playlist' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nome, descricao, intervaloChamadas, musicas, chamadas } = body;

    db.transaction(() => {
      // Atualizar playlist
      db.prepare(`
        UPDATE playlists
        SET nome = ?, descricao = ?, intervalo_chamadas = ?
        WHERE id = ?
      `).run(nome, descricao, intervaloChamadas || 15, id);

      // Limpar associações antigas
      db.prepare('DELETE FROM playlist_musicas WHERE playlist_id = ?').run(id);
      db.prepare('DELETE FROM playlist_chamadas WHERE playlist_id = ?').run(id);

      // Re-inserir músicas
      if (musicas && musicas.length > 0) {
        const stmt = db.prepare(`
          INSERT INTO playlist_musicas (playlist_id, musica_id, ordem)
          VALUES (?, ?, ?)
        `);
        musicas.forEach((m: { id: string }, index: number) => {
          stmt.run(id, m.id, index);
        });
      }

      // Re-inserir chamadas
      if (chamadas && chamadas.length > 0) {
        const stmt = db.prepare(`
          INSERT INTO playlist_chamadas (playlist_id, chamada_id, ordem)
          VALUES (?, ?, ?)
        `);
        chamadas.forEach((c: { id: string }, index: number) => {
          stmt.run(id, c.id, index);
        });
      }
    })();

    return NextResponse.json({ message: 'Playlist atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar playlist:', error);
    return NextResponse.json({ error: 'Erro ao atualizar playlist' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = db.prepare('DELETE FROM playlists WHERE id = ?').run(id);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Playlist não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Playlist excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir playlist:', error);
    return NextResponse.json({ error: 'Erro ao excluir playlist' }, { status: 500 });
  }
}
