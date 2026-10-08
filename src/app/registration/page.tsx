import Link from 'next/link';
import { teacherData } from '@/data/teachers';
import ContactForm from './ContactForm';
import styles from './registration.module.scss';

export const metadata = {
  title: 'Contact | Funkcamp 2027',
  description:
    'Contact Funkcamp with camp questions or join the waiting list. March 26–29, 2027 in Stockholm, Sweden.',
};

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Funkcamp 2027 · Stockholm, Sweden</p>
        <h1>Contact Funkcamp</h1>
        <p>
          Interested in participating? Join the waiting list. Have a question
          about the camp? Send us a message below or email us directly.
        </p>
      </section>

      <section className={styles.contentGrid}>
        <div className={styles.infoCard}>
          <h2>Camp info</h2>
          <p>
            <strong>March 26–29, 2027</strong>
            <br />
            Stockholm, Sweden.
          </p>

          <h3>Location</h3>
          <p>
            <strong>Friday 26 March</strong>
            <br />
            To be announced.
          </p>
          <p>
            <strong>Saturday–Monday, 27–29 March</strong>
            <br />
            Danscenter Fryshuset
            <br />
            Mårtensdalsgatan 2–8
            <br />
            120 30 Stockholm, Sweden
          </p>
          <p>
            <a
              className={styles.mapLink}
              href="https://www.google.com/maps/search/?api=1&query=Danscenter%20Fryshuset%2C%20M%C3%A5rtensdalsgatan%202-8%2C%20120%2030%20Stockholm"
            >
              Click here to open in Google Maps
            </a>
          </p>

          <h3>Schedule</h3>
          <ul>
            <li>Friday 26 March: 17.30–20.30</li>
            <li>Saturday 27 March: 11.00–17.00</li>
            <li>Sunday 28 March: 11.00–17.00</li>
            <li>Monday 29 March: 11.00–15.00</li>
          </ul>
          <p>
            All times are local to Stockholm. The schedule may change closer to
            the camp.
          </p>

          <h3>Teachers</h3>
          <ul className={styles.teacherList}>
            {teacherData.map((teacher) => (
              <li key={teacher.id}>
                <Link href={`/teachers/${teacher.slug}`}>{teacher.name}</Link>
              </li>
            ))}
          </ul>
          <p>More camp details will be shared as the event approaches.</p>
        </div>

        <ContactForm />
      </section>
    </main>
  );
}
