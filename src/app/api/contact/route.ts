import { NextRequest, NextResponse } from 'next/server';
import {
  CONTACT_ACKNOWLEDGEMENT,
  sendFunkcampContactQuestion,
} from '@/lib/contactMail';

export const runtime = 'nodejs';

function hasControlCharacters(value: string) {
  return /[\u0000-\u001f\u007f-\u009f]/.test(value);
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Please send a valid contact form.' },
      { status: 400 },
    );
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json(
      { error: 'Please send a valid contact form.' },
      { status: 400 },
    );
  }

  const fields = body as Record<string, unknown>;

  if (
    typeof fields.fullName !== 'string' ||
    hasControlCharacters(fields.fullName)
  ) {
    return NextResponse.json(
      { error: 'Please enter your name (up to 100 characters).' },
      { status: 400 },
    );
  }

  const fullName = fields.fullName.trim();

  if (!fullName || fullName.length > 100) {
    return NextResponse.json(
      { error: 'Please enter your name (up to 100 characters).' },
      { status: 400 },
    );
  }

  if (
    typeof fields.email !== 'string' ||
    hasControlCharacters(fields.email)
  ) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 },
    );
  }

  const email = fields.email.trim().toLowerCase();

  if (
    !email ||
    email.length > 254 ||
    !/^[^\s@<>()\[\]\\,;:"]+@[^\s@<>()\[\]\\,;:"]+\.[^\s@<>()\[\]\\,;:"]+$/.test(email)
  ) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 },
    );
  }

  if (typeof fields.message !== 'string') {
    return NextResponse.json(
      { error: 'Please enter your question (up to 5,000 characters).' },
      { status: 400 },
    );
  }

  const message = fields.message.trim();

  if (!message || message.length > 5000) {
    return NextResponse.json(
      { error: 'Please enter your question (up to 5,000 characters).' },
      { status: 400 },
    );
  }

  try {
    await sendFunkcampContactQuestion({ fullName, email, message });

    return NextResponse.json({
      success: true,
      message: CONTACT_ACKNOWLEDGEMENT,
    });
  } catch (error) {
    console.error('Funkcamp contact delivery error:', error);

    return NextResponse.json(
      {
        error:
          'Could not send your question. Please try again or email funkcampswe@gmail.com.',
      },
      { status: 500 },
    );
  }
}
