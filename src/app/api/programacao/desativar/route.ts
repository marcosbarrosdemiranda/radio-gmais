import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    db.prepare('UPDATE programacao SET ativa = 0 WHERE id = ?').run(id);

    return NextResponse.json({ message: 'Programação desativada' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao desativar' }, { status: 500 });
  }
}
