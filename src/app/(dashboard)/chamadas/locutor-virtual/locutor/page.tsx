'use client';

import { useState } from 'react';
import { Mic, Volume2, Save, Loader2, Play } from 'lucide-react';
import * as googleTTS from 'google-tts-api';

interface ChamadaGerada {
  titulo: string;
  url: string;
}

export default function LocutorPage() {
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [idioma, setIdioma] = useState('pt-BR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Preview
  const [previewAudio, setPreviewAudio] = useState<string | null>(null);

  const gerarAudio = async () => {
    if (!titulo || !texto) {
      setError('Por favor, preencha o título e o texto do spot.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/locutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ titulo, texto, idioma }),
      });

      if (!response.ok) {
        throw new Error('Falha ao processar a geração de voz.');
      }

      const data = await response.json();
      setPreviewAudio(data.arquivo);
      setSuccess(true);
      setTexto('');
      setTitulo('');

    } catch (err: any) {
      setError(err.message || 'Erro ao comunicar com a API.');
    } finally {
      setLoading(false);
    }
  };

  const tocarPreviewLocal = () => {
     if(!texto) return;
     // Toca direto no navegador sem salvar, para o usuário ouvir antes de confirmar
     try {
         const url = googleTTS.getAudioUrl(texto, {
          lang: idioma,
          slow: false,
          host: 'https://translate.google.com',
         });
         const a = new Audio(url);
         a.play();
     } catch (err) {
         console.log(err)
     }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Mic className="text-blue-500" />
          Locutor Virtual (TTS)
        </h1>
        <p className="text-gray-400">Gere spots comerciais e avisos utilizando vozes sintéticas gratuitas do Google.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl p-6" style={{ background: '#1F2026', border: '1px solid #404048' }}>
          <h2 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Criar Novo Spot</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">Título Visual (Para reconhecer depois)</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex:- Promoção Black Friday 30%"
                className="w-full bg-gray-800 rounded-lg p-3 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
               <label className="block text-sm font-medium mb-1 text-gray-400">Voz / Sotaque</label>
               <select
                   value={idioma}
                   onChange={e => setIdioma(e.target.value)}
                   className="w-full bg-gray-800 rounded-lg p-3 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
               >
                   <option value="pt-BR">Português do Brasil</option>
                   <option value="pt-PT">Português de Portugal</option>
                   <option value="en-US">Inglês (Americano)</option>
                   <option value="es-ES">Espanhol</option>
               </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">Texto para Locução</label>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                rows={5}
                placeholder="Atenção clientes! Oferta relâmpago no setor de frios, confira..."
                className="w-full bg-gray-800 rounded-lg p-3 text-white border border-gray-700 focus:outline-none focus:border-blue-500 resize-none"
              />
               <p className="text-xs text-gray-500 mt-1">Recomendamos até 200 caracteres para melhor processamento gratuito.</p>
            </div>

            {error && (
              <div className="text-red-500 text-sm p-3 bg-red-500/10 rounded-lg">
                ❌ {error}
              </div>
            )}

            {success && (
                <div className="text-green-500 text-sm p-3 bg-green-500/10 rounded-lg">
                  ✅ Áudio gerado e adicionado às Chamadas com sucesso!
                </div>
            )}

            <div className="flex gap-3 pt-2">
                 <button
                    onClick={tocarPreviewLocal}
                    disabled={!texto}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white p-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
                  >
                    <Play size={18} /> Ouvir Teste
                  </button>

                 <button
                    onClick={gerarAudio}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {loading ? 'Processando...' : 'Salvar no Acervo'}
                  </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
            <div className="rounded-xl p-6" style={{ background: '#1F2026', border: '1px solid #404048' }}>
               <h2 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">O que acontece agora?</h2>
               <ul className="text-gray-400 space-y-3 text-sm">
                   <li className="flex items-start gap-2">
                       <span className="text-blue-500 mt-1">1.</span>
                       <span>O texto digitado é processado gratuitamente pelos servidores do Google (Web TTS).</span>
                   </li>
                   <li className="flex items-start gap-2">
                       <span className="text-blue-500 mt-1">2.</span>
                       <span>Um arquivo real em formato MP3 é guardado no disco do seu servidor, para funcionar offline e economizar banda.</span>
                   </li>
                   <li className="flex items-start gap-2">
                       <span className="text-blue-500 mt-1">3.</span>
                       <span>A gravação já entra automaticamente na lista de <b>Chamadas e Acervo</b>, ficando liberada para o Player tocar durante a programação se você pedir.</span>
                   </li>
               </ul>
            </div>

            {previewAudio && (
               <div className="rounded-xl p-6" style={{ background: '#16653420', border: '1px solid #16a34a50' }}>
                   <h2 className="text-lg font-semibold mb-4 text-green-500">Último spot gerado</h2>

                   <audio src={previewAudio} controls className="w-full mt-2" />
               </div>
            )}
        </div>
      </div>
    </div>
  );
}
