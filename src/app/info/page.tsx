import styles from './Info.module.scss';

export const metadata = {
  title: 'Information | Funkcamp 2027',
  description: 'Important information about Funkcamp 2027.',
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
            The final venue information will be announced soon. The camp will be
            held in Stockholm/Sweden.
          </p>
        </article>

        <article className={styles.card}>
          <span>03</span>
          <h2>Registration</h2>
          <p>
            Registration is open. A booking fee secures your spot, and the
            remaining amount must be paid no later than December 31st, 2026.
          </p>
        </article>

        <article className={styles.card}>
          <span>04</span>
          <h2>Community</h2>
          <p>
            Funkcamp is built around locking, culture, history, connection and
            learning directly from people who carry the dance forward.
          </p>
        </article>
      </section>

      <section className={styles.notice}>
        <h2>More information coming soon</h2>
        <p>
          Schedule, venue details, other happenings and practical information
          will be added here as the event approaches.
        </p>
      </section>
    </main>
  );
}
