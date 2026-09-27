import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const programacoes = db.prepare('SELECT * FROM programacao ORDER BY criado_em DESC').all();
    return NextResponse.json(programacoes);
  } catch (error) {
    console.error('Erro ao buscar programações:', error);
    return NextResponse.json({ error: 'Erro ao buscar programações' }, { status: 500 });
  }
}
