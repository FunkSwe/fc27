'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/Login.module.scss';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      setStatus('error');
      setMessage('Missing or invalid verification link.');
      return;
    }

    async function verifyEmail() {
      const response = await fetch(
        `/api/auth/verify-email?token=${encodeURIComponent(token as string)}&email=${encodeURIComponent(
          email as string,
        )}`,
      );
      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(data?.error || 'Verification failed.');
        return;
      }

      setStatus('success');
      setMessage(data?.message || 'Email verified successfully.');
    }

    verifyEmail();
  }, [searchParams]);

  return (
    <main className={styles.authPage}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Funkcamp 2027</p>
        <h1>Email Verification</h1>
        <p>{message}</p>
      </section>

      <section className={styles.formSection}>
        <div className={styles.formContainer}>
          <div className={styles.form}>
            {status === 'success' && (
              <p className={styles.success}>
                Your email is confirmed.{' '}
                <Link href='/auth/login'>Log in now</Link>.
              </p>
            )}
            {status === 'error' && (
              <p className={styles.error}>
                {message}{' '}
                <Link href='/auth/forgot-password'>Request a new link</Link>.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
