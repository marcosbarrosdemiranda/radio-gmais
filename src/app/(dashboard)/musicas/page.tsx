'use client';

import { useState, useEffect } from 'react';
import { Music, Play, Pause, Trash2, Search, FileAudio, Clock, HardDrive } from 'lucide-react';

interface AudioFile {
  id: string;
  titulo: string;
  artista: string;
  arquivo_url: string;
  genero: string;
  criado_em: string;
}

export default function MusicasPage() {
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [tocando, setTocando] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/upload?tipo=musicas');
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este arquivo?')) return;
    
    try {
      await fetch(`/api/upload?id=${id}`, { method: 'DELETE' });
      setFiles(files.filter(f => f.id !== id));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const filteredFiles = files.filter(file =>
    file.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    file.artista.toLowerCase().includes(busca.toLowerCase())
  );

  const formatDuration = (seconds: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Music size={28} style={{ color: '#DB1931' }} />
          <div>
            <h1 className="text-2xl font-bold">Biblioteca de Músicas</h1>
            <p style={{ color: '#9ca3af' }}>{files.length} arquivos de áudio</p>
          </div>
        </div>
      </div>

      {/* Busca */}
      <div
        className="flex items-center gap-2 rounded-lg px-3 py-2"
        style={{ background: '#1F2026', border: '1px solid #404048' }}
      >
        <Search size={18} style={{ color: '#71717a' }} />
        <input
          type="text"
          placeholder="Buscar músicas..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="bg-transparent border-none outline-none w-full"
          style={{ color: '#fff' }}
        />
      </div>

      {/* Lista de músicas */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full mx-auto" style={{ borderColor: '#DB1931', borderTopColor: 'transparent' }} />
          <p className="mt-4" style={{ color: '#9ca3af' }}>Carregando músicas...</p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <FileAudio size={48} style={{ color: '#404048' }} className="mx-auto mb-4" />
          <p style={{ color: '#71717a' }}>
            {busca ? 'Nenhuma música encontrada' : 'Nenhuma música cadastrada'}
          </p>
          <p style={{ color: '#52525b' }} className="text-sm mt-2">
            Faça upload de músicas na página de Upload
          </p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ background: '#1F2026', border: '1px solid #404048' }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #404048' }}>
                <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>#</th>
                <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Título</th>
                <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Artista</th>
                <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Duração</th>
                <th className="text-right px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file, index) => (
                <tr
                  key={file.id}
                  style={{ borderBottom: '1px solid #404048' }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(64, 64, 72, 0.3)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td className="px-4 py-3" style={{ color: '#71717a' }}>
                    {tocando === file.id ? (
                      <Pause size={16} style={{ color: '#DB1931' }} />
                    ) : (
                      <button
                        onClick={() => setTocando(tocando === file.id ? null : file.id)}
                        className="hover:opacity-80"
                      >
                        <Play size={16} style={{ color: '#9ca3af' }} />
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{file.titulo}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#9ca3af' }}>{file.artista}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#9ca3af' }}>
                    <Clock size={14} className="inline mr-1" />
                    {formatDuration(0)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: '#71717a' }}
                      onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                      onMouseOut={(e) => e.currentTarget.style.color = '#71717a'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}