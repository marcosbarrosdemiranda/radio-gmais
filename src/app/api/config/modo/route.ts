import { NextResponse } from 'next/server';
import { getModoOperacao } from '@/lib/config';

export async function GET() {
  try {
    const modo = getModoOperacao();
    return NextResponse.json({ modo });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao verificar modo' }, { status: 500 });
  }
}
