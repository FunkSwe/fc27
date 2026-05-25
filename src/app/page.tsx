import styles from './page.module.css';
import Hero from './_components/Hero';
import TeacherVideoSection from './_components/TeacherVideoSection';
import HomeTeacherLinks from './_components/HomeTeacherLinks';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Hero
          desktopTitleLines={['FUNKCAMP', '2027']}
          mobileTitleLines={['FUNK', 'CAMP', '2027']}
          subtitle='Best of the best'
          imageSrc='/images/hero-players.png'
        />
        <TeacherVideoSection />
        <HomeTeacherLinks />
      </main>
    </div>
  );
}
