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

interface Chamada {
  id: string;
  titulo: string;
  arquivo: string;
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
  const [chamadas, setChamadas] = useState<Chamada[]>([]);
  const [tocandoChamada, setTocandoChamada] = useState<string | null>(null);
  const [noProgram, setNoProgram] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const audioRef = useRef<HTMLAudioElement>(null);
  const chamadaRef = useRef<HTMLAudioElement>(null);
  const queueRef = useRef<Track[]>([]);
  const currentTrackRef = useRef<Track | null>(null);
  const isFetchingRef = useRef(false);

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

  const fetchChamadas = async () => {
    try {
      const res = await fetch('/api/chamadas/instantaneas');
      if (res.ok) {
        const data = await res.json();
        setChamadas(data);
      }
    } catch (err) {
      console.error('Erro ao buscar chamadas:', err);
    }
  };

  const reabastecerFila = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const res = await fetch('/api/player/fila');
      if (!res.ok) return;
      const data = await res.json();

      if (data.noProgram) {
        setNoProgram(true);
        setStatusMsg(data.message || 'Nenhuma programação');
        setQueue([]);
        setCurrentTrack(null);
        return;
      }

      if (!Array.isArray(data) || data.length === 0) return;

      setNoProgram(false);

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

  const [filialId, setFilialId] = useState<string | null>(null);
  const [modo, setModo] = useState<'uniloja' | 'multi-filial'>('multi-filial');

  useEffect(() => {
    fetch('/api/config/modo')
      .then(res => res.json())
      .then(data => setModo(data.modo));

    // TODO: pegar filial ID da URL ou localStorage
    setFilialId('filial-01');
  }, []);

  useEffect(() => {
    if (!filialId && modo === 'multi-filial') return;

    const endpoint = modo === 'uniloja'
        ? '/api/uniloja/check-comando'
        : `/api/filial/check-comando?filialId=${filialId}`;

    const interval = setInterval(async () => {
        try {
            const res = await fetch(endpoint);
            const data = await res.json();

            if (data.comando) {
                const { acao, valor } = data.comando;
                console.log('Executando comando:', acao, valor);

                if (acao === 'play') audioRef.current?.play().then(() => setIsPlaying(true));
                if (acao === 'pause') { audioRef.current?.pause(); setIsPlaying(false); }
                if (acao === 'volume' && audioRef.current) {
                    setVolume(valor);
                    audioRef.current.volume = valor / 100;
                }
            }
        } catch (err) {
            console.error('Erro ao verificar comando:', err);
        }
    }, 5000); // Polling a cada 5 segundos

    // Polling para status (monitoramento)
    const statusInterval = setInterval(async () => {
        try {
            await fetch('/api/monitor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filialId: FILIAL_ID,
                    status: isPlaying ? 'online - tocando' : 'online - parado',
                    message: currentTrack ? `Tocando: ${currentTrack.titulo}` : 'Sem música'
                })
            });
        } catch (err) {
            console.error('Erro ao enviar monitoramento:', err);
        }
    }, 30000); // Polling de status a cada 30 segundos

    return () => {
        clearInterval(interval);
        clearInterval(statusInterval);
    };
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
    if (chamadaRef.current) {
      chamadaRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const tocarProxima = useCallback(() => {
    const filaAtual = queueRef.current;

    if (filaAtual.length === 0) {
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
    if (currentTrack) {
        fetch('/api/historico', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tipo: (currentTrack as any).tipo || 'musica',
                referencia_id: currentTrack.id,
                titulo: currentTrack.titulo,
                duracao: currentTrack.duracao
            })
        }).catch(console.error);
    }
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

  const playChamada = async (chamada: Chamada) => {
      if (!chamadaRef.current || !audioRef.current) return;

      setTocandoChamada(chamada.id);

      // Baixa volume da música
      const musicVolume = audioRef.current.volume;
      audioRef.current.volume = musicVolume * 0.2;

      chamadaRef.current.src = chamada.arquivo;
      chamadaRef.current.load();
      await chamadaRef.current.play();

      chamadaRef.current.onended = () => {
          // Restaura volume
          if (audioRef.current) audioRef.current.volume = musicVolume;
          setTocandoChamada(null);
      };
  };

  return (
    <div className="space-y-6">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      <audio ref={chamadaRef} />

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
            style={{ background: isPlaying || tocandoChamada ? '#22c55e' : '#ef4444' }}
          />
          <span className="text-sm" style={{ color: '#9ca3af' }}>
            {isPlaying || tocandoChamada ? 'Ao Vivo' : 'Parado'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
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
                <p style={{ color: '#9ca3af' }}>{currentTrack?.artista || '...'}</p>
                {tocandoChamada && <p className="text-sm font-bold" style={{ color: '#f59e0b' }}>📢 Tocando Chamada!</p>}
              </div>
            </div>

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

            <div className="flex items-center justify-center gap-4 mt-4">
              <button onClick={togglePlay} className="w-16 h-16 rounded-full flex items-center justify-center transition-colors" style={{ background: '#DB1931', color: '#fff' }}>
                {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
              </button>
              <button onClick={tocarProxima} className="p-2 text-gray-400 hover:text-white"><SkipForward size={20} /></button>
            </div>

            <div className="flex items-center gap-3 mt-6">
                <button onClick={() => setIsMuted(!isMuted)} style={{ color: '#9ca3af' }}>
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input type="range" min="0" max="100" value={isMuted ? 0 : volume} onChange={(e) => {setVolume(parseInt(e.target.value)); setIsMuted(false); }} className="flex-1 h-2 rounded-full appearance-none cursor-pointer" style={{ background: `linear-gradient(to right, #DB1931 ${volume}%, #404048 ${volume}%)` }} />
            </div>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ background: '#1F2026', border: '1px solid #404048' }}
          >
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Zap size={18} style={{ color: '#f59e0b' }} />
              Chamadas Rápidas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {chamadas.map((chamada) => (
                <button
                  key={chamada.id}
                  onClick={() => playChamada(chamada)}
                  className="px-3 py-2 rounded-lg text-sm transition-colors"
                  style={{ background: tocandoChamada === chamada.id ? '#f59e0b' : '#404048', color: tocandoChamada === chamada.id ? '#000' : '#fff' }}
                >
                  {chamada.titulo}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl p-4" style={{ background: '#1F2026', border: '1px solid #404048' }}>
            <h3 className="font-semibold mb-3">🎵 Fila de Reprodução</h3>
            {noProgram ? (<p className="text-amber-500">{statusMsg}</p>) : queue.length === 0 ? <p>Carregando...</p> : (
              <div className="space-y-2">
                {queue.map((t, i) => <div key={i} className="text-sm truncate">{t.titulo}</div>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
