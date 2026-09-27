import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Endpoint para as Filiais reportarem status para a Matriz
export async function POST(request: Request) {
  try {
    const { filialId, status, message } = await request.json();

    if (!filialId) {
      return NextResponse.json({ error: 'Filial ID obrigatório' }, { status: 400 });
    }

    // Atualiza status da filial no banco de dados da Matriz
    db.prepare('UPDATE filiais SET status = ?, ultima_sincronizacao = datetime("now") WHERE id = ?')
      .run(status, filialId);

    // Aqui seria onde integrariamos com o Webhook do Portal-GLPI
    console.log(`[Monitoramento] Filial ${filialId}: ${status} - ${message}`);

    // Exemplo de integração (simulada)
    // await fetch('https://portal-glpi.exemplo.com/webhook', {
    //    method: 'POST',
    //    body: JSON.stringify({ filialId, status, message })
    // }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao processar monitoramento' }, { status: 500 });
  }
}
