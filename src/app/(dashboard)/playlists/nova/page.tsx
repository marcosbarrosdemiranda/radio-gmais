'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Music, Plus, X, GripVertical, Clock, Shuffle } from 'lucide-react';

interface MusicItem {
  id: string;
  titulo: string;
  artista: string;
  duracao: number;
}

export default function NovaPlaylistPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [musicas, setMusicas] = useState<MusicItem[]>([]);
  const [busca, setBusca] = useState('');
  const [musicasDisponiveis, setMusicasDisponiveis] = useState<MusicItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/musicas')
      .then(res => res.json())
      .then(data => {
        setMusicasDisponiveis(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar músicas:', err);
        setLoading(false);
      });
  }, []);

  const adicionarMusica = (musica: MusicItem) => {
    if (!musicas.find(m => m.id === musica.id)) {
      setMusicas([...musicas, musica]);
    }
  };

  const removerMusica = (id: string) => {
    setMusicas(musicas.filter(m => m.id !== id));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuracao = musicas.reduce((acc, m) => acc + m.duracao, 0);

  const salvarPlaylist = async () => {
    if (!nome) {
      alert('Nome é obrigatório');
      return;
    }

    try {
      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          descricao,
          musicas,
          intervaloChamadas: 15 // Default
        }),
      });

      if (response.ok) {
        router.push('/playlists');
        router.refresh();
      } else {
        alert('Erro ao salvar playlist');
      }
    } catch (error) {
      console.error('Erro ao salvar playlist:', error);
      alert('Erro ao salvar playlist');
    }
  };

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
            <h1 className="text-2xl font-bold">Nova Playlist</h1>
            <p style={{ color: '#9ca3af' }}>Crie uma nova playlist de música</p>
          </div>
        </div>
        <button
          onClick={salvarPlaylist}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
          style={{ background: '#22c55e', color: '#fff' }}
          onMouseOver={(e) => e.currentTarget.style.background = '#16a34a'}
          onMouseOut={(e) => e.currentTarget.style.background = '#22c55e'}
        >
          <Save size={18} />
          Salvar Playlist
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações da Playlist */}
        <div className="space-y-4">
          <div
            className="rounded-xl p-4"
            style={{ background: '#1F2026', border: '1px solid #404048' }}
          >
            <h3 className="font-semibold mb-4">📝 Informações</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>Nome *</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Manhã Comercial"
                  className="w-full rounded-lg px-4 py-2 outline-none"
                  style={{ background: '#282930', border: '1px solid #404048', color: '#fff' }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>Descrição</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva o objetivo desta playlist..."
                  rows={3}
                  className="w-full rounded-lg px-4 py-2 outline-none resize-none"
                  style={{ background: '#282930', border: '1px solid #404048', color: '#fff' }}
                />
              </div>
            </div>
          </div>

          {/* Músicas Disponíveis */}
          <div
            className="rounded-xl p-4"
            style={{ background: '#1F2026', border: '1px solid #404048' }}
          >
            <h3 className="font-semibold mb-4">🎵 Músicas Disponíveis</h3>
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2 mb-3"
              style={{ background: '#282930', border: '1px solid #404048' }}
            >
              <input
                type="text"
                placeholder="Buscar músicas..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-sm"
                style={{ color: '#fff' }}
              />
            </div>

            {loading ? (
              <p className="text-sm p-4 text-center" style={{ color: '#9ca3af' }}>Carregando...</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {musicasDisponiveis
                  .filter(m => m.titulo.toLowerCase().includes(busca.toLowerCase()))
                  .map((musica) => (
                    <div
                      key={musica.id}
                      className="flex items-center gap-3 p-2 rounded-lg"
                      style={{ background: '#282930' }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{musica.titulo}</p>
                        <p className="text-xs truncate" style={{ color: '#9ca3af' }}>{musica.artista}</p>
                      </div>
                      <span className="text-xs" style={{ color: '#9ca3af' }}>
                        {formatDuration(musica.duracao)}
                      </span>
                      <button
                        onClick={() => adicionarMusica(musica)}
                        className="p-1 rounded transition-colors"
                        style={{ color: '#22c55e' }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Playlist Atual */}
        <div className="space-y-4">
          <div
            className="rounded-xl p-4"
            style={{ background: '#1F2026', border: '1px solid #404048' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">🎶 Playlist</h3>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#9ca3af' }}>
                <span>{musicas.length} músicas</span>
                <span>•</span>
                <span>{formatDuration(totalDuracao)}</span>
              </div>
            </div>

            {musicas.length === 0 ? (
              <div className="text-center py-8">
                <Music size={48} style={{ color: '#404048' }} className="mx-auto mb-4" />
                <p style={{ color: '#71717a' }}>Nenhuma música adicionada</p>
                <p style={{ color: '#52525b' }} className="text-sm mt-1">
                  Adicione músicas da lista ao lado
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {musicas.map((musica, index) => (
                  <div
                    key={musica.id}
                    className="flex items-center gap-3 p-2 rounded-lg"
                    style={{ background: '#282930' }}
                  >
                    <span className="text-sm w-6 text-center" style={{ color: '#71717a' }}>
                      {index + 1}
                    </span>
                    <GripVertical size={16} style={{ color: '#52525b' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{musica.titulo}</p>
                      <p className="text-xs truncate" style={{ color: '#9ca3af' }}>{musica.artista}</p>
                    </div>
                    <span className="text-xs" style={{ color: '#9ca3af' }}>
                      {formatDuration(musica.duracao)}
                    </span>
                    <button
                      onClick={() => removerMusica(musica.id)}
                      className="p-1 rounded transition-colors"
                      style={{ color: '#ef4444' }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
