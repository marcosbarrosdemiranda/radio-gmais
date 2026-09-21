'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ListMusic, Plus, Play, Pause, Clock, Music, Trash2, Edit, Calendar, MoreVertical } from 'lucide-react';

interface Playlist {
  id: string;
  nome: string;
  descricao: string;
  total_musicas: number;
  duracao_total: number;
  criado_em: string;
  ativa: boolean;
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dados simulados
    setPlaylists([
      {
        id: '1',
        nome: 'Manhã Comercial',
        descricao: 'Músicas para o período da manhã',
        total_musicas: 45,
        duracao_total: 2700,
        criado_em: '2026-09-20',
        ativa: true,
      },
      {
        id: '2',
        nome: 'Tarde Relaxante',
        descricao: 'Músicas suaves para a tarde',
        total_musicas: 38,
        duracao_total: 2280,
        criado_em: '2026-09-19',
        ativa: true,
      },
      {
        id: '3',
        nome: 'Noite Especial',
        descricao: 'Músicas para o período noturno',
        total_musicas: 52,
        duracao_total: 3120,
        criado_em: '2026-09-18',
        ativa: false,
      },
      {
        id: '4',
        nome: 'Sábado Animado',
        descricao: 'Músicas animadas para sábados',
        total_musicas: 60,
        duracao_total: 3600,
        criado_em: '2026-09-17',
        ativa: true,
      },
    ]);
    setLoading(false);
  }, []);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins} min`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ListMusic size={28} style={{ color: '#DB1931' }} />
          <div>
            <h1 className="text-2xl font-bold">Playlists</h1>
            <p style={{ color: '#9ca3af' }}>Gerencie suas playlists de música</p>
          </div>
        </div>
        <Link
          href="/playlists/nova"
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
          style={{ background: '#DB1931', color: '#fff' }}
          onMouseOver={(e) => e.currentTarget.style.background = '#B21125'}
          onMouseOut={(e) => e.currentTarget.style.background = '#DB1931'}
        >
          <Plus size={18} />
          Nova Playlist
        </Link>
      </div>

      {/* Lista de Playlists */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full mx-auto" style={{ borderColor: '#DB1931', borderTopColor: 'transparent' }} />
          <p className="mt-4" style={{ color: '#9ca3af' }}>Carregando playlists...</p>
        </div>
      ) : playlists.length === 0 ? (
        <div className="text-center py-12">
          <ListMusic size={48} style={{ color: '#404048' }} className="mx-auto mb-4" />
          <p style={{ color: '#71717a' }}>Nenhuma playlist criada</p>
          <Link
            href="/playlists/nova"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg"
            style={{ background: '#DB1931', color: '#fff' }}
          >
            <Plus size={18} />
            Criar Primeira Playlist
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="rounded-xl overflow-hidden transition-all"
              style={{ background: '#1F2026', border: '1px solid #404048' }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = '#DB1931'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = '#404048'}
            >
              {/* Cover */}
              <div
                className="h-32 flex items-center justify-center relative"
                style={{ background: 'linear-gradient(135deg, #DB1931 0%, #B21125 100%)' }}
              >
                <ListMusic size={48} style={{ color: 'rgba(255,255,255,0.3)' }} />
                <div className="absolute top-2 right-2">
                  <span
                    className="px-2 py-1 rounded-full text-xs"
                    style={{
                      background: playlist.ativa ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: playlist.ativa ? '#22c55e' : '#ef4444'
                    }}
                  >
                    {playlist.ativa ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{playlist.nome}</h3>
                <p className="text-sm mb-3" style={{ color: '#9ca3af' }}>{playlist.descricao}</p>

                <div className="flex items-center gap-4 text-sm mb-4" style={{ color: '#9ca3af' }}>
                  <div className="flex items-center gap-1">
                    <Music size={14} />
                    <span>{playlist.total_musicas} músicas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{formatDuration(playlist.duracao_total)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors"
                    style={{ background: '#404048', color: '#fff' }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#DB1931';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#404048';
                    }}
                  >
                    <Play size={16} />
                    Tocar
                  </button>
                  <Link
                    href={`/playlists/${playlist.id}`}
                    className="p-2 rounded-lg transition-colors"
                    style={{ background: '#404048', color: '#9ca3af' }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
                  >
                    <Edit size={16} />
                  </Link>
                  <button
                    className="p-2 rounded-lg transition-colors"
                    style={{ background: '#404048', color: '#9ca3af' }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}