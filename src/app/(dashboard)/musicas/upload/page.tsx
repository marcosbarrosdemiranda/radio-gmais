'use client';

import { useState, useRef } from 'react';
import { Upload, Music, FileAudio, X, Check, Loader2, Folder } from 'lucide-react';

type UploadTipo = 'musicas' | 'chamadas' | 'jingles';

interface UploadedFile {
  id: string;
  fileName: string;
  audioUrl: string;
  fileSize: number;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [titulo, setTitulo] = useState('');
  const [artista, setArtista] = useState('');
  const [tipo, setTipo] = useState<UploadTipo>('musicas');
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<UploadedFile | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setTitulo(selectedFile.name.replace(/\.[^/.]+$/, ''));
      setError('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setTitulo(droppedFile.name.replace(/\.[^/.]+$/, ''));
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Selecione um arquivo');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tipo', tipo);
      formData.append('titulo', titulo);
      formData.append('artista', artista);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao fazer upload');
        return;
      }

      setUploaded(data);
      setFile(null);
      setTitulo('');
      setArtista('');
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const tipos = [
    { value: 'musicas', label: 'Músicas', icon: Music, color: '#DB1931' },
    { value: 'chamadas', label: 'Chamadas', icon: FileAudio, color: '#f59e0b' },
    { value: 'jingles', label: 'Jingles', icon: Folder, color: '#3b82f6' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload de Áudio</h1>
        <p style={{ color: '#9ca3af' }}>Envie músicas, chamadas e jingles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <div className="space-y-4">
          {/* Tipo de arquivo */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
              Tipo de arquivo
            </label>
            <div className="flex gap-2">
              {tipos.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTipo(t.value as UploadTipo)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                  style={{
                    background: tipo === t.value ? t.color : '#1F2026',
                    color: tipo === t.value ? '#fff' : '#9ca3af',
                    border: `1px solid ${tipo === t.value ? t.color : '#404048'}`
                  }}
                >
                  <t.icon size={16} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
            style={{
              borderColor: file ? '#DB1931' : '#404048',
              background: file ? 'rgba(219, 25, 49, 0.05)' : '#1F2026'
            }}
            onMouseOver={(e) => {
              if (!file) e.currentTarget.style.borderColor = '#52525b';
            }}
            onMouseOut={(e) => {
              if (!file) e.currentTarget.style.borderColor = '#404048';
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,.ogg,.m4a,.aac,audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {file ? (
              <div className="space-y-2">
                <FileAudio size={48} style={{ color: '#DB1931' }} className="mx-auto" />
                <p className="font-medium">{file.name}</p>
                <p style={{ color: '#9ca3af' }} className="text-sm">
                  {formatFileSize(file.size)}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="text-sm"
                  style={{ color: '#ef4444' }}
                >
                  Remover
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload size={48} style={{ color: '#71717a' }} className="mx-auto" />
                <p style={{ color: '#9ca3af' }}>
                  Arraste um arquivo ou clique para selecionar
                </p>
                <p style={{ color: '#71717a' }} className="text-sm">
                  MP3, WAV, OGG, M4A, AAC (máx. 50MB)
                </p>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#9ca3af' }}>
                Título
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Nome da música ou chamada"
                className="w-full rounded-lg px-4 py-2 outline-none"
                style={{ background: '#1F2026', border: '1px solid #404048', color: '#fff' }}
              />
            </div>

            {tipo === 'musicas' && (
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#9ca3af' }}>
                  Artista
                </label>
                <input
                  type="text"
                  value={artista}
                  onChange={(e) => setArtista(e.target.value)}
                  placeholder="Nome do artista"
                  className="w-full rounded-lg px-4 py-2 outline-none"
                  style={{ background: '#1F2026', border: '1px solid #404048', color: '#fff' }}
                />
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div
              className="rounded-lg p-3 text-sm"
              style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}
            >
              {error}
            </div>
          )}

          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors"
            style={{
              background: !file || uploading ? '#404048' : '#DB1931',
              color: !file || uploading ? '#71717a' : '#fff',
              cursor: !file || uploading ? 'not-allowed' : 'pointer'
            }}
          >
            {uploading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload size={20} />
                Enviar Arquivo
              </>
            )}
          </button>
        </div>

        {/* Success / Preview */}
        <div className="space-y-4">
          {uploaded ? (
            <div
              className="rounded-xl p-6"
              style={{ background: '#1F2026', border: '1px solid #22c55e' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Check size={24} style={{ color: '#22c55e' }} />
                <h3 className="font-semibold">Upload realizado com sucesso!</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <p style={{ color: '#9ca3af' }} className="text-sm">Arquivo:</p>
                  <p className="font-medium">{uploaded.fileName}</p>
                </div>
                <div>
                  <p style={{ color: '#9ca3af' }} className="text-sm">Tamanho:</p>
                  <p className="font-medium">{formatFileSize(uploaded.fileSize)}</p>
                </div>
                <div>
                  <p style={{ color: '#9ca3af' }} className="text-sm">URL:</p>
                  <p className="font-medium text-sm break-all" style={{ color: '#DB1931' }}>
                    {uploaded.audioUrl}
                  </p>
                </div>
              </div>

              {/* Audio preview */}
              <div className="mt-4">
                <audio controls src={uploaded.audioUrl} className="w-full" />
              </div>

              <button
                onClick={() => setUploaded(null)}
                className="mt-4 w-full py-2 rounded-lg transition-colors"
                style={{ background: '#404048', color: '#fff' }}
              >
                Enviar outro arquivo
              </button>
            </div>
          ) : (
            <div
              className="rounded-xl p-6"
              style={{ background: '#1F2026', border: '1px solid #404048' }}
            >
              <h3 className="font-semibold mb-4">ℹ️ Informações</h3>
              <div className="space-y-3 text-sm" style={{ color: '#9ca3af' }}>
                <p>
                  <strong style={{ color: '#fff' }}>Músicas:</strong> Arquivos de áudio para playlists
                </p>
                <p>
                  <strong style={{ color: '#fff' }}>Chamadas:</strong> Anúncios e avisos para tocar ao vivo
                </p>
                <p>
                  <strong style={{ color: '#fff' }}>Jingles:</strong> Vinhetas de transição e identificação
                </p>
                <div className="pt-3" style={{ borderTop: '1px solid #404048' }}>
                  <p style={{ color: '#71717a' }}>
                    Formatos suportados: MP3, WAV, OGG, M4A, AAC
                  </p>
                  <p style={{ color: '#71717a' }}>
                    Tamanho máximo: 50MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Storage info */}
          <div
            className="rounded-xl p-4"
            style={{ background: '#1F2026', border: '1px solid #404048' }}
          >
            <h4 className="font-medium mb-2">📁 Estrutura de Pastas</h4>
            <div className="text-sm space-y-1" style={{ color: '#9ca3af', fontFamily: 'monospace' }}>
              <p>public/audio/</p>
              <p className="ml-4">├── musicas/     <span style={{ color: '#DB1931' }}>(suas músicas)</span></p>
              <p className="ml-4">├── chamadas/    <span style={{ color: '#f59e0b' }}>(anúncios)</span></p>
              <p className="ml-4">├── jingles/     <span style={{ color: '#3b82f6' }}>(vinhetas)</span></p>
              <p className="ml-4">└── uploads/     <span style={{ color: '#22c55e' }}>(uploads gerais)</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
