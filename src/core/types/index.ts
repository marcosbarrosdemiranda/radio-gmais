export interface Chamada {
  id: string;
  titulo: string;
  texto: string;
  tipo: 'locutor-virtual' | 'aniversario' | 'funcionario' | 'instantanea' | 'estacionamento';
  vozId?: string;
  audioUrl?: string;
  duracao?: number;
  ativa: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Musica {
  id: string;
  titulo: string;
  artista: string;
  album?: string;
  duracao: number;
  arquivoUrl: string;
  genero?: string;
  favorita: boolean;
  criadoEm: string;
}

export interface Playlist {
  id: string;
  nome: string;
  descricao?: string;
  musicas: Musica[];
  chamadas: Chamada[];
  intervaloChamadas: number; // minutos entre chamadas
  ativa: boolean;
  criadoEm: string;
}

export interface Locutor {
  id: string;
  nome: string;
  vozId: string;
  idioma: string;
  genero: 'masculino' | 'feminino';
  provedor: 'elevenlabs' | 'google' | 'azure';
  configuracoes: Record<string, any>;
}

export interface PlayerState {
  tocando: boolean;
  musicaAtual: Musica | null;
  playlist: Playlist | null;
  fila: (Musica | Chamada)[];
  volume: number;
  modo: 'playlist' | 'manual' | 'chamada';
}
