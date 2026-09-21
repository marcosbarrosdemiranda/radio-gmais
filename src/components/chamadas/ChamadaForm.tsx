'use client';

import { useState } from 'react';
import { Mic, Calendar, Users, Zap, ParkingCircle, Bus } from 'lucide-react';
import Input from '@/components/ui/Input';

interface ChamadaFormProps {
  initialData?: {
    titulo?: string;
    texto?: string;
    tipo?: string;
    vozId?: string;
  };
  onSubmit?: (data: any) => void;
}

const tipos = [
  { id: 'locutor-virtual', label: 'Locutor Virtual', icon: Mic, color: 'text-green-500' },
  { id: 'aniversario', label: 'Aniversário', icon: Calendar, color: 'text-pink-500' },
  { id: 'funcionario', label: 'Funcionário', icon: Users, color: 'text-blue-500' },
  { id: 'instantanea', label: 'Instantânea', icon: Zap, color: 'text-yellow-500' },
  { id: 'estacionamento', label: 'Estacionamento', icon: ParkingCircle, color: 'text-purple-500' },
];

export default function ChamadaForm({ initialData, onSubmit }: ChamadaFormProps) {
  const [titulo, setTitulo] = useState(initialData?.titulo || '');
  const [texto, setTexto] = useState(initialData?.texto || '');
  const [tipo, setTipo] = useState(initialData?.tipo || 'locutor-virtual');
  const [vozId, setVozId] = useState(initialData?.vozId || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ titulo, texto, tipo, vozId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Ex: Promoção Semanal"
        required
      />

      <div className="space-y-1">
        <label className="block text-sm text-zinc-400">Tipo de Chamada</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {tipos.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTipo(t.id)}
              className={`p-3 rounded-lg border transition-all text-left ${
                tipo === t.id
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <t.icon size={18} className={t.color} />
                <span className="text-sm">{t.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm text-zinc-400">Texto da Chamada</label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Digite o texto que será falado..."
          rows={4}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
          required
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-green-500 hover:bg-green-400 text-black font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Salvar Chamada
        </button>
        <button
          type="button"
          className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Gerar Áudio
        </button>
      </div>
    </form>
  );
}
