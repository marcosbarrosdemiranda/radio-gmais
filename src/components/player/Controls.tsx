'use client';

import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Shuffle, Repeat } from 'lucide-react';
import { useState } from 'react';

interface ControlsProps {
  playing: boolean;
  onTogglePlay: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

export default function Controls({ playing, onTogglePlay, onPrevious, onNext }: ControlsProps) {
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShuffle(!shuffle)}
          className={`transition-colors ${shuffle ? 'text-green-500' : 'text-zinc-400 hover:text-white'}`}
        >
          <Shuffle size={20} />
        </button>
        <button
          onClick={onPrevious}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          <SkipBack size={20} />
        </button>
        <button
          onClick={onTogglePlay}
          className="bg-green-500 hover:bg-green-400 text-black rounded-full p-3 transition-colors"
        >
          {playing ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
        <button
          onClick={onNext}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          <SkipForward size={20} />
        </button>
        <button
          onClick={() => setRepeat(!repeat)}
          className={`transition-colors ${repeat ? 'text-green-500' : 'text-zinc-400 hover:text-white'}`}
        >
          <Repeat size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setMuted(!muted)}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={(e) => {
            setVolume(Number(e.target.value));
            setMuted(false);
          }}
          className="w-20 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
      </div>
    </div>
  );
}
