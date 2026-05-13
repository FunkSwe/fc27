import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Participant from '@/models/Participant';
import { getCurrentUser, type CurrentUser } from '@/lib/currentUser';

type AdminAuthResult =
  | { ok: true; user: CurrentUser }
  | { ok: false; response: NextResponse };

async function requireAdmin(request: NextRequest): Promise<AdminAuthResult> {
  const user = await getCurrentUser(request);
  if (!user) return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  if (!user.isAdmin) return { ok: false, response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  return { ok: true, user };
}

export async function GET(request: NextRequest) {
  await connect();
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const participants = await Participant.find({}).sort({ createdAt: -1 }).limit(1000).lean();
  return NextResponse.json(participants);
}

export async function POST(request: NextRequest) {
  await connect();
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const name = String(body.name || '').trim();
  if (!name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 });

  const participant = await Participant.create({
    name,
    email: String(body.email || '').trim().toLowerCase(),
    paid: body.paid === true,
    paymentInfo: String(body.paymentInfo || '').trim(),
    note: String(body.note || '').trim(),
  });

  return NextResponse.json(participant, { status: 201 });
}
