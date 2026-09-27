import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db-factory';

export async function GET() {
  try {
    // 1. Identificar a programação ativa
    const gradeAtiva = db.prepare('SELECT * FROM programacao WHERE ativa = 1 LIMIT 1').get();

    let proximaMusica;

    if (gradeAtiva) {
      // Por enquanto, pegamos o primeiro slot de músicas para testar
      const slot = db.prepare('SELECT * FROM programacao_slots WHERE programacao_id = ? AND type = ? LIMIT 1').get(gradeAtiva.id, 'musicas');

      if (slot) {
        if (slot.type === 'musicas') {
          proximaMusica = db.prepare('SELECT id, titulo, artista, arquivo_url, duracao FROM musicas WHERE genero = ? ORDER BY RANDOM() LIMIT 1').get(slot.category);
        } else if (slot.type === 'playlist') {
          proximaMusica = db.prepare(`
            SELECT m.id, m.titulo, m.artista, m.arquivo_url, m.duracao
            FROM musicas m
            JOIN playlist_musicas pm ON m.id = pm.musica_id
            WHERE pm.playlist_id = ?
            ORDER BY RANDOM() LIMIT 1
          `).get(slot.category);
        }
      }
    }

    // Fallback se não houver programação ou slot
    if (!proximaMusica) {
      proximaMusica = db.prepare('SELECT id, titulo, artista, arquivo_url, duracao FROM musicas ORDER BY RANDOM() LIMIT 1').get();
    }

    if (!proximaMusica) {
      return NextResponse.json({ error: 'Nenhuma música disponível' }, { status: 404 });
    }

    return NextResponse.json(proximaMusica);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar próxima música' }, { status: 500 });
  }
}
