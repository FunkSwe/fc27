/* import RegistrationForm from './RegistrationForm';
import styles from './registration.module.scss';

export const metadata = {
  title: 'Funkcamp 2027 Registration',
  description: 'Register your interest for Funkcamp 2027 in Stockholm, Sweden.',
};

export default function RegistrationPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Stockholm, Sweden</p>
        <h1>Funkcamp 2027 Registration</h1>
        <p>
          Funkcamp returns March 26th–29th, 2027. Register your interest and we
          will continue the process with you by email.
        </p>
      </section>

      <section className={styles.contentGrid}>
        <div className={styles.infoCard}>
          <h2>Registration info</h2>

          <p>
            Register to the funkcamp 2027 
          </p>

          <div className={styles.priceBox}>
            <span>Price</span>
            <strong>€250 / 2700 kr</strong>
          </div>

          <p>
            To secure your spot, a booking fee of <strong>€100</strong> must be
            paid as soon as possible. (information will be sent in the registration confirmation email).
          </p>

          <p>
            Your spot is only secured once the booking fee has been paid. The
            remaining amount must be paid no later than{' '}
            <strong>December 31st, 2026</strong>.
          </p>
        <h4>Funkcamp Schedule</h4>
          <ul>
            <li>Friday 26th: 17.30–20.30</li>
            <li>Saturday 27th: 11.00–17.00</li>
            <li>Sunday 28th: 11.00–17.00</li>
            <li>Monday: 10.00–14.00</li>
                  </ul>
                  <p>changes might occur closer to the event date.</p>
                  <p>More will be announced and updated as the event approaches.</p>
        </div>

        <RegistrationForm />
      </section>
    </main>
  );
}

 */

import RegistrationClosedNotice from './RegistrationClosedNotice';
import styles from './registration.module.scss';

export const metadata = {
  title: 'Funkcamp 2027 Registration | Closed Until September 2026',
  description:
    'Registration for Funkcamp 2027 is currently closed and will open again in September 2026.',
};

export default function RegistrationPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Stockholm, Sweden</p>
        <h1>Funkcamp 2027 Registration</h1>
        <p>
          Funkcamp returns March 26th–29th, 2027. Registration is currently
          closed after an amazing response with 60+ sign-ups already received.
          Registration will open again in September 2026.
        </p>
      </section>

      <section className={styles.contentGrid}>
        <div className={styles.infoCard}>
          <h2>Registration info</h2>

          <p>
            Registration for Funkcamp 2027 is currently paused. We are so happy
            to already have more than 60 sign-ups, and we will open registration
            again in September 2026.
          </p>

          <p>
            If you would like to be added to the waiting list, please email us
            at <a href='mailto:funkcampswe@gmail.com'>funkcampswe@gmail.com</a>.
            We will contact everyone on the waiting list when registration opens
            again.
          </p>

          <div className={styles.priceBox}>
            <span>Price</span>
            <strong>€250 / 2700 kr</strong>
          </div>

          <p>
            To secure your spot, a booking fee of <strong>€100</strong> must be
            paid once registration opens again. More information will be sent by
            email during the registration process.
          </p>

          <p>
            Your spot is only secured once the booking fee has been paid. The
            remaining amount must be paid no later than{' '}
            <strong>December 31st, 2026</strong>.
          </p>

          <h4>Funkcamp Schedule</h4>

          <ul>
            <li>Friday 26th: 17.30–20.30</li>
            <li>Saturday 27th: 11.00–17.00</li>
            <li>Sunday 28th: 11.00–17.00</li>
            <li>Monday 29th: 10.00–14.00</li>
          </ul>

          <p>Changes might occur closer to the event date.</p>
          <p>More will be announced and updated as the event approaches.</p>
        </div>

        <RegistrationClosedNotice />
      </section>
    </main>
  );
}
