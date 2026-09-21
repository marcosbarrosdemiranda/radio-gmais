import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { texto, vozId, velocidade = 1.0 } = body;

    if (!texto) {
      return NextResponse.json(
        { error: 'Texto é obrigatório' },
        { status: 400 }
      );
    }

    // TODO: Integrate with TTS provider (ElevenLabs, Azure, Google)
    // For now, return a mock response
    const audioUrl = `/api/audio/mock-${Date.now()}.mp3`;

    return NextResponse.json({
      audioUrl,
      duracao: Math.ceil(texto.split(/\s+/).length / 150 * 60),
      vozId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao gerar áudio' },
      { status: 500 }
    );
  }
}
