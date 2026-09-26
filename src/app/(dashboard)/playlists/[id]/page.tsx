'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, Pause, Trash2, Edit, Clock, Music, GripVertical } from 'lucide-react';

interface MusicItem {
  id: string;
  titulo: string;
  artista: string;
  duracao: number;
}

export default function PlaylistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [playlist, setPlaylist] = useState<any>(null);
  const [musicas, setMusicas] = useState<MusicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tocando, setTocando] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/playlists/${id}`)
      .then(res => res.json())
      .then(data => {
        setPlaylist(data);
        setMusicas(data.musicas || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar playlist:', err);
        setLoading(false);
      });
  }, [id]);

  const handleTocar = () => {
    alert(`Iniciando reprodução da playlist: ${playlist?.nome}`);
    // Placeholder para o motor de áudio
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuracao = musicas.reduce((acc, m) => acc + (m.duracao || 0), 0);

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>;
  }

  if (!playlist) {
    return <div className="text-center py-12">Playlist não encontrada</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/playlists"
            className="p-2 rounded-lg transition-colors"
            style={{ background: '#404048', color: '#9ca3af' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
            onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{playlist.nome}</h1>
            <p style={{ color: '#9ca3af' }}>{playlist.descricao}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/playlists/${playlist.id}/editar`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
            style={{ background: '#404048', color: '#fff' }}
          >
            <Edit size={18} />
            Editar
          </Link>
          <button
            onClick={handleTocar}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
            style={{ background: '#DB1931', color: '#fff' }}
          >
            <Play size={18} />
            Tocar
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div
          className="rounded-xl p-4"
          style={{ background: '#1F2026', border: '1px solid #404048' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Music size={18} style={{ color: '#DB1931' }} />
            <span className="text-sm" style={{ color: '#9ca3af' }}>Músicas</span>
          </div>
          <p className="text-2xl font-bold">{musicas.length}</p>
        </div>
        <div
          className="rounded-xl p-4"
          style={{ background: '#1F2026', border: '1px solid #404048' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} style={{ color: '#3b82f6' }} />
            <span className="text-sm" style={{ color: '#9ca3af' }}>Duração</span>
          </div>
          <p className="text-2xl font-bold">{formatDuration(totalDuracao)}</p>
        </div>
        <div
          className="rounded-xl p-4"
          style={{ background: '#1F2026', border: '1px solid #404048' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: playlist.ativa ? '#22c55e' : '#ef4444' }}
            />
            <span className="text-sm" style={{ color: '#9ca3af' }}>Status</span>
          </div>
          <p className="text-2xl font-bold">{playlist.ativa ? 'Ativa' : 'Inativa'}</p>
        </div>
      </div>

      {/* Lista de Músicas */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#1F2026', border: '1px solid #404048' }}
      >
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid #404048' }}>
          <h3 className="font-semibold">Músicas</h3>
        </div>

        {musicas.length === 0 ? (
          <div className="text-center py-12">
            <Music size={48} style={{ color: '#404048' }} className="mx-auto mb-4" />
            <p style={{ color: '#71717a' }}>Nenhuma música nesta playlist</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #404048' }}>
                <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>#</th>
                <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Título</th>
                <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Artista</th>
                <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Duração</th>
              </tr>
            </thead>
            <tbody>
              {musicas.map((musica, index) => (
                <tr
                  key={musica.id}
                  style={{ borderBottom: '1px solid #404048' }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(64, 64, 72, 0.3)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <GripVertical size={16} style={{ color: '#52525b' }} />
                      <button
                        onClick={() => setTocando(tocando === musica.id ? null : musica.id)}
                        style={{ color: tocando === musica.id ? '#DB1931' : '#9ca3af' }}
                      >
                        {tocando === musica.id ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{musica.titulo}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#9ca3af' }}>{musica.artista}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#9ca3af' }}>
                    {formatDuration(musica.duracao)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
