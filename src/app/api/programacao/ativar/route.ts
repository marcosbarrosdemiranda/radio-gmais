import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID da programação é obrigatório' }, { status: 400 });
    }

    db.transaction(() => {
      // 1. Desativa todas as outras programações
      db.prepare('UPDATE programacao SET ativa = 0').run();

      // 2. Ativa a escolhida
      db.prepare('UPDATE programacao SET ativa = 1 WHERE id = ?').run(id);
    })();

    return NextResponse.json({ message: 'Programação definida como ativa com sucesso' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao definir programação ativa:', error);
    return NextResponse.json({ error: 'Erro ao definir programação ativa' }, { status: 500 });
  }
}
