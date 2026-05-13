import { NextRequest } from 'next/server';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);

  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const payload = verifyToken(token);

  if (!payload || typeof payload.id !== 'string') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await connect();

  const user = await User.findById(payload.id).select('-passwordHash').lean();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const normalizedUser = {
    ...user,
    id: String(user._id),
    role: user.isAdmin === true || user.role === 'admin' ? 'admin' : user.role,
    isAdmin: user.isAdmin === true || user.role === 'admin',
  };

  return new Response(JSON.stringify({ user: normalizedUser }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
