import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import {
  hashPassword,
  validatePassword,
  createToken,
  createAuthResponse,
} from '@/lib/auth';
import { sendAccountVerificationEmail } from '@/lib/mail';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const username = String(body.username || '').trim().toLowerCase();

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Username, email and password are required.' },
        { status: 400 },
      );
    }

    const passwordError = validatePassword(password);

    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    await connect();

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: 'A user with that email already exists.' },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: 'A user with that username already exists.' },
        { status: 409 },
      );
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

    try {
      await sendAccountVerificationEmail(
        user.email,
        user.username,
        verificationToken,
      );
    } catch (emailError) {
      console.error('Verification email failed:', emailError);
    }

    const token = createToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return createAuthResponse(
      {
        message:
          'Account created successfully. Please check your email and confirm your address.',
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
    console.error('Signup error:', error);

    return NextResponse.json(
      { error: 'Server error while creating account.' },
      { status: 500 },
    );
  }
}