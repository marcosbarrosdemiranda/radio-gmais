'use client';

import Link from 'next/link';
import { Mic, Calendar, Users, Zap, ParkingCircle } from 'lucide-react';

interface ChamadaItem {
  id: string;
  titulo: string;
  tipo: string;
  ativa: boolean;
  criadoEm: string;
}

interface ChamadaListProps {
  chamadas: ChamadaItem[];
}

const tipoConfig: Record<string, { icon: any; color: string; label: string }> = {
  'locutor-virtual': { icon: Mic, color: 'text-green-500', label: 'Locutor Virtual' },
  'aniversario': { icon: Calendar, color: 'text-pink-500', label: 'Aniversário' },
  'funcionario': { icon: Users, color: 'text-blue-500', label: 'Funcionário' },
  'instantanea': { icon: Zap, color: 'text-yellow-500', label: 'Instantânea' },
  'estacionamento': { icon: ParkingCircle, color: 'text-purple-500', label: 'Estacionamento' },
};

export default function ChamadaList({ chamadas }: ChamadaListProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="text-left px-4 py-3 text-sm text-zinc-400 font-medium">Título</th>
            <th className="text-left px-4 py-3 text-sm text-zinc-400 font-medium">Tipo</th>
            <th className="text-left px-4 py-3 text-sm text-zinc-400 font-medium">Status</th>
            <th className="text-left px-4 py-3 text-sm text-zinc-400 font-medium">Criado em</th>
            <th className="text-right px-4 py-3 text-sm text-zinc-400 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {chamadas.map((chamada) => {
            const config = tipoConfig[chamada.tipo] || tipoConfig['locutor-virtual'];
            return (
              <tr key={chamada.id} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50">
                <td className="px-4 py-3 font-medium">{chamada.titulo}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <config.icon size={16} className={config.color} />
                    <span className="text-sm">{config.label}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    chamada.ativa ? 'bg-green-500/20 text-green-500' : 'bg-zinc-700 text-zinc-400'
                  }`}>
                    {chamada.ativa ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-zinc-400">{chamada.criadoEm}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/chamadas/${chamada.id}`}
                    className="text-green-500 hover:text-green-400 text-sm"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
