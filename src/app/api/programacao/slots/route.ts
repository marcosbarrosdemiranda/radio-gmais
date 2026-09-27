import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID da programação é obrigatório' }, { status: 400 });
    }

    const slots = db.prepare('SELECT * FROM programacao_slots WHERE programacao_id = ? ORDER BY ordem ASC').all(id);
    return NextResponse.json(slots);
  } catch (error) {
    console.error('Erro ao buscar slots:', error);
    return NextResponse.json({ error: 'Erro ao buscar slots' }, { status: 500 });
  }
}
