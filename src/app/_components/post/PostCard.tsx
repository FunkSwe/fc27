'use client';

import Link from 'next/link';
import styles from './PostStyles.module.scss';

interface PostImageData {
  url: string;
  publicId?: string;
}

export interface PostCardProps {
  id: string;
  title: string;
  content: string;
  type: 'news' | 'post';
  image?: PostImageData | null;
  imageUrl?: string;
  youtubeUrl?: string;
  linkUrl?: string;
  tags: string[];
  author: { username: string } | string;
  createdAt: string;
}

export default function PostCard({ id, title, content, type, image, imageUrl, youtubeUrl, linkUrl, tags, author, createdAt }: PostCardProps) {
  const authorName = typeof author === 'string' ? author : author?.username || 'Unknown';
  const preview = content.replace(/<[^>]+>/g, '').slice(0, 170) + '...';
  const displayImageUrl = image?.url || imageUrl || '';

  return (
    <article className={styles.postCard}>
      <div className={styles.postHero}>
        <span className={styles.postBadge}>{type === 'news' ? 'News' : 'Post'}</span>
        {displayImageUrl ? <img className={styles.postImage} src={displayImageUrl} alt={title} /> : null}
      </div>

      <div className={styles.postBody}>
        <h3>{title}</h3>
        <p>{preview}</p>
        {youtubeUrl ? <p className={styles.postMeta}>YouTube: {youtubeUrl}</p> : null}
        {linkUrl ? <p className={styles.postMeta}>Link: <a href={linkUrl} target='_blank' rel='noreferrer'>{linkUrl}</a></p> : null}
        <div className={styles.postFooter}>
          <span>{authorName}</span>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
        <div className={styles.postTags}>
          {tags?.map((tag) => <span key={tag} className={styles.postTag}>{tag}</span>)}
        </div>
        <Link href={`/posts/${id}`} className={styles.postLink}>Read more</Link>
      </div>
    </article>
  );
}
