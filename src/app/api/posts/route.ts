import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Post from '@/models/Post';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const mine = url.searchParams.get('mine') === 'true';
  const limit = Number(url.searchParams.get('limit') || '20');

  await connect();

  if (mine) {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload || typeof payload.id !== 'string') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const posts = await Post.find({ author: payload.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('author', 'username role')
      .lean();

    return NextResponse.json(posts);
  }

  const filter: Record<string, unknown> = { published: true };

  if (type === 'news' || type === 'post') {
    filter.type = type;
  }

  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('author', 'username role')
    .lean();

  return NextResponse.json(posts);
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

  if (type === 'news' && payload.role !== 'admin') {
    return NextResponse.json(
      { error: 'Only administrators can create news posts.' },
      { status: 403 },
    );
  }

  await connect();

  const post = await Post.create({
    author: payload.id,
    title,
    content,
    type,
    imageUrl,
    youtubeUrl,
    linkUrl,
    tags,
    published: true,
  });

  return NextResponse.json(post, { status: 201 });
}
