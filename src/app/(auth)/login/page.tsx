'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao fazer login');
        setLoading(false);
        return;
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111217', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem' }}>🎙️</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>
              Radio Gmais
            </h1>
          </div>
          <p style={{ color: '#9ca3af', margin: 0 }}>Sua rádio ambiente exclusiva!</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} style={{ background: '#1F2026', border: '1px solid #404048', borderRadius: '0.75rem', padding: '1.5rem' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '0.875rem', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@radiogmais.com.br"
              required
              style={{
                width: '100%',
                background: '#16171B',
                border: '1px solid #404048',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#DB1931'}
              onBlur={(e) => e.target.style.borderColor = '#404048'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Senha</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                background: '#16171B',
                border: '1px solid #404048',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#DB1931'}
              onBlur={(e) => e.target.style.borderColor = '#404048'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '2.25rem',
                background: 'none',
                border: 'none',
                color: '#71717a',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#404048' : '#DB1931',
              color: loading ? '#71717a' : '#fff',
              fontWeight: 500,
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.background = '#B21125';
            }}
            onMouseOut={(e) => {
              if (!loading) e.currentTarget.style.background = '#DB1931';
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          {/* Demo credentials hint */}
          <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#71717a', marginTop: '1.5rem' }}>
            <p style={{ margin: '0 0 0.25rem 0' }}>Credenciais de teste:</p>
            <p style={{ color: '#9ca3af', margin: 0 }}>admin@radiogmais.com.br / admin123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
