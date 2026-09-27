import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // Busca comando pendente para a loja padrão
    const loja = db.prepare('SELECT configuracoes FROM lojas WHERE id = ?').get('loja-padrao') as any;

    if (!loja) return NextResponse.json({ comando: null });

    const config = JSON.parse(loja.configuracoes);
    const comando = config.proximo_comando;

    if (!comando) return NextResponse.json({ comando: null });

    // Limpa o comando
    config.proximo_comando = null;
    db.prepare('UPDATE lojas SET configuracoes = ? WHERE id = ?').run(JSON.stringify(config), 'loja-padrao');

    return NextResponse.json({ comando: JSON.parse(comando) });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao verificar comandos' }, { status: 500 });
  }
}
