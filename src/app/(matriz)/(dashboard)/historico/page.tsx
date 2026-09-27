'use client';

import { useState, useEffect } from 'react';
import { History, Clock, Music, Mic } from 'lucide-react';

interface HistoricoItem {
  id: number;
  tipo: 'musica' | 'chamada';
  titulo: string;
  duracao: number;
  tocado_em: string;
}

export default function HistoricoPage() {
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/historico')
      .then(res => res.json())
      .then(data => {
        setHistorico(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar histórico:', err);
        setLoading(false);
      });
  }, []);

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <History className="text-blue-500" />
        Histórico de Reprodução
      </h1>

      <div className="rounded-xl p-6" style={{ background: '#1F2026', border: '1px solid #404048' }}>
        {loading ? (
            <p>Carregando...</p>
        ) : (
            <div className="space-y-2">
            {historico.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg" style={{ background: '#282930' }}>
                    {item.tipo === 'musica' ? <Music className="text-blue-500" size={20}/> : <Mic className="text-green-500" size={20}/>}
                    <div className="flex-1">
                        <p className="font-medium text-white">{item.titulo}</p>
                        <p className="text-xs text-gray-400 capitalize">{item.tipo}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock size={16}/>
                        {formatTime(item.tocado_em)}
                    </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}
