'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../login/Login.module.scss';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    const data = await response.json();

    if (!response.ok) {
      setError(data?.error || 'Unable to send password reset email.');
      return;
    }

    setMessage(data?.message || 'Password reset email sent.');
  };

  return (
    <main className={styles.authPage}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Funkcamp 2027</p>
        <h1>Forgot Password</h1>
        <p>Enter your email and we'll send a link to create a new password.</p>
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

            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.helpText}>{message}</p>}

            <button
              type='submit'
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className={styles.switchAuth}>
            Remembered your password? <Link href='/auth/login'>Log in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
