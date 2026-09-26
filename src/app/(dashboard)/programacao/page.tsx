'use client';

import { useState } from 'react';
import { Plus, GripVertical, Settings, Music, Mic, Folder, Trash2, Save, PlayCircle, Shuffle, ListOrdered } from 'lucide-react';

type SlotType = 'musicas' | 'chamadas' | 'jingles' | 'playlist';
type PlaybackMode = 'aleatorio' | 'sequencial';

interface ProgramacaoSlot {
  id: string;
  type: SlotType;
  category: string; // Pode ser o ID da playlist
  count: number;
  mode: PlaybackMode;
}

export default function ProgramacaoPage() {
  const [nome, setNome] = useState('');
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [slots, setSlots] = useState<ProgramacaoSlot[]>([
    { id: '1', type: 'musicas', category: 'sertanejo_novo', count: 2, mode: 'aleatorio' },
    { id: '2', type: 'jingles', category: 'transicao', count: 1, mode: 'aleatorio' },
    { id: '3', type: 'musicas', category: 'pop', count: 1, mode: 'aleatorio' },
    { id: '4', type: 'chamadas', category: 'ofertas', count: 1, mode: 'sequencial' }
  ]);

  useEffect(() => {
    fetch('/api/playlists')
      .then(res => res.json())
      .then(data => setPlaylists(data))
      .catch(err => console.error('Erro ao buscar playlists:', err));
  }, []);

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
      mode: type === 'chamadas' ? 'sequencial' : 'aleatorio'
    }]);
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

    try {
      const response = await fetch('/api/programacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, slots }),
      });

      if (response.ok) {
        alert('Programação salva com sucesso!');
      } else {
        alert('Erro ao salvar programação');
      }
    } catch (error) {
      console.error('Erro ao salvar programação:', error);
      alert('Erro ao salvar programação');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <PlayCircle size={28} style={{ color: '#DB1931' }} />
            Grade de Programação (Rotatividade)
          </h1>
          <p style={{ color: '#9ca3af' }}>Monte o esqueleto/fórmula do que a rádio vai tocar em looping</p>
        </div>

        <button
          onClick={salvarProgramacao}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-colors shadow-lg"
          style={{ background: '#DB1931', color: '#fff' }}
        >
          <Save size={20} /> Salvar Grade
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Painel Esquerdo: Info e Adição */}
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-xl p-5" style={{ background: '#1F2026', border: '1px solid #404048' }}>
            <h2 className="font-semibold mb-4">Configuração Básica</h2>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#9ca3af' }}>Nome da Grade</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Padrão Manhã (Promoções)"
                className="w-full rounded-lg px-4 py-2 outline-none"
                style={{ background: '#16171B', border: '1px solid #404048', color: '#fff' }}
              />
            </div>
          </div>

          <div className="rounded-xl p-5" style={{ background: '#1F2026', border: '1px solid #404048' }}>
            <h2 className="font-semibold mb-4">Adicionar Bloco</h2>
            <div className="space-y-2">
              <button onClick={() => addSlot('musicas')} className="w-full flex items-center justify-between p-3 rounded-lg transition-colors hover:opacity-80" style={{ border: '1px solid rgba(219, 25, 49, 0.3)' }}>
                <span className="flex items-center gap-2 font-medium"><Music size={18} style={{ color: '#DB1931' }}/> Músicas</span>
                <Plus size={18} style={{ color: '#DB1931' }} />
              </button>

              <button onClick={() => addSlot('chamadas')} className="w-full flex items-center justify-between p-3 rounded-lg transition-colors hover:opacity-80" style={{ border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <span className="flex items-center gap-2 font-medium"><Mic size={18} style={{ color: '#f59e0b' }}/> Chamadas / Ofertas</span>
                <Plus size={18} style={{ color: '#f59e0b' }} />
              </button>

              <button onClick={() => addSlot('jingles')} className="w-full flex items-center justify-between p-3 rounded-lg transition-colors hover:opacity-80" style={{ border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                <span className="flex items-center gap-2 font-medium"><Folder size={18} style={{ color: '#3b82f6' }}/> Jingles de Transição</span>
                <Plus size={18} style={{ color: '#3b82f6' }} />
              </button>

              <button onClick={() => addSlot('playlist')} className="w-full flex items-center justify-between p-3 rounded-lg transition-colors hover:opacity-80" style={{ border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                <span className="flex items-center gap-2 font-medium"><ListMusic size={18} style={{ color: '#22c55e' }}/> Playlist Pré-Definida</span>
                <Plus size={18} style={{ color: '#22c55e' }} />
              </button>
            </div>
          </div>


          <div className="rounded-xl p-4 text-sm" style={{ background: 'rgba(219, 25, 49, 0.05)', border: '1px solid rgba(219, 25, 49, 0.2)' }}>
            <p style={{ color: '#DB1931' }} className="font-semibold mb-1">Como Funciona?</p>
            <p style={{ color: '#9ca3af' }}>Essa é a "receita". A rádio executará os blocos de cima para baixo. Ao terminar, ela volta pro início gerando um loop musical infinito e sem repetições iguais.</p>
          </div>
        </div>

        {/* Parede Central: Sequenciador Visual */}
        <div className="lg:col-span-2">
          <div className="rounded-xl p-5 min-h-[600px]" style={{ background: '#16171B', border: '1px dashed #404048' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg flex items-center gap-2"><ListOrdered size={20}/> Estrutura do Looping (Padrão)</h2>
              <span className="text-sm px-3 py-1 rounded-full" style={{ background: '#1F2026', color: '#9ca3af' }}>
                {slots.reduce((acc, curr) => acc + curr.count, 0)} itens por ciclo
              </span>
            </div>

            {slots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: '#1F2026' }}>
                  <Settings size={32} style={{ color: '#404048' }} />
                </div>
                <p className="text-lg font-medium" style={{ color: '#fff' }}>Sua Grade está Vazia</p>
                <p style={{ color: '#71717a' }}>Comece adicionando Blocos Mágicos no menu lateral</p>
              </div>
            ) : (
              <div className="space-y-3">
                {slots.map((slot, index) => (
                  <div key={slot.id} className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl transition-all" style={{ background: '#1F2026', border: '1px solid #404048' }}>

                    <div className="flex items-center gap-3 w-full sm:w-auto cursor-move">
                      <div className="flex flex-col items-center justify-center w-8">
                        <span className="text-xs font-bold" style={{ color: '#52525b' }}>{index + 1}</span>
                        <GripVertical size={16} style={{ color: '#404048' }} />
                      </div>
                      <div className="p-2 rounded-lg" style={{ background: '#16171B', border: '1px solid #282930' }}>
                        {getTypeIcon(slot.type)}
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3 w-full items-center">

                      {/* Qtd */}
                      <div className="flex items-center rounded-lg px-2 py-1 col-span-1" style={{ background: '#16171B', border: '1px solid #404048' }}>
                        <span className="text-xs mr-2 truncate" style={{ color: '#9ca3af' }}>Qtd:</span>
                        <input
                          type="number" min="1" max="20"
                          value={slot.count}
                          onChange={(e) => updateSlot(slot.id, 'count', parseInt(e.target.value) || 1)}
                          className="bg-transparent w-full outline-none text-center font-bold"
                          style={{ color: '#fff' }}
                        />
                      </div>

                      {/* Categoria */}
                      <div className="flex items-center rounded-lg px-2 py-1.5 sm:col-span-2" style={{ background: '#16171B', border: '1px solid #404048' }}>
                        <span className="text-xs mr-2" style={{ color: '#9ca3af' }}>De:</span>
                        <select
                          value={slot.category}
                          onChange={(e) => updateSlot(slot.id, 'category', e.target.value)}
                          className="bg-transparent w-full outline-none text-sm appearance-none font-medium"
                          style={{ color: '#fff' }}
                        >
                          {getCategories(slot.type).map(c => (
                            <option key={c.value} value={c.value} style={{ background: '#16171B' }}>{c.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Modo */}
                      <div className="flex items-center rounded-lg overflow-hidden h-full col-span-1" style={{ border: '1px solid #404048' }}>
                        <button
                          onClick={() => updateSlot(slot.id, 'mode', 'aleatorio')}
                          className="flex-1 h-full flex items-center justify-center transition-all"
                          style={{ background: slot.mode === 'aleatorio' ? '#DB1931' : '#16171B', color: slot.mode === 'aleatorio' ? '#fff' : '#71717a' }}
                          title="Tocar arquivo Aleatório (Shuffle)"
                        >
                          <Shuffle size={14} />
                        </button>
                        <button
                          onClick={() => updateSlot(slot.id, 'mode', 'sequencial')}
                          className="flex-1 h-full flex items-center justify-center transition-all"
                          style={{ background: slot.mode === 'sequencial' ? '#DB1931' : '#16171B', color: slot.mode === 'sequencial' ? '#fff' : '#71717a' }}
                          title="Tocar na Sequência Original"
                        >
                          <ListOrdered size={14} />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => removeSlot(slot.id)}
                      className="p-2 ml-auto rounded-lg transition-colors hover:bg-neutral-800"
                      style={{ color: '#ef4444' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}