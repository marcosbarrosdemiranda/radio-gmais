import { NextResponse } from 'next/server';
import db from '@/lib/db';
import * as googleTTS from 'google-tts-api';
// A lib msedge-tts vai ser instanciada dinamicamente para evitar crash caso não instalada
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { titulo, texto, idioma = 'pt-BR', motor = 'google', vozId } = await req.json();

    if (!titulo || !texto) {
      return NextResponse.json(
        { error: 'Título e texto são obrigatórios.' },
        { status: 400 }
      );
    }

    const arquivoNome = `${Date.now()}-locutor-${motor}.mp3`;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const filePath = path.join(uploadsDir, arquivoNome);
    let buffer: Buffer;

    // ==========================================
    // ROTEAMENTO DOS MOTORES DE IA
    // ==========================================

    if (motor === 'google') {
      // ----------------------------------------
      // MOTOR 0: GOOGLE TTS (FREE)
      // ----------------------------------------
      const audioUrl = googleTTS.getAudioUrl(texto, {
        lang: idioma,
        slow: false,
        host: 'https://translate.google.com',
      });
      const response = await fetch(audioUrl);
      if (!response.ok) throw new Error('Falha ao acionar TTS do Google.');
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);

    } else if (motor === 'microsoft') {
      // ----------------------------------------
      // MOTOR 1: MICROSOFT EDGE NEURAL (FREE)
      // ----------------------------------------
      try {
        const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
        const tts = new MsEdgeTTS();

        // Define voz padrão dependendo do idioma caso vozId não exista
        let selectedVoice = vozId;
        if (!selectedVoice) {
             if (idioma === 'pt-BR') selectedVoice = 'pt-BR-FranciscaNeural';
             else if (idioma === 'pt-PT') selectedVoice = 'pt-PT-RaquelNeural';
             else selectedVoice = 'en-US-AriaNeural';
        }

        await tts.setMetadata(selectedVoice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
        const audioStream = tts.toStream(texto);

        // Converter Stream para Buffer
        buffer = await new Promise((resolve, reject) => {
             const chunks: any[] = [];
             audioStream.on('data', (chunk: any) => chunks.push(chunk));
             audioStream.on('end', () => resolve(Buffer.concat(chunks)));
             audioStream.on('error', reject);
        });

      } catch (err: any) {
         if(err.code === 'MODULE_NOT_FOUND') {
             throw new Error("Biblioteca do Microsoft Edge não instalada. Execute 'npm install msedge-tts'.");
         }
         throw new Error("Erro na API da Microsoft: " + err.message);
      }

    } else if (motor === 'coqui') {
      // ----------------------------------------
      // MOTOR 3: COQUI / XTTS v2 LOCAL (FREE)
      // ----------------------------------------
      // Exige um servidor python XTTS rodando localmente (ex, na porta 5002)
      try {
        const pyResponse = await fetch('http://127.0.0.1:5002/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: texto,
                language: idioma,
                speaker: vozId || 'default_speaker'
            })
        });

        if (!pyResponse.ok) throw new Error('Servidor Local TTS falhou (Código: ' + pyResponse.status + ')');

        const pyArrayBuffer = await pyResponse.arrayBuffer();
        buffer = Buffer.from(pyArrayBuffer);
      } catch (err: any) {
        throw new Error("Servidor Coqui/XTTS Local parece estar offline. Detalhes: " + err.message);
      }

    } else if (motor === 'elevenlabs') {
      // ----------------------------------------
      // MOTOR 4: ELEVENLABS / PREMIUM (PAGO)
      // ----------------------------------------
      // Brecha preparada para o futuro!
      if (!process.env.ELEVENLABS_API_KEY) {
          throw new Error("Missing ELEVENLABS_API_KEY. Adicione no servidor seu token Premium para usar a Opção 4.");
      }

      const elResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vozId || 'EXAVITQu4vr4xnSDxMaL'}`, {
          method: 'POST',
          headers: {
             'Accept': 'audio/mpeg',
             'Content-Type': 'application/json',
             'xi-api-key': process.env.ELEVENLABS_API_KEY
          },
          body: JSON.stringify({
             text: texto,
             model_id: "eleven_multilingual_v2",
             voice_settings: { stability: 0.5, similarity_boost: 0.5 }
          })
      });

      if (!elResponse.ok) throw new Error("Erro via ElevenLabs...");
      const elBuffer = await elResponse.arrayBuffer();
      buffer = Buffer.from(elBuffer);

    } else {
        throw new Error("Motor não suportado.");
    }

    // ==========================================
    // GRAVAÇÃO NO DISCO E BANCO DE DADOS
    // ==========================================
    fs.writeFileSync(filePath, buffer);
    const arquivo_url = `/uploads/${arquivoNome}`;

    const info = db.prepare(`
      INSERT INTO musicas (titulo, artista, genero, duracao, arquivo_url)
      VALUES (?, 'Locutor Virtual', 'chamadas', 1, ?)
    `).run(titulo, arquivo_url);

    return NextResponse.json({
      id: info.lastInsertRowid,
      titulo,
      arquivo: arquivo_url,
      message: 'Spot gerado com sucesso via ' + motor
    });

  } catch (error: any) {
    console.error('Erro geral ao gerar TTS:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno ao gerar o áudio' },
      { status: 500 }
    );
  }
}