'use client';

import { useState } from 'react';
import { Mic, Save, Loader2, Play, Sparkles, Cpu, Globe, KeyRound } from 'lucide-react';

export default function LocutorPage() {
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [idioma, setIdioma] = useState('pt-BR');
  const [motor, setMotor] = useState('microsoft'); // Padrão recomendado
  const [vozId, setVozId] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [previewAudio, setPreviewAudio] = useState<string | null>(null);

  const gerarAudio = async () => {
    if (!titulo || !texto) {
      setError('Por favor, preencha o título e o texto do spot.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/locutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ titulo, texto, idioma, motor, vozId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao processar a geração de voz.');
      }

      setPreviewAudio(data.arquivo);
      setSuccess(data.message);
      setTexto('');
      setTitulo('');

    } catch (err: any) {
      setError(err.message || 'Erro ao comunicar com a API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Mic className="text-blue-500" />
          Locutor Virtual (Multimotor)
        </h1>
        <p className="text-gray-400">Gere spots comerciais utilizando Inteligências Artificiais e salve no acervo offline.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Painel Esquerdo: Text/Config */}
        <div className="rounded-xl p-6 xl:col-span-2" style={{ background: '#1F2026', border: '1px solid #404048' }}>
          <h2 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Configurar Spot</h2>

          <div className="space-y-4">

            {/* MOTORES Grid */}
            <label className="block text-sm font-medium mb-1 text-gray-400">1. Escolha o Motor de Voz:</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
               {/* 0. GOOGLE */}
               <div
                  onClick={() => {setMotor('google'); setVozId('');}}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${motor === 'google' ? 'border-green-500 bg-green-500/10' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}`}
               >
                  <Globe className={`mb-2 ${motor === 'google' ? 'text-green-500' : 'text-gray-400'}`} size={24} />
                  <h3 className="font-bold text-sm">Google TTS</h3>
                  <p className="text-xs text-gray-400 mt-1">Básico, robótico, mas muito rápido e 100% gratuito.</p>
               </div>

               {/* 1. MICROSOFT */}
               <div
                  onClick={() => {setMotor('microsoft'); setVozId('pt-BR-FranciscaNeural');}}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-colors relative overflow-hidden ${motor === 'microsoft' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}`}
               >
                  <div className="absolute top-0 right-0 bg-blue-500 text-xs px-2 py-0.5 rounded-bl-lg font-bold">RECOMENDADO</div>
                  <Sparkles className={`mb-2 ${motor === 'microsoft' ? 'text-blue-500' : 'text-gray-400'}`} size={24} />
                  <h3 className="font-bold text-sm">MS Edge Neural</h3>
                  <p className="text-xs text-gray-400 mt-1">Emulação das vozes super realistas do Windows. 100% Grátis!</p>
               </div>

               {/* 3. XTTS LOCAL */}
               <div
                  onClick={() => {setMotor('coqui'); setVozId('');}}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${motor === 'coqui' ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}`}
               >
                  <Cpu className={`mb-2 ${motor === 'coqui' ? 'text-purple-500' : 'text-gray-400'}`} size={24} />
                  <h3 className="font-bold text-sm">Servidor XTTS (Local)</h3>
                  <p className="text-xs text-gray-400 mt-1">Clonagem de voz via GPU. Requer setup Python e placa de vídeo.</p>
               </div>

               {/* 4. PREMIUM */}
               <div
                  onClick={() => setMotor('elevenlabs')}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${motor === 'elevenlabs' ? 'border-amber-500 bg-amber-500/10' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}`}
               >
                  <KeyRound className={`mb-2 ${motor === 'elevenlabs' ? 'text-amber-500' : 'text-gray-400'}`} size={24} />
                  <h3 className="font-bold text-sm text-gray-300">ElevenLabs (Premium)</h3>
                  <p className="text-xs text-gray-400 mt-1">Requer API Key no config do sistema para habilitar.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-400">2. Identificação / Nome Visual</label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ex: Oferta Black Friday"
                    className="w-full bg-gray-800 rounded-lg p-3 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                   <label className="block text-sm font-medium mb-1 text-gray-400">Seleção de Voz / Estilo</label>

                   {motor === 'microsoft' && (
                       <select value={vozId} onChange={e => setVozId(e.target.value)} className="w-full bg-gray-800 rounded-lg p-3 text-white border border-gray-700 focus:outline-none focus:border-blue-500">
                           <option value="pt-BR-FranciscaNeural">Francisca (Feminino Brasil - Natural)</option>
                           <option value="pt-BR-AntonioNeural">Antônio (Masculino Brasil - Forte)</option>
                           <option value="pt-PT-RaquelNeural">Raquel (Português Portugal)</option>
                       </select>
                   )}
                   {motor === 'google' && (
                       <select value={idioma} onChange={e => setIdioma(e.target.value)} className="w-full bg-gray-800 rounded-lg p-3 text-white border border-gray-700 focus:outline-none focus:border-blue-500">
                           <option value="pt-BR">Português (Brasil)</option>
                           <option value="en-US">Inglês (Standard)</option>
                       </select>
                   )}
                   {motor === 'coqui' && (
                       <input type="text" value={vozId} onChange={e => setVozId(e.target.value)} placeholder="Nome do speaker local (Ex: joao_clone)" className="w-full bg-gray-800 rounded-lg p-3 text-gray-300 border border-gray-700" />
                   )}
                   {motor === 'elevenlabs' && (
                       <input type="text" value={vozId} onChange={e => setVozId(e.target.value)} placeholder="ID da Voz (Ex: EXAVITQu4vr4...)" className="w-full bg-gray-800 rounded-lg p-3 text-gray-300 border border-gray-700" />
                   )}
                </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">3. Roteiro / Locução</label>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                rows={4}
                placeholder="Hoje tem oferta especial na seção de padaria, aproveite..."
                className="w-full bg-gray-800 rounded-lg p-3 text-white border border-gray-700 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {error && <div className="text-red-400 text-sm p-3 bg-red-900/40 border border-red-800 rounded-lg mb-2">❌ {error}</div>}
            {success && <div className="text-green-400 text-sm p-3 bg-green-900/40 border border-green-800 rounded-lg mb-2">✅ {success}</div>}

            <button
                onClick={gerarAudio}
                disabled={loading}
                className={`w-full p-4 rounded-lg flex items-center justify-center gap-2 font-bold transition-all
                   ${motor === 'elvenlabs' ? 'bg-amber-600 hover:bg-amber-700 text-white' :
                     motor === 'microsoft' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                     'bg-gray-700 hover:bg-gray-600 text-white'}
                `}
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {loading ? 'Processando e gravando...' : 'GERAR ÁUDIO E SALVAR'}
            </button>

            {motor === 'microsoft' && (
                <p className="text-xs text-center text-blue-400 mt-2">✨ Não esqueça de rodar `npm install msedge-tts` no console se der erro!</p>
            )}
          </div>
        </div>

        {/* Painel Direito: Resultados */}
        <div className="space-y-6">
            <div className="rounded-xl p-6" style={{ background: '#1F2026', border: '1px solid #404048' }}>
               <h2 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Arquitetura GMais</h2>
               <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                   Todos os motores geram o áudio e deixam salvos <b>offline</b> dentro do servidor.
                   Isso significa que, se sua internet cair amanhã, as chamadas que você gerou hoje via IA ainda vão tocar normalmente nas caixas de som!
               </p>
            </div>

            {previewAudio && (
               <div className="rounded-xl p-6 shadow-[0_0_15px_rgba(34,197,94,0.15)]" style={{ background: '#16653420', border: '1px solid #16a34a50' }}>
                   <h2 className="text-lg font-semibold mb-4 text-green-500">Ouça sua criação!</h2>
                   <p className="text-sm text-gray-300 mb-2">Foi salvo no banco de dados. Já está aparecendo na tela de Player.</p>
                   <audio src={previewAudio} controls autoPlay className="w-full mt-2" />
               </div>
            )}
        </div>
      </div>
    </div>
  );
}
