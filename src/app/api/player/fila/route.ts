import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // 1. Identificar a programação ativa
    const gradeAtiva = db.prepare('SELECT * FROM programacao WHERE ativa = 1 LIMIT 1').get();

    // Se não há grade, retornamos um indicador específico
    if (!gradeAtiva) {
      return NextResponse.json({
        noProgram: true,
        message: 'Nenhuma grade de programação ativa encontrada.'
      }, { status: 200 });
    }

    let proximaMusicaList: any[] = [];
    const limit = 5;

    // 2. Busca todos os slots da grade
    const slots = db.prepare('SELECT * FROM programacao_slots WHERE programacao_id = ? ORDER BY ordem ASC').all(gradeAtiva.id);

    // 3. Tenta encontrar músicas a partir do primeiro slot disponível que contenha músicas
    for (const slot of slots) {
      if (slot.type === 'musicas') {
        proximaMusicaList = db.prepare('SELECT id, titulo, artista, arquivo_url, duracao FROM musicas WHERE genero = ? ORDER BY RANDOM() LIMIT ?').all(slot.category, limit);
        if (proximaMusicaList.length > 0) break;
      } else if (slot.type === 'playlist') {
        proximaMusicaList = db.prepare(`
            SELECT m.id, m.titulo, m.artista, m.arquivo_url, m.duracao
            FROM musicas m
            JOIN playlist_musicas pm ON m.id = pm.musica_id
            WHERE pm.playlist_id = ?
            ORDER BY RANDOM() LIMIT ?
        `).all(slot.category, limit);
        if (proximaMusicaList.length > 0) break;
      }
    }

    return NextResponse.json(proximaMusicaList);
  } catch (error) {
    console.error('Erro ao buscar fila de músicas:', error);
    return NextResponse.json({ error: 'Erro ao buscar fila de músicas' }, { status: 500 });
  }
}
