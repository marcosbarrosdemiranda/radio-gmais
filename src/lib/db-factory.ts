import dbMatriz from './db';
import dbFilial from './db-filial';

// Determina o modo baseado na variável de ambiente. 
// Padronizamos como 'true' para indicar que esta instância é uma filial.
const isFilial = process.env.IS_FILIAL === 'true';

export function getDb() {
  return isFilial ? dbFilial : dbMatriz;
}

export default getDb();
