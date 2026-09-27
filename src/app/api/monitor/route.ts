import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { sendWebhook } from '@/lib/system-monitor';

// Endpoint para reportar status (Filiais ou Matriz)
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { filialId, status, message } = data;

    let payload;

    if (filialId) {
        // Atualiza status da filial no banco de dados
        db.prepare('UPDATE filiais SET status = ?, ultima_sincronizacao = datetime("now") WHERE id = ?')
          .run(status, filialId);

        payload = { type: 'filial_update', filialId, status, message };
    } else {
        // Status enviado pela própria matriz (ex: healthcheck)
        payload = { type: 'matriz_update', ...data };
    }

    // Dispara webhook para o Portal-GLPI
    await sendWebhook(payload);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Monitoramento] Erro:', error);
    return NextResponse.json({ error: 'Erro ao processar monitoramento' }, { status: 500 });
  }
}