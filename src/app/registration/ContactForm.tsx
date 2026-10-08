'use client';

import { useState, type FormEvent } from 'react';
import styles from './registration.module.scss';

type FormState = {
  fullName: string;
  email: string;
  message: string;
};

const initialFormState: FormState = {
  fullName: '',
  email: '',
  message: '',
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>(
    'idle',
  );
  const [feedback, setFeedback] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>(
    'idle',
  );

  const copyEmailAddress = async () => {
    setCopyStatus('idle');

    try {
      await navigator.clipboard.writeText('funkcampswe@gmail.com');
      setCopyStatus('success');
    } catch {
      setCopyStatus('error');
    }
  };

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setStatus('idle');
    setFeedback('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setFeedback('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Could not send your question. Please try again.',
        );
      }

      setStatus('success');
      setFeedback('We have received your question and will respond shortly.');
      setForm(initialFormState);
    } catch (error) {
      setStatus('error');
      setFeedback(
        error instanceof Error
          ? error.message
          : 'Could not send your question. Please try again.',
      );
    }
  };

  return (
    <form
      className={styles.formCard}
      onSubmit={handleSubmit}
      aria-busy={status === 'sending'}
    >
      <h2>Ask a question</h2>
      <p className={styles.formIntro}>
        Questions about Funkcamp? Send us a message and we will get back to you.
      </p>

      <fieldset disabled={status === 'sending'}>
        <label>
          Name
          <input
            name="fullName"
            type="text"
            autoComplete="name"
            value={form.fullName}
            onChange={(event) => updateField('fullName', event.target.value)}
            required
            maxLength={100}
            placeholder="Your name"
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            required
            maxLength={254}
            placeholder="your@email.com"
          />
        </label>

        <label>
          Your question
          <textarea
            name="message"
            value={form.message}
            onChange={(event) => updateField('message', event.target.value)}
            required
            maxLength={5000}
            placeholder="What would you like to know about the camp?"
            rows={5}
          />
        </label>

        <button type="submit">
          {status === 'sending' ? 'Sending...' : 'Send question'}
        </button>
      </fieldset>

      {feedback && (
        <p
          role={status === 'error' ? 'alert' : 'status'}
          className={
            status === 'success' ? styles.successMessage : styles.errorMessage
          }
        >
          {feedback}
        </p>
      )}

      <div id="waiting-list" className={styles.directContact}>
        <p>
          Prefer email? Email us directly, or copy the address into your email
          service.
        </p>
        <a className={styles.emailLink} href="mailto:funkcampswe@gmail.com">
          funkcampswe@gmail.com
        </a>
        <div>
          <button
            type="button"
            className={styles.copyEmailButton}
            onClick={copyEmailAddress}
          >
            Copy email address
          </button>
        </div>
        <p className={styles.copyEmailFeedback} role="status" aria-live="polite">
          {copyStatus === 'success' && 'Email address copied.'}
          {copyStatus === 'error' &&
            'Could not copy automatically. Select the address below and copy it into your email service.'}
        </p>
        {copyStatus === 'error' && (
          <p className={styles.selectableEmail}>funkcampswe@gmail.com</p>
        )}

        <h3>Interested in participating?</h3>
        <p>
          Join the waiting list. Email us with your name and ask to be added to
          the list.
        </p>
        <a
          className={styles.emailLink}
          href="mailto:funkcampswe@gmail.com?subject=Funkcamp%202027%20Waiting%20List"
        >
          Email Funkcamp to join the waiting list
        </a>
      </div>
    </form>
  );
}
