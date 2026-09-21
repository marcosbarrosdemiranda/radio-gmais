import { NextRequest, NextResponse } from 'next/server';

// Mock data
const musicas = [
  { id: '1', titulo: 'Música Exemplo 1', artista: 'Artista 1', duracao: 210, favorita: false, criadoEm: '2026-09-20' },
];

export async function GET() {
  return NextResponse.json(musicas);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titulo, artista, duracao, arquivoUrl, genero } = body;

    if (!titulo || !artista) {
      return NextResponse.json(
        { error: 'Título e artista são obrigatórios' },
        { status: 400 }
      );
    }

    const novaMusica = {
      id: Date.now().toString(),
      titulo,
      artista,
      duracao: duracao || 0,
      arquivoUrl: arquivoUrl || '',
      genero,
      favorita: false,
      criadoEm: new Date().toISOString(),
    };

    return NextResponse.json(novaMusica, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar música' },
      { status: 500 }
    );
  }
}
