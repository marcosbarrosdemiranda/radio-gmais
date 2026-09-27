'use client';

import { useState } from 'react';
import { Settings, User, Radio, Volume2, Mic, Bell, Shield, Save, Eye, EyeOff } from 'lucide-react';

export default function ConfiguracoesPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [config, setConfig] = useState({
    nomeLoja: 'Supermercado Gmais',
    nomeRadio: 'Radio Gmais',
    timezone: 'America/Sao_Paulo',
    volumePadrao: 80,
    autoPlay: true,
    chamadaFadeIn: 3,
    chamadaFadeOut: 3,
    notificacoes: true,
    emailNotificacoes: 'admin@gmais.com.br',
  });

  const handleSave = () => {
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings size={28} style={{ color: '#DB1931' }} />
          <div>
            <h1 className="text-2xl font-bold">Configurações</h1>
            <p style={{ color: '#9ca3af' }}>Personalize seu sistema de rádio</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
          style={{ background: '#DB1931', color: '#fff' }}
          onMouseOver={(e) => e.currentTarget.style.background = '#B21125'}
          onMouseOut={(e) => e.currentTarget.style.background = '#DB1931'}
        >
          <Save size={18} />
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações da Loja */}
        <div
          className="rounded-xl p-4"
          style={{ background: '#1F2026', border: '1px solid #404048' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <User size={20} style={{ color: '#DB1931' }} />
            <h3 className="font-semibold">Informações da Loja</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>Nome da Loja</label>
              <input
                type="text"
                value={config.nomeLoja}
                onChange={(e) => setConfig({ ...config, nomeLoja: e.target.value })}
                className="w-full rounded-lg px-4 py-2 outline-none"
                style={{ background: '#282930', border: '1px solid #404048', color: '#fff' }}
              />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>Nome do Rádio</label>
              <input
                type="text"
                value={config.nomeRadio}
                onChange={(e) => setConfig({ ...config, nomeRadio: e.target.value })}
                className="w-full rounded-lg px-4 py-2 outline-none"
                style={{ background: '#282930', border: '1px solid #404048', color: '#fff' }}
              />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>Fuso Horário</label>
              <select
                value={config.timezone}
                onChange={(e) => setConfig({ ...config, timezone: e.target.value })}
                className="w-full rounded-lg px-4 py-2 outline-none"
                style={{ background: '#282930', border: '1px solid #404048', color: '#fff' }}
              >
                <option value="America/Sao_Paulo">Horário de Brasília (GMT-3)</option>
                <option value="America/Manaus">Horário da Amazônia (GMT-4)</option>
                <option value="America/Noronha">Horário de Fernando de Noronha (GMT-2)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Configurações de Áudio */}
        <div
          className="rounded-xl p-4"
          style={{ background: '#1F2026', border: '1px solid #404048' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Volume2 size={20} style={{ color: '#3b82f6' }} />
            <h3 className="font-semibold">Áudio</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>
                Volume Padrão: {config.volumePadrao}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={config.volumePadrao}
                onChange={(e) => setConfig({ ...config, volumePadrao: parseInt(e.target.value) })}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #DB1931 ${config.volumePadrao}%, #404048 ${config.volumePadrao}%)` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: '#9ca3af' }}>Auto-play ao iniciar</span>
              <button
                onClick={() => setConfig({ ...config, autoPlay: !config.autoPlay })}
                className="w-10 h-6 rounded-full relative transition-colors"
                style={{ background: config.autoPlay ? '#22c55e' : '#404048' }}
              >
                <div
                  className="w-4 h-4 rounded-full bg-white absolute top-1 transition-transform"
                  style={{ left: config.autoPlay ? '22px' : '4px' }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Configurações de Chamadas */}
        <div
          className="rounded-xl p-4"
          style={{ background: '#1F2026', border: '1px solid #404048' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Mic size={20} style={{ color: '#f59e0b' }} />
            <h3 className="font-semibold">Chamadas</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>
                Fade In: {config.chamadaFadeIn}s
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={config.chamadaFadeIn}
                onChange={(e) => setConfig({ ...config, chamadaFadeIn: parseInt(e.target.value) })}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #f59e0b ${(config.chamadaFadeIn / 10) * 100}%, #404048 ${(config.chamadaFadeIn / 10) * 100}%)` }}
              />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>
                Fade Out: {config.chamadaFadeOut}s
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={config.chamadaFadeOut}
                onChange={(e) => setConfig({ ...config, chamadaFadeOut: parseInt(e.target.value) })}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #f59e0b ${(config.chamadaFadeOut / 10) * 100}%, #404048 ${(config.chamadaFadeOut / 10) * 100}%)` }}
              />
            </div>
          </div>
        </div>

        {/* Notificações */}
        <div
          className="rounded-xl p-4"
          style={{ background: '#1F2026', border: '1px solid #404048' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Bell size={20} style={{ color: '#22c55e' }} />
            <h3 className="font-semibold">Notificações</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: '#9ca3af' }}>Receber notificações</span>
              <button
                onClick={() => setConfig({ ...config, notificacoes: !config.notificacoes })}
                className="w-10 h-6 rounded-full relative transition-colors"
                style={{ background: config.notificacoes ? '#22c55e' : '#404048' }}
              >
                <div
                  className="w-4 h-4 rounded-full bg-white absolute top-1 transition-transform"
                  style={{ left: config.notificacoes ? '22px' : '4px' }}
                />
              </button>
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>E-mail para notificações</label>
              <input
                type="email"
                value={config.emailNotificacoes}
                onChange={(e) => setConfig({ ...config, emailNotificacoes: e.target.value })}
                className="w-full rounded-lg px-4 py-2 outline-none"
                style={{ background: '#282930', border: '1px solid #404048', color: '#fff' }}
              />
            </div>
          </div>
        </div>

        {/* Segurança */}
        <div
          className="rounded-xl p-4 lg:col-span-2"
          style={{ background: '#1F2026', border: '1px solid #404048' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield size={20} style={{ color: '#ef4444' }} />
            <h3 className="font-semibold">Segurança</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>Nova Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full rounded-lg px-4 py-2 pr-10 outline-none"
                  style={{ background: '#282930', border: '1px solid #404048', color: '#fff' }}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#9ca3af' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>Confirmar Senha</label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full rounded-lg px-4 py-2 outline-none"
                style={{ background: '#282930', border: '1px solid #404048', color: '#fff' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}