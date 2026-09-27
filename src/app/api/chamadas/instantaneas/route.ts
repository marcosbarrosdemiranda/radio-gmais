import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // Retorna as chamadas cadastradas (upload salvou na tabela musicas com genero = 'chamadas')
    const chamadas = db.prepare(`SELECT id, titulo, arquivo_url as arquivo FROM musicas WHERE genero = 'chamadas' ORDER BY criado_em DESC`).all();

    return NextResponse.json(chamadas);
  } catch (error) {
    console.error('Erro ao buscar chamadas instantâneas:', error);
    return NextResponse.json({ error: 'Erro ao buscar chamadas instantâneas' }, { status: 500 });
  }
}
