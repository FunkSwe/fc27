import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connect from '@/lib/mongoose';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const postId = url.searchParams.get('postId');

  if (!postId || !mongoose.isValidObjectId(postId)) {
    return NextResponse.json({ error: 'Invalid post id.' }, { status: 400 });
  }

  await connect();

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: 1 })
    .populate('author', 'username')
    .lean();

  return NextResponse.json(comments);
}

export async function POST(request: NextRequest) {
  const token = getTokenFromRequest(request);

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = verifyToken(token);

  if (!payload || typeof payload.id !== 'string') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const postId = String(body.postId || '').trim();
  const content = String(body.content || '').trim();

  if (!postId || !mongoose.isValidObjectId(postId) || !content) {
    return NextResponse.json(
      { error: 'Post id and comment text are required.' },
      { status: 400 },
    );
  }

  await connect();

  const post = await Post.findById(postId);

  if (!post) {
    return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
  }

  const comment = await Comment.create({
    post: post._id,
    author: payload.id,
    content,
  });

  const result = await Comment.findById(comment._id)
    .populate('author', 'username')
    .lean();

  return NextResponse.json(result, { status: 201 });
}
