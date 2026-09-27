import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { acao, valor } = await request.json();

    // Atualiza o estado desejado na loja padrão
    const loja = db.prepare('SELECT configuracoes FROM lojas WHERE id = ?').get('loja-padrao') as any;
    if (!loja) return NextResponse.json({ error: 'Loja não encontrada' }, { status: 404 });

    const config = JSON.parse(loja.configuracoes);
    config.proximo_comando = JSON.stringify({ acao, valor, timestamp: Date.now() });

    db.prepare('UPDATE lojas SET configuracoes = ? WHERE id = ?').run(JSON.stringify(config), 'loja-padrao');

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao enviar comando' }, { status: 500 });
  }
}
