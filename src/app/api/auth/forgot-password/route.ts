import { NextRequest } from 'next/server';
import crypto from 'crypto';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/mail';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = String(body.email || '').trim().toLowerCase();

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await connect();

  const user = await User.findOne({ email });

  if (user) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = await hashPassword(resetToken);
    const expires = new Date(Date.now() + 1000 * 60 * 60);

    user.passwordResetToken = tokenHash;
    user.passwordResetExpires = expires;
    await user.save();

    await sendPasswordResetEmail(user.email, user.username, resetToken);
  }

  return new Response(
    JSON.stringify({ message: 'If an account exists with that email, a password reset link has been sent.' }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
