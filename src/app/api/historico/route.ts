import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const historico = db.prepare(`SELECT * FROM historico ORDER BY tocado_em DESC LIMIT 50`).all();
    return NextResponse.json(historico);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar histórico' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { tipo, referencia_id, titulo, duracao } = await req.json();

    db.prepare(`
      INSERT INTO historico (tipo, referencia_id, titulo, duracao)
      VALUES (?, ?, ?, ?)
    `).run(tipo, referencia_id, titulo, duracao);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar histórico' }, { status: 500 });
  }
}
