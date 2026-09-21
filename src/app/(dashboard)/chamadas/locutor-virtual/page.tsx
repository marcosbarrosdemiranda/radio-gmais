'use client';

import { useState } from 'react';
import { Mic, Play, Pause, Volume2, Save, RefreshCw, Settings, Sparkles, Clock } from 'lucide-react';

const vozes = [
  { id: 'pt-BR-1', nome: 'Maria', genero: 'Feminina', estilo: 'Profissional' },
  { id: 'pt-BR-2', nome: 'João', genero: 'Masculino', estilo: 'Profissional' },
  { id: 'pt-BR-3', nome: 'Ana', genero: 'Feminina', estilo: 'Amigável' },
  { id: 'pt-BR-4', nome: 'Pedro', genero: 'Masculino', estilo: 'Narrador' },
];

const velocidades = [
  { value: 0.5, label: 'Lento' },
  { value: 0.75, label: 'Moderado' },
  { value: 1, label: 'Normal' },
  { value: 1.25, label: 'Rápido' },
  { value: 1.5, label: 'Muito Rápido' },
];

const templates = [
  { id: '1', nome: 'Boas-vindas', texto: 'Bem-vindos ao nosso supermercado! Aproveite nossas promoções de hoje!' },
  { id: '2', nome: 'Promoção', texto: 'Atenção clientes! Temos uma promoção especial hoje: {produto} por apenas {preço}!' },
  { id: '3', nome: 'Aviso', texto: 'Aviso importante: {aviso}. Agradecemos pela compreensão.' },
  { id: '4', nome: 'Encerramento', texto: 'Atenção clientes, estamos encerrando as atividades. Agradecemos a preferência!' },
];

