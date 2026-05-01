import { NextRequest } from 'next/server';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import { verifyPassword } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const token = String(url.searchParams.get('token') || '');
  const email = String(url.searchParams.get('email') || '').trim().toLowerCase();

  if (!token || !email) {
    return new Response(JSON.stringify({ error: 'Missing verification token or email.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await connect();

  const user = await User.findOne({ email }).select(
    '+emailVerificationToken +emailVerificationExpires'
  );

  if (
    !user ||
    !user.emailVerificationToken ||
    !user.emailVerificationExpires ||
    user.emailVerificationExpires < new Date()
  ) {
    return new Response(JSON.stringify({ error: 'Invalid or expired verification link.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const isValid = await verifyPassword(token, user.emailVerificationToken);

  if (!isValid) {
    return new Response(JSON.stringify({ error: 'Invalid or expired verification link.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  return new Response(
    JSON.stringify({ message: 'Your email has been verified. You can now log in.' }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
