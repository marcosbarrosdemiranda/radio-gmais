'use client';

import { useState, useRef } from 'react';
import { Upload, Music, FileAudio, Check, Loader2, Folder, Trash2 } from 'lucide-react';

// Importa dinamicamente apenas no lado do cliente
const jsmediatags = typeof window !== 'undefined' ? require('jsmediatags') : null;

type UploadTipo = 'musicas' | 'chamadas' | 'jingles';
type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

interface UploadItem {
  id: string;
  file: File;
  titulo: string;
  artista: string;
  status: UploadStatus;
  error?: string;
  uploadedUrl?: string;
}

export default function UploadPage() {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [tipo, setTipo] = useState<UploadTipo>('musicas');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingTags, setIsProcessingTags] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFileTags = (file: File): Promise<{ titulo: string; artista: string }> => {
    return new Promise((resolve) => {
      const defaultTitle = file.name.replace(/\.[^/.]+$/, '');
      const defaultArtist = '';

      if (!jsmediatags) {
        resolve({ titulo: defaultTitle, artista: defaultArtist });
        return;
      }

      jsmediatags.read(file, {
        onSuccess: (tag: any) => {
          resolve({
            titulo: tag.tags.title?.trim() || defaultTitle,
            artista: tag.tags.artist?.trim() || defaultArtist,
          });
        },
        onError: () => {
          resolve({ titulo: defaultTitle, artista: defaultArtist });
        }
      });
    });
  };

  const handleFiles = async (files: FileList | File[]) => {
    const newFiles = Array.from(files).filter(f => f.type.startsWith('audio/') || f.name.match(/\.(mp3|wav|ogg|m4a|aac)$/i));

    if (newFiles.length === 0) return;

    setIsProcessingTags(true);

    const newItems: UploadItem[] = [];

    for (const file of newFiles) {
      const id = Math.random().toString(36).substring(7);
      const tags = await processFileTags(file);

      newItems.push({
        id,
        file,
        titulo: tags.titulo,
        artista: tags.artista,
        status: 'pending'
      });
    }

    setItems(prev => [...prev, ...newItems]);
    setIsProcessingTags(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const updateItem = (id: string, field: keyof UploadItem, value: any) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUploadAll = async () => {
    const pendingItems = items.filter(i => i.status === 'pending' || i.status === 'error');
    if (pendingItems.length === 0) return;

    for (const item of pendingItems) {
      updateItem(item.id, 'status', 'uploading');
      updateItem(item.id, 'error', undefined);

      try {
        const formData = new FormData();
        formData.append('file', item.file);
        formData.append('tipo', tipo);
        formData.append('titulo', item.titulo);
        formData.append('artista', item.artista);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          updateItem(item.id, 'status', 'error');
          updateItem(item.id, 'error', data.error || 'Erro no upload');
        } else {
          updateItem(item.id, 'status', 'success');
          updateItem(item.id, 'uploadedUrl', data.audioUrl);
        }
      } catch (err) {
        updateItem(item.id, 'status', 'error');
        updateItem(item.id, 'error', 'Erro de conexão');
      }
    }
  };

  const clearCompleted = () => {
    setItems(prev => prev.filter(item => item.status !== 'success'));
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

  const pendingCount = items.filter(i => i.status === 'pending' || i.status === 'error').length;
  const isUploading = items.some(i => i.status === 'uploading');
  const hasSuccess = items.some(i => i.status === 'success');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload em Lote</h1>
        <p style={{ color: '#9ca3af' }}>Envie múltiplas músicas, chamadas ou jingles de uma vez</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Dropzone & Settings */}
        <div className="space-y-6 lg:col-span-1">
          {/* Tipo de arquivo */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: '#9ca3af' }}>
              Categoria de Upload
            </label>
            <div className="flex flex-col gap-2">
              {tipos.map((t) => (
                <button
                  key={t.value}
                  disabled={isUploading}
                  onClick={() => setTipo(t.value as UploadTipo)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left"
                  style={{
                    background: tipo === t.value ? t.color : '#1F2026',
                    color: tipo === t.value ? '#fff' : '#9ca3af',
                    border: `1px solid ${tipo === t.value ? t.color : '#404048'}`,
                    opacity: isUploading ? 0.5 : 1
                  }}
                >
                  <t.icon size={18} />
                  <span className="font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-8 text-center transition-colors"
            style={{
              borderColor: isDragging ? '#DB1931' : '#404048',
              background: isDragging ? 'rgba(219, 25, 49, 0.05)' : '#1F2026',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              opacity: isUploading ? 0.5 : 1
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".mp3,.wav,.ogg,.m4a,.aac,audio/*"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
              disabled={isUploading}
            />

            <div className="space-y-3">
              {isProcessingTags ? (
                <Loader2 size={40} style={{ color: '#DB1931' }} className="mx-auto animate-spin" />
              ) : (
                <Upload size={40} style={{ color: isDragging ? '#DB1931' : '#71717a' }} className="mx-auto" />
              )}

              <div>
                <p className="font-medium" style={{ color: isDragging ? '#DB1931' : '#fff' }}>
                  {isProcessingTags ? 'Lendo ID3...' : 'Arraste vários arquivos'}
                </p>
                <p style={{ color: '#9ca3af' }} className="text-sm mt-1">
                  ou clique para selecionar
                </p>
              </div>
            </div>
          </div>

          {/* Storage info (kept from original) */}
          <div className="rounded-xl p-4 text-sm" style={{ background: '#1F2026', border: '1px solid #404048' }}>
            <p style={{ color: '#9ca3af' }} className="mb-2">⚠️ Limite máx. 50MB por arquivo</p>
            <p style={{ color: '#71717a' }}>Metadados (Título e Artista) são extraídos automaticamente via tags ID3 de seus MP3/M4A.</p>
          </div>
        </div>

        {/* Right Column: Files List & Action */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Arquivos na Fila
              <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: '#404048', color: '#fff' }}>
                {items.length}
              </span>
            </h2>

            {hasSuccess && !isUploading && (
              <button
                onClick={clearCompleted}
                className="text-sm hover:underline"
                style={{ color: '#9ca3af' }}
              >
                Limpar concluídos
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="rounded-xl p-12 text-center border border-dashed" style={{ borderColor: '#404048' }}>
              <Music size={48} style={{ color: '#404048' }} className="mx-auto mb-4" />
              <p style={{ color: '#9ca3af' }}>Nenhum arquivo selecionado ainda.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center relative"
                  style={{
                    background: '#1F2026',
                    border: `1px solid ${
                      item.status === 'success' ? '#22c55e' :
                      item.status === 'error' ? '#ef4444' : '#404048'
                    }`
                  }}
                >
                  {/* File Info */}
                  <div className="w-full sm:w-1/3 min-w-0">
                    <p className="font-medium truncate" title={item.file.name}>{item.file.name}</p>
                    <p className="text-xs" style={{ color: '#9ca3af' }}>
                      {formatFileSize(item.file.size)}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      {item.status === 'success' && <span className="text-xs flex items-center gap-1" style={{ color: '#22c55e' }}><Check size={12} /> Concluído</span>}
                      {item.status === 'uploading' && <span className="text-xs flex items-center gap-1" style={{ color: '#3b82f6' }}><Loader2 size={12} className="animate-spin" /> Enviando</span>}
                      {item.status === 'error' && <span className="text-xs truncate" title={item.error} style={{ color: '#ef4444' }}>{item.error}</span>}
                      {item.status === 'pending' && <span className="text-xs" style={{ color: '#71717a' }}>Pendente</span>}
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        value={item.titulo}
                        onChange={(e) => updateItem(item.id, 'titulo', e.target.value)}
                        placeholder="Título"
                        disabled={item.status === 'success' || item.status === 'uploading'}
                        className="w-full rounded-lg px-3 py-1.5 text-sm outline-none transition-colors"
                        style={{
                          background: 'rgba(0,0,0,0.2)',
                          border: '1px solid #404048',
                          color: '#fff',
                          opacity: (item.status === 'success' || item.status === 'uploading') ? 0.6 : 1
                        }}
                      />
                    </div>
                    {tipo === 'musicas' && (
                      <div>
                        <input
                          type="text"
                          value={item.artista}
                          onChange={(e) => updateItem(item.id, 'artista', e.target.value)}
                          placeholder="Artista"
                          disabled={item.status === 'success' || item.status === 'uploading'}
                          className="w-full rounded-lg px-3 py-1.5 text-sm outline-none transition-colors"
                          style={{
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid #404048',
                            color: '#fff',
                            opacity: (item.status === 'success' || item.status === 'uploading') ? 0.6 : 1
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="absolute top-2 right-2 sm:relative sm:top-auto sm:right-auto">
                    {item.status !== 'uploading' && item.status !== 'success' && (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
                        style={{ color: '#ef4444' }}
                        title="Remover"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {items.length > 0 && (
            <button
              onClick={handleUploadAll}
              disabled={pendingCount === 0 || isUploading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all"
              style={{
                background: pendingCount === 0 || isUploading ? '#404048' : '#DB1931',
                color: pendingCount === 0 || isUploading ? '#71717a' : '#fff',
                cursor: pendingCount === 0 || isUploading ? 'not-allowed' : 'pointer',
                marginTop: '1rem'
              }}
            >
              {isUploading ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Processando Envios...
                </>
              ) : pendingCount > 0 ? (
                <>
                  <Upload size={24} />
                  Enviar {pendingCount} {pendingCount === 1 ? 'Arquivo' : 'Arquivos'}
                </>
              ) : (
                <>
                  <Check size={24} />
                  Tudo Enviado
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
