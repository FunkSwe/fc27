'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/Login.module.scss';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');

    if (tokenParam) {
      setToken(tokenParam);
    }

    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token, password }),
    });

    setLoading(false);

    const data = await response.json();

    if (!response.ok) {
      setError(data?.error || 'Unable to reset your password.');
      return;
    }

    setMessage(data?.message || 'Password reset complete.');
    setTimeout(() => router.push('/auth/login'), 1500);
  };

  return (
    <main className={styles.authPage}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Funkcamp 2027</p>
        <h1>Reset Password</h1>
        <p>
          Set a new password for your account using the link from your email.
        </p>
      </section>

      <section className={styles.formSection}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
              <span>Email</span>
              <input
                type='email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder='you@example.com'
                required
              />
            </label>

            <label className={styles.label}>
              <span>New Password</span>
              <input
                type='password'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder='New password'
                required
              />
            </label>

            <label className={styles.label}>
              <span>Confirm Password</span>
              <input
                type='password'
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder='Confirm new password'
                required
              />
            </label>

            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.helpText}>{message}</p>}

            <button
              type='submit'
              className={styles.submitButton}
              disabled={loading || !token}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <p className={styles.switchAuth}>
            Remembered your password? <Link href='/auth/login'>Log in</Link>
          </p>

          {!token && (
            <p className={styles.helpText}>
              Missing reset token.{' '}
              <Link href='/auth/forgot-password'>Request a new reset link</Link>
              .
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
