import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export const AUTH_COOKIE_NAME = 'fc_token';
const JWT_SECRET = process.env.JWT_SECRET as string;
const TOKEN_EXPIRY = '7d';
const SALT_ROUNDS = 10;

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET environment variable');
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function validatePassword(password: string) {
  const value = String(password);

  if (value.length < 8) {
    return 'Password must be at least 8 characters long.';
  }

  if (value.length > 128) {
    return 'Password cannot exceed 128 characters.';
  }

  if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/[0-9]/.test(value)) {
    return 'Password must contain uppercase, lowercase, and a number.';
  }

  return null;
}

export function createToken(payload: Record<string, unknown>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function parseCookies(cookieHeader?: string | null) {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(';').reduce<Record<string, string>>((cookies, cookie) => {
    const [name, ...rest] = cookie.split('=');
    const value = rest.join('=').trim();

    cookies[name.trim()] = decodeURIComponent(value);
    return cookies;
  }, {});
}

export function getTokenFromRequest(request: Request) {
  const cookieHeader = request.headers.get('cookie');
  const cookies = parseCookies(cookieHeader);
  return cookies[AUTH_COOKIE_NAME];
}

export function createAuthResponse(body: unknown, token?: string, status = 200) {
  const response = NextResponse.json(body, { status });

  if (token) {
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });
  }

  return response;
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
  });

  return response;
}
