'use client';

import ChamadaForm from '@/components/chamadas/ChamadaForm';

export default function NovaChamadaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nova Chamada</h1>
        <p className="text-zinc-400">Crie uma nova chamada ou locução</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <ChamadaForm onSubmit={(data) => console.log('Submit:', data)} />
        </div>
      </div>
    </div>
  );
}