export default function LocutorVirtualPage() {
  const [texto, setTexto] = useState('');
  const [vozSelecionada, setVozSelecionada] = useState('pt-BR-1');
  const [velocidade, setVelocidade] = useState(1);
  const [gerando, setGerando] = useState(false);
  const [audioGerado, setAudioGerado] = useState(false);
  const [tocando, setTocando] = useState(false);
  const [creditos, setCreditos] = useState(1000);
  const [historico, setHistorico] = useState([
    { id: '1', texto: 'Bem-vindos ao Supermercado Gmais!', data: '2026-09-20 14:30', duracao: '0:05' },
    { id: '2', texto: 'Promoção especial na padaria hoje!', data: '2026-09-20 10:15', duracao: '0:04' },
  ]);

  const handleGerar = async () => {
    if (!texto.trim()) return;
    
    setGerando(true);
    // Simular geração de áudio
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGerando(false);
    setAudioGerado(true);
    setCreditos(creditos - texto.length);
  };

  const handleTocar = () => {
    setTocando(!tocando);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mic size={28} style={{ color: '#DB1931' }} />
          <div>
            <h1 className="text-2xl font-bold">Locutor Virtual</h1>
            <p style={{ color: '#9ca3af' }}>Gere áudio com Inteligência Artificial</p>
          </div>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{ background: '#1F2026', border: '1px solid #404048' }}
        >
          <Sparkles size={18} style={{ color: '#f59e0b' }} />
          <span className="font-medium">{creditos}</span>
          <span style={{ color: '#9ca3af' }}>créditos</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gerador */}
        <div className="space-y-4">
          {/* Templates */}
          <div
            className="rounded-xl p-4"
            style={{ background: '#1F2026', border: '1px solid #404048' }}
          >
            <h3 className="font-semibold mb-3">📝 Templates</h3>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setTexto(template.texto)}
                  className="text-left p-3 rounded-lg text-sm transition-colors"
                  style={{ background: '#282930', border: '1px solid #404048' }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#DB1931'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#404048'}
                >
                  <p className="font-medium">{template.nome}</p>
                  <p className="text-xs mt-1 truncate" style={{ color: '#9ca3af' }}>
                    {template.texto.substring(0, 40)}...
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Texto */}
          <div
            className="rounded-xl p-4"
            style={{ background: '#1F2026', border: '1px solid #404048' }}
          >
            <h3 className="font-semibold mb-3">✍️ Texto para Converter</h3>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Digite o texto que deseja converter em áudio..."
              rows={6}
              className="w-full rounded-lg px-4 py-3 outline-none resize-none"
              style={{ background: '#282930', border: '1px solid #404048', color: '#fff' }}
            />
            <div className="flex items-center justify-between mt-2 text-sm" style={{ color: '#9ca3af' }}>
              <span>{texto.length} caracteres</span>
              <span>{texto.length} créditos necessários</span>
            </div>
          </div>

          {/* Configurações */}
          <div
            className="rounded-xl p-4"
            style={{ background: '#1F2026', border: '1px solid #404048' }}
          >
            <h3 className="font-semibold mb-3">⚙️ Configurações</h3>
            <div className="space-y-4">
              {/* Voz */}
              <div>
                <label className="block text-sm mb-2" style={{ color: '#9ca3af' }}>Voz</label>
                <div className="grid grid-cols-2 gap-2">
                  {vozes.map((voz) => (
                    <button
                      key={voz.id}
                      onClick={() => setVozSelecionada(voz.id)}
                      className="text-left p-3 rounded-lg transition-colors"
                      style={{
                        background: vozSelecionada === voz.id ? 'rgba(219, 25, 49, 0.2)' : '#282930',
                        border: `1px solid ${vozSelecionada === voz.id ? '#DB1931' : '#404048'}`
                      }}
                    >
                      <p className="font-medium text-sm">{voz.nome}</p>
                      <p className="text-xs" style={{ color: '#9ca3af' }}>{voz.genero} • {voz.estilo}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Velocidade */}
              <div>
                <label className="block text-sm mb-2" style={{ color: '#9ca3af' }}>Velocidade</label>
                <div className="flex gap-2">
                  {velocidades.map((vel) => (
                    <button
                      key={vel.value}
                      onClick={() => setVelocidade(vel.value)}
                      className="flex-1 py-2 rounded-lg text-sm transition-colors"
                      style={{
                        background: velocidade === vel.value ? '#DB1931' : '#282930',
                        color: velocidade === vel.value ? '#fff' : '#9ca3af'
                      }}
                    >
                      {vel.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <button
              onClick={handleGerar}
              disabled={!texto.trim() || gerando || creditos < texto.length}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors"
              style={{
                background: !texto.trim() || gerando || creditos < texto.length ? '#404048' : '#DB1931',
                color: !texto.trim() || gerando || creditos < texto.length ? '#71717a' : '#fff',
                cursor: !texto.trim() || gerando || creditos < texto.length ? 'not-allowed' : 'pointer'
              }}
            >
              {gerando ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  Gerando áudio...
                </>
              ) : (
                <>
                  <Mic size={20} />
                  Gerar Áudio
                </>
              )}
            </button>
          </div>
        </div>

        {/* Resultado e Histórico */}
        <div className="space-y-4">
          {/* Player */}
          {audioGerado && (
            <div
              className="rounded-xl p-4"
              style={{ background: '#1F2026', border: '1px solid #22c55e' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full" style={{ background: '#22c55e' }} />
                <h3 className="font-semibold">Áudio Gerado</h3>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={handleTocar}
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: '#DB1931', color: '#fff' }}
                >
                  {tocando ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                </button>
                <div className="flex-1">
                  <div className="w-full h-2 rounded-full" style={{ background: '#404048' }}>
                    <div className="h-full rounded-full" style={{ width: tocando ? '60%' : '0%', background: '#DB1931' }} />
                  </div>
                  <div className="flex justify-between mt-1 text-xs" style={{ color: '#9ca3af' }}>
                    <span>0:00</span>
                    <span>0:03</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors"
                  style={{ background: '#404048', color: '#fff' }}
                >
                  <Save size={16} />
                  Salvar
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors"
                  style={{ background: '#404048', color: '#fff' }}
                >
                  📢 Tocar Agora
                </button>
              </div>
            </div>
          )}

          {/* Histórico */}
          <div
            className="rounded-xl p-4"
            style={{ background: '#1F2026', border: '1px solid #404048' }}
          >
            <h3 className="font-semibold mb-3">🕐 Histórico</h3>
            <div className="space-y-2">
              {historico.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: '#282930' }}
                >
                  <button
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: '#404048', color: '#fff' }}
                  >
                    <Play size={14} className="ml-0.5" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.texto}</p>
                    <p className="text-xs" style={{ color: '#9ca3af' }}>
                      {item.data} • {item.duracao}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Informações */}
          <div
            className="rounded-xl p-4"
            style={{ background: '#1F2026', border: '1px solid #404048' }}
          >
            <h3 className="font-semibold mb-3">ℹ️ Informações</h3>
            <div className="text-sm space-y-2" style={{ color: '#9ca3af' }}>
              <p><span style={{ color: '#fff' }}>Créditos:</span> 1 caractere = 1 crédito</p>
              <p><span style={{ color: '#fff' }}>Formato:</span> MP3 de alta qualidade</p>
              <p><span style={{ color: '#fff' }}>Uso:</span> Chamadas instantâneas e playlists</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}