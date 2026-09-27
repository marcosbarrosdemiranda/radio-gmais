import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { id, nome, slots } = await request.json();

    if (!id || !nome || !slots) {
      return NextResponse.json({ error: 'ID, Nome e slots são obrigatórios' }, { status: 400 });
    }

    db.transaction(() => {
      // 1. Atualizar nome da grade
      db.prepare('UPDATE programacao SET nome = ? WHERE id = ?').run(nome, id);

      // 2. Apagar slots antigos
      db.prepare('DELETE FROM programacao_slots WHERE programacao_id = ?').run(id);

      // 3. Inserir slots novos
      const stmt = db.prepare(`
        INSERT INTO programacao_slots (id, programacao_id, type, category, count, ordem, mode, interval)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      slots.forEach((s: any, index: number) => {
        stmt.run(crypto.randomUUID(), id, s.type, s.category, s.count, index, s.mode, s.interval || 0);
      });
    })();

    return NextResponse.json({ message: 'Programação atualizada com sucesso' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar programação:', error);
    return NextResponse.json({ error: 'Erro ao atualizar programação' }, { status: 500 });
  }
}
