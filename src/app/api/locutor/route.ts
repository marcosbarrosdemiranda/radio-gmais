import { NextResponse } from 'next/server';
import db from '@/lib/db';
import * as googleTTS from 'google-tts-api';
import fs from 'fs';
import path from 'path';

// Função utilitária para chamar APIs genéricas de TTS (OpenAI, ElevenLabs, etc)
async function chamarApiPremium(url: string, apiKey: string, payload: any, headers: Record<string, string>) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers,
            'xi-api-key': apiKey, // Exemplo específico para ElevenLabs se mantido este modelo
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
    }

    return await response.arrayBuffer();
}

export async function POST(req: Request) {
  try {
    const { titulo, texto, idioma = 'pt-BR', motor = 'google', vozId } = await req.json();

    if (!titulo || !texto) {
      return NextResponse.json({ error: 'Título e texto são obrigatórios.' }, { status: 400 });
    }

    const arquivoNome = `${Date.now()}-locutor-${motor}.mp3`;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, arquivoNome);
    let buffer: Buffer;

    // ==========================================
    // ROTEAMENTO DOS MOTORES DE IA
    // ==========================================

    if (motor === 'google') {
      const audioUrl = googleTTS.getAudioUrl(texto, { lang: idioma, slow: false, host: 'https://translate.google.com' });
      const response = await fetch(audioUrl);
      if (!response.ok) throw new Error('Falha Google TTS.');
      buffer = Buffer.from(await response.arrayBuffer());

    } else if (motor === 'microsoft') {
      try {
        const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
        const tts = new MsEdgeTTS();
        const selectedVoice = vozId || (idioma === 'pt-BR' ? 'pt-BR-FranciscaNeural' : 'en-US-AriaNeural');
        await tts.setMetadata(selectedVoice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
        const audioStream = tts.toStream(texto);
        buffer = await new Promise((resolve, reject) => {
             const chunks: any[] = [];
             audioStream.on('data', (c: any) => chunks.push(c));
             audioStream.on('end', () => resolve(Buffer.concat(chunks)));
             audioStream.on('error', reject);
        });
      } catch (err: any) { throw new Error("Erro Microsft: " + err.message); }

    } else if (motor === 'coqui') {
      const pyResponse = await fetch('http://127.0.0.1:5002/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: texto, language: idioma, speaker: vozId || 'default' })
      });
      if (!pyResponse.ok) throw new Error('Servidor Local XTTS offline.');
      buffer = Buffer.from(await pyResponse.arrayBuffer());

    } else if (motor === 'elevenlabs') {
      // Brecha configurada para ElevenLabs ou OpenAI TTS
      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (!apiKey) throw new Error("API Key não configurada no .env");

      const audioData = await chamarApiPremium(
          `https://api.elevenlabs.io/v1/text-to-speech/${vozId || 'EXAVITQu4vr4xnSDxMaL'}`,
          apiKey,
          { text: texto, model_id: "eleven_multilingual_v2" },
          { 'Accept': 'audio/mpeg' }
      );
      buffer = Buffer.from(audioData);

    } else if (motor === 'openai') {
      // BRECHA EXTRA: OpenAI TTS
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error("OPENAI_API_KEY não configurada");

      const audioData = await chamarApiPremium(
          'https://api.openai.com/v1/audio/speech',
          '', // OpenAI usa Authorization Bearer
          { model: "tts-1", input: texto, voice: vozId || "alloy" },
          { 'Authorization': `Bearer ${apiKey}` }
      );
      buffer = Buffer.from(audioData);

    } else {
        throw new Error("Motor não suportado.");
    }

    fs.writeFileSync(filePath, buffer);

    const info = db.prepare(`INSERT INTO musicas (titulo, artista, genero, duracao, arquivo_url) VALUES (?, 'Locutor IA', 'chamadas', 1, ?)`)
      .run(titulo, `/uploads/${arquivoNome}`);

    return NextResponse.json({ id: info.lastInsertRowid, arquivo: `/uploads/${arquivoNome}`, message: 'Sucesso!' });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
