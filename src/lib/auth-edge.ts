// Edge-compatible auth utilities (no Node.js modules)
// Used in middleware and Edge Runtime

import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'radio-gmais-secret-key-change-in-production'
);

export interface AuthToken {
  userId: string;
  email: string;
  nome: string;
  perfil: string;
  lojaId?: string;
}

// Verify JWT token (Edge compatible)
export async function verifyTokenEdge(token: string): Promise<AuthToken | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AuthToken;
  } catch {
    return null;
  }
}
