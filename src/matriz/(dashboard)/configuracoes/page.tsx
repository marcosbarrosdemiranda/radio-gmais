'use client';
import { useState } from 'react';
import { Settings, AlertTriangle } from 'lucide-react';

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(false);

  const handleReset = async (novoModo: 'uniloja' | 'multi-filial') => {
    if (!confirm(`ATENÇÃO: Você está prestes a mudar o modo do sistema para "${novoModo}".

ESTA AÇÃO É DESTRUTIVA E IRREVERSÍVEL.
Toda a base de dados, arquivos de áudio, playlists e configurações serão APAGADOS.
O sistema será reiniciado para a configuração inicial.

Confirmar reset total do sistema?`)) {
      return;
    }

    setLoading(true);
    try {
      // 1. Resetar sistema
      const res = await fetch('/api/config/reset-system', { method: 'POST' });
      if (!res.ok) throw new Error('Erro ao resetar');

      // 2. Aqui a página recarregaria e cairia no setup inicial (futuro)
      alert('Sistema resetado. Recarregando...');
      window.location.reload();
    } catch (err) {
      alert('Erro ao resetar sistema');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Settings size={28} style={{ color: '#DB1931' }} />
        Configurações do Sistema
      </h1>

      <div className="p-6 rounded-xl" style={{ background: '#1F2026' }}>
        <h2 className="text-lg font-bold mb-4">Modo de Operação</h2>
        <div className="flex gap-4">
          <button
            disabled={loading}
            onClick={() => handleReset('uniloja')}
            className="flex-1 p-4 rounded-xl border border-red-500 hover:bg-red-900/20 transition-all text-left"
          >
            <div className="font-bold flex items-center gap-2 text-red-500">
                <AlertTriangle size={20} /> Modo Uniloja
            </div>
            <p className="text-sm text-gray-400 mt-2">Instância única simplificada.</p>
          </button>

          <button
            disabled={loading}
            onClick={() => handleReset('multi-filial')}
            className="flex-1 p-4 rounded-xl border border-red-500 hover:bg-red-900/20 transition-all text-left"
          >
            <div className="font-bold flex items-center gap-2 text-red-500">
                <AlertTriangle size={20} /> Modo Multi-Filial
            </div>
            <p className="text-sm text-gray-400 mt-2">Matriz gerencia vários Kiosks.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
