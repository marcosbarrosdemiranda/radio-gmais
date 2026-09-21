import { NextRequest, NextResponse } from 'next/server';

// Mock data
const playlists = [
  { id: '1', nome: 'Manhã', musicas: [], chamadas: [], intervaloChamadas: 15, ativa: true, criadoEm: '2026-09-20' },
];

export async function GET() {
  return NextResponse.json(playlists);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, descricao, intervaloChamadas } = body;

    if (!nome) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    const novaPlaylist = {
      id: Date.now().toString(),
      nome,
      descricao,
      musicas: [],
      chamadas: [],
      intervaloChamadas: intervaloChamadas || 15,
      ativa: true,
      criadoEm: new Date().toISOString(),
    };

    return NextResponse.json(novaPlaylist, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar playlist' },
      { status: 500 }
    );
  }
}
