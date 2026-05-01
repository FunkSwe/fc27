import { NextRequest } from 'next/server';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import { hashPassword, verifyPassword, validatePassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = String(body.email || '').trim().toLowerCase();
  const token = String(body.token || '');
  const password = String(body.password || '');

  if (!email || !token || !password) {
    return new Response(JSON.stringify({ error: 'Email, token and new password are required.' }), {
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

  const user = await User.findOne({ email }).select('+passwordResetToken +passwordResetExpires');

  if (
    !user ||
    !user.passwordResetToken ||
    !user.passwordResetExpires ||
    user.passwordResetExpires < new Date()
  ) {
    return new Response(JSON.stringify({ error: 'Invalid or expired password reset token.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resetTokenMatches = await verifyPassword(token, user.passwordResetToken);

  if (!resetTokenMatches) {
    return new Response(JSON.stringify({ error: 'Invalid or expired password reset token.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  user.passwordHash = await hashPassword(password);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return new Response(JSON.stringify({ message: 'Your password has been reset successfully.' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
