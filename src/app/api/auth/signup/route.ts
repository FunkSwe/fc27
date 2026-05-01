import { NextRequest } from 'next/server';
import crypto from 'crypto';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import { hashPassword, validatePassword } from '@/lib/auth';
import { sendAccountVerificationEmail } from '@/lib/mail';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const username = String(body.username || '').trim().toLowerCase();

  if (!email || !password || !username) {
    return new Response(JSON.stringify({ error: 'Username, email and password are required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const passwordError = validatePassword(password);

  if (passwordError) {
    return new Response(JSON.stringify({ error: passwordError }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await connect();

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      return new Response(JSON.stringify({ error: 'A user with that email already exists.' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'A user with that username already exists.' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const passwordHash = await hashPassword(password);
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationHash = await hashPassword(verificationToken);
  const verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);

  const user = await User.create({
    email,
    username,
    passwordHash,
    role: 'user',
    emailVerified: false,
    emailVerificationToken: verificationHash,
    emailVerificationExpires: verificationExpires,
    isAdmin: false,
  });

  await sendAccountVerificationEmail(user.email, user.username, verificationToken);

  return new Response(
    JSON.stringify({
      message:
        'Account created successfully. Please check your email and confirm your address before logging in.',
    }),
    {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
