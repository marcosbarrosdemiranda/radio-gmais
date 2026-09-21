'use client';

import { Bell, Search, User } from 'lucide-react';

export default function Header() {
  return (
    <header
      className="h-16 flex items-center justify-between px-6 backdrop-blur-sm"
      style={{ borderBottom: '1px solid #404048', background: 'rgba(22, 23, 27, 0.5)' }}
    >
      {/* Search */}
      <div
        className="flex items-center gap-2 rounded-lg px-3 py-2 w-96"
        style={{ background: '#1F2026' }}
      >
        <Search size={18} style={{ color: '#71717a' }} />
        <input
          type="text"
          placeholder="Buscar músicas, chamadas..."
          className="bg-transparent border-none outline-none text-sm w-full text-white"
          style={{ color: '#fff' }}
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button
          className="relative transition-colors"
          style={{ color: '#9ca3af' }}
          onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
          onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
        >
          <Bell size={20} />
          <span
            className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
            style={{ background: '#DB1931' }}
          />
        </button>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: '#404048' }}
          >
            <User size={18} />
          </div>
          <span className="text-sm">Admin</span>
        </div>
      </div>
    </header>
  );
}
