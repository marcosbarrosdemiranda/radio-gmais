'use client';

import { useState, useEffect } from 'react';
import { Store, Plus, Trash2, Play, Pause, Volume2 } from 'lucide-react';

export default function FiliaisConfigPage() {
  const [filiais, setFiliais] = useState<any[]>([]);

  useEffect(() => {
    // Carregar filiais cadastradas
    fetch('/api/filiais')
        .then(res => res.json())
        .then(data => setFiliais(data))
        .catch(console.error);
  }, []);

  const criarFilial = async () => {
    const nome = prompt("Nome da nova filial:");
    if (!nome) return;

    const res = await fetch('/api/filiais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome })
    });

    if (res.ok) {
        window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
            <Store size={28} style={{ color: '#DB1931' }} />
            Gerenciamento de Filiais
        </h1>
        <button onClick={criarFilial} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: '#DB1931' }}>
            <Plus /> Nova Filial
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
          {filiais.map((f) => (
              <div key={f.id} className="p-4 rounded-xl flex items-center justify-between" style={{ background: '#1F2026' }}>
                  <div>
                    <h3 className="font-bold">{f.nome}</h3>
                    <p className="text-sm text-gray-500">Status: <span className={f.status === 'online - tocando' ? 'text-green-500' : 'text-red-500'}>{f.status || 'offline'}</span></p>
                    <p className="text-sm text-gray-500">Token: <span className='font-mono'>{f.token_acesso}</span></p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => fetch(`/api/filial/comando/${f.id}`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ acao: 'play' }) })} className="p-2 bg-gray-700 rounded-full hover:text-green-500"><Play size={18} /></button>
                    <button onClick={() => fetch(`/api/filial/comando/${f.id}`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ acao: 'pause' }) })} className="p-2 bg-gray-700 rounded-full hover:text-red-500"><Pause size={18} /></button>
                    <input type="range" className="w-20" onChange={(e) => fetch(`/api/filial/comando/${f.id}`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ acao: 'volume', valor: parseInt(e.target.value) }) })} />
                    <button className="p-2 text-gray-400 hover:text-red-500"><Trash2 /></button>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
}
