import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const musicas = db.prepare('SELECT * FROM musicas ORDER BY criado_em DESC').all();
    return NextResponse.json(musicas);
  } catch (error) {
    console.error('Erro ao buscar músicas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar músicas' },
      { status: 500 }
    );
  }
}
