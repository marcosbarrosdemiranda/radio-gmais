'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
  const [activeProgram, setActiveProgram] = useState<any>(null);
  const [showChamada, setShowChamada] = useState(false);
  const [noProgram, setNoProgram] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  // Refs para acessar state atualizado dentro de callbacks sem closure stale
  const queueRef = useRef<Track[]>([]);
  const currentTrackRef = useRef<Track | null>(null);
  const isFetchingRef = useRef(false);

  // Mantém os refs sincronizados com o state
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { currentTrackRef.current = currentTrack; }, [currentTrack]);

  const fetchGradeAtiva = async () => {
    try {
      const res = await fetch('/api/programacao/ativa');
      if (res.ok) {
        const data = await res.json();
        setActiveProgram(data.grade);
        setNoProgram(false);
      } else {
        setActiveProgram(null);
        setNoProgram(true);
      }
    } catch (err) {
      console.error('Erro ao buscar grade ativa:', err);
      setActiveProgram(null);
    }
  };

  // Busca mais músicas e ADICIONA ao final da fila (não substitui)
  const reabastecerFila = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const res = await fetch('/api/player/fila');
      if (!res.ok) return;
      const data = await res.json();

      if (data.noProgram) {
        setNoProgram(true);
        setQueue([]);
        setCurrentTrack(null);
        return;
      }

      if (!Array.isArray(data) || data.length === 0) return;

      setNoProgram(false);

      // Se não tem música tocando, começa a tocar a primeira
      if (!currentTrackRef.current) {
        const [primeira, ...resto] = data;
        setCurrentTrack(primeira);
        currentTrackRef.current = primeira;
        setQueue(resto);
        queueRef.current = resto;
        if (audioRef.current) {
          audioRef.current.src = primeira.arquivo_url;
          audioRef.current.load();
          audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
        }
      } else {
        // Já tem música tocando: só adiciona ao final da fila
        setQueue(prev => {
          const novaFila = [...prev, ...data];
          queueRef.current = novaFila;
          return novaFila;
        });
      }
    } catch (err) {
      console.error('Erro ao buscar fila:', err);
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  // Inicialização
  useEffect(() => {
    fetchGradeAtiva();
    reabastecerFila();
  }, [reabastecerFila]);

  // Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const tocarProxima = useCallback(() => {
    const filaAtual = queueRef.current;

    if (filaAtual.length === 0) {
      // Fila vazia: busca mais e aguarda
      reabastecerFila();
      setCurrentTrack(null);
      currentTrackRef.current = null;
      setIsPlaying(false);
      return;
    }

    const [proxima, ...resto] = filaAtual;
    setCurrentTrack(proxima);
    currentTrackRef.current = proxima;
    setQueue(resto);
    queueRef.current = resto;

    if (audioRef.current) {
      audioRef.current.src = proxima.arquivo_url;
      audioRef.current.load();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }

    // Se a fila ficou com menos de 3 músicas, reabastece em background
    if (resto.length < 3) {
      reabastecerFila();
    }
  }, [reabastecerFila]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    tocarProxima();
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
            <p style={{ color: '#9ca3af' }}>{activeProgram ? `Grade: ${activeProgram.nome}` : 'Nenhuma grade ativa'}</p>
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
                onClick={tocarProxima}
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
            {noProgram ? (
              <div className="text-center py-8">
                <p style={{ color: '#71717a' }}>Nenhuma programação ativa</p>
                <div className="mt-4">
                  <p className="text-sm mb-2" style={{ color: '#9ca3af' }}>Deseja configurar uma nova programação?</p>
                  <a href="/programacao" className="text-sm font-bold" style={{ color: '#DB1931' }}>Ir para Cadastro de Programação</a>
                </div>
              </div>
            ) : queue.length === 0 ? (
              <div className="text-center py-8">
                <p style={{ color: '#71717a' }}>Carregando fila...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {queue.map((track, index) => (
                  <div
                    key={`${track.id}-${index}`}
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
