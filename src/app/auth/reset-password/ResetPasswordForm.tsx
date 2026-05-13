'use client';

import { useEffect, useState, type SubmitEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/Login.module.scss';

const EyeIcon = () => (
  <svg width='20' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
    <path d='M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    <circle cx='12' cy='12' r='3' stroke='currentColor' strokeWidth='2' />
  </svg>
);

const EyeOffIcon = () => (
  <svg width='20' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
    <path d='M1 1l22 22' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
    <path d='M10.47 10.47a3 3 0 0 0 4.24 4.24' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
    <path d='M4.93 4.93C2.92 6.77 1.48 9.32 1 12c1.26 4.26 5.16 7 11 7 1.49 0 2.91-.24 4.24-.68' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    <path d='M19.07 19.07C21.08 17.23 22.52 14.68 23 12c-1.26-4.26-5.16-7-11-7-1.49 0-2.91.24-4.24.68' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
);

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');

    if (tokenParam) setToken(tokenParam);
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');
    setMessage('');

    if (!token) {
      setError('Missing reset token. Please request a new reset link.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || 'Unable to reset your password.');
        return;
      }

      setMessage(data?.message || 'Password reset complete.');

      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.authPage}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Funkcamp 2027</p>
        <h1>Reset Password</h1>
        <p>Set a new password for your account using the link from your email.</p>
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
              <div className={styles.passwordField}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder='New password'
                  required
                />
                <button
                  type='button'
                  className={styles.eyeButton}
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </label>

            <label className={styles.label}>
              <span>Confirm Password</span>
              <div className={styles.passwordField}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder='Confirm new password'
                  required
                />
                <button
                  type='button'
                  className={styles.eyeButton}
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </label>

            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.helpText}>{message}</p>}

            <button type='submit' className={styles.submitButton} disabled={loading || !token}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <p className={styles.switchAuth}>
            Remembered your password? <Link href='/auth/login'>Log in</Link>
          </p>

          {!token && (
            <p className={styles.helpText}>
              Missing reset token. <Link href='/auth/forgot-password'>Request a new reset link</Link>.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
