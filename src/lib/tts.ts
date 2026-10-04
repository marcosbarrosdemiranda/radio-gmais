// Text-to-Speech service
// Supports multiple providers: ElevenLabs, Google TTS, Azure

export interface TTSConfig {
  provider: 'elevenlabs' | 'google' | 'azure' | 'voicestudio';
  apiKey: string;
  voiceId?: string;
  language?: string;
  speed?: number;
  pitch?: number;
  region?: string;
}

export interface TTSResult {
  audioBuffer: Buffer;
  duration: number;
  format: 'mp3' | 'wav' | 'ogg';
}

// Generate speech from text
export async function generateSpeech(
  text: string,
  config: TTSConfig
): Promise<TTSResult> {
  switch (config.provider) {
    case 'elevenlabs':
      return generateElevenLabs(text, config);
    case 'google':
      return generateGoogleTTS(text, config);
    case 'azure':
      return generateAzureTTS(text, config);
    case 'voicestudio':
      return generateVoiceStudioTTS(text, config);
    default:
      throw new Error(`Provider ${config.provider} not supported`);
  }
}

async function generateVoiceStudioTTS(
  text: string,
  config: TTSConfig
): Promise<TTSResult> {
  const response = await fetch('http://localhost:3900/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: config.voiceId || 'alloy',
      response_format: 'mp3',
    }),
  });

  if (!response.ok) {
    throw new Error('VoiceStudio TTS failed');
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  return {
    audioBuffer,
    duration: estimateDuration(text),
    format: 'mp3',
  };
}

async function generateElevenLabs(
  text: string,
  config: TTSConfig
): Promise<TTSResult> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': config.apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error('ElevenLabs TTS failed');
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  return {
    audioBuffer,
    duration: estimateDuration(text),
    format: 'mp3',
  };
}

async function generateGoogleTTS(
  text: string,
  config: TTSConfig
): Promise<TTSResult> {
  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${config.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: config.language || 'pt-BR',
          name: config.voiceId || 'pt-BR-Wavenet-A',
          ssmlGender: 'NEUTRAL',
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: config.speed || 1.0,
          pitch: config.pitch || 0,
        },
      }),
    }
  );

  const data = await response.json();
  const audioBuffer = Buffer.from(data.audioContent, 'base64');
  return {
    audioBuffer,
    duration: estimateDuration(text),
    format: 'mp3',
  };
}

async function generateAzureTTS(
  text: string,
  config: TTSConfig
): Promise<TTSResult> {
  const response = await fetch(
    `https://${config.region || 'brazilsouth'}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': config.apiKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
      },
      body: `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='pt-BR'>
        <voice name='${config.voiceId || 'pt-BR-FranciscoNeural'}'>
          ${text}
        </voice>
      </speak>`,
    }
  );

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  return {
    audioBuffer,
    duration: estimateDuration(text),
    format: 'mp3',
  };
}

// Estimate duration based on text length (Portuguese average: ~150 words/min)
function estimateDuration(text: string): number {
  const words = text.split(/\s+/).length;
  return (words / 150) * 60; // seconds
}

// List available voices for a provider
export async function listVoices(provider: string, apiKey: string) {
  switch (provider) {
    case 'elevenlabs':
      const res = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: { 'xi-api-key': apiKey },
      });
      const data = await res.json();
      return data.voices.map((v: any) => ({
        id: v.voice_id,
        name: v.name,
        language: v.labels?.language || 'multi',
        gender: v.labels?.gender || 'unknown',
        preview: v.preview_url,
      }));
    default:
      return [];
  }
}
