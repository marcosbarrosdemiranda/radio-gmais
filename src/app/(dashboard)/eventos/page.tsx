'use client';

import { useState } from 'react';
import { Calendar, Clock, Plus, Trash2, Edit, Play, Pause, Repeat, Zap, Music, Mic } from 'lucide-react';

interface Evento {
  id: string;
  titulo: string;
  tipo: 'playlists' | 'chamadas' | 'jingles';
  horario: string;
  diasSemana: number[];
  ativo: boolean;
  audioId?: string;
  waitCurrent: boolean;
}

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([
    {
      id: '1',
      titulo: 'Play Automático Manhã',
      tipo: 'playlists',
      horario: '7:00',
      diasSemana: [1, 2, 3, 4, 5, 6, 7],
      ativo: true,
      waitCurrent: false,
    },
    {
      id: '2',
      titulo: 'Chamada Bom Dia',
      tipo: 'chamadas',
      horario: '8:00',
      diasSemana: [1, 2, 3, 4, 5, 6, 7],
      ativo: true,
      waitCurrent: true,
    },
    {
      id: '3',
      titulo: 'Jingle Intervalo',
      tipo: 'jingles',
      horario: '12:00',
      diasSemana: [1, 2, 3, 4, 5, 6, 7],
      ativo: true,
      waitCurrent: false,
    },
    {
      id: '4',
      titulo: 'Chamada Encerramento',
      tipo: 'chamadas',
      horario: '21:30',
      diasSemana: [1, 2, 3, 4, 5, 6, 7],
      ativo: true,
      waitCurrent: true,
    },
    {
      id: '5',
      titulo: 'Playlist Sábado',
      tipo: 'playlists',
      horario: '10:00',
      diasSemana: [7],
      ativo: false,
      waitCurrent: false,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);

  const tipoConfig = {
    playlists: { icon: Music, color: '#3b82f6', label: 'Playlist' },
    chamadas: { icon: Mic, color: '#f59e0b', label: 'Chamada' },
    jingles: { icon: Zap, color: '#22c55e', label: 'Jingle' },
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      setEventos(eventos.filter(e => e.id !== id));
    }
  };

  const toggleAtivo = (id: string) => {
    setEventos(eventos.map(e => 
      e.id === id ? { ...e, ativo: !e.ativo } : e
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar size={28} style={{ color: '#DB1931' }} />
          <div>
            <h1 className="text-2xl font-bold">Eventos Agendados</h1>
            <p style={{ color: '#9ca3af' }}>Programe suas chamadas e playlists</p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingEvento(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
          style={{ background: '#DB1931', color: '#fff' }}
          onMouseOver={(e) => e.currentTarget.style.background = '#B21125'}
          onMouseOut={(e) => e.currentTarget.style.background = '#DB1931'}
        >
          <Plus size={18} />
          Novo Evento
        </button>
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-6 text-sm">
        {Object.entries(tipoConfig).map(([tipo, config]) => (
          <div key={tipo} className="flex items-center gap-2">
            <config.icon size={16} style={{ color: config.color }} />
            <span style={{ color: '#9ca3af' }}>{config.label}</span>
          </div>
        ))}
      </div>

      {/* Lista de Eventos */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#1F2026', border: '1px solid #404048' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #404048' }}>
              <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Evento</th>
              <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Tipo</th>
              <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Horário</th>
              <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Dias</th>
              <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Aguardar</th>
              <th className="text-right px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((evento) => {
              const config = tipoConfig[evento.tipo];
              return (
                <tr
                  key={evento.id}
                  style={{ borderBottom: '1px solid #404048', opacity: evento.ativo ? 1 : 0.5 }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(64, 64, 72, 0.3)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleAtivo(evento.id)}
                      className="w-10 h-6 rounded-full relative transition-colors"
                      style={{ background: evento.ativo ? '#22c55e' : '#404048' }}
                    >
                      <div
                        className="w-4 h-4 rounded-full bg-white absolute top-1 transition-transform"
                        style={{ left: evento.ativo ? '22px' : '4px' }}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 font-medium">{evento.titulo}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <config.icon size={16} style={{ color: config.color }} />
                      <span className="text-sm">{config.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock size={14} style={{ color: '#9ca3af' }} />
                      <span className="font-mono">{evento.horario}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {diasSemana.map((dia, index) => (
                        <span
                          key={index}
                          className="w-7 h-7 rounded flex items-center justify-center text-xs"
                          style={{
                            background: evento.diasSemana.includes(index + 1) ? '#DB1931' : '#404048',
                            color: evento.diasSemana.includes(index + 1) ? '#fff' : '#71717a'
                          }}
                        >
                          {dia}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        background: evento.waitCurrent ? 'rgba(245, 158, 11, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                        color: evento.waitCurrent ? '#f59e0b' : '#6b7280'
                      }}
                    >
                      {evento.waitCurrent ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingEvento(evento);
                          setShowModal(true);
                        }}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: '#9ca3af' }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(evento.id)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: '#9ca3af' }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal de Novo Evento */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-xl p-6"
            style={{ background: '#1F2026', border: '1px solid #404048' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              {editingEvento ? 'Editar Evento' : 'Novo Evento'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>Título</label>
                <input
                  type="text"
                  defaultValue={editingEvento?.titulo || ''}
                  placeholder="Ex: Play Automático Manhã"
                  className="w-full rounded-lg px-4 py-2 outline-none"
                  style={{ background: '#282930', border: '1px solid #404048', color: '#fff' }}
                />
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>Tipo</label>
                <div className="flex gap-2">
                  {Object.entries(tipoConfig).map(([tipo, config]) => (
                    <button
                      key={tipo}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors"
                      style={{
                        background: editingEvento?.tipo === tipo ? config.color : '#282930',
                        border: `1px solid ${editingEvento?.tipo === tipo ? config.color : '#404048'}`,
                        color: editingEvento?.tipo === tipo ? '#fff' : '#9ca3af'
                      }}
                    >
                      <config.icon size={16} />
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>Horário</label>
                <input
                  type="time"
                  defaultValue={editingEvento?.horario || '08:00'}
                  className="w-full rounded-lg px-4 py-2 outline-none"
                  style={{ background: '#282930', border: '1px solid #404048', color: '#fff' }}
                />
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>Dias da Semana</label>
                <div className="flex gap-2">
                  {diasSemana.map((dia, index) => (
                    <button
                      key={index}
                      className="flex-1 py-2 rounded-lg text-sm transition-colors"
                      style={{
                        background: editingEvento?.diasSemana.includes(index + 1) ? '#DB1931' : '#282930',
                        border: `1px solid ${editingEvento?.diasSemana.includes(index + 1) ? '#DB1931' : '#404048'}`,
                        color: editingEvento?.diasSemana.includes(index + 1) ? '#fff' : '#9ca3af'
                      }}
                    >
                      {dia}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked={editingEvento?.waitCurrent}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: '#DB1931' }}
                />
                <label className="text-sm" style={{ color: '#9ca3af' }}>
                  Aguardar áudio atual terminar
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-lg transition-colors"
                style={{ background: '#404048', color: '#fff' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-lg transition-colors"
                style={{ background: '#DB1931', color: '#fff' }}
              >
                {editingEvento ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}