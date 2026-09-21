import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import db from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'radio-gmais-secret-key-change-in-production';
const TOKEN_EXPIRY = '24h';

export interface User {
  id: string;
  email: string;
  nome: string;
  perfil: string; // 'admin' | 'operador' | 'locutor'
  lojaId?: string;
  ativo: boolean;
}

export interface AuthToken {
  userId: string;
  email: string;
  nome: string;
  perfil: string;
  lojaId?: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Create JWT token
export function createToken(user: AuthToken): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

// Verify JWT token (Node.js runtime)
export function verifyToken(token: string): AuthToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthToken;
  } catch {
    return null;
  }
}

// Get current user from request
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  // Get user from database
  const user = db.prepare('SELECT * FROM usuarios WHERE id = ? AND ativo = 1').get(payload.userId) as any;

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    nome: user.nome,
    perfil: user.perfil,
    lojaId: user.loja_id,
    ativo: user.ativo === 1,
  };
}

// Login function
export async function login(email: string, password: string): Promise<{ user: User; token: string } | null> {
  const user = db.prepare('SELECT * FROM usuarios WHERE email = ? AND ativo = 1').get(email) as any;

  if (!user) return null;

  const validPassword = await verifyPassword(password, user.senha);
  if (!validPassword) return null;

  const tokenPayload: AuthToken = {
    userId: user.id,
    email: user.email,
    nome: user.nome,
    perfil: user.perfil,
    lojaId: user.loja_id,
  };

  const token = createToken(tokenPayload);

  // Update last login
  db.prepare("UPDATE usuarios SET ultimo_login = datetime('now') WHERE id = ?").run(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      nome: user.nome,
      perfil: user.perfil,
      lojaId: user.loja_id,
      ativo: true,
    },
    token,
  };
}

// Create user
export async function createUser(
  email: string,
  password: string,
  nome: string,
  perfil: string = 'operador',
  lojaId?: string
): Promise<User> {
  const id = crypto.randomUUID();
  const hashedPassword = await hashPassword(password);

  db.prepare(
    'INSERT INTO usuarios (id, email, senha, nome, perfil, loja_id) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, email, hashedPassword, nome, perfil, lojaId || null);

  return {
    id,
    email,
    nome,
    perfil,
    lojaId,
    ativo: true,
  };
}

// Logout (clear cookie)
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}
