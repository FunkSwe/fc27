import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connect from '@/lib/mongoose';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { getCurrentUser } from '@/lib/currentUser';

type Params = { params: Promise<{ id: string; messageId: string }> };

async function getConversationForUser(conversationId: string, userId: string) {
  if (!mongoose.isValidObjectId(conversationId)) return null;
  return Conversation.findOne({ _id: conversationId, participants: userId });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id, messageId } = await params;

  await connect();

  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.isBanned) return NextResponse.json({ error: 'This account is banned.' }, { status: 403 });

  if (!mongoose.isValidObjectId(messageId)) {
    return NextResponse.json({ error: 'Invalid message id.' }, { status: 400 });
  }

  const conversation = await getConversationForUser(id, user.id);
  if (!conversation) return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });

  const message = await Message.findOne({ _id: messageId, conversation: id });
  if (!message) return NextResponse.json({ error: 'Message not found.' }, { status: 404 });

  if (message.sender.toString() !== user.id) {
    return NextResponse.json({ error: 'You can only edit your own messages.' }, { status: 403 });
  }

  if (message.isDeleted) {
    return NextResponse.json({ error: 'Deleted messages cannot be edited.' }, { status: 400 });
  }

  const body = await request.json();
  const text = String(body.body || '').trim();

  if (!text) return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
  if (text.length > 2000) {
    return NextResponse.json({ error: 'Message is too long.' }, { status: 400 });
  }

  if (!message.originalBody) message.originalBody = message.body;
  message.body = text;
  message.editedAt = new Date();
  await message.save();

  const populated = await Message.findById(message._id)
    .populate('sender', 'username email role isAdmin')
    .lean();

  return NextResponse.json(populated);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id, messageId } = await params;

  await connect();

  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!mongoose.isValidObjectId(messageId)) {
    return NextResponse.json({ error: 'Invalid message id.' }, { status: 400 });
  }

  const conversation = await getConversationForUser(id, user.id);
  if (!conversation) return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });

  const message = await Message.findOne({ _id: messageId, conversation: id });
  if (!message) return NextResponse.json({ error: 'Message not found.' }, { status: 404 });

  if (message.sender.toString() !== user.id && !user.isAdmin) {
    return NextResponse.json({ error: 'You can only delete your own messages.' }, { status: 403 });
  }

  message.originalBody = message.originalBody || message.body;
  message.body = 'Message deleted';
  message.isDeleted = true;
  message.deletedAt = new Date();
  await message.save();

  const populated = await Message.findById(message._id)
    .populate('sender', 'username email role isAdmin')
    .lean();

  return NextResponse.json(populated);
}
