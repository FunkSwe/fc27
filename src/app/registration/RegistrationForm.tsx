'use client';

import { useState } from 'react';
import styles from './registration.module.scss';

type FormState = {
  fullName: string;
  email: string;
  country: string;
  message: string;
  hasAttended2025: boolean;
};

const initialFormState: FormState = {
  fullName: '',
  email: '',
  country: '',
  message: '',
  hasAttended2025: false,
};

export default function RegistrationForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>(
    'idle',
  );
  const [feedback, setFeedback] = useState('');

  const updateField = (
    field: keyof FormState,
    value: string | boolean,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus('sending');
    setFeedback('');

    try {
      const response = await fetch('/api/event-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not send registration.');
      }

      setStatus('success');
      setFeedback(
        'Thank you. Your registration has been sent. Please check your email for more information.',
      );
      setForm(initialFormState);
    } catch (error) {
      setStatus('error');
      setFeedback(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
      );
    }
  };

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      <h2>Register to funkcamp 2027</h2>

      <label>
        Full name
        <input
          type="text"
          value={form.fullName}
          onChange={(event) => updateField('fullName', event.target.value)}
          required
          placeholder="Your full name"
        />
      </label>

      <label>
        Email
        <input
          type="email"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
          required
          placeholder="your@email.com"
        />
      </label>

      <label>
        Country
        <input
          type="text"
          value={form.country}
          onChange={(event) => updateField('country', event.target.value)}
          placeholder="Where are you travelling from?"
        />
      </label>

      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={form.hasAttended2025}
          onChange={(event) =>
            updateField('hasAttended2025', event.target.checked)
          }
        />
        <span>I joined Funkcamp 2025 / 20 Year Anniversary Camp</span>
      </label>

      <label>
        Message
        <textarea
          value={form.message}
          onChange={(event) => updateField('message', event.target.value)}
          placeholder="Anything you want us to know?"
          rows={5}
        />
      </label>

      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send registration'}
      </button>

      {feedback && (
        <p
          className={
            status === 'success' ? styles.successMessage : styles.errorMessage
          }
        >
          {feedback}
        </p>
      )}
    </form>
  );
}