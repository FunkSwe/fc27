'use client';

import Link from 'next/link';
import CommentSection from './CommentSection';
import styles from './PostStyles.module.scss';

interface PostDetailProps {
  post: {
    _id: string;
    title: string;
    content: string;
    type: 'news' | 'post';
    imageUrl?: string;
    youtubeUrl?: string;
    linkUrl?: string;
    tags: string[];
    author: { username: string } | string;
    createdAt: string;
  };
  initialComments: Array<{
    _id: string;
    content: string;
    author: { username: string } | string;
    createdAt: string;
  }>;
}

export default function PostDetailClient({ post, initialComments }: PostDetailProps) {
  const authorName = typeof post.author === 'string' ? post.author : post.author.username || 'Unknown';

  return (
    <main className={styles.homePanel}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.smallLabel}>{post.type === 'news' ? 'News' : 'Community post'}</p>
          <h1>{post.title}</h1>
          <p className={styles.postMeta}>By {authorName} · {new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
        <Link href='/' className={styles.secondaryButton}>Back home</Link>
      </div>

      {post.imageUrl ? <img className={styles.postImage} src={post.imageUrl} alt={post.title} /> : null}
      {post.youtubeUrl ? (
        <div style={{ marginTop: '1.5rem' }}>
          <iframe
            width='100%'
            height='420'
            src={post.youtubeUrl.replace('watch?v=', 'embed/')}
            title={post.title}
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        </div>
      ) : null}

      <article style={{ marginTop: '2rem' }}>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        {post.linkUrl ? (
          <p style={{ marginTop: '1.5rem' }}>
            Related link: <a href={post.linkUrl} target='_blank' rel='noreferrer'>{post.linkUrl}</a>
          </p>
        ) : null}
      </article>

      <CommentSection postId={post._id} initialComments={initialComments} />
    </main>
  );
}
