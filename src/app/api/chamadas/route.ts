import { NextRequest, NextResponse } from 'next/server';

// Mock data
const chamadas = [
  { id: '1', titulo: 'Promoção Semanal', texto: 'Texto da promoção', tipo: 'locutor-virtual', ativa: true, criadoEm: '2026-09-20' },
];

export async function GET() {
  return NextResponse.json(chamadas);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titulo, texto, tipo, vozId } = body;

    if (!titulo || !texto) {
      return NextResponse.json(
        { error: 'Título e texto são obrigatórios' },
        { status: 400 }
      );
    }

    const novaChamada = {
      id: Date.now().toString(),
      titulo,
      texto,
      tipo: tipo || 'locutor-virtual',
      vozId,
      ativa: true,
      criadoEm: new Date().toISOString(),
    };

    return NextResponse.json(novaChamada, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar chamada' },
      { status: 500 }
    );
  }
}
