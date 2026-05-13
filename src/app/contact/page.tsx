import Image from 'next/image';
import styles from './contact.module.scss';

export const metadata = {
  title: 'Contact Funkcamp',
  description: 'Contact Funkcamp by email or Instagram.',
};

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Stockholm, Sweden</p>
        <h1>Contact</h1>
        <p>
          Questions about Funkcamp 2027, registration, payment, travel or the
          camp experience? Reach out to us.
        </p>
      </section>

      <section className={styles.card}>
        <div className={styles.logoWrap}>
          <Image
            src='/fclogosmall.png'
            alt='Funkcamp'
            width={220}
            height={220}
            className={styles.logo}
            priority
          />
        </div>

        <div className={styles.links}>
          <a href='mailto:funkcampswe@gmail.com' className={styles.linkButton}>
            Email us
            <span>funkcampswe@gmail.com</span>
          </a>

          <a
            href='https://www.instagram.com/funkcampswe/'
            target='_blank'
            rel='noreferrer'
            className={styles.linkButton}
          >
            Instagram
            <span>@funkcampswe</span>
          </a>

          <a href='/registration' className={styles.linkButton}>
            Funkcamp 2027 Registration
            <span>Register your interest</span>
          </a>
        </div>
      </section>
    </main>
  );
}
