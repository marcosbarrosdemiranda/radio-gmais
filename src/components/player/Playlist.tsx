'use client';

import { Music, Mic } from 'lucide-react';

interface QueueItem {
  type: 'musica' | 'chamada';
  titulo: string;
  artista?: string;
}

interface PlaylistProps {
  items: QueueItem[];
  currentIndex: number;
  onSelect?: (index: number) => void;
}

export default function Playlist({ items, currentIndex, onSelect }: PlaylistProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
        <Music size={18} className="text-zinc-400" />
        <h3 className="font-semibold">Playlist</h3>
        <span className="text-sm text-zinc-500 ml-auto">{items.length} faixas</span>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelect?.(index)}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/50 transition-colors text-left ${
              index === currentIndex ? 'bg-green-500/10 border-l-2 border-green-500' : ''
            }`}
          >
            <span className="w-6 text-center text-sm text-zinc-500">
              {index === currentIndex ? '▶' : index + 1}
            </span>
            {item.type === 'chamada' ? (
              <Mic size={16} className="text-blue-500 flex-shrink-0" />
            ) : (
              <Music size={16} className="text-green-500 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="font-medium truncate">{item.titulo}</p>
              {item.artista && (
                <p className="text-sm text-zinc-500 truncate">{item.artista}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
