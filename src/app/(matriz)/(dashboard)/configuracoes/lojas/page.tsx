'use client';

import { useState, useEffect } from 'react';
import { Save, Store } from 'lucide-react';

export default function LojasConfigPage() {
  const [horarios, setHorarios] = useState({
      segunda: { abertura: '06:30', fechamento: '20:00' },
      terca: { abertura: '06:30', fechamento: '20:00' },
      quarta: { abertura: '06:30', fechamento: '20:00' },
      quinta: { abertura: '06:30', fechamento: '20:00' },
      sexta: { abertura: '06:30', fechamento: '20:00' },
      sabado: { abertura: '06:30', fechamento: '20:00' },
      domingo: { abertura: '00:00', fechamento: '00:00' },
  });

  useEffect(() => {
    fetch('/api/lojas')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
            setHorarios(data);
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch('/api/lojas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configuracoes: horarios })
      });
      if (res.ok) {
        alert('Horários salvos com sucesso!');
      } else {
        alert('Erro ao salvar horários.');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao salvar.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
            <Store size={28} style={{ color: '#DB1931' }} />
            Horários de Funcionamento (Loja)
        </h1>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: '#DB1931' }}>
            <Save /> Salvar
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
          {Object.entries(horarios).map(([dia, times]) => (
              <div key={dia} className="p-4 rounded-xl" style={{ background: '#1F2026' }}>
                  <h3 className="capitalize font-bold mb-2">{dia}</h3>
                  <div className="flex gap-2">
                    <input type="time" value={times.abertura} onChange={e => setHorarios({...horarios, [dia]: {...times, abertura: e.target.value}})} className="bg-neutral-800 p-2 rounded" />
                    <input type="time" value={times.fechamento} onChange={e => setHorarios({...horarios, [dia]: {...times, fechamento: e.target.value}})} className="bg-neutral-800 p-2 rounded" />
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
}
