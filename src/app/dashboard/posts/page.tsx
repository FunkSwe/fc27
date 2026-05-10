'use client';

import { useEffect, useState } from 'react';
import PostModal from '@/app/_components/post/PostModal';
import PostCard from '@/app/_components/post/PostCard';
import styles from '@/app/_components/post/PostStyles.module.scss';

interface PostImageData {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
}

interface PostItem {
  _id: string;
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

export default function DashboardPostsPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [userRole, setUserRole] = useState('');
  const [viewMode, setViewMode] = useState<'mine' | 'all' | 'community' | 'news'>('mine');

  const buildPostsUrl = (role = userRole, mode = viewMode) => {
    if (role === 'admin') {
      if (mode === 'all') return '/api/posts?all=true&limit=100';
      if (mode === 'community') return '/api/posts?type=post&limit=100';
      if (mode === 'news') return '/api/posts?type=news&limit=100';
    }

    return '/api/posts?mine=true&limit=100';
  };

  const loadPosts = async (role = userRole, mode = viewMode) => {
    setLoading(true);
    setError('');

    const response = await fetch(buildPostsUrl(role, mode), { cache: 'no-store' });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error || (role === 'admin' ? 'Unable to load posts for moderation.' : 'Unable to load your posts.'));
      setLoading(false);
      return;
    }

    const data = await response.json();
    setPosts(data);
    setLoading(false);
  };

  const loadUserAndPosts = async () => {
    try {
      const response = await fetch('/api/auth/me', { cache: 'no-store' });
      if (!response.ok) {
        await loadPosts('');
        return;
      }
      const { user } = await response.json();
      const role = user?.role || '';
      const startMode = role === 'admin' ? 'all' : 'mine';
      setUserRole(role);
      setViewMode(startMode);
      await loadPosts(role, startMode);
    } catch {
      setUserRole('');
      await loadPosts('');
    }
  };

  useEffect(() => {
    loadUserAndPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Delete this post?')) return;

    const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    if (response.ok) {
      loadPosts(userRole, viewMode);
    } else {
      setError('Could not delete post.');
    }
  };

  return (
    <main className={styles.homePanel}>
      <div className={styles.homeIntro}>
        <div>
          <p className={styles.smallLabel}>Post management</p>
          <h1>{userRole === 'admin' ? 'Post Moderation' : 'My Posts'}</h1>
          <p>{userRole === 'admin' ? 'Create posts/news, check your own posts, and moderate all user content.' : 'Manage your posts, edit existing posts, or create new community content.'}</p>
        </div>
        <button type='button' className={styles.primaryButton} onClick={() => { setSelectedPost(null); setIsOpen(true); }}>
          New post
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {userRole === 'admin' && (
        <div className={styles.actions}>
          {[
            ['all', 'All posts'],
            ['mine', 'My posts'],
            ['community', 'Community posts'],
            ['news', 'News'],
          ].map(([mode, label]) => (
            <button
              key={mode}
              type='button'
              className={viewMode === mode ? styles.primaryButton : styles.secondaryButton}
              onClick={() => {
                const nextMode = mode as 'mine' | 'all' | 'community' | 'news';
                setViewMode(nextMode);
                loadPosts(userRole, nextMode);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {loading ? <p>Loading posts…</p> : posts.length === 0 ? <p>No posts found.</p> : (
        <div className={styles.postGrid}>
          {posts.map((post) => (
            <div key={post._id}>
              <PostCard {...post} id={post._id} />
              <div className={styles.actions}>
                <button type='button' className={styles.secondaryButton} onClick={() => { setSelectedPost(post); setIsOpen(true); }}>Edit</button>
                <button type='button' className={styles.secondaryButton} onClick={() => handleDelete(post._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <PostModal
        isOpen={isOpen}
        title={selectedPost ? 'Edit post' : 'Create post'}
        role={userRole}
        initialData={selectedPost ? {
          id: selectedPost._id,
          title: selectedPost.title,
          content: selectedPost.content,
          type: selectedPost.type,
          image: selectedPost.image || null,
          imageUrl: selectedPost.imageUrl || '',
          youtubeUrl: selectedPost.youtubeUrl || '',
          linkUrl: selectedPost.linkUrl || '',
          tags: selectedPost.tags.join(', '),
        } : undefined}
        onClose={() => setIsOpen(false)}
        onSaved={() => loadPosts(userRole, viewMode)}
      />
    </main>
  );
}
