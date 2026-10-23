import FunkcampStory from './_components/FunkcampStory';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main id="top">
      <FunkcampStory />
      <nav className={styles.footerNav} aria-label="Explore Funkcamp">
        <Link href="/info">
          Info <span aria-hidden="true">↗</span>
        </Link>
        <Link href="/teachers">
          Teachers <span aria-hidden="true">↗</span>
        </Link>
        <Link href="/registration">
          Contact <span aria-hidden="true">↗</span>
        </Link>
      </nav>
    </main>
  );
}
