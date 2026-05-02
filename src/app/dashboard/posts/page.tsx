'use client';

import { useEffect, useState } from 'react';
import PostModal from '@/app/_components/post/PostModal';
import PostCard from '@/app/_components/post/PostCard';
import styles from '@/app/_components/post/PostStyles.module.scss';

interface PostItem {
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
}

export default function DashboardPostsPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [userRole, setUserRole] = useState('');

  const loadPosts = async () => {
    setLoading(true);
    setError('');

    const response = await fetch('/api/posts?mine=true');

    if (!response.ok) {
      setError('Unable to load your posts.');
      setLoading(false);
      return;
    }

    const data = await response.json();
    setPosts(data);
    setLoading(false);
  };

  const loadUser = async () => {
    try {
      const response = await fetch('/api/auth/me', { cache: 'no-store' });
      if (!response.ok) return;
      const { user } = await response.json();
      setUserRole(user?.role || '');
    } catch {
      setUserRole('');
    }
  };

  useEffect(() => {
    loadPosts();
    loadUser();
  }, []);

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Delete this post?')) {
      return;
    }

    const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });

    if (response.ok) {
      loadPosts();
    } else {
      setError('Could not delete post.');
    }
  };

  return (
    <main className={styles.homePanel}>
      <div className={styles.homeIntro}>
        <div>
          <p className={styles.smallLabel}>Post management</p>
          <h1>My Posts</h1>
          <p>Manage your drafts, edit existing posts, or create new community content.</p>
        </div>
        <button
          type='button'
          className={styles.primaryButton}
          onClick={() => {
            setSelectedPost(null);
            setIsOpen(true);
          }}
        >
          New post
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <p>Loading your posts…</p>
      ) : posts.length === 0 ? (
        <p>You do not have any posts yet.</p>
      ) : (
        <div className={styles.postGrid}>
          {posts.map((post) => (
            <div key={post._id}>
              <PostCard {...post} id={post._id} />
              <div className={styles.actions}>
                <button
                  type='button'
                  className={styles.secondaryButton}
                  onClick={() => {
                    setSelectedPost(post);
                    setIsOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  type='button'
                  className={styles.secondaryButton}
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </button>
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
          imageUrl: selectedPost.imageUrl || '',
          youtubeUrl: selectedPost.youtubeUrl || '',
          linkUrl: selectedPost.linkUrl || '',
          tags: selectedPost.tags.join(', '),
        } : undefined}
        onClose={() => setIsOpen(false)}
        onSaved={loadPosts}
      />
    </main>
  );
}
