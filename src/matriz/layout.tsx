'use client';
import { useEffect } from 'react';

export default function MatrizLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const interval = setInterval(async () => {
        await fetch('/api/monitor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'online', message: 'Servidor Matriz ativo' })
        }).catch(console.error);
    }, 60000); // Heartbeat da Matriz a cada 1 minuto

    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}
