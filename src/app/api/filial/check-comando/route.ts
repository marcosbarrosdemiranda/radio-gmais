import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Rota para a filial consultar comandos pendentes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filialId = searchParams.get('filialId');

    if (!filialId) {
      return NextResponse.json({ error: 'Filial ID obrigatório' }, { status: 400 });
    }

    const filial = db.prepare('SELECT proximo_comando FROM filiais WHERE id = ?').get(filialId) as any;

    if (!filial || !filial.proximo_comando) {
      return NextResponse.json({ comando: null });
    }

    // Retorna o comando e limpa o banco para não executar novamente
    db.prepare('UPDATE filiais SET proximo_comando = NULL WHERE id = ?').run(filialId);

    return NextResponse.json({ comando: JSON.parse(filial.proximo_comando) });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao verificar comandos' }, { status: 500 });
  }
}
