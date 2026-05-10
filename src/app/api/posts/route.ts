import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongoose';
import Post from '@/models/Post';
import { getCurrentUser } from '@/lib/currentUser';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const mine = url.searchParams.get('mine') === 'true';
  const all = url.searchParams.get('all') === 'true';
  const limit = Math.min(Number(url.searchParams.get('limit') || '20'), 200);

  await connect();
  const user = await getCurrentUser(request);

  if (mine) {
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const posts = await Post.find({ author: user.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('author', 'username role isAdmin')
      .lean();

    return NextResponse.json(posts);
  }

  if (all) {
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!user.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('author', 'username role isAdmin')
      .lean();

    return NextResponse.json(posts);
  }

  const filter: Record<string, unknown> = { published: true };

  if (type === 'news') {
    filter.type = 'news';
  } else if (type === 'post') {
    if (!user) {
      return NextResponse.json(
        { error: 'You need to be logged in to view community posts.' },
        { status: 401 },
      );
    }
    filter.type = 'post';
  } else if (!user) {
    filter.type = 'news';
  }

  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('author', 'username role isAdmin')
    .lean();

  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  await connect();
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const title = String(body.title || '').trim();
  const content = String(body.content || '').trim();
  const type = body.type === 'news' ? 'news' : 'post';
  const image = body.image && typeof body.image === 'object' ? body.image : null;
  const imageUrl = String(body.imageUrl || '').trim();
  const youtubeUrl = String(body.youtubeUrl || '').trim();
  const linkUrl = String(body.linkUrl || '').trim();
  const tags = Array.isArray(body.tags)
    ? body.tags.map((tag: unknown) => String(tag).trim()).filter(Boolean)
    : String(body.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean);

  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
  }

  if (type === 'news' && !user.isAdmin) {
    return NextResponse.json({ error: 'Only administrators can create news posts.' }, { status: 403 });
  }

  const post = await Post.create({
    author: user.id,
    title,
    content,
    type,
    image,
    imageUrl,
    youtubeUrl,
    linkUrl,
    tags,
    published: true,
  });

  return NextResponse.json(post, { status: 201 });
}
