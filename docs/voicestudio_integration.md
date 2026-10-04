# Integração VoiceStudio (Alternativa ElevenLabs 100% Local)

## Objetivo
Implementar a integração do VoiceStudio como um motor de Text-To-Speech (TTS) no módulo "Locutor Virtual". 
Isto servirá como uma alternativa local, de custo zero e alta qualidade (via OmniVoice e K2) para diminuir os custos com inferências de API (Google, Azure, ElevenLabs, OpenAI).

## Como Funcionará
- O VoiceStudio provê uma API local (default em `http://localhost:3900/v1/audio/speech`).
- A API é 100% compátivel com o padrão da OpenAI.
- No `LocutorVirtual.tsx`, adicionaremos algumas vozes virtuais mapeadas para o provedor `voicestudio`.
- No `api/locutor/route.ts`, adicionaremos uma condicional `motor === 'voicestudio'` para despachar a requisição localmente e salvar o áudio gerado de forma semelhante à integração da OpenAI.

## Vantagens
- Custo zero por geração.
- Reduz o tempo de round-trip da rede ao gerar na máquina local.
- Compatibilidade nativa com a infraestrutura atual, podendo ser estendido para clonagem de locutores do supermercado diretamente no app desktop do VoiceStudio.
