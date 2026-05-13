import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connect from '@/lib/mongoose';
import Block from '@/models/Block';
import Conversation from '@/models/Conversation';
import User from '@/models/User';
import { getCurrentUser } from '@/lib/currentUser';

function uniqueIds(ids: string[]) {
  return Array.from(new Set(ids.filter((id) => mongoose.isValidObjectId(id))));
}

export async function GET(request: NextRequest) {
  await connect();
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const conversations = await Conversation.find({ participants: user.id })
    .populate('participants', 'username email role isAdmin')
    .sort({ lastMessageAt: -1, updatedAt: -1 })
    .limit(100)
    .lean();

  return NextResponse.json(conversations);
}

export async function POST(request: NextRequest) {
  await connect();
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.isBanned) return NextResponse.json({ error: 'This account is banned.' }, { status: 403 });

  const body = await request.json();
  const participantIds = uniqueIds([user.id, ...(Array.isArray(body.participantIds) ? body.participantIds.map(String) : [])]);

  if (participantIds.length < 2) {
    return NextResponse.json({ error: 'Choose at least one person to message.' }, { status: 400 });
  }

  const participants = await User.find({ _id: { $in: participantIds }, isBanned: { $ne: true } })
    .select('username email role isAdmin')
    .lean();

  if (participants.length !== participantIds.length) {
    return NextResponse.json({ error: 'One or more selected users could not be added.' }, { status: 400 });
  }

  const blocks = await Block.find({
    $or: [
      { blocker: { $in: participantIds }, blocked: user.id },
      { blocker: user.id, blocked: { $in: participantIds } },
    ],
  }).lean();

  if (blocks.length > 0 && !user.isAdmin) {
    return NextResponse.json({ error: 'A block prevents this conversation from being created.' }, { status: 403 });
  }

  const isGroup = body.isGroup === true || participantIds.length > 2;
  const name = String(body.name || '').trim();

  if (!isGroup) {
    const existing = await Conversation.findOne({
      isGroup: false,
      participants: { $all: participantIds, $size: 2 },
    })
      .populate('participants', 'username email role isAdmin')
      .lean();

    if (existing) return NextResponse.json(existing);
  }

  const conversation = await Conversation.create({
    participants: participantIds,
    isGroup,
    name: isGroup ? name : '',
    createdBy: user.id,
    lastMessageAt: new Date(),
  });

  const populated = await Conversation.findById(conversation._id)
    .populate('participants', 'username email role isAdmin')
    .lean();

  return NextResponse.json(populated, { status: 201 });
}
