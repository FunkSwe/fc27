import { NextRequest } from 'next/server';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import { verifyPassword, createToken, createAuthResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Email and password are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await connect();

  const user = await User.findOne({ email });

  if (!user) {
    return new Response(JSON.stringify({ error: 'Invalid email or password.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    return new Response(JSON.stringify({ error: 'Invalid email or password.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = createToken({ id: user._id.toString(), email: user.email, role: user.role });

  return createAuthResponse(
    {
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
        emailVerified: user.emailVerified,
        isAdmin: user.isAdmin,
      },
    },
    token
  );
}
