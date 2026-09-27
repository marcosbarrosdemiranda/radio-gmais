'use client';

import { useState, useEffect } from 'react';
import { Plus, GripVertical, Settings, Music, Mic, Folder, Trash2, Save, PlayCircle, Shuffle, ListOrdered, ListMusic, CheckCircle } from 'lucide-react';

type SlotType = 'musicas' | 'chamadas' | 'jingles' | 'playlist';
type PlaybackMode = 'aleatorio' | 'sequencial';

interface ProgramacaoSlot {
  id: string;
  type: SlotType;
  category: string;
  count: number;
  mode: PlaybackMode;
  interval?: number;
}

export default function ProgramacaoPage() {
  const [nome, setNome] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [programacoes, setProgramacoes] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [slots, setSlots] = useState<ProgramacaoSlot[]>([]);

  useEffect(() => {
    fetch('/api/playlists')
      .then(res => res.json())
      .then(data => setPlaylists(data))
      .catch(err => console.error('Erro ao buscar playlists:', err));

    fetch('/api/programacao/lista')
      .then(res => res.json())
      .then(data => setProgramacoes(data))
      .catch(err => console.error('Erro ao buscar programações:', err));
  }, []);

  const iniciarEdicao = (p: any) => {
    setEditingId(p.id);
    setNome(p.nome);
    fetch(`/api/programacao/slots?id=${p.id}`)
      .then(res => res.json())
      .then(data => setSlots(data))
      .catch(err => console.error('Erro ao buscar slots:', err));
  };

  const resetForm = () => {
    setEditingId(null);
    setNome('');
    setSlots([]);
  };

  const ativarProgramacao = async (id: string) => {
    try {
      const response = await fetch('/api/programacao/ativar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        alert('Programação ativada!');
        setProgramacoes(prev => prev.map(p => ({ ...p, ativa: p.id === id ? 1 : 0 })));
      } else {
        alert('Erro ao ativar programação');
      }
    } catch (error) {
      console.error('Erro ao ativar:', error);
    }
  };

  const deletarProgramacao = async (id: string) => {
    try {
      const response = await fetch('/api/programacao/deletar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        alert('Programação deletada!');
        setProgramacoes(prev => prev.filter(p => p.id !== id));
      } else {
        alert('Erro ao deletar programação');
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  const desativarProgramacao = async (id: string) => {
    try {
      const response = await fetch('/api/programacao/desativar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        alert('Programação desativada!');
        setProgramacoes(prev => prev.map(p => ({ ...p, ativa: p.id === id ? 0 : p.ativa })));
      } else {
        alert('Erro ao desativar programação');
      }
    } catch (error) {
      console.error('Erro ao desativar:', error);
    }
  };

  const categoriasMusica = ['Geral', 'Pop', 'Sertanejo Novo', 'Flashback', 'Modão'];
  const categoriasChamada = ['Ofertas', 'Institucional', 'Avisos Internos'];
  const categoriasJingle = ['Transição Curta', 'Abertura de Bloco'];

  const addSlot = (type: SlotType) => {
    let defaultCat = 'Geral';
    if (type === 'chamadas') defaultCat = 'Ofertas';
    if (type === 'jingles') defaultCat = 'Transição Curta';
    if (type === 'playlist' && playlists.length > 0) defaultCat = playlists[0].id;

    setSlots([...slots, {
      id: Math.random().toString(36).substring(7),
      type,
      category: defaultCat,
      count: 1,
      mode: type === 'chamadas' ? 'sequencial' : 'aleatorio',
      interval: type === 'chamadas' ? 15 : 0
    }]);
  };

  const updateSlot = (id: string, field: keyof ProgramacaoSlot, value: any) => {
    setSlots(slots.map(slot => slot.id === id ? { ...slot, [field]: value } : slot));
  };

  const removeSlot = (id: string) => {
    setSlots(slots.filter(slot => slot.id !== id));
  };

  const getTypeIcon = (type: SlotType) => {
    switch(type) {
      case 'musicas': return <Music size={18} style={{ color: '#DB1931' }} />;
      case 'chamadas': return <Mic size={18} style={{ color: '#f59e0b' }} />;
      case 'jingles': return <Folder size={18} style={{ color: '#3b82f6' }} />;
      case 'playlist': return <ListMusic size={18} style={{ color: '#22c55e' }} />;
    }
  };

  const getCategories = (type: SlotType) => {
    switch(type) {
      case 'musicas': return categoriasMusica.map(c => ({value: c.toLowerCase().replace(' ', '_'), label: c}));
      case 'chamadas': return categoriasChamada.map(c => ({value: c.toLowerCase().replace(' ', '_'), label: c}));
      case 'jingles': return categoriasJingle.map(c => ({value: c.toLowerCase().replace(' ', '_'), label: c}));
      case 'playlist': return playlists.map(p => ({value: p.id, label: p.nome}));
      default: return [];
    }
  };

  const salvarProgramacao = async () => {
    if (!nome) {
      alert('Nome é obrigatório');
      return;
    }

    const endpoint = editingId ? '/api/programacao/atualizar' : '/api/programacao';
    const body = editingId ? { id: editingId, nome, slots } : { nome, slots };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert(editingId ? 'Programação atualizada com sucesso!' : 'Programação salva com sucesso!');
        resetForm();
        // Refresh list
        fetch('/api/programacao/lista').then(res => res.json()).then(setProgramacoes);
        // Refresh player status (if applicable - here we just update state)
      } else {
        alert('Erro ao salvar/atualizar programação');
      }
    } catch (error) {
      console.error('Erro ao salvar/atualizar programação:', error);
      alert('Erro ao salvar/atualizar programação');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <PlayCircle size={28} style={{ color: '#DB1931' }} />
            Grade de Programação
          </h1>
          <p style={{ color: '#9ca3af' }}>Gerencie suas grades e defina qual está ativa na rádio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Grades */}
        <div className="rounded-xl p-5" style={{ background: '#1F2026', border: '1px solid #404048' }}>
            <h2 className="font-semibold mb-4 text-lg">Grades Salvas</h2>
            <div className="space-y-3">
                {programacoes.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#16171B', border: '1px solid #282930' }}>
                        <div>
                            <p className="font-semibold">{p.nome}</p>
                            <p className="text-xs" style={{ color: p.ativa ? '#22c55e' : '#9ca3af' }}>{p.ativa ? 'Ativa' : 'Inativa'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {p.ativa ? (
                              <button onClick={() => desativarProgramacao(p.id)} className="text-sm px-3 py-1 rounded bg-neutral-700 hover:bg-neutral-600 transition">
                                  Desativar
                              </button>
                          ) : (
                              <button onClick={() => ativarProgramacao(p.id)} className="text-sm px-3 py-1 rounded bg-neutral-700 hover:bg-neutral-600 transition">
                                  Ativar
                              </button>
                          )}
                          <button onClick={() => iniciarEdicao(p)} className="text-sm px-3 py-1 rounded bg-neutral-700 hover:bg-neutral-600 transition">
                             Editar
                          </button>
                          <button onClick={() => deletarProgramacao(p.id)} className="text-sm px-3 py-1 rounded bg-red-900 hover:bg-red-800 transition">
                             <Trash2 size={16} />
                          </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Criação de Nova Grade */}
        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{ background: '#1F2026', border: '1px solid #404048' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">{editingId ? 'Editar Grade' : 'Nova Grade'}</h2>
              {editingId && (
                <button onClick={resetForm} className="text-sm underline">Cancelar</button>
              )}
            </div>
            <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome da grade..."
                className="w-full rounded-lg px-4 py-2 outline-none mb-4"
                style={{ background: '#16171B', border: '1px solid #404048', color: '#fff' }}
            />
            {/* Seção de Configuração de Slots */}
            <div className="rounded-xl p-5" style={{ background: '#1F2026', border: '1px solid #404048' }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Configuração (Slots)</h2>
                <div className="flex gap-2">
                    <button onClick={() => addSlot('musicas')} className="p-1.5 rounded hover:bg-neutral-700" title="Add Música"><Music size={18} /></button>
                    <button onClick={() => addSlot('chamadas')} className="p-1.5 rounded hover:bg-neutral-700" title="Add Chamada"><Mic size={18} /></button>
                    <button onClick={() => addSlot('jingles')} className="p-1.5 rounded hover:bg-neutral-700" title="Add Jingle"><Folder size={18} /></button>
                    <button onClick={() => addSlot('playlist')} className="p-1.5 rounded hover:bg-neutral-700" title="Add Playlist"><ListMusic size={18} /></button>
                </div>
              </div>
              <div className="space-y-3">
                {slots.map(slot => (
                  <div key={slot.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: '#16171B', border: '1px solid #282930' }}>
                    {getTypeIcon(slot.type)}
                    <select
                      value={slot.category}
                      onChange={(e) => updateSlot(slot.id, 'category', e.target.value)}
                      className="text-sm bg-transparent outline-none flex-grow"
                    >
                      {getCategories(slot.type).map(cat => <option key={cat.value} value={cat.value} className="bg-neutral-800">{cat.label}</option>)}
                    </select>
                    <input
                      type="number"
                      value={slot.count}
                      onChange={(e) => updateSlot(slot.id, 'count', parseInt(e.target.value))}
                      className="w-10 text-sm bg-transparent outline-none text-center"
                      title="Qtd"
                    />
                    {slot.type === 'chamadas' && (
                        <input
                            type="number"
                            value={slot.interval || 0}
                            onChange={(e) => updateSlot(slot.id, 'interval', parseInt(e.target.value))}
                            className="w-12 text-sm bg-transparent outline-none text-center border-l border-neutral-700"
                            title="Intervalo (min)"
                        />
                    )}
                    <button onClick={() => removeSlot(slot.id)} className="text-red-500"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
            <button
                onClick={salvarProgramacao}
                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-colors shadow-lg"
                style={{ background: '#DB1931', color: '#fff' }}
            >
                <Save size={20} /> {editingId ? 'Atualizar Grade' : 'Salvar Nova Grade'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
