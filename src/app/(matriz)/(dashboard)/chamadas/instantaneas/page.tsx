'use client';

import { useState } from 'react';
import { Play, Pause, Trash2, Plus, Search, Zap } from 'lucide-react';

const chamadasInstantaneas = [
  { id: '1', titulo: 'Pão Quentinho Acabou de Sair', arquivo: '/audio/pao-quentinho.mp3', categoria: 'Produtos', ativa: true },
  { id: '2', titulo: 'Bom Dia a Todos', arquivo: '/audio/bom-dia.mp3', categoria: 'Saudações', ativa: true },
  { id: '3', titulo: 'Boa Tarde a Todos', arquivo: '/audio/boa-tarde.mp3', categoria: 'Saudações', ativa: true },
  { id: '4', titulo: 'Boa Noite a Todos', arquivo: '/audio/boa-noite.mp3', categoria: 'Saudações', ativa: true },
  { id: '5', titulo: 'Encerramento - 10 Minutos', arquivo: '/audio/encerramento-10min.mp3', categoria: 'Horário', ativa: true },
  { id: '6', titulo: 'Encerramento Final do Dia', arquivo: '/audio/encerramento-final.mp3', categoria: 'Horário', ativa: true },
  { id: '7', titulo: 'Atenção Colaboradores', arquivo: '/audio/atencao-colaboradores.mp3', categoria: 'Funcionários', ativa: true },
  { id: '8', titulo: 'Aniversário do Cliente', arquivo: '/audio/aniversario.mp3', categoria: 'Comemorativos', ativa: true },
  { id: '9', titulo: 'Meta ALCANÇADA - Padaria', arquivo: '/audio/meta-padaria.mp3', categoria: 'Metas', ativa: true },
  { id: '10', titulo: 'Sistema Fora do Ar', arquivo: '/audio/sistema-fora.mp3', categoria: 'Sistema', ativa: false },
];

const categorias = ['Todas', 'Produtos', 'Saudações', 'Horário', 'Funcionários', 'Comemorativos', 'Metas', 'Sistema'];

export default function ChamadasInstantaneasPage() {
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [tocando, setTocando] = useState<string | null>(null);

  const chamadasFiltradas = chamadasInstantaneas.filter(chamada => {
    const matchBusca = chamada.titulo.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria = categoriaFiltro === 'Todas' || chamada.categoria === categoriaFiltro;
    return matchBusca && matchCategoria;
  });

  const handlePlay = (id: string) => {
    if (tocando === id) {
      setTocando(null);
    } else {
      setTocando(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap size={28} style={{ color: '#DB1931' }} />
          <div>
            <h1 className="text-2xl font-bold">Chamadas Instantâneas</h1>
            <p style={{ color: '#9ca3af' }}>Toque anúncios pré-gravados ao vivo</p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
          style={{ background: '#DB1931', color: '#fff' }}
          onMouseOver={(e) => e.currentTarget.style.background = '#B21125'}
          onMouseOut={(e) => e.currentTarget.style.background = '#DB1931'}
        >
          <Plus size={18} />
          Nova Chamada
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        {/* Busca */}
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 flex-1"
          style={{ background: '#1F2026', border: '1px solid #404048' }}
        >
          <Search size={18} style={{ color: '#71717a' }} />
          <input
            type="text"
            placeholder="Buscar chamadas..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="bg-transparent border-none outline-none w-full"
            style={{ color: '#fff' }}
          />
        </div>

        {/* Filtro de categoria */}
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          className="rounded-lg px-3 py-2 outline-none"
          style={{ background: '#1F2026', border: '1px solid #404048', color: '#fff' }}
        >
          {categorias.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Lista de chamadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chamadasFiltradas.map((chamada) => (
          <div
            key={chamada.id}
            className="rounded-xl p-4 transition-all"
            style={{
              background: tocando === chamada.id ? 'rgba(219, 25, 49, 0.1)' : '#1F2026',
              border: tocando === chamada.id ? '1px solid #DB1931' : '1px solid #404048',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{chamada.titulo}</h3>
                <span
                  className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                  style={{ background: '#404048', color: '#9ca3af' }}
                >
                  {chamada.categoria}
                </span>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: chamada.ativa ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: chamada.ativa ? '#22c55e' : '#ef4444'
                }}
              >
                {chamada.ativa ? 'Ativa' : 'Inativa'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePlay(chamada.id)}
                className="flex items-center justify-center w-10 h-10 rounded-full transition-colors"
                style={{
                  background: tocando === chamada.id ? '#DB1931' : '#404048',
                  color: '#fff'
                }}
                onMouseOver={(e) => {
                  if (tocando !== chamada.id) e.currentTarget.style.background = '#52525b';
                }}
                onMouseOut={(e) => {
                  if (tocando !== chamada.id) e.currentTarget.style.background = '#404048';
                }}
              >
                {tocando === chamada.id ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </button>

              <div className="flex-1">
                {tocando === chamada.id && (
                  <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 rounded-full animate-pulse"
                          style={{
                            background: '#DB1931',
                            height: `${12 + Math.random() * 8}px`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs ml-2" style={{ color: '#DB1931' }}>Tocando...</span>
                  </div>
                )}
              </div>

              <button
                className="p-2 rounded-lg transition-colors"
                style={{ color: '#71717a' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                onMouseOut={(e) => e.currentTarget.style.color = '#71717a'}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {chamadasFiltradas.length === 0 && (
        <div className="text-center py-12">
          <Zap size={48} style={{ color: '#404048' }} className="mx-auto mb-4" />
          <p style={{ color: '#71717a' }}>Nenhuma chamada encontrada</p>
        </div>
      )}
    </div>
  );
}
