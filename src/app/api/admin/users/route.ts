import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/currentUser';

export async function GET(request: NextRequest) {
  await connect();
  const currentUser = await getCurrentUser(request);

  if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!currentUser.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const users = await User.find({})
    .select('username email role isAdmin isBanned banReason emailVerified createdAt updatedAt')
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();

  return NextResponse.json(users);
}
