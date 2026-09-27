import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // Na implementação real, precisaríamos de uma forma de notificar a instância
    // específica da filial (via WebSocket ou polling).
    // Aqui estamos apenas persistindo o comando desejado.

    const { acao, valor } = await request.json(); // acao: 'play'|'pause'|'volume', valor: 0-100
    const filialId = params.id;

    // Atualiza o estado desejado da filial no banco de dados
    db.prepare('UPDATE filiais SET proximo_comando = ? WHERE id = ?')
      .run(JSON.stringify({ acao, valor, timestamp: Date.now() }), filialId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao enviar comando' }, { status: 500 });
  }
}
