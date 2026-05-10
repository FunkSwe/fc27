'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PostModal from './PostModal';
import PostCard from './PostCard';
import styles from './PostStyles.module.scss';

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

export default function PostHomePanel() {
  const [newsPosts, setNewsPosts] = useState<PostItem[]>([]);
  const [communityPosts, setCommunityPosts] = useState<PostItem[]>([]);
  const [userRole, setUserRole] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Create post');
  const [initialPostType, setInitialPostType] = useState<'news' | 'post'>('post');

  const loadPosts = async () => {
    const [newsResponse, communityResponse] = await Promise.all([
      fetch('/api/posts?type=news'),
      fetch('/api/posts?type=post'),
    ]);

    if (newsResponse.ok) {
      setNewsPosts(await newsResponse.json());
    }

    if (communityResponse.ok) {
      setCommunityPosts(await communityResponse.json());
    }
  };

  const loadUser = async () => {
    try {
      const response = await fetch('/api/auth/me', { cache: 'no-store' });
      if (!response.ok) {
        setIsLoggedIn(false);
        return;
      }
      const { user } = await response.json();
      setUserRole(user?.role || '');
      setIsLoggedIn(true);
    } catch {
      setUserRole('');
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    loadPosts();
    loadUser();
  }, []);

  const handleSaved = () => {
    loadPosts();
  };

  return (
    <section className={styles.homePanel}>
      <div className={styles.homeIntro}>
        <div>
          <p className={styles.smallLabel}>Latest from Funkcamp</p>
          <h2>News and community posts</h2>
          <p>
            Admins can publish news posts here, while everyone can add new
            community updates.
          </p>
        </div>

        <div className={styles.homeActions}>
          <Link href='/dashboard/posts' className={styles.primaryButton}>
            View my posts
          </Link>
          <button
            type='button'
            className={styles.secondaryButton}
            onClick={() => {
              setModalTitle('Create community post');
              setInitialPostType('post');
              setIsOpen(true);
            }}
          >
            Add post
          </button>
          {userRole === 'admin' && (
            <button
              type='button'
              className={styles.secondaryButton}
              onClick={() => {
                setModalTitle('Create news post');
                setInitialPostType('news');
                setIsOpen(true);
              }}
            >
              Add news
            </button>
          )}
        </div>
      </div>

      <div className={styles.sectionGrid}>
        <div>
          <div className={styles.sectionHeader}>
            <h3>NEWS</h3>
          </div>
          <div className={styles.postGrid}>
            {newsPosts.length > 0 ? (
              newsPosts.map((post) => (
                <PostCard key={post._id} {...post} id={post._id} />
              ))
            ) : (
              <p>No news posts yet.</p>
            )}
          </div>
        </div>

        {isLoggedIn && (
          <div>
            <div className={styles.sectionHeader}>
              <h3>POSTS</h3>
            </div>
            <div className={styles.postGrid}>
              {communityPosts.length > 0 ? (
                communityPosts.map((post) => (
                  <PostCard key={post._id} {...post} id={post._id} />
                ))
              ) : (
                <p>No community posts yet.</p>
              )}
            </div>
          </div>
        )}
      </div>

      <PostModal
        isOpen={isOpen}
        title={modalTitle}
        role={userRole}
        initialData={{
          title: '',
          content: '',
          type: initialPostType,
          image: null,
          imageUrl: '',
          youtubeUrl: '',
          linkUrl: '',
          tags: '',
        }}
        onClose={() => setIsOpen(false)}
        onSaved={handleSaved}
      />
    </section>
  );
}
