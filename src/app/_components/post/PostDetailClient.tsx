'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CommentSection from './CommentSection';
import PostModal from './PostModal';
import styles from './PostStyles.module.scss';

type PostAuthor = {
  _id?: string;
  username?: string;
  role?: string;
  isAdmin?: boolean;
};

interface PostDetailProps {
  post: {
    _id: string;
    title: string;
    content: string;
    type: 'news' | 'post';
    image?: { url: string; publicId?: string; width?: number; height?: number } | null;
    imageUrl?: string;
    youtubeUrl?: string;
    linkUrl?: string;
    tags: string[];
    author: PostAuthor | string;
    createdAt: string;
  };
  initialComments: Array<{
    _id: string;
    content: string;
    author: { username: string } | string;
    createdAt: string;
  }>;
}

type Viewer = {
  id: string;
  role?: string;
  isAdmin?: boolean;
};

export default function PostDetailClient({ post, initialComments }: PostDetailProps) {
  const router = useRouter();
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [error, setError] = useState('');

  const authorName = typeof post.author === 'string' ? post.author : post.author.username || 'Unknown';
  const authorId = typeof post.author === 'string' ? '' : post.author._id || '';
  const displayImageUrl = post.image?.url || post.imageUrl || '';
  const canManagePost = Boolean(viewer && (viewer.isAdmin || viewer.id === authorId));

  useEffect(() => {
    async function loadViewer() {
      const response = await fetch('/api/auth/me', { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json().catch(() => null);
      if (data?.user) setViewer(data.user);
    }

    loadViewer();
  }, []);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;

    setError('');
    const response = await fetch(`/api/posts/${post._id}`, { method: 'DELETE' });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error || 'Could not delete post.');
      return;
    }

    router.push('/dashboard/posts');
    router.refresh();
  };

  const handleSaved = () => {
    setIsEditOpen(false);
    router.refresh();
  };

  return (
    <main className={styles.homePanel}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.smallLabel}>{post.type === 'news' ? 'News' : 'Community post'}</p>
          <h1>{post.title}</h1>
          <p className={styles.postMeta}>By {authorName} · {new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
        <div className={styles.detailActions}>
          {canManagePost ? (
            <>
              <button type='button' className={styles.secondaryButton} onClick={() => setIsEditOpen(true)}>
                Edit
              </button>
              <button type='button' className={styles.secondaryButton} onClick={handleDelete}>
                Delete
              </button>
            </>
          ) : null}
          <Link href='/' className={styles.secondaryButton}>Back home</Link>
        </div>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      {displayImageUrl ? <img className={styles.postDetailImage} src={displayImageUrl} alt={post.title} /> : null}
      {post.youtubeUrl ? (
        <div className={styles.videoEmbed}>
          <iframe width='100%' height='420' src={post.youtubeUrl.replace('watch?v=', 'embed/')} title={post.title} frameBorder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowFullScreen />
        </div>
      ) : null}

      <article className={styles.postDetailBody}>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        {post.linkUrl ? <p className={styles.relatedLink}>Related link: <a href={post.linkUrl} target='_blank' rel='noreferrer'>{post.linkUrl}</a></p> : null}
      </article>

      <CommentSection postId={post._id} initialComments={initialComments} />

      <PostModal
        isOpen={isEditOpen}
        title='Edit post'
        role={viewer?.role}
        initialData={{
          id: post._id,
          title: post.title,
          content: post.content,
          type: post.type,
          image: post.image ? {
            url: post.image.url,
            publicId: post.image.publicId || '',
            width: post.image.width,
            height: post.image.height,
          } : null,
          imageUrl: post.imageUrl || '',
          youtubeUrl: post.youtubeUrl || '',
          linkUrl: post.linkUrl || '',
          tags: post.tags.join(', '),
        }}
        onClose={() => setIsEditOpen(false)}
        onSaved={handleSaved}
      />
    </main>
  );
}
