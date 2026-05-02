import connect from '@/lib/mongoose';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import PostDetailClient from '@/app/_components/post/PostDetailClient';

async function getPostAndComments(id: string) {
  await connect();

  const post = await Post.findById(id).populate('author', 'username').lean();

  if (!post) {
    return null;
  }

  const comments = await Comment.find({ post: id })
    .sort({ createdAt: 1 })
    .populate('author', 'username')
    .lean();

  return {
    post: JSON.parse(JSON.stringify(post)),
    comments: JSON.parse(JSON.stringify(comments)),
  };
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const data = await getPostAndComments(params.id);

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
