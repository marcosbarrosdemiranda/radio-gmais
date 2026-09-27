import { NextResponse } from 'next/server';
import db from '@/lib/db-factory';

export async function GET() {
  try {
    // 1. Busca a grade ativa
    const gradeAtiva = db.prepare('SELECT * FROM programacao WHERE ativa = 1 LIMIT 1').get();

    if (!gradeAtiva) {
      return NextResponse.json({ error: 'Nenhuma grade ativa definida' }, { status: 404 });
    }

    // 2. Busca os slots da grade ordenados
    const slots = db.prepare('SELECT * FROM programacao_slots WHERE programacao_id = ? ORDER BY ordem ASC').all(gradeAtiva.id);

    // 3. Lógica para definir o próximo item (simples, sequencial agora, expandiremos depois)
    // Para a opção A, precisamos de um estado de "onde estamos na grade"
    // Vamos começar buscando a "fórmula" da grade
    return NextResponse.json({ grade: gradeAtiva, slots });
  } catch (error) {
    console.error('Erro ao buscar status da grade:', error);
    return NextResponse.json({ error: 'Erro ao buscar status da grade' }, { status: 500 });
  }
}
