import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import { hashPassword, validatePassword } from '@/lib/auth';
import { sendAccountCreatedEmail } from '@/lib/mail';

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

    await User.create({
      email,
      username,
      passwordHash,
      role: 'user',
      emailVerified: true,
      isAdmin: false,
    });

    try {
      await sendAccountCreatedEmail(email, username);
    } catch (emailError) {
      console.error('Account created email failed:', emailError);
    }

    return NextResponse.json(
      {
        message:
          'Account created successfully. You can now log in.',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Signup error:', error);

    return NextResponse.json(
      { error: 'Server error while creating account.' },
      { status: 500 },
    );
  }
}