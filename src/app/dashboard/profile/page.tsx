'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './DashboardProfile.module.scss';

interface UserProfile {
  id?: string;
  _id?: string;
  email: string;
  username: string;
  role: string;
  emailVerified: boolean;
  isAdmin: boolean;
}

type ApiResponse = {
  error?: string;
  message?: string;
  user?: UserProfile;
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

export default function DashboardProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/auth/me');

        if (!response.ok) {
          router.push('/auth/login');
          return;
        }

        const data = await readJsonSafely(response);

        if (!data.user) {
          setDeleteError('Unable to load your profile.');
          return;
        }

        setUser(data.user);
      } catch {
        setDeleteError('Something went wrong while loading your profile.');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPasswordError('');
    setPasswordMessage('');

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await readJsonSafely(response);

      if (!response.ok) {
        setPasswordError(data.error || 'Could not change password.');
        return;
      }

      setPasswordMessage(data.message || 'Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch {
      setPasswordError('Something went wrong while changing your password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      return;
    }

    setDeleteError('');

    if (confirmText !== user.username) {
      setDeleteError(`Type "${user.username}" to confirm account deletion.`);
      return;
    }

    const confirmed = window.confirm(
      'Are you sure? This will permanently delete your account.',
    );

    if (!confirmed) {
      return;
    }

    setDeleteLoading(true);

    try {
      const response = await fetch('/api/auth/account', {
        method: 'DELETE',
      });

      const data = await readJsonSafely(response);

      if (!response.ok) {
        setDeleteError(data.error || 'Could not delete account.');
        return;
      }

      router.push('/auth/signup');
    } catch {
      setDeleteError('Something went wrong while deleting your account.');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.profilePage}>
        <div className={styles.grain} />
        <section className={styles.posterFrame}>
          <p className={styles.loadingText}>Loading profile...</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={styles.profilePage}>
        <div className={styles.grain} />
        <section className={styles.posterFrame}>
          <h1 className={styles.bigTitle}>PROFILE</h1>
          <div className={styles.contentPanel}>
            <p>Unable to load your account.</p>
            {deleteError && <p className={styles.error}>{deleteError}</p>}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.profilePage}>
      <div className={styles.grain} />

      <section className={styles.posterFrame}>
        <div className={styles.metaGrid}>
          <div>
            <span>Funkcamp</span>
            <p>Community</p>
          </div>

          <div>
            <span>Account</span>
            <p>Dashboard</p>
          </div>

          <div className={styles.metaRight}>
            <span>User</span>
            <p>{user.username}</p>
          </div>

          <div className={styles.metaRight}>
            <span>Status</span>
            <p>{user.emailVerified ? 'Verified' : 'Not verified'}</p>
          </div>
        </div>

        <h1 className={styles.bigTitle}>
          <span className={styles.desktopTitle}>PROFILE</span>
          <span className={styles.mobileTitle}>
            <span>PRO</span>
            <span>FILE</span>
          </span>
        </h1>

        <div className={styles.contentPanel}>
          <section className={styles.profileHeader}>
            <div className={styles.avatarPlaceholder}>
              <span>{user.username.charAt(0).toUpperCase()}</span>
            </div>

            <div>
              <p className={styles.kicker}>Your account</p>
              <h2>{user.username}</h2>
              <p>
                View your account details, change your password, and manage
                your profile settings.
              </p>
            </div>
          </section>

          <section className={styles.cardGrid}>
            <div className={styles.card}>
              <h3>Account Details</h3>

              <div className={styles.details}>
                <p>
                  <strong>Username:</strong> {user.username}
                </p>

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

            <div className={styles.card}>
              <h3>Profile Photo</h3>
              <p>
                Profile image upload can be added later. This area is ready for
                showing the user photo in the dashboard/header.
              </p>

              <div className={styles.photoPreview}>
                <span>{user.username.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h3>Change Password</h3>

            <form
              onSubmit={handleChangePassword}
              className={styles.passwordForm}
            >
              <label>
                <span>Current Password</span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  required
                />
              </label>

              <label>
                <span>New Password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                  minLength={8}
                />
              </label>

              <label>
                <span>Confirm New Password</span>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(event) => setConfirmNewPassword(event.target.value)}
                  required
                  minLength={8}
                />
              </label>

              {passwordError && (
                <p className={styles.error}>{passwordError}</p>
              )}

              {passwordMessage && (
                <p className={styles.success}>{passwordMessage}</p>
              )}

              <button type="submit" disabled={passwordLoading}>
                {passwordLoading ? 'Changing password...' : 'Change Password'}
              </button>
            </form>
          </section>

          <section className={styles.dangerCard}>
            <h3>Delete Account</h3>

            <p>
              This will permanently delete your account from the database. This
              action cannot be undone.
            </p>

            <p>
              To confirm, type your username:{' '}
              <strong>{user.username}</strong>
            </p>

            <input
              type="text"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder={`Type ${user.username}`}
            />

            {deleteError && <p className={styles.error}>{deleteError}</p>}

            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={deleteLoading || confirmText !== user.username}
            >
              {deleteLoading ? 'Deleting account...' : 'Delete my account'}
            </button>
          </section>

          <div className={styles.barcode} aria-hidden="true">
            <span style={{ height: '30%' }} />
            <span style={{ height: '80%' }} />
            <span style={{ height: '55%' }} />
            <span style={{ height: '100%' }} />
            <span style={{ height: '45%' }} />
            <span style={{ height: '90%' }} />
            <span style={{ height: '35%' }} />
            <span style={{ height: '70%' }} />
            <span style={{ height: '100%' }} />
            <span style={{ height: '50%' }} />
            <span style={{ height: '85%' }} />
            <span style={{ height: '40%' }} />
          </div>
        </div>
      </section>
    </main>
  );
}