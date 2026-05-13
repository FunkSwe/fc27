import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/currentUser';

export async function GET(request: NextRequest) {
  await connect();
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.isBanned) return NextResponse.json({ error: 'This account is banned.' }, { status: 403 });

  const url = new URL(request.url);
  const q = String(url.searchParams.get('q') || '').trim();
  if (q.length < 2) return NextResponse.json([]);

  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const users = await User.find({
    _id: { $ne: user.id },
    isBanned: { $ne: true },
    $or: [{ username: regex }, { email: regex }],
  })
    .select('username email role isAdmin')
    .limit(20)
    .lean();

  return NextResponse.json(users);
}
