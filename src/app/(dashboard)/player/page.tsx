'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Radio, Repeat, Shuffle, Mic, Zap } from 'lucide-react';

interface Track {
  id: string;
  titulo: string;
  artista: string;
  arquivo_url: string;
  duracao: number;
}

export default function PlayerPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState<Track[]>([]);
  const [showChamada, setShowChamada] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const buscarProximaMusica = async () => {
    try {
      const res = await fetch('/api/player/proximo');
      if (res.ok) {
        const track = await res.json();
        setCurrentTrack(track);
        // Reseta o player e toca automaticamente
        if (audioRef.current) {
          audioRef.current.src = track.arquivo_url;
          audioRef.current.load();
          audioRef.current.play().then(() => setIsPlaying(true));
        }
      }
    } catch (err) {
      console.error('Erro ao buscar próxima música:', err);
    }
  };

  // Carrega a primeira ao iniciar
  useEffect(() => {
    buscarProximaMusica();
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play().then(() => setIsPlaying(true));
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    buscarProximaMusica(); // Pula para a próxima automaticamente
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setProgress(time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const triggerChamada = (tipo: string) => {
    setShowChamada(true);
    // Simular chamada
    setTimeout(() => setShowChamada(false), 5000);
  };

  return (
    <div className="space-y-6">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Radio size={28} style={{ color: '#DB1931' }} />
          <div>
            <h1 className="text-2xl font-bold">Player de Rádio</h1>
            <p style={{ color: '#9ca3af' }}>Controle principal do sistema</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ background: isPlaying ? '#22c55e' : '#ef4444' }}
          />
          <span className="text-sm" style={{ color: '#9ca3af' }}>
            {isPlaying ? 'Ao Vivo' : 'Parado'}
          </span>
        </div>
      </div>

      {/* Chamada Instantânea Overlay */}
      {showChamada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0, 0, 0, 0.9)' }}
        >
          <div className="text-center">
            <Mic size={64} style={{ color: '#DB1931' }} className="mx-auto mb-4 animate-pulse" />
            <h2 className="text-3xl font-bold mb-2">📢 Chamada Instantânea</h2>
            <p className="text-xl" style={{ color: '#9ca3af' }}>Tocando agora...</p>
            <div className="flex gap-1 justify-center mt-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 rounded-full animate-pulse"
                  style={{
                    background: '#DB1931',
                    height: `${20 + Math.random() * 20}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player Principal */}
        <div className="lg:col-span-2 space-y-4">
          {/* Now Playing */}
          <div
            className="rounded-xl p-6"
            style={{ background: '#1F2026', border: '1px solid #404048' }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-24 h-24 rounded-xl flex items-center justify-center"
                style={{ background: '#DB1931' }}
              >
                <Radio size={40} style={{ color: '#fff' }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#9ca3af' }}>Tocando Agora</p>
                <h2 className="text-xl font-bold">{currentTrack?.titulo || 'Nenhuma música selecionada'}</h2>
                <p style={{ color: '#9ca3af' }}>{currentTrack?.artista || 'Faça upload de músicas para começar'}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={progress}
                onChange={handleSeek}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #DB1931 ${(progress / (duration || 1)) * 100}%, #404048 ${(progress / (duration || 1)) * 100}%)` }}
              />
              <div className="flex justify-between text-sm" style={{ color: '#9ca3af' }}>
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                className="p-2 rounded-lg transition-colors"
                style={{ color: '#9ca3af' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                <Shuffle size={20} />
              </button>
              <button
                className="p-2 rounded-lg transition-colors"
                style={{ color: '#9ca3af' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                <SkipBack size={20} />
              </button>
              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-colors"
                style={{ background: '#DB1931', color: '#fff' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#B21125'}
                onMouseOut={(e) => e.currentTarget.style.background = '#DB1931'}
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
              </button>
              <button
                className="p-2 rounded-lg transition-colors"
                style={{ color: '#9ca3af' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                <SkipForward size={20} />
              </button>
              <button
                className="p-2 rounded-lg transition-colors"
                style={{ color: '#9ca3af' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                <Repeat size={20} />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setIsMuted(!isMuted)}
                style={{ color: '#9ca3af' }}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseInt(e.target.value));
                  setIsMuted(false);
                }}
                className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #DB1931 ${volume}%, #404048 ${volume}%)` }}
              />
              <span className="text-sm w-10 text-right" style={{ color: '#9ca3af' }}>{volume}%</span>
            </div>
          </div>

          {/* Quick Chamadas */}
          <div
            className="rounded-xl p-4"
            style={{ background: '#1F2026', border: '1px solid #404048' }}
          >
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Zap size={18} style={{ color: '#f59e0b' }} />
              Chamadas Rápidas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                'Bom Dia',
                'Boa Tarde',
                'Pão Quentinho',
                'Encerramento'
              ].map((chamada) => (
                <button
                  key={chamada}
                  onClick={() => triggerChamada(chamada)}
                  className="px-3 py-2 rounded-lg text-sm transition-colors"
                  style={{ background: '#404048', color: '#fff' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f59e0b';
                    e.currentTarget.style.color = '#000';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#404048';
                    e.currentTarget.style.color = '#fff';
                  }}
                >
                  {chamada}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Fila de Reprodução */}
        <div className="space-y-4">
          <div
            className="rounded-xl p-4"
            style={{ background: '#1F2026', border: '1px solid #404048' }}
          >
            <h3 className="font-semibold mb-3">🎵 Fila de Reprodução</h3>
            {queue.length === 0 ? (
              <div className="text-center py-8">
                <p style={{ color: '#71717a' }}>Nenhuma música na fila</p>
                <p style={{ color: '#52525b' }} className="text-sm mt-1">
                  Adicione músicas para começar
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {queue.map((track, index) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-3 p-2 rounded-lg"
                    style={{ background: '#282930' }}
                  >
                    <span style={{ color: '#71717a' }}>{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{track.titulo}</p>
                      <p className="text-xs truncate" style={{ color: '#9ca3af' }}>{track.artista}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div
            className="rounded-xl p-4"
            style={{ background: '#1F2026', border: '1px solid #404048' }}
          >
            <h3 className="font-semibold mb-3">📊 Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: '#9ca3af' }}>Status:</span>
                <span style={{ color: isPlaying ? '#22c55e' : '#ef4444' }}>
                  {isPlaying ? 'Tocando' : 'Parado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#9ca3af' }}>Na fila:</span>
                <span>{queue.length} músicas</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#9ca3af' }}>Volume:</span>
                <span>{isMuted ? 'Mudo' : `${volume}%`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}