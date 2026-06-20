'use client';

import { useState } from 'react';
import styles from './registration.module.scss';

export default function RegistrationClosedNotice() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={styles.closedCard}>
        <span className={styles.statusPill}>Registration closed</span>

        <h2>Registration opens again in September 2026</h2>

        <p>
          Thank you for the amazing response. Funkcamp 2027 already has 60+
          sign-ups, so registration is currently paused.
        </p>

        <p>
          Want to be on the waiting list? Email us and we will contact you when
          registration opens again.
        </p>

        <a
          className={styles.emailLink}
          href="mailto:funkcampswe@gmail.com?subject=Funkcamp%202027%20Waiting%20List"
        >
          funkcampswe@gmail.com
        </a>

        <button
          type="button"
          className={styles.closedButton}
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
        >
          Registration closed
        </button>
      </div>

      {isOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setIsOpen(false)}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-closed-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setIsOpen(false)}
              aria-label="Close popup"
            >
              ×
            </button>

            <h2 id="registration-closed-title">
              Registration opens again in September 2026
            </h2>

            <p>
              Funkcamp 2027 registration is currently closed after 60+ sign-ups.
              If you want to be added to the waiting list, please email us at:
            </p>

            <a
              className={styles.emailLink}
              href="mailto:funkcampswe@gmail.com?subject=Funkcamp%202027%20Waiting%20List"
            >
              funkcampswe@gmail.com
            </a>

            <div className={styles.modalActions}>
              <button type="button" onClick={() => setIsOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}