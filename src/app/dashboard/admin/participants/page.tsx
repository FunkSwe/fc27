'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import styles from '../../Dashboard.module.scss';

type Participant = {
  _id?: string;
  name: string;
  email: string;
  paid: boolean;
  attended?: boolean;
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
  const [paidListOpen, setPaidListOpen] = useState(false);

  const paidParticipants = useMemo(
    () =>
      participants
        .filter((participant) => participant.paid)
        .sort((a, b) => a.name.localeCompare(b.name, 'sv', { sensitivity: 'base' })),
    [participants],
  );

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

  const toggleAttendance = async (participant: Participant) => {
    if (!participant._id) return;
    const response = await fetch(`/api/admin/participants/${participant._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...participant, attended: !participant.attended }),
    });

    if (response.ok) loadParticipants();
  };

  const editParticipant = (participant: Participant) => {
    const { attended: _attended, ...editableParticipant } = participant as Participant & { attended?: boolean };
    setForm({ ...emptyParticipant, ...editableParticipant });
    setEditingId(participant._id || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className={styles.dashboardPage}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Admin</p>
        <h1>Participants</h1>
        <p>Private admin list for Funkcamp participants, payments, and internal notes.</p>
      </section>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <Link href='/dashboard' className={styles.logoutButton} style={{ textDecoration: 'none' }}>
          Back to dashboard
        </Link>
        <button type='button' className={styles.logoutButton} onClick={() => setPaidListOpen(true)}>
          Paid list ({paidParticipants.length})
        </button>
      </div>

      {error && <p style={{ color: '#b20b1a' }}>{error}</p>}

      <section className={styles.card} style={{ marginBottom: '2rem' }}>
        <h3>{editingId ? 'Edit participant' : 'Add participant'}</h3>
        <form onSubmit={saveParticipant} style={{ display: 'grid', gap: '1rem' }}>
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder='Full name' required style={{ padding: '0.9rem', border: '2px solid #111' }} />
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

      {paidListOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100002, background: 'rgba(0,0,0,0.55)', display: 'grid', placeItems: 'center', padding: '1rem' }} role='dialog' aria-modal='true'>
          <section className={styles.card} style={{ width: 'min(100%, 720px)', maxHeight: '86vh', overflow: 'auto', background: '#fffaf0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
              <div>
                <h3>Paid participants</h3>
                <p style={{ marginTop: 0 }}>Simple list of everyone marked as paid, with attendance checkmark.</p>
              </div>
              <button type='button' className={styles.logoutButton} onClick={() => setPaidListOpen(false)}>Close</button>
            </div>

            {paidParticipants.length === 0 ? (
              <p>No paid participants yet.</p>
            ) : (
              <ol style={{ display: 'grid', gap: '0.75rem', paddingLeft: '1.25rem' }}>
                {paidParticipants.map((participant) => (
                  <li key={participant._id}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <input type='checkbox' checked={participant.attended} onChange={() => toggleAttendance(participant)} />
                      <strong>{participant.name}</strong>
                      <span>{participant.attended ? '✓ Attended' : 'Not checked'}</span>
                    </label>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
