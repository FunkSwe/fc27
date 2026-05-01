import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import { verifyPassword } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);

    const token = String(url.searchParams.get('token') || '');
    const email = String(url.searchParams.get('email') || '')
      .trim()
      .toLowerCase();

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Missing verification token or email.' },
        { status: 400 },
      );
    }

    await connect();

    const user = await User.findOne({ email }).select(
      '+emailVerificationToken +emailVerificationExpires',
    );

    if (!user) {
      console.error('Verify email failed: user not found', { email });

      return NextResponse.json(
        { error: 'Invalid or expired verification link.' },
        { status: 400 },
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'Your email is already verified. You can log in.' },
        { status: 200 },
      );
    }

    if (!user.emailVerificationToken) {
      console.error('Verify email failed: missing token in database', {
        email,
      });

      return NextResponse.json(
        { error: 'Invalid or expired verification link.' },
        { status: 400 },
      );
    }

    if (!user.emailVerificationExpires) {
      console.error('Verify email failed: missing expiry in database', {
        email,
      });

      return NextResponse.json(
        { error: 'Invalid or expired verification link.' },
        { status: 400 },
      );
    }

    if (user.emailVerificationExpires < new Date()) {
      console.error('Verify email failed: token expired', {
        email,
        expires: user.emailVerificationExpires,
      });

      return NextResponse.json(
        { error: 'Invalid or expired verification link.' },
        { status: 400 },
      );
    }

    const isValid = await verifyPassword(token, user.emailVerificationToken);

    if (!isValid) {
      console.error('Verify email failed: token does not match', {
        email,
      });

      return NextResponse.json(
        { error: 'Invalid or expired verification link.' },
        { status: 400 },
      );
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    return NextResponse.json(
      { message: 'Your email has been verified. You can now log in.' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Verify email server error:', error);

    return NextResponse.json(
      { error: 'Server error while verifying email.' },
      { status: 500 },
    );
  }
}