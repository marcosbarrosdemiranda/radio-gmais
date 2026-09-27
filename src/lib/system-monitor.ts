import db from './db';

export async function getSystemHealth() {
  try {
    // 1. Check banco de dados
    const dbStatus = db.open ? 'online' : 'offline';

    // 2. Check de alguma tabela importante
    db.prepare('SELECT count(*) FROM lojas').get();

    return {
      status: 'online',
      checks: {
        database: dbStatus,
        memory: process.memoryUsage().heapUsed / 1024 / 1024 + ' MB',
        uptime: process.uptime()
      }
    };
  } catch (error) {
    return {
      status: 'degraded',
      checks: {
        database: 'offline',
        error: String(error)
      }
    };
  }
}

export async function sendWebhook(payload: any) {
  const WEBHOOK_URL = process.env.GLPI_WEBHOOK_URL;
  if (!WEBHOOK_URL) {
      console.warn('[Monitoramento] URL do webhook não configurada');
      return;
  }

  try {
    await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...payload,
            timestamp: new Date().toISOString(),
            source: 'radio-gmais-matriz'
        })
    });
  } catch (error) {
    console.error('[Monitoramento] Erro ao disparar webhook:', error);
  }
}
