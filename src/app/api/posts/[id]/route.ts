import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connect from '@/lib/mongoose';
import Post from '@/models/Post';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid post id.' }, { status: 400 });
  }

  await connect();

  const post = await Post.findById(id)
    .populate('author', 'username role')
    .lean();

  if (!post) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid post id.' }, { status: 400 });
  }

  const token = getTokenFromRequest(request);

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = verifyToken(token);

  if (!payload || typeof payload.id !== 'string') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connect();

  const post = await Post.findById(id);

  if (!post) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }

  const isOwner = post.author.toString() === payload.id;
  const isAdmin = payload.role === 'admin';

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const title = String(body.title || '').trim();
  const content = String(body.content || '').trim();
  const type = body.type === 'news' ? 'news' : 'post';
  const imageUrl = String(body.imageUrl || '').trim();
  const youtubeUrl = String(body.youtubeUrl || '').trim();
  const linkUrl = String(body.linkUrl || '').trim();
  const tags = Array.isArray(body.tags)
    ? body.tags.map(String).map((tag) => tag.trim()).filter(Boolean)
    : String(body.tags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

  if (!title || !content) {
    return NextResponse.json(
      { error: 'Title and content are required.' },
      { status: 400 },
    );
  }

  if (type === 'news' && !isAdmin) {
    return NextResponse.json(
      { error: 'Only administrators can mark a post as news.' },
      { status: 403 },
    );
  }

  post.title = title;
  post.content = content;
  post.type = type;
  post.imageUrl = imageUrl;
  post.youtubeUrl = youtubeUrl;
  post.linkUrl = linkUrl;
  post.tags = tags;
  await post.save();

  return NextResponse.json(post);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid post id.' }, { status: 400 });
  }

  const token = getTokenFromRequest(request);

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = verifyToken(token);

  if (!payload || typeof payload.id !== 'string') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connect();

  const post = await Post.findById(id);

  if (!post) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }

  const isOwner = post.author.toString() === payload.id;
  const isAdmin = payload.role === 'admin';

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await post.deleteOne();

  return NextResponse.json({ success: true });
}
