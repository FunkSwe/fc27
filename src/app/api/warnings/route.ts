import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Warning from '@/models/Warning';
import { getCurrentUser } from '@/lib/currentUser';

export async function GET(request: NextRequest) {
  await connect();
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const filter = user.isAdmin ? {} : { user: user.id };
  const warnings = await Warning.find(filter)
    .populate('user', 'username email')
    .populate('issuedBy', 'username email')
    .populate('post', 'title type')
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  return NextResponse.json(warnings);
}
