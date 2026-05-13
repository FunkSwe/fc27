import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connect from '@/lib/mongoose';
import Post from '@/models/Post';
import Warning from '@/models/Warning';
import { getCurrentUser } from '@/lib/currentUser';

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: 'Invalid post id.' }, { status: 400 });

  await connect();
  const admin = await getCurrentUser(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!admin.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const post = await Post.findById(id);
  if (!post) return NextResponse.json({ error: 'Post not found.' }, { status: 404 });

  const body = await request.json();
  const message = String(body.message || '').trim();
  if (!message) return NextResponse.json({ error: 'Warning message is required.' }, { status: 400 });

  const warning = await Warning.create({
    user: post.author,
    post: post._id,
    issuedBy: admin.id,
    message,
  });

  return NextResponse.json(warning, { status: 201 });
}
