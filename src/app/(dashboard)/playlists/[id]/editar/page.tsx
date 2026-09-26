'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Music, Plus, X, GripVertical, Clock } from 'lucide-react';

interface MusicItem {
  id: string;
  titulo: string;
  artista: string;
  duracao: number;
}

export default function EditarPlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [musicas, setMusicas] = useState<MusicItem[]>([]);
  const [busca, setBusca] = useState('');
  const [musicasDisponiveis, setMusicasDisponiveis] = useState<MusicItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [playlistRes, musicasRes] = await Promise.all([
          fetch(`/api/playlists/${id}`),
          fetch('/api/musicas')
        ]);

        const playlistData = await playlistRes.json();
        const musicasData = await musicasRes.json();

        setNome(playlistData.nome);
        setDescricao(playlistData.descricao);
        setMusicas(playlistData.musicas || []);
        setMusicasDisponiveis(musicasData);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setLoading(false);
      }
    };
    carregarDados();
  }, [id]);

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
      const response = await fetch(`/api/playlists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          descricao,
          musicas,
        }),
      });

      if (response.ok) {
        router.push(`/playlists/${id}`);
        router.refresh();
      } else {
        alert('Erro ao atualizar playlist');
      }
    } catch (error) {
      console.error('Erro ao atualizar playlist:', error);
      alert('Erro ao atualizar playlist');
    }
  };

  if (loading) return <div className="text-center py-12">Carregando...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/playlists/${id}`}
            className="p-2 rounded-lg transition-colors"
            style={{ background: '#404048', color: '#9ca3af' }}
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Editar Playlist</h1>
            <p style={{ color: '#9ca3af' }}>Edite a playlist e suas músicas</p>
          </div>
        </div>
        <button
          onClick={salvarPlaylist}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
          style={{ background: '#22c55e', color: '#fff' }}
        >
          <Save size={18} />
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações */}
        <div className="space-y-4">
          <div className="rounded-xl p-4" style={{ background: '#1F2026', border: '1px solid #404048' }}>
            <h3 className="font-semibold mb-4">📝 Informações</h3>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-lg px-4 py-2 mb-3"
              style={{ background: '#282930', border: '1px solid #404048', color: '#fff' }}
            />
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              className="w-full rounded-lg px-4 py-2"
              style={{ background: '#282930', border: '1px solid #404048', color: '#fff' }}
            />
          </div>

          {/* Músicas Disponíveis */}
          <div className="rounded-xl p-4" style={{ background: '#1F2026', border: '1px solid #404048' }}>
            <h3 className="font-semibold mb-4">🎵 Músicas Disponíveis</h3>
             <input
              type="text"
              placeholder="Buscar músicas..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-lg px-4 py-2 mb-3"
              style={{ background: '#282930', border: '1px solid #404048', color: '#fff' }}
            />
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {musicasDisponiveis
                .filter(m => m.titulo.toLowerCase().includes(busca.toLowerCase()))
                .map((musica) => (
                  <div key={musica.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: '#282930' }}>
                    <div className="flex-1">
                      <p className="text-sm">{musica.titulo}</p>
                    </div>
                    <button onClick={() => adicionarMusica(musica)} className="text-green-500">
                      <Plus size={16} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Playlist Atual */}
        <div className="space-y-4">
          <div className="rounded-xl p-4" style={{ background: '#1F2026', border: '1px solid #404048' }}>
            <h3 className="font-semibold mb-4">🎶 Músicas na Playlist ({musicas.length})</h3>
            <div className="space-y-2">
              {musicas.map((musica, index) => (
                <div key={`${musica.id}-${index}`} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: '#282930' }}>
                  <GripVertical size={16} />
                  <span className="text-sm flex-1">{musica.titulo}</span>
                  <button onClick={() => removerMusica(musica.id)} className="text-red-500">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
