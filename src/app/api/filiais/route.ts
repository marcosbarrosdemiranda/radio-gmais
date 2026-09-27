import { NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';

export async function GET() {
  const filiais = db.prepare('SELECT * FROM filiais').all();
  return NextResponse.json(filiais);
}

export async function POST(request: Request) {
  const { nome } = await request.json();
  const id = crypto.randomUUID();
  const token = crypto.randomBytes(16).toString('hex');

  // Assumindo que pegaremos a primeira loja por enquanto ou exigiremos passar loja_id
  const loja = db.prepare('SELECT id FROM lojas LIMIT 1').get() as any;

  db.prepare('INSERT INTO filiais (id, loja_id, nome, token_acesso) VALUES (?, ?, ?, ?)')
    .run(id, loja?.id || 'default', nome, token);

  return NextResponse.json({ success: true });
}
