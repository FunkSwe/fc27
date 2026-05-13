import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connect from '@/lib/mongoose';
import Block from '@/models/Block';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/currentUser';

export async function GET(request: NextRequest) {
  await connect();
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const blocks = await Block.find({ blocker: user.id }).populate('blocked', 'username email role isAdmin').lean();
  return NextResponse.json(blocks);
}

export async function POST(request: NextRequest) {
  await connect();
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.isBanned) return NextResponse.json({ error: 'This account is banned.' }, { status: 403 });

  const body = await request.json();
  const blockedUserId = String(body.blockedUserId || '');
  if (!mongoose.isValidObjectId(blockedUserId)) return NextResponse.json({ error: 'Invalid user id.' }, { status: 400 });
  if (blockedUserId === user.id) return NextResponse.json({ error: 'You cannot block yourself.' }, { status: 400 });

  const target = await User.findById(blockedUserId).select('role isAdmin username').lean();
  if (!target) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  if (target.isAdmin === true || target.role === 'admin') {
    return NextResponse.json({ error: 'Admins cannot be blocked.' }, { status: 403 });
  }

  const block = await Block.findOneAndUpdate(
    { blocker: user.id, blocked: blockedUserId },
    { blocker: user.id, blocked: blockedUserId },
    { new: true, upsert: true },
  );

  return NextResponse.json(block);
}

export async function DELETE(request: NextRequest) {
  await connect();
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const blockedUserId = String(body.blockedUserId || '');
  if (!mongoose.isValidObjectId(blockedUserId)) return NextResponse.json({ error: 'Invalid user id.' }, { status: 400 });

  await Block.deleteOne({ blocker: user.id, blocked: blockedUserId });
  return NextResponse.json({ success: true });
}
