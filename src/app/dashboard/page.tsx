'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.scss';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: string;
  emailVerified: boolean;
  isAdmin: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      setLoading(true);
      const response = await fetch('/api/auth/me');

      if (!response.ok) {
        router.push('/auth/login');
        return;
      }

      const data = await response.json();
      setUser(data.user);
      setLoading(false);
    }

    fetchMe();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <main className={styles.dashboardPage}>
        <p>Loading dashboard…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={styles.dashboardPage}>
        <p>Unable to load your account.</p>
      </main>
    );
  }

  return (
    <main className={styles.dashboardPage}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Funkcamp 2027</p>
        <h1>Your Dashboard</h1>
        <p>Manage posts, messages, and your community presence.</p>
      </section>

      <section className={styles.userHeader}>
        <div className={styles.userGreeting}>
          <p className={styles.subtitle}>Welcome back,</p>
          <h2>{user.username}</h2>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Log out
        </button>
      </section>

      <section className={styles.content}>
        <div className={styles.card}>
          <h3>Account Details</h3>
          <div className={styles.details}>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <p>
              <strong>Email Verified:</strong>{' '}
              {user.emailVerified ? '✓ Yes' : '✗ No'}
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          <Link href='/dashboard/posts' className={styles.linkCard}>
            <h3>Posts</h3>
            <p>Create and manage your posts.</p>
          </Link>
          <Link href='/dashboard/messages' className={styles.linkCard}>
            <h3>Messages</h3>
            <p>View direct chats and group conversations.</p>
          </Link>
          <Link href='/dashboard/profile' className={styles.linkCard}>
            <h3>Profile</h3>
            <p>Update account details and settings.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
