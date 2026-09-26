import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { nome, slots } = await request.json();

    if (!nome || !slots) {
      return NextResponse.json({ error: 'Nome e slots são obrigatórios' }, { status: 400 });
    }

    const programacaoId = crypto.randomUUID();

    db.transaction(() => {
      // Inserir grade
      db.prepare(`
        INSERT INTO programacao (id, nome)
        VALUES (?, ?)
      `).run(programacaoId, nome);

      // Inserir slots
      const stmt = db.prepare(`
        INSERT INTO programacao_slots (id, programacao_id, type, category, count, ordem, mode)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      slots.forEach((s: any, index: number) => {
        stmt.run(crypto.randomUUID(), programacaoId, s.type, s.category, s.count, index, s.mode);
      });
    })();

    return NextResponse.json({ message: 'Programação salva com sucesso', id: programacaoId }, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar programação:', error);
    return NextResponse.json({ error: 'Erro ao salvar programação' }, { status: 500 });
  }
}
