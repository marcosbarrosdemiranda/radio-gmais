import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const tipo = formData.get('tipo') as string || 'musicas'; // musicas, chamadas, jingles
    const titulo = formData.get('titulo') as string;
    const artista = formData.get('artista') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac', 'audio/x-m4a'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não suportado. Use: MP3, WAV, OGG, M4A, AAC' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'audio', tipo);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadDir, fileName);

    // Convert file to buffer and write
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Get file size
    const fileSize = buffer.length;

    // Create audio URL
    const audioUrl = `/audio/${tipo}/${fileName}`;

    // Save to database
    const db = (await import('@/lib/db')).default;
    const id = crypto.randomUUID();
    
    db.prepare(
      `INSERT INTO musicas (id, titulo, artista, duracao, arquivo_url, genero, favorita) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      titulo || file.name.replace(/\.[^/.]+$/, ''),
      artista || 'Desconhecido',
      0, // Duration will be calculated later
      audioUrl,
      tipo,
      0
    );

    return NextResponse.json({
      id,
      fileName,
      audioUrl,
      fileSize,
      message: 'Arquivo enviado com sucesso',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer upload do arquivo' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo') || 'musicas';

    const db = (await import('@/lib/db')).default;
    const files = db.prepare(
      'SELECT * FROM musicas WHERE genero = ? ORDER BY criado_em DESC'
    ).all(tipo);

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json(
      { error: 'Erro ao listar arquivos' },
      { status: 500 }
    );
  }
}
