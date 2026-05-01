import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import { verifyPassword, createToken, createAuthResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 },
      );
    }

    await connect();

    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 },
      );
    }

    if (!user.passwordHash) {
      console.error('Login failed: passwordHash missing for user', {
        email,
        userId: user._id.toString(),
      });

      return NextResponse.json(
        { error: 'Server error while logging in.' },
        { status: 500 },
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 },
      );
    }

    const token = createToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

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
      token,
    );
  } catch (error) {
    console.error('Login error:', error);

    return NextResponse.json(
      { error: 'Server error while logging in.' },
      { status: 500 },
    );
  }
}