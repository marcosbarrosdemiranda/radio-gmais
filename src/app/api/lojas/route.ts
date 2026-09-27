import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.lojaId) {
      return NextResponse.json({ error: 'Usuário não autenticado ou sem loja associada' }, { status: 401 });
    }

    const { configuracoes } = await request.json();

    db.prepare('UPDATE lojas SET configuracoes = ? WHERE id = ?').run(
      JSON.stringify(configuracoes),
      user.lojaId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar configurações da loja:', error);
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 });
  }
}

export async function GET() {
    try {
      const user = await getCurrentUser();
      if (!user || !user.lojaId) {
        return NextResponse.json({ error: 'Usuário não autenticado ou sem loja associada' }, { status: 401 });
      }

      const loja = db.prepare('SELECT configuracoes FROM lojas WHERE id = ?').get(user.lojaId) as any;

      return NextResponse.json(loja ? JSON.parse(loja.configuracoes) : {});
    } catch (error) {
      console.error('Erro ao buscar configurações da loja:', error);
      return NextResponse.json({ error: 'Erro ao buscar configurações' }, { status: 500 });
    }
  }
