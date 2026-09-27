'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mic, Plus, Play, Pause, Trash2, Settings, Volume2 } from 'lucide-react';

interface Locutor {
  id: string;
  nome: string;
  voz: string;
  genero: string;
  idioma: string;
  ativo: boolean;
}

export default function LocutoresPage() {
  const [locutores, setLocutores] = useState<Locutor[]>([
    { id: '1', nome: 'Maria Profissional', voz: 'pt-BR-1', genero: 'Feminina', idioma: 'Português (BR)', ativo: true },
    { id: '2', nome: 'João Narrador', voz: 'pt-BR-2', genero: 'Masculino', idioma: 'Português (BR)', ativo: true },
    { id: '3', nome: 'Ana Amigável', voz: 'pt-BR-3', genero: 'Feminina', idioma: 'Português (BR)', ativo: false },
  ]);

  const [tocando, setTocando] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este locutor?')) {
      setLocutores(locutores.filter(l => l.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/configuracoes"
            className="p-2 rounded-lg transition-colors"
            style={{ background: '#404048', color: '#9ca3af' }}
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Locutores Virtuais</h1>
            <p style={{ color: '#9ca3af' }}>Gerencie suas vozes para TTS</p>
          </div>
        </div>
        <Link
          href="/chamadas/locutor-virtual"
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
          style={{ background: '#DB1931', color: '#fff' }}
        >
          <Plus size={18} />
          Novo Locutor
        </Link>
      </div>

      {/* Lista de Locutores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locutores.map((locutor) => (
          <div
            key={locutor.id}
            className="rounded-xl p-4 transition-all"
            style={{ background: '#1F2026', border: '1px solid #404048' }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#DB1931'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = '#404048'}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: locutor.genero === 'Feminina' ? '#ec4899' : '#3b82f6' }}
              >
                <Mic size={24} style={{ color: '#fff' }} />
              </div>
              <span
                className="px-2 py-1 rounded-full text-xs"
                style={{
                  background: locutor.ativo ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: locutor.ativo ? '#22c55e' : '#ef4444'
                }}
              >
                {locutor.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <h3 className="font-semibold mb-2">{locutor.nome}</h3>
            <div className="text-sm space-y-1 mb-4" style={{ color: '#9ca3af' }}>
              <p>Voz: {locutor.voz}</p>
              <p>Gênero: {locutor.genero}</p>
              <p>Idioma: {locutor.idioma}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTocando(tocando === locutor.id ? null : locutor.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors"
                style={{
                  background: tocando === locutor.id ? '#DB1931' : '#404048',
                  color: '#fff'
                }}
              >
                {tocando === locutor.id ? <Pause size={16} /> : <Play size={16} />}
                {tocando === locutor.id ? 'Parar' : 'Testar'}
              </button>
              <button
                onClick={() => handleDelete(locutor.id)}
                className="p-2 rounded-lg transition-colors"
                style={{ background: '#404048', color: '#9ca3af' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}