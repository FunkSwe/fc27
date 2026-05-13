import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connect from '@/lib/mongoose';
import Conversation from '@/models/Conversation';
import { getCurrentUser } from '@/lib/currentUser';

type Params = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;

  await connect();

  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid conversation id.' }, { status: 400 });
  }

  const conversation = await Conversation.findOne({ _id: id, participants: user.id });
  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
  }

  await Conversation.updateOne(
    { _id: id },
    { $addToSet: { hiddenFor: user.id } },
  );

  return NextResponse.json({ success: true });
}
