'use client';

import { useState, type SubmitEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Login.module.scss';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data?.error || 'Could not log in.');
      return;
    }

    router.push('/dashboard');
  };

  return (
    <main className={styles.authPage}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Funkcamp 2027</p>
        <h1>Log In</h1>
        <p>Access your Funkcamp dashboard and community features.</p>
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
              <span>Password</span>
              <input
                type='password'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder='Your password'
                required
              />
            </label>

            <p className={styles.helpText}>
              <Link href='/auth/forgot-password'>Forgot password?</Link>
            </p>

            {error && <p className={styles.error}>{error}</p>}

            <button
              type='submit'
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className={styles.switchAuth}>
            New to Funkcamp?{' '}
            <Link href='/auth/signup'>Create an account here</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
