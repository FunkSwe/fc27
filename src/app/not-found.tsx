import Link from 'next/link';
import styles from './not-found.module.scss';

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.backgroundText} aria-hidden="true">
        404 PAGE NOT FOUND
      </div>

      <div className={styles.gifWrap}>
        <img src="/locker.gif" alt="Dancing locker animation" />
      </div>

      <div className={styles.content}>
        <p>Lost in the groove?</p>
        <Link href="/">Back to home</Link>
      </div>
    </main>
  );
}
