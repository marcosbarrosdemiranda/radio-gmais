'use client';

import { useState } from 'react';
import { History, Music, Mic, Play, Calendar, Clock, Filter, Download } from 'lucide-react';

interface HistoricoItem {
  id: string;
  tipo: 'musica' | 'chamada' | 'jingle';
  titulo: string;
  artista?: string;
  data: string;
  hora: string;
  duracao: number;
}

export default function HistoricoPage() {
  const [filtro, setFiltro] = useState<'todos' | 'musica' | 'chamada' | 'jingle'>('todos');
  const [historico] = useState<HistoricoItem[]>([
    { id: '1', tipo: 'musica', titulo: 'Música Exemplo 1', artista: 'Artista 1', data: '2026-09-20', hora: '14:30', duracao: 240 },
    { id: '2', tipo: 'chamada', titulo: 'Bom Dia a Todos', data: '2026-09-20', hora: '08:00', duracao: 5 },
    { id: '3', tipo: 'jingle', titulo: 'Jingle Radio Gmais', data: '2026-09-20', hora: '07:55', duracao: 15 },
    { id: '4', tipo: 'musica', titulo: 'Música Exemplo 2', artista: 'Artista 2', data: '2026-09-20', hora: '14:26', duracao: 180 },
    { id: '5', tipo: 'chamada', titulo: 'Pão Quentinho Acabou de Sair', data: '2026-09-20', hora: '10:15', duracao: 8 },
    { id: '6', tipo: 'musica', titulo: 'Música Exemplo 3', artista: 'Artista 3', data: '2026-09-20', hora: '14:23', duracao: 300 },
    { id: '7', tipo: 'jingle', titulo: 'Jingle Intervalo', data: '2026-09-20', hora: '12:00', duracao: 10 },
    { id: '8', tipo: 'musica', titulo: 'Música Exemplo 4', artista: 'Artista 4', data: '2026-09-19', hora: '18:30', duracao: 210 },
  ]);

  const tipoConfig = {
    musica: { icon: Music, color: '#DB1931', label: 'Música' },
    chamada: { icon: Mic, color: '#f59e0b', label: 'Chamada' },
    jingle: { icon: Play, color: '#22c55e', label: 'Jingle' },
  };

  const historicoFiltrado = historico.filter(item => 
    filtro === 'todos' || item.tipo === filtro
  );

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History size={28} style={{ color: '#DB1931' }} />
          <div>
            <h1 className="text-2xl font-bold">Histórico de Reprodução</h1>
            <p style={{ color: '#9ca3af' }}>Veja o que foi reproduzido</p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          style={{ background: '#404048', color: '#fff' }}
        >
          <Download size={18} />
          Exportar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2">
        <Filter size={18} style={{ color: '#9ca3af' }} />
        <div className="flex gap-2">
          {[
            { value: 'todos', label: 'Todos' },
            { value: 'musica', label: 'Músicas' },
            { value: 'chamada', label: 'Chamadas' },
            { value: 'jingle', label: 'Jingles' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFiltro(item.value as any)}
              className="px-3 py-1 rounded-lg text-sm transition-colors"
              style={{
                background: filtro === item.value ? '#DB1931' : '#1F2026',
                color: filtro === item.value ? '#fff' : '#9ca3af',
                border: `1px solid ${filtro === item.value ? '#DB1931' : '#404048'}`
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#1F2026', border: '1px solid #404048' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #404048' }}>
              <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Tipo</th>
              <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Título</th>
              <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Data</th>
              <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Hora</th>
              <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Duração</th>
            </tr>
          </thead>
          <tbody>
            {historicoFiltrado.map((item) => {
              const config = tipoConfig[item.tipo];
              return (
                <tr
                  key={item.id}
                  style={{ borderBottom: '1px solid #404048' }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(64, 64, 72, 0.3)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <config.icon size={16} style={{ color: config.color }} />
                      <span className="text-sm">{config.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{item.titulo}</p>
                    {item.artista && (
                      <p className="text-xs" style={{ color: '#9ca3af' }}>{item.artista}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#9ca3af' }}>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {item.data}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#9ca3af' }}>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {item.hora}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#9ca3af' }}>
                    {formatDuration(item.duracao)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}