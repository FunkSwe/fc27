import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { getCurrentUser } from '@/lib/currentUser';

export async function GET(request: NextRequest) {
  await connect();

  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const conversations = await Conversation.find({
    participants: user.id,
    hiddenFor: { $ne: user.id },
  })
    .select('_id')
    .lean();

  const conversationIds = conversations.map((conversation) => conversation._id);

  if (conversationIds.length === 0) {
    return NextResponse.json({ count: 0 });
  }

  const count = await Message.countDocuments({
    conversation: { $in: conversationIds },
    sender: { $ne: user.id },
    readBy: { $ne: user.id },
    isDeleted: { $ne: true },
  });

  return NextResponse.json({ count });
}
