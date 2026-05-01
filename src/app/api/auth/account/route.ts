import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import {
  getTokenFromRequest,
  verifyToken,
  verifyPassword,
  hashPassword,
  validatePassword,
} from '@/lib/auth';

export async function PATCH(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload || typeof payload.id !== 'string') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const currentPassword = String(body.currentPassword || '');
    const newPassword = String(body.newPassword || '');

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required.' },
        { status: 400 },
      );
    }

    const passwordError = validatePassword(newPassword);

    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    await connect();

    const user = await User.findById(payload.id).select('+passwordHash');

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isCurrentPasswordValid = await verifyPassword(
      currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect.' },
        { status: 400 },
      );
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    return NextResponse.json(
      { message: 'Password changed successfully.' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Change password error:', error);

    return NextResponse.json(
      { error: 'Server error while changing password.' },
      { status: 500 },
    );
  }
}