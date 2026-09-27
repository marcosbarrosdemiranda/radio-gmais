import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // Fetch musicas
    const musicas = db.prepare('SELECT id, titulo, artista, album, duracao, arquivo_url, genero, favorita FROM musicas WHERE ativa = 1').all();

    // Fetch playlists
    const playlists = db.prepare('SELECT id, nome, descricao, intervalo_chamadas, ativa FROM playlists WHERE ativa = 1').all();

    // Fetch playlist_musicas
    const playlistMusicas = db.prepare('SELECT playlist_id, musica_id, ordem FROM playlist_musicas').all();

    // Fetch chamadas? Maybe not needed for now, but let's include if we want to support locutor virtual offline
    const chamadas = db.prepare('SELECT id, titulo, texto, tipo, voz_id, audio_url, duracao, ativa FROM chamadas WHERE ativa = 1').all();

    // Fetch lojas? Maybe the filial needs to know its own loja_id? We can send the filial's loja_id via header or token, but for now, we can send all lojas? Or just the config.
    // Let's send a basic config object
    const configuracoes = {
      // We can get from the lojas table where id = ? but we don't know which loja is making the request.
      // For now, we'll send an empty object and the filial can use its own stored loja_id.
      // Alternatively, we can require the filial to send its loja_id in the request header.
      // We'll do that in a later step.
    };

    const payload = {
      configuracoes,
      musicas,
      playlists,
      playlist_musicas,
      chamadas,
      // Add a timestamp for versioning
      sync_timestamp: new Date().toISOString()
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error('[Sync] Erro ao gerar dados para sincronização:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
