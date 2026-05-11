import RegistrationForm from './RegistrationForm';
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
          <h2>Early registration info</h2>

          <p>
            Before we officially announce the full line-up, we want to give a
            special early bird offer to everyone who joined us at the Funkcamp
            2025 “20 Year Anniversary” Camp.
          </p>

          <div className={styles.priceBox}>
            <span>Price</span>
            <strong>€250 / 2700 kr</strong>
          </div>

          <p>
            To secure your spot, a booking fee of <strong>€100</strong> must be
            paid as soon as possible.
          </p>

          <p>
            Your spot is only secured once the booking fee has been paid. The
            remaining amount must be paid no later than{' '}
            <strong>December 31st, 2026</strong>.
          </p>

          <ul>
            <li>Friday: 17.30–20.30</li>
            <li>Saturday: 11.00–17.00</li>
            <li>Sunday: 11.00–17.00</li>
            <li>Monday: 10.00–14.00</li>
          </ul>
        </div>

        <RegistrationForm />
      </section>
    </main>
  );
}
