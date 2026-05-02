'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PostForm from '@/app/_components/post/PostForm';
import styles from '@/app/_components/post/PostStyles.module.scss';

export default function NewPostPage() {
  const router = useRouter();
  const [role, setRole] = useState('');

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!response.ok) return;
        const { user } = await response.json();
        setRole(user?.role || '');
      } catch {
        setRole('');
      }
    }

    loadUser();
  }, []);

  return (
    <main className={styles.homePanel}>
      <div className={styles.homeIntro}>
        <div>
          <p className={styles.smallLabel}>Create a new post</p>
          <h1>New Post</h1>
          <p>Publish a community update or, for admins, a news announcement.</p>
        </div>
      </div>

      <PostForm onSuccess={() => router.push('/dashboard/posts')} userRole={role} />
    </main>
  );
}
