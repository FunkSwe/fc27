import Link from 'next/link';
import { teacherData } from '@/data/teachers';
import styles from './Info.module.scss';

export const metadata = {
  title: 'Information | Funkcamp 2027',
  description:
    'Funkcamp 2027 dates, schedule and teachers. Contact us with camp questions or join the waiting list.',
};

export default function Info() {
  return (
    <main className={styles.infoPage}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Funkcamp 2027</p>
        <h1>Information</h1>
        <p>
          Everything you need to know before joining Funkcamp 2027. More details
          will be updated as we get closer to the camp.
        </p>
      </section>

      <section className={styles.contentGrid}>
        <article className={styles.card}>
          <span>01</span>
          <h2>Date</h2>
          <p>
            Funkcamp 2027 will take place from <strong>26 March</strong> to{' '}
            <strong>29 March 2027</strong>.
          </p>
        </article>

        <article className={styles.card}>
          <span>02</span>
          <h2>Location</h2>
          <p>
            <strong>Friday 26 March</strong>
            <br />
            TBA shortly
          </p>
          <p>
            <strong>Saturday–Monday, 27–29 March</strong>
            <br />
            TBA shortly
            {/*
            Danscenter Fryshuset
            <br />
            Mårtensdalsgatan 2–8
            <br />
            120 30 Stockholm, Sweden
            */}
          </p>
          {/*
          <p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Danscenter%20Fryshuset%2C%20M%C3%A5rtensdalsgatan%202-8%2C%20120%2030%20Stockholm"
            >
              Click here to open in Google Maps
            </a>
          </p>
          */}
        </article>

        <article className={styles.card}>
          <span>03</span>
          <h2>Schedule</h2>
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
        </article>

        <article className={styles.card}>
          <span>04</span>
          <h2>Teachers</h2>
          <ul>
            {teacherData.map((teacher) => (
              <li key={teacher.id}>
                <Link href={`/teachers/${teacher.slug}`}>{teacher.name}</Link>
              </li>
            ))}
          </ul>
        </article>

        <article className={styles.card}>
          <span>05</span>
          <h2>Community</h2>
          <p>
            Funkcamp is built around locking, culture, history, connection and
            learning directly from people who carry the dance forward.
          </p>
        </article>

        <article className={styles.card}>
          <span>06</span>
          <h2>Questions &amp; waiting list</h2>
          <p>
            Have questions about the camp? Send us a message through the{' '}
            <Link href="/registration">contact form</Link> or email{' '}
            <a href="mailto:funkcampswe@gmail.com">funkcampswe@gmail.com</a>.
          </p>
          <p>
            Interested in participating?{' '}
            <a href="mailto:funkcampswe@gmail.com?subject=Funkcamp%202027%20Waiting%20List">
              Join the waiting list
            </a>{' '}
            by emailing us with your name.
          </p>
        </article>
      </section>

      <section className={styles.notice}>
        <h2>More info added closer to the camp</h2>
      </section>
    </main>
  );
}
