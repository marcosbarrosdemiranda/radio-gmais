import db from '@/lib/db';

export function getModoOperacao(): 'uniloja' | 'multi-filial' {
  // Assume que temos uma loja padrão com id 'loja-padrao'
  const loja = db.prepare('SELECT configuracoes FROM lojas WHERE id = ?').get('loja-padrao') as any;
  if (!loja) return 'multi-filial';

  const config = JSON.parse(loja.configuracoes || '{}');
  return config.modo_operacao || 'multi-filial';
}

export function setModoOperacao(modo: 'uniloja' | 'multi-filial') {
  const loja = db.prepare('SELECT configuracoes FROM lojas WHERE id = ?').get('loja-padrao') as any;
  if (!loja) return;

  const config = JSON.parse(loja.configuracoes || '{}');
  config.modo_operacao = modo;

  db.prepare('UPDATE lojas SET configuracoes = ? WHERE id = ?').run(JSON.stringify(config), 'loja-padrao');
}
