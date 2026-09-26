'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  Music,
  Mic,
  ListMusic,
  Settings,
  History,
  Radio,
  LogOut,
  Upload,
  Zap,
  Calendar,
  Volume2,
  Folder,
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', href: '/', icon: Home },
  { label: 'Player', href: '/player', icon: Radio },
  { label: 'Músicas', href: '/musicas', icon: Music },
  { label: 'Upload', href: '/musicas/upload', icon: Upload },
  { label: 'Chamadas', href: '/chamadas', icon: Mic },
  { label: 'Instantâneas', href: '/chamadas/instantaneas', icon: Zap },
  { label: 'Locutor Virtual', href: '/chamadas/locutor-virtual', icon: Volume2 },
  { label: 'Programação (Grade)', href: '/programacao', icon: ListMusic },
  { label: 'Playlists', href: '/playlists', icon: Folder },
  { label: 'Eventos', href: '/eventos', icon: Calendar },
  { label: 'Histórico', href: '/historico', icon: History },
  { label: 'Configurações', href: '/configuracoes', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <aside className="w-64 flex flex-col" style={{ background: '#16171B', borderRight: '1px solid #404048' }}>
      {/* Logo */}
      <div className="p-6" style={{ borderBottom: '1px solid #404048' }}>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Radio size={24} style={{ color: '#DB1931' }} />
          <span>Radio Gmais</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
              style={{
                background: isActive ? 'rgba(219, 25, 49, 0.1)' : 'transparent',
                color: isActive ? '#DB1931' : '#9ca3af',
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = '#1F2026';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#9ca3af';
                }
              }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4" style={{ borderTop: '1px solid #404048' }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg w-full transition-colors"
          style={{ color: '#9ca3af' }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#1F2026';
            e.currentTarget.style.color = '#ef4444';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#9ca3af';
          }}
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}