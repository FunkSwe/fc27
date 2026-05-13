'use client';

import { useState, type SubmitEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Signup.module.scss';

const EyeIcon = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
  >
    <path
      d='M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <circle cx='12' cy='12' r='3' stroke='currentColor' strokeWidth='2' />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
  >
    <path
      d='M1 1l22 22'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <path
      d='M10.47 10.47a3 3 0 0 0 4.24 4.24'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <path
      d='M4.93 4.93C2.92 6.77 1.48 9.32 1 12c1.26 4.26 5.16 7 11 7 1.49 0 2.91-.24 4.24-.68'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M19.07 19.07C21.08 17.23 22.52 14.68 23 12c-1.26-4.26-5.16-7-11-7-1.49 0-2.91.24-4.24.68'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

type ApiResponse = {
  error?: string;
  message?: string;
};

async function readJsonSafely(response: Response): Promise<ApiResponse> {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text) as ApiResponse;
  } catch {
    return {};
  }
}

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupCode, setSignupCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, signupCode }),
      });

      const data = await readJsonSafely(response);

      if (!response.ok) {
        setError(data.error || 'Could not create account.');
        return;
      }

      setMessage(data.message || 'Account created. You can now log in.');

      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setSignupCode('');

      setTimeout(() => {
        router.push('/auth/login');
        router.refresh();
      }, 1200);
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
        <h1>Sign Up</h1>
        <p>Create your account and join the Funkcamp community.</p>
      </section>

      <section className={styles.formSection}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
              <span>Username</span>
              <input
                type='text'
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder='Choose a username'
                required
              />
            </label>

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
              <span>Signup Code</span>
              <input
                type='text'
                value={signupCode}
                onChange={(event) => setSignupCode(event.target.value)}
                placeholder='Enter signup code'
                required
              />
            </label>

            <label className={styles.label}>
              <span>Password</span>

              <div className={styles.passwordField}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder='At least 8 characters'
                  required
                  minLength={8}
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
                  placeholder='Repeat your password'
                  required
                  minLength={8}
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
            {message && <p className={styles.success}>{message}</p>}

            <button
              type='submit'
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className={styles.switchAuth}>
            Already have an account? <Link href='/auth/login'>Log in here</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
