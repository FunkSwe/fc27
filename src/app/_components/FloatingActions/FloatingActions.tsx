'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import MessengerModal from '../MessengerModal';
import PostModal from '../post/PostModal';
import styles from './FloatingActions.module.scss';

const PenIcon = () => (
  <svg width='23' height='23' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
    <path d='M4 20h4l10-10-4-4L4 16v4Z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    <path d='M14 6l4 4' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
  </svg>
);

const MessageIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
    <path d='M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6A8.4 8.4 0 0 1 12.5 3H13a8 8 0 0 1 8 8v.5Z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
);

const LoginIcon = () => (
  <svg width='20' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
    <path d='M10 17l5-5-5-5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    <path d='M15 12H3' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
    <path d='M21 19V5a2 2 0 0 0-2-2H13' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
);

type CurrentUser = {
  id: string;
  username: string;
  email: string;
  role: string;
  isAdmin?: boolean;
};

export default function FloatingActions() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        cache: 'no-store',
        credentials: 'include',
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();
      setUser(data.user || null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleAuthChanged = () => checkAuth();
    window.addEventListener('auth-changed', handleAuthChanged);
    window.addEventListener('focus', handleAuthChanged);
    return () => {
      window.removeEventListener('auth-changed', handleAuthChanged);
      window.removeEventListener('focus', handleAuthChanged);
    };
  }, [checkAuth]);

  return (
    <>
      <div className={styles.wrapper} aria-label='Quick actions'>
        {user ? (
          <>
            <button type='button' className={styles.actionButton} onClick={() => setPostModalOpen(true)} aria-label='Create post'>
              <PenIcon />
            </button>
            <button type='button' className={styles.actionButton} onClick={() => setMessagesOpen(true)} aria-label='Open messages'>
              <MessageIcon />
            </button>
          </>
        ) : (
          <Link href='/auth/login' className={styles.loginButton} aria-label='Log in'>
            <LoginIcon />
            Login
          </Link>
        )}
      </div>

      {user && (
        <PostModal
          isOpen={postModalOpen}
          title='Create post'
          role={user.role}
          onClose={() => setPostModalOpen(false)}
          onSaved={() => {
            window.dispatchEvent(new Event('posts-changed'));
          }}
        />
      )}

      <MessengerModal isOpen={messagesOpen} onClose={() => setMessagesOpen(false)} />
    </>
  );
}
