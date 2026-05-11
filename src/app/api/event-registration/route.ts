import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import EventRegistration from '@/models/EventRegistration';
import {
  sendFunkcampAdminRegistrationNotice,
  sendFunkcampRegistrationConfirmation,
} from '@/lib/eventRegistrationMail';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const fullName = String(body.fullName || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const country = String(body.country || '').trim();
    const message = String(body.message || '').trim();
    const hasAttended2025 = Boolean(body.hasAttended2025);

    if (!fullName || fullName.length < 2) {
      return NextResponse.json(
        { error: 'Please enter your full name.' },
        { status: 400 },
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 },
      );
    }

    await connect();

    const registration = await EventRegistration.create({
      fullName,
      email,
      country,
      message,
      hasAttended2025,
    });

    await sendFunkcampRegistrationConfirmation({
      fullName,
      email,
    });

    await sendFunkcampAdminRegistrationNotice({
      fullName,
      email,
      country,
      message,
      hasAttended2025,
    });

    return NextResponse.json(
      {
        success: true,
        registrationId: registration._id.toString(),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Event registration error:', error);

    return NextResponse.json(
      { error: 'Could not send registration. Please try again.' },
      { status: 500 },
    );
  }
}