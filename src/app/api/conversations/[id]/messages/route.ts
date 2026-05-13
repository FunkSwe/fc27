import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connect from '@/lib/mongoose';
import Block from '@/models/Block';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { getCurrentUser } from '@/lib/currentUser';

type Params = { params: Promise<{ id: string }> };

async function getConversationForUser(conversationId: string, userId: string) {
  if (!mongoose.isValidObjectId(conversationId)) return null;
  return Conversation.findOne({ _id: conversationId, participants: userId });
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  await connect();
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const conversation = await getConversationForUser(id, user.id);
  if (!conversation) return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });

  const messages = await Message.find({ conversation: id })
    .populate('sender', 'username email role isAdmin')
    .sort({ createdAt: 1 })
    .limit(500)
    .lean();

  await Message.updateMany({ conversation: id, readBy: { $ne: user.id } }, { $addToSet: { readBy: user.id } });

  return NextResponse.json(messages);
}

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  await connect();
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.isBanned) return NextResponse.json({ error: 'This account is banned.' }, { status: 403 });

  const conversation = await getConversationForUser(id, user.id);
  if (!conversation) return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });

  const body = await request.json();
  const text = String(body.body || '').trim();
  if (!text) return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });

  const participantIds = conversation.participants.map((participant: mongoose.Types.ObjectId) => participant.toString());
  const blocks = await Block.find({ blocker: { $in: participantIds }, blocked: user.id }).lean();

  if (blocks.length > 0 && !user.isAdmin) {
    return NextResponse.json({ error: 'You cannot send a message to this conversation.' }, { status: 403 });
  }

  const message = await Message.create({
    conversation: conversation._id,
    sender: user.id,
    body: text,
    readBy: [user.id],
  });

  conversation.lastMessageAt = new Date();
  await conversation.save();

  const populated = await Message.findById(message._id).populate('sender', 'username email role isAdmin').lean();

  return NextResponse.json(populated, { status: 201 });
}
