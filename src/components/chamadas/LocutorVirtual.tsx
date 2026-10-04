'use client';

import { useState } from 'react';
import { Mic, Play, Download, Loader2 } from 'lucide-react';

const voices = [
  { id: 'pt-BR-FranciscoNeural', nome: 'Francisco', genero: 'masculino', provedor: 'azure' },
  { id: 'pt-BR-AntonioNeural', nome: 'Antônio', genero: 'masculino', provedor: 'azure' },
  { id: 'pt-BR-FranciscaNeural', nome: 'Francisca', genero: 'feminino', provedor: 'azure' },
  { id: 'pt-BR-GiovannaNeural', nome: 'Giovanna', genero: 'feminino', provedor: 'azure' },
  { id: 'RXicbHjhMt8qkSMq7KsF', nome: 'Rafael', genero: 'masculino', provedor: 'elevenlabs' },
  { id: 'pNInz6obpgDQGcFmaJgB', nome: 'Adam', genero: 'masculino', provedor: 'elevenlabs' },
  { id: 'alloy', nome: 'VoiceStudio Padrão', genero: 'neutro', provedor: 'voicestudio' },
];

interface LocutorVirtualProps {
  onGenerate?: (audioUrl: string) => void;
}

export default function LocutorVirtual({ onGenerate }: LocutorVirtualProps) {
  const [texto, setTexto] = useState('');
  const [vozSelecionada, setVozSelecionada] = useState(voices[0].id);
  const [velocidade, setVelocidade] = useState(1.0);
  const [gerando, setGerando] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!texto.trim()) return;

    setGerando(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texto,
          vozId: vozSelecionada,
          velocidade,
        }),
      });

      const data = await response.json();
      if (data.audioUrl) {
        setAudioUrl(data.audioUrl);
        onGenerate?.(data.audioUrl);
      }
    } catch (error) {
      console.error('Erro ao gerar áudio:', error);
    } finally {
      setGerando(false);
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
      <div className="flex items-center gap-2 mb-6">
        <Mic className="text-green-500" size={24} />
        <h2 className="text-xl font-semibold">Locutor Virtual</h2>
      </div>

      {/* Text input */}
      <div className="mb-4">
        <label className="block text-sm text-zinc-400 mb-2">
          Texto da chamada
        </label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Digite o texto que o locutor irá falar..."
          className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 resize-none"
        />
        <p className="text-xs text-zinc-500 mt-1">
          {texto.split(/\s+/).filter(Boolean).length} palavras · ~{Math.ceil(texto.split(/\s+/).filter(Boolean).length / 150 * 60)}s estimados
        </p>
      </div>

      {/* Voice selector */}
      <div className="mb-4">
        <label className="block text-sm text-zinc-400 mb-2">
          Locutor/Voz
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {voices.map((voz) => (
            <button
              key={voz.id}
              onClick={() => setVozSelecionada(voz.id)}
              className={`p-3 rounded-lg border transition-all ${
                vozSelecionada === voz.id
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
              }`}
            >
              <p className="font-medium text-sm">{voz.nome}</p>
              <p className="text-xs text-zinc-500">
                {voz.genero} · {voz.provedor}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Speed control */}
      <div className="mb-6">
        <label className="block text-sm text-zinc-400 mb-2">
          Velocidade: {velocidade.toFixed(1)}x
        </label>
        <input
          type="range"
          min={0.5}
          max={2.0}
          step={0.1}
          value={velocidade}
          onChange={(e) => setVelocidade(Number(e.target.value))}
          className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleGenerate}
          disabled={!texto.trim() || gerando}
          className="flex-1 bg-green-500 hover:bg-green-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {gerando ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Mic size={20} />
              Gerar Chamada
            </>
          )}
        </button>

        {audioUrl && (
          <>
            <button
              onClick={() => new Audio(audioUrl).play()}
              className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-4 rounded-lg transition-colors"
            >
              <Play size={20} />
            </button>
            <a
              href={audioUrl}
              download
              className="bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center"
            >
              <Download size={20} />
            </a>
          </>
        )}
      </div>

      {/* Preview */}
      {audioUrl && (
        <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
          <p className="text-sm text-zinc-400 mb-2">Preview:</p>
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}
    </div>
  );
}
