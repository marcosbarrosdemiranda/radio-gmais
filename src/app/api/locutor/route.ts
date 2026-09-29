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
        // Use AntonioNeural for Brazilian Portuguese, GuyNeural for English as they sound more natural
        const selectedVoice = vozId || (idioma === 'pt-BR' ? 'pt-BR-AntonioNeural' : 'en-US-GuyNeural');
        await tts.setMetadata(selectedVoice, OUTPUT_FORMAT.AUDIO_48KHZ_192KBITRATE_MONO_MP3);

        // Função para gerar SSML com variação natural de prosódia para locutor de supermercado
        const generateExpressiveSSML = (texto: string, idioma: string) => {
          // Divide o texto em sentenças para aplicar variação contextual
          const sentences = texto.split(/([.!?]+)\s*/).filter(s => s.trim().length > 0);

          let ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${idioma}'>\n`;
          ssml += `  <voice name='${selectedVoice}'>\n`;

          sentences.forEach((sentence, index) => {
            if (!sentence.trim()) return;

            // Determina o tipo de sentença para entonação apropriada
            const isQuestion = sentence.trim().endsWith('?');
            const isExclamation = sentence.trim().endsWith('!');
            const isDeclaration = sentence.trim().endsWith('.') || !['?', '!'].includes(sentence.slice(-1));

            // Variação de pitch baseada no tipo e posição da sentença - mais animado para supermercado
            let pitchAdjustment = '0%';
            let rateAdjustment = 'medium';

            if (isQuestion) {
              pitchAdjustment = '+8%'; // Aumento mais pronunciado para perguntas
              if (index === sentences.length - 1) pitchAdjustment = '+12%'; // Última pergunta mais expressiva
            } else if (isExclamation) {
              pitchAdjustment = '+6%';
              rateAdjustment = 'medium+'; // Mais rápido para exclamações
            } else if (index === 0) {
              pitchAdjustment = '+4%'; // Começa mais animado
              rateAdjustment = 'medium+'; // Levemente mais rápido no início
            } else if (index === sentences.length - 1) {
              pitchAdjustment = '-2%'; // Termina um pouco mais baixo (natural)
              rateAdjustment = 'medium'; // Volta ao normal no final
            }

            // Ajuste extra para contexto de supermercado: mais energia em ofertas
            const textoLower = sentence.toLowerCase();
            const temOferta = textoLower.includes('oferta') || textoLower.includes('desconto') ||
                            textoLower.includes('promoção') || textoLower.includes('líquido') ||
                            /\d+%/.test(sentence); // Detecta porcentagens

            if (temOferta) {
              pitchAdjustment = (parseInt(pitchAdjustment) + 3) + '%'; // Mais animado para ofertas
              rateAdjustment = rateAdjustment === 'medium' ? 'medium+' : rateAdjustment;
            }

            // Pausas contextuais mais naturais
            let pauseBefore = '150ms';
            let pauseAfter = '250ms';

            if (index > 0) {
              // Pausa maior após pontuação forte
              const prevChar = sentences[index-1].slice(-1);
              if (['.','!','?'].includes(prevChar)) pauseBefore = '350ms';
            }

            ssml += `    <prosody rate='${rateAdjustment}' pitch='${pitchAdjustment}' volume='+0%'>\n`;

            // Enfatiza palavras importantes para contexto de supermercado
            let emphasizedText = sentence
              // Enfatiza números e preços
              .replace(/(\d+[.,]?\d*)/g, '<emphasis level=\"moderate\">$1</emphasis>')
              // Enfatiza palavras de urgência/oferta típicas de supermercado
              .replace(/\b(hoje|agora|últimas|última|oferta|desconto|promoção|grátis|líquido|meia-entrada|dois por um|leve\d|pague\d)\b/gi,
                       '<emphasis level=\"strong\">$1</emphasis>')
              // Enfatiza unidades de medida e valores monetários
              .replace(/\b(kg|g|l|ml|unidade|unidades|pc|peça|peças|R\$\s*\d+[.,]?\d*)\b/gi,
                       '<emphasis level=\"moderate\">$1</emphasis>');

            ssml += `      ${emphasizedText}\n`;
            ssml += `    </prosody>\n`;

            // Pausa contextual após a sentença
            if (index < sentences.length - 1) {
              const pauseTime = isQuestion || isExclamation ? '300ms' : '200ms';
              ssml += `    <break time=\"${pauseTime}\"/>\n`;
            }
          });

          ssml += `  </voice>\n</speak>`;
          return ssml;
        };

        // Use esta função no lugar do SSML simples:
        const ssml = generateExpressiveSSML(texto, idioma);

        // Use toFile method which is more stable for getting the audio buffer
        const result = await tts.toFile(uploadsDir, ssml, {});
        const audioFilePath = result.audioFilePath;
        buffer = await fs.promises.readFile(audioFilePath);

        // Clean up the temporary file
        await fs.promises.unlink(audioFilePath);
      } catch (err: any) { throw new Error("Erro Microsoft: " + err.message); }

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
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
