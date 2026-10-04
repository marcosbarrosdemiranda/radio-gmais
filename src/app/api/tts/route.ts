import { NextRequest, NextResponse } from 'next/server';
import { generateSpeech, TTSConfig } from '@/lib/tts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { texto, vozId, motor = 'voicestudio', apiKey = '' } = body;

    if (!texto) {
      return NextResponse.json(
        { error: 'Texto é obrigatório' },
        { status: 400 }
      );
    }

    const config: TTSConfig = {
      provider: motor,
      apiKey,
      voiceId: vozId,
    };

    const result = await generateSpeech(texto, config);

    return NextResponse.json({
      audioUrl: `data:audio/mp3;base64,${result.audioBuffer.toString('base64')}`,
      duracao: result.duration,
      vozId,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Erro ao gerar áudio: ' + error.message },
      { status: 500 }
    );
  }
}
