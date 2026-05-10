import { cookies } from 'next/headers';
import connect from '@/lib/mongoose';
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import PostDetailClient from '@/app/_components/post/PostDetailClient';

async function getPostAndComments(id: string) {
  await connect();

  const post = await Post.findById(id).populate('author', 'username role').lean();
  if (!post) return null;

  if (post.type === 'post') {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    const payload = token ? verifyToken(token) : null;
    if (!payload || typeof payload.id !== 'string') return 'unauthorized' as const;
  }

  const comments = await Comment.find({ post: id })
    .sort({ createdAt: 1 })
    .populate('author', 'username')
    .lean();

  return { post: JSON.parse(JSON.stringify(post)), comments: JSON.parse(JSON.stringify(comments)) };
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getPostAndComments(id);

  if (data === 'unauthorized') {
    return (
      <main style={{ padding: '3rem', maxWidth: 960, margin: '0 auto' }}>
        <h1>Login required</h1>
        <p>This is a community post. Please log in to view it.</p>
      </main>
    );
  }

  if (!data || !data.post) {
    return (
      <main style={{ padding: '3rem', maxWidth: 960, margin: '0 auto' }}>
        <h1>Post not found</h1>
        <p>The requested post does not exist or it has been removed.</p>
      </main>
    );
  }

  return <PostDetailClient post={data.post} initialComments={data.comments} />;
}
