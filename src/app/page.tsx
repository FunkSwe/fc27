import Image from 'next/image';
import styles from './page.module.css';
import Hero from './_components/Hero';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Hero
          title='Funkcamp 2027'
          subtitle='Best of the best'
          imageSrc='/images/hero-players.png'
        />
      </main>
    </div>
  );
}
