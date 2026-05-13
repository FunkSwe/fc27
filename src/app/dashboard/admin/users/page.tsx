'use client';

import { useEffect, useState } from 'react';
import styles from '../../Dashboard.module.scss';

type AdminUser = {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'teacher' | 'admin';
  isAdmin: boolean;
  isBanned?: boolean;
  banReason?: string;
  emailVerified?: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    const response = await fetch('/api/admin/users', { cache: 'no-store' });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setError(data?.error || 'Unable to load users.');
      setLoading(false);
      return;
    }

    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateUser = async (user: AdminUser, updates: Partial<AdminUser>) => {
    setSavingId(user._id);
    setError('');

    const nextUser = { ...user, ...updates };
    const response = await fetch(`/api/admin/users/${user._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: nextUser.role,
        isAdmin: nextUser.role === 'admin',
        isBanned: nextUser.isBanned === true,
        banReason: nextUser.banReason || '',
      }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error || 'Unable to update user.');
      setSavingId('');
      return;
    }

    setUsers((current) => current.map((item) => (item._id === user._id ? data : item)));
    setSavingId('');
  };

  const deleteUser = async (user: AdminUser) => {
    if (!window.confirm(`Delete ${user.username}? This removes their account, posts, comments, warnings, blocks, and conversations.`)) return;

    setSavingId(user._id);
    setError('');

    const response = await fetch(`/api/admin/users/${user._id}`, { method: 'DELETE' });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setError(data?.error || 'Unable to delete user.');
      setSavingId('');
      return;
    }

    setUsers((current) => current.filter((item) => item._id !== user._id));
    setSavingId('');
  };

  return (
    <main className={styles.dashboardPage}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Admin</p>
        <h1>Users</h1>
        <p>Check users, change roles, and ban or unban accounts.</p>
      </section>

      {error && <p style={{ color: '#b20b1a' }}>{error}</p>}
      {loading ? <p>Loading users…</p> : null}

      <section className={styles.content}>
        {users.map((user) => (
          <article key={user._id} className={styles.card}>
            <h3>{user.username}</h3>
            <div className={styles.details}>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Current role:</strong> {user.role}</p>
              <p><strong>Status:</strong> {user.isBanned ? 'Banned' : 'Active'}</p>
            </div>

            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              <label>
                Role<br />
                <select
                  value={user.role}
                  onChange={(event) => updateUser(user, { role: event.target.value as AdminUser['role'], isAdmin: event.target.value === 'admin' })}
                  disabled={savingId === user._id}
                  style={{ width: '100%', padding: '0.9rem', border: '2px solid #111' }}
                >
                  <option value='user'>User</option>
                  <option value='teacher'>Teacher</option>
                  <option value='admin'>Admin</option>
                </select>
              </label>

              <label>
                Ban reason<br />
                <textarea
                  value={user.banReason || ''}
                  onChange={(event) => setUsers((current) => current.map((item) => item._id === user._id ? { ...item, banReason: event.target.value } : item))}
                  rows={3}
                  style={{ width: '100%', padding: '0.9rem', border: '2px solid #111' }}
                />
              </label>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button type='button' className={styles.logoutButton} onClick={() => updateUser(user, { isBanned: !user.isBanned })} disabled={savingId === user._id}>
                  {user.isBanned ? 'Unban user' : 'Ban user'}
                </button>
                <button type='button' className={styles.logoutButton} onClick={() => updateUser(user, {})} disabled={savingId === user._id}>
                  Save changes
                </button>
                <button type='button' className={styles.logoutButton} onClick={() => deleteUser(user)} disabled={savingId === user._id}>
                  Delete user
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
