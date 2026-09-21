'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Music, Mic, ListMusic, Play, Radio, Zap, Upload, HardDrive, Clock, TrendingUp } from 'lucide-react';

interface Stats {
  totalMusicas: number;
  totalChamadas: number;
  totalPlaylists: number;
  totalJingles: number;
  armazenamentoUsado: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalMusicas: 0,
    totalChamadas: 0,
    totalPlaylists: 0,
    totalJingles: 0,
    armazenamentoUsado: 0,
  });

  useEffect(() => {
    // Simular busca de estatísticas
    setStats({
      totalMusicas: 0,
      totalChamadas: 35,
      totalPlaylists: 0,
      totalJingles: 0,
      armazenamentoUsado: 0,
    });
  }, []);

  const statCards = [
    { label: 'Músicas', value: stats.totalMusicas, icon: Music, color: '#DB1931', href: '/musicas' },
    { label: 'Chamadas', value: stats.totalChamadas, icon: Zap, color: '#f59e0b', href: '/chamadas/instantaneas' },
    { label: 'Playlists', value: stats.totalPlaylists, icon: ListMusic, color: '#3b82f6', href: '/playlists' },
    { label: 'Uploads', value: stats.totalJingles, icon: Upload, color: '#22c55e', href: '/musicas/upload' },
  ];

  const quickActions = [
    { label: 'Tocar Rádio', icon: Play, color: '#DB1931', href: '/player' },
    { label: 'Chamada Instantânea', icon: Zap, color: '#f59e0b', href: '/chamadas/instantaneas' },
    { label: 'Upload de Música', icon: Upload, color: '#22c55e', href: '/musicas/upload' },
    { label: 'Nova Playlist', icon: ListMusic, color: '#3b82f6', href: '/playlists/nova' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p style={{ color: '#9ca3af' }}>Visão geral do sistema Radio Gmais</p>
        </div>
        <div className="flex items-center gap-2">
          <Radio size={20} style={{ color: '#DB1931' }} />
          <span className="text-sm" style={{ color: '#9ca3af' }}>Sistema Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl p-4 transition-all"
            style={{ background: '#1F2026', border: '1px solid #404048' }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = stat.color}
            onMouseOut={(e) => e.currentTarget.style.borderColor = '#404048'}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={20} style={{ color: stat.color }} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm" style={{ color: '#9ca3af' }}>{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 rounded-xl p-4 transition-colors"
              style={{ background: '#1F2026', border: '1px solid #404048' }}
              onMouseOver={(e) => e.currentTarget.style.background = '#282930'}
              onMouseOut={(e) => e.currentTarget.style.background = '#1F2026'}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${action.color}20` }}
              >
                <action.icon size={20} style={{ color: action.color }} />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Storage Info */}
      <div className="rounded-xl p-4" style={{ background: '#1F2026', border: '1px solid #404048' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <HardDrive size={18} style={{ color: '#9ca3af' }} />
            <span className="font-medium">Armazenamento</span>
          </div>
          <span className="text-sm" style={{ color: '#9ca3af' }}>Local</span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ background: '#404048' }}>
          <div
            className="h-full rounded-full"
            style={{ width: '0%', background: '#DB1931' }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm" style={{ color: '#9ca3af' }}>
          <span>0 MB usados</span>
          <span>Ilimitado</span>
        </div>
      </div>

      {/* Sistema Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: '#1F2026', border: '1px solid #404048' }}>
          <h3 className="font-semibold mb-3">📁 Estrutura de Áudio</h3>
          <div className="text-sm space-y-2" style={{ color: '#9ca3af', fontFamily: 'monospace' }}>
            <p>public/audio/</p>
            <p className="ml-4">├── musicas/   <span style={{ color: '#DB1931' }}>(suas músicas)</span></p>
            <p className="ml-4">├── chamadas/  <span style={{ color: '#f59e0b' }}>(anúncios)</span></p>
            <p className="ml-4">├── jingles/   <span style={{ color: '#3b82f6' }}>(vinhetas)</span></p>
            <p className="ml-4">└── uploads/   <span style={{ color: '#22c55e' }}>(uploads gerais)</span></p>
          </div>
        </div>

        <div className="rounded-xl p-4" style={{ background: '#1F2026', border: '1px solid #404048' }}>
          <h3 className="font-semibold mb-3">ℹ️ Sistema</h3>
          <div className="text-sm space-y-2" style={{ color: '#9ca3af' }}>
            <p><span style={{ color: '#fff' }}>Versão:</span> 1.0.0</p>
            <p><span style={{ color: '#fff' }}>Baseado em:</span> RadioSrv</p>
            <p><span style={{ color: '#fff' }}>Framework:</span> Next.js + SQLite</p>
            <p><span style={{ color: '#fff' }}>Status:</span> <span style={{ color: '#22c55e' }}>Online</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}