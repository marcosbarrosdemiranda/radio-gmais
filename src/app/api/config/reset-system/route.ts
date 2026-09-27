import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import db from '@/lib/db';

export async function POST() {
  try {
    // 1. Fechar o banco de dados antes de deletar
    db.close();

    // 2. Caminhos para limpar
    const dbPath = path.join(process.cwd(), 'data', 'radio-gmais.db');
    const uploadsDir = path.join(process.cwd(), 'data', 'uploads');

    // 3. Remover arquivos
    if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
    if (fs.existsSync(uploadsDir)) {
      fs.rmSync(uploadsDir, { recursive: true, force: true });
    }

    return NextResponse.json({ success: true, message: 'Sistema resetado com sucesso' });
  } catch (error) {
    console.error('Erro ao resetar sistema:', error);
    return NextResponse.json({ error: 'Erro ao resetar sistema' }, { status: 500 });
  }
}
