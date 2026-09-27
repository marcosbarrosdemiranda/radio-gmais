'use client';

import { useParams } from 'next/navigation';
import ChamadaForm from '@/components/chamadas/ChamadaForm';

const mockChamada = {
  id: '1',
  titulo: 'Promoção Semanal',
  texto: 'Atenção ouvintes! Temos uma promoção imperdível esta semana. Venha conferir nossas ofertas especiais na loja Radio Gmais.',
  tipo: 'locutor-virtual',
  vozId: 'pt-BR-FranciscoNeural',
};

export default function EditChamadaPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Editar Chamada</h1>
        <p className="text-zinc-400">Editando chamada #{id}</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <ChamadaForm
            initialData={mockChamada}
            onSubmit={(data) => console.log('Update:', id, data)}
          />
        </div>
      </div>
    </div>
  );
}
