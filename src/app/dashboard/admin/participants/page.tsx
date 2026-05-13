'use client';

import { useEffect, useState } from 'react';
import styles from '../../Dashboard.module.scss';

type Participant = {
  _id?: string;
  name: string;
  email: string;
  paid: boolean;
  paymentInfo: string;
  note: string;
};

const emptyParticipant: Participant = {
  name: '',
  email: '',
  paid: false,
  paymentInfo: '',
  note: '',
};

export default function AdminParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [form, setForm] = useState<Participant>(emptyParticipant);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadParticipants = async () => {
    setLoading(true);
    setError('');
    const response = await fetch('/api/admin/participants', { cache: 'no-store' });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error || 'Unable to load participants.');
      setLoading(false);
      return;
    }
    setParticipants(data);
    setLoading(false);
  };

  useEffect(() => {
    loadParticipants();
  }, []);

  const saveParticipant = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const url = editingId ? `/api/admin/participants/${editingId}` : '/api/admin/participants';
    const method = editingId ? 'PUT' : 'POST';
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setError(data?.error || 'Unable to save participant.');
      return;
    }

    setForm(emptyParticipant);
    setEditingId('');
    loadParticipants();
  };

  const deleteParticipant = async (id?: string) => {
    if (!id || !window.confirm('Delete this participant?')) return;
    await fetch(`/api/admin/participants/${id}`, { method: 'DELETE' });
    loadParticipants();
  };

  const editParticipant = (participant: Participant) => {
    setForm(participant);
    setEditingId(participant._id || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className={styles.dashboardPage}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Admin</p>
        <h1>Participants</h1>
        <p>Private admin list for Funkcamp participants, payments, and internal payment notes.</p>
      </section>

      {error && <p style={{ color: '#b20b1a' }}>{error}</p>}

      <section className={styles.card} style={{ marginBottom: '2rem' }}>
        <h3>{editingId ? 'Edit participant' : 'Add participant'}</h3>
        <form onSubmit={saveParticipant} style={{ display: 'grid', gap: '1rem' }}>
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder='Name' required style={{ padding: '0.9rem', border: '2px solid #111' }} />
          <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder='Email, optional' style={{ padding: '0.9rem', border: '2px solid #111' }} />
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type='checkbox' checked={form.paid} onChange={(event) => setForm({ ...form, paid: event.target.checked })} />
            Paid
          </label>
          <textarea value={form.paymentInfo} onChange={(event) => setForm({ ...form, paymentInfo: event.target.value })} placeholder='Payment info: prepaid fee, remaining amount, cash note, custom plan...' rows={4} style={{ padding: '0.9rem', border: '2px solid #111' }} />
          <textarea value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder='Internal notification / admin note' rows={4} style={{ padding: '0.9rem', border: '2px solid #111' }} />
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type='submit' className={styles.logoutButton}>{editingId ? 'Update participant' : 'Add participant'}</button>
            {editingId && <button type='button' className={styles.logoutButton} onClick={() => { setEditingId(''); setForm(emptyParticipant); }}>Cancel edit</button>}
          </div>
        </form>
      </section>

      {loading ? <p>Loading participants…</p> : null}

      <section className={styles.grid}>
        {participants.map((participant) => (
          <article key={participant._id} className={styles.card}>
            <h3>{participant.name}</h3>
            <div className={styles.details}>
              <p><strong>Email:</strong> {participant.email || '—'}</p>
              <p><strong>Paid:</strong> {participant.paid ? '✓ Yes' : 'No'}</p>
              <p><strong>Payment:</strong> {participant.paymentInfo || '—'}</p>
              <p><strong>Note:</strong> {participant.note || '—'}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button type='button' className={styles.logoutButton} onClick={() => editParticipant(participant)}>Edit</button>
              <button type='button' className={styles.logoutButton} onClick={() => deleteParticipant(participant._id)}>Delete</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
