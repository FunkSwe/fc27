import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connect from '@/lib/mongoose';
import Participant from '@/models/Participant';
import { getCurrentUser, type CurrentUser } from '@/lib/currentUser';

type Params = { params: Promise<{ id: string }> };

type AdminAuthResult =
  | { ok: true; user: CurrentUser }
  | { ok: false; response: NextResponse };

async function requireAdmin(request: NextRequest): Promise<AdminAuthResult> {
  const user = await getCurrentUser(request);
  if (!user) return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  if (!user.isAdmin) return { ok: false, response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  return { ok: true, user };
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Invalid participant id.' }, { status: 400 });

  await connect();
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const participant = await Participant.findById(id);
  if (!participant) return NextResponse.json({ error: 'Participant not found.' }, { status: 404 });

  participant.name = String(body.name || '').trim();
  participant.email = String(body.email || '').trim().toLowerCase();
  participant.paid = body.paid === true;
  if (typeof body.attended === 'boolean') {
    participant.attended = body.attended;
  }
  participant.paymentInfo = String(body.paymentInfo || '').trim();
  participant.note = String(body.note || '').trim();

  if (!participant.name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 });

  await participant.save();
  return NextResponse.json(participant);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Invalid participant id.' }, { status: 400 });

  await connect();
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  await Participant.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
