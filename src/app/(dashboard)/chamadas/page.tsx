'use client';

import Link from 'next/link';
import { Plus, Mic, Calendar, Users, Zap, ParkingCircle, Bus } from 'lucide-react';

const chamadas = [
  { id: '1', titulo: 'Promoção Semanal', tipo: 'locutor-virtual', ativa: true, criadoEm: '2026-09-20' },
  { id: '2', titulo: 'Aniversário João', tipo: 'aniversario', ativa: true, criadoEm: '2026-09-20' },
  { id: '3', titulo: 'Aviso Estacionamento', tipo: 'estacionamento', ativa: false, criadoEm: '2026-09-19' },
  { id: '4', titulo: 'Chamada Funcionário Pedro', tipo: 'funcionario', ativa: true, criadoEm: '2026-09-19' },
  { id: '5', titulo: 'Aviso Ônibus 14:00', tipo: 'onibus', ativa: true, criadoEm: '2026-09-18' },
];

const tipoConfig: Record<string, { icon: any; color: string; label: string; href: string }> = {
  'locutor-virtual': { icon: Mic, color: '#DB1931', label: 'Locutor Virtual', href: '/chamadas/locutor-virtual' },
  'instantanea': { icon: Zap, color: '#f59e0b', label: 'Instantâneas', href: '/chamadas/instantaneas' },
  'aniversario': { icon: Calendar, color: '#ec4899', label: 'Aniversário', href: '/chamadas/nova?tipo=aniversario' },
  'funcionario': { icon: Users, color: '#3b82f6', label: 'Funcionário', href: '/chamadas/nova?tipo=funcionario' },
  'estacionamento': { icon: ParkingCircle, color: '#a855f7', label: 'Estacionamento', href: '/chamadas/nova?tipo=estacionamento' },
  'onibus': { icon: Bus, color: '#f97316', label: 'Ônibus', href: '/chamadas/nova?tipo=onibus' },
};

export default function ChamadasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Chamadas</h1>
          <p style={{ color: '#9ca3af' }}>Gerencie suas chamadas e locuções</p>
        </div>
        <Link
          href="/chamadas/nova"
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
          style={{ background: '#DB1931', color: '#fff' }}
          onMouseOver={(e) => e.currentTarget.style.background = '#B21125'}
          onMouseOut={(e) => e.currentTarget.style.background = '#DB1931'}
        >
          <Plus size={18} />
          Nova Chamada
        </Link>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(tipoConfig).map(([tipo, config]) => (
          <Link
            key={tipo}
            href={config.href}
            className="rounded-xl p-4 transition-colors text-center"
            style={{ background: '#1F2026', border: '1px solid #404048' }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = config.color}
            onMouseOut={(e) => e.currentTarget.style.borderColor = '#404048'}
          >
            <config.icon size={24} style={{ color: config.color }} className="mx-auto mb-2" />
            <p className="text-sm">{config.label}</p>
          </Link>
        ))}
      </div>

      {/* Chamadas list */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#1F2026', border: '1px solid #404048' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #404048' }}>
              <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Título</th>
              <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Tipo</th>
              <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Criado em</th>
              <th className="text-right px-4 py-3 text-sm font-medium" style={{ color: '#9ca3af' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {chamadas.map((chamada) => {
              const config = tipoConfig[chamada.tipo] || tipoConfig['locutor-virtual'];
              return (
                <tr
                  key={chamada.id}
                  style={{ borderBottom: '1px solid #404048' }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(64, 64, 72, 0.3)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td className="px-4 py-3 font-medium">{chamada.titulo}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <config.icon size={16} style={{ color: config.color }} />
                      <span className="text-sm">{config.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded-full text-xs"
                      style={{
                        background: chamada.ativa ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: chamada.ativa ? '#22c55e' : '#ef4444'
                      }}
                    >
                      {chamada.ativa ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#9ca3af' }}>{chamada.criadoEm}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/chamadas/${chamada.id}`}
                      className="text-sm"
                      style={{ color: '#DB1931' }}
                      onMouseOver={(e) => e.currentTarget.style.color = '#B21125'}
                      onMouseOut={(e) => e.currentTarget.style.color = '#DB1931'}
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
    </div>
  );
}
