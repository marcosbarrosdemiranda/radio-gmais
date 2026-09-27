import db from './src/lib/db';
try {
    db.prepare('ALTER TABLE programacao_slots ADD COLUMN interval INTEGER DEFAULT 0;').run();
    console.log('Coluna adicionada com sucesso.');
} catch (e) {
    console.log('Erro ao alterar tabela (provavelmente já alterada):', e);
}
