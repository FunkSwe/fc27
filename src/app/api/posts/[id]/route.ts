import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connect from '@/lib/mongoose';
import cloudinary from '@/lib/cloudinary';
import Post from '@/models/Post';
import { getCurrentUser } from '@/lib/currentUser';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Invalid post id.' }, { status: 400 });

  await connect();

  const post = await Post.findById(id).populate('author', 'username role isAdmin').lean();
  if (!post) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  if (post.type === 'post') {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'You need to be logged in to view community posts.' }, { status: 401 });
    }
  }

  return NextResponse.json(post);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Invalid post id.' }, { status: 400 });

  await connect();
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const post = await Post.findById(id);
  if (!post) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  const isOwner = post.author.toString() === user.id;
  const isAdmin = user.isAdmin;
  if (!isOwner && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

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

  if (!title || !content) return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
  if (type === 'news' && !isAdmin) return NextResponse.json({ error: 'Only administrators can mark a post as news.' }, { status: 403 });

  const oldPublicId = post.image?.publicId;
  const newPublicId = image?.publicId;

  post.title = title;
  post.content = content;
  post.type = type;
  post.image = image;
  post.imageUrl = imageUrl;
  post.youtubeUrl = youtubeUrl;
  post.linkUrl = linkUrl;
  post.tags = tags;
  await post.save();

  if (oldPublicId && newPublicId && oldPublicId !== newPublicId) {
    await cloudinary.uploader.destroy(oldPublicId);
  }

  return NextResponse.json(post);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Invalid post id.' }, { status: 400 });

  await connect();
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const post = await Post.findById(id);
  if (!post) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  const isOwner = post.author.toString() === user.id;
  const isAdmin = user.isAdmin;
  if (!isOwner && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  if (post.image?.publicId) {
    await cloudinary.uploader.destroy(post.image.publicId);
  }

  await post.deleteOne();
  return NextResponse.json({ success: true });
}
