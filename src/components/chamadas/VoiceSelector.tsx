'use client';

import { Mic } from 'lucide-react';

const voices = [
  { id: 'pt-BR-FranciscoNeural', nome: 'Francisco', genero: 'masculino', provedor: 'azure' },
  { id: 'pt-BR-AntonioNeural', nome: 'Antônio', genero: 'masculino', provedor: 'azure' },
  { id: 'pt-BR-FranciscaNeural', nome: 'Francisca', genero: 'feminino', provedor: 'azure' },
  { id: 'pt-BR-GiovannaNeural', nome: 'Giovanna', genero: 'feminino', provedor: 'azure' },
  { id: 'RXicbHjhMt8qkSMq7KsF', nome: 'Rafael', genero: 'masculino', provedor: 'elevenlabs' },
  { id: 'pNInz6obpgDQGcFmaJgB', nome: 'Adam', genero: 'masculino', provedor: 'elevenlabs' },
];

interface VoiceSelectorProps {
  selectedVoice: string;
  onSelect: (voiceId: string) => void;
}

export default function VoiceSelector({ selectedVoice, onSelect }: VoiceSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm text-zinc-400 flex items-center gap-2">
        <Mic size={16} />
        Locutor/Voz
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {voices.map((voz) => (
          <button
            key={voz.id}
            type="button"
            onClick={() => onSelect(voz.id)}
            className={`p-3 rounded-lg border transition-all text-left ${
              selectedVoice === voz.id
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
  );
}
