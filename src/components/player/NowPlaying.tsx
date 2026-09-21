'use client';

import { Music, Mic, Radio } from 'lucide-react';

interface NowPlayingProps {
  titulo?: string;
  artista?: string;
  tipo?: 'musica' | 'chamada';
}

export default function NowPlaying({ titulo, artista, tipo = 'musica' }: NowPlayingProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center gap-2 text-zinc-400 mb-4">
        {tipo === 'chamada' ? (
          <Mic className="text-blue-500" size={20} />
        ) : (
          <Music className="text-green-500" size={20} />
        )}
        <span className="text-sm uppercase tracking-wide">
          {tipo === 'chamada' ? 'Chamada' : 'Tocando Agora'}
        </span>
      </div>

      <h2 className="text-3xl font-bold mb-2">
        {titulo || 'Nenhuma faixa'}
      </h2>
      {artista && (
        <p className="text-zinc-400 text-lg">{artista}</p>
      )}

      {/* Visualizer placeholder */}
      <div className="mt-4 flex items-end gap-1 h-12">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-green-500/30 rounded-t"
            style={{
              height: `${Math.random() * 100}%`,
              animationName: 'pulse',
              animationDuration: `${0.5 + Math.random() * 0.5}s`,
              animationIterationCount: 'infinite',
              animationDirection: 'alternate',
            }}
          />
        ))}
      </div>
    </div>
  );
}
