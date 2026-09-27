import { NextResponse } from 'next/server';
import db from '@/lib/db';
import * as googleTTS from 'google-tts-api';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { titulo, texto, idioma = 'pt-BR' } = await req.json();

    if (!titulo || !texto) {
      return NextResponse.json(
        { error: 'Título e texto são obrigatórios.' },
        { status: 400 }
      );
    }

    // 1. Gera url em base64 do Google TTS
    const audioUrl = googleTTS.getAudioUrl(texto, {
      lang: idioma,
      slow: false,
      host: 'https://translate.google.com',
    });

    // 2. Faz o fetch do Google e converte para Buffer de MP3
    const response = await fetch(audioUrl);

    if (!response.ok) {
        throw new Error('Falha ao acionar TTS do Google.')
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Salva no Disco (diretório uploads)
    const arquivoNome = `${Date.now()}-locutor.mp3`;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, arquivoNome);
    fs.writeFileSync(filePath, buffer);

    const arquivo_url = `/uploads/${arquivoNome}`;

    // 4. Salva no Banco de Dados
    // Usando 1 para a duração provisória caso seja difícil calcular
    const info = db.prepare(`
      INSERT INTO musicas (titulo, artista, genero, duracao, arquivo_url)
      VALUES (?, 'Locutor Virtual', 'chamadas', 1, ?)
    `).run(titulo, arquivo_url);

    return NextResponse.json({
      id: info.lastInsertRowid,
      titulo,
      arquivo: arquivo_url,
      message: 'Spot gerado com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao gerar TTS:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar o áudio' },
      { status: 500 }
    );
  }
}
