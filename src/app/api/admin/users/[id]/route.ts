import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connect from '@/lib/mongoose';
import cloudinary from '@/lib/cloudinary';
import Block from '@/models/Block';
import Comment from '@/models/Comment';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import Post from '@/models/Post';
import User from '@/models/User';
import Warning from '@/models/Warning';
import { getCurrentUser, type CurrentUser } from '@/lib/currentUser';

type Params = { params: Promise<{ id: string }> };

type AdminAuthResult =
  | { ok: true; currentUser: CurrentUser }
  | { ok: false; response: NextResponse };

async function requireAdmin(request: NextRequest): Promise<AdminAuthResult> {
  const currentUser = await getCurrentUser(request);
  if (!currentUser) {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  if (!currentUser.isAdmin) {
    return { ok: false, response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { ok: true, currentUser };
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Invalid user id.' }, { status: 400 });

  await connect();
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const user = await User.findById(id);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  const nextRole = ['user', 'teacher', 'admin'].includes(body.role) ? body.role : user.role;
  const nextIsAdmin = body.isAdmin === true || nextRole === 'admin';
  const nextIsBanned = body.isBanned === true;

  if (user._id.toString() === auth.currentUser.id && nextIsBanned) {
    return NextResponse.json({ error: 'You cannot ban your own account.' }, { status: 400 });
  }

  user.role = nextIsAdmin ? 'admin' : nextRole;
  user.isAdmin = nextIsAdmin;
  user.isBanned = nextIsBanned;
  user.banReason = String(body.banReason || '').trim();

  await user.save();

  const updated = await User.findById(id)
    .select('username email role isAdmin isBanned banReason emailVerified createdAt updatedAt')
    .lean();

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Invalid user id.' }, { status: 400 });

  await connect();
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  if (auth.currentUser.id === id) {
    return NextResponse.json({ error: 'You cannot delete your own account from admin users.' }, { status: 400 });
  }

  const user = await User.findById(id);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  const userPosts = await Post.find({ author: id }).select('image').lean();
  const publicIds = userPosts
    .map((post) => post.image?.publicId)
    .filter((publicId): publicId is string => Boolean(publicId));

  await Promise.allSettled(publicIds.map((publicId) => cloudinary.uploader.destroy(publicId)));

  const postIds = userPosts.map((post) => post._id);
  const conversations = await Conversation.find({ participants: id }).select('_id').lean();
  const conversationIds = conversations.map((conversation) => conversation._id);

  await Promise.all([
    Comment.deleteMany({ $or: [{ author: id }, { post: { $in: postIds } }] }),
    Post.deleteMany({ author: id }),
    Warning.deleteMany({ $or: [{ user: id }, { issuedBy: id }] }),
    Block.deleteMany({ $or: [{ blocker: id }, { blocked: id }] }),
    Message.deleteMany({ $or: [{ sender: id }, { conversation: { $in: conversationIds } }] }),
    Conversation.deleteMany({ _id: { $in: conversationIds } }),
    User.updateMany({}, { $pull: { friends: id, friendRequests: id } }),
  ]);

  await user.deleteOne();

  return NextResponse.json({ success: true });
}
