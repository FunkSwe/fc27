import styles from './Teachers.module.scss';
import TeacherCard from './_components/TeacherCard';
import { teacherData } from '@/data/teachers';

export const metadata = {
  title: 'Teachers | Funkcamp 2027',
  description: 'Meet the teachers of Funkcamp 2027.',
};

export default function TeachersPage() {
  return (
    <main className={styles.teachersPage}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Funkcamp 2027</p>
        <h1>Teachers</h1>
        <p>
          Meet the dancers, teachers and culture carriers joining Funkcamp 2027.
          More information will be added as we get closer to the camp.
        </p>
      </section>

      <section className={styles.teacherGrid}>
        {teacherData.map((teacher, index) => (
          <TeacherCard key={teacher.id} teacher={teacher} index={index} />
        ))}
      </section>

      <section className={styles.notice}>
        <h2>More teachers may be announced</h2>
        <p>
          The final teacher line-up, class details and schedule will be updated
          when everything is confirmed.
        </p>
      </section>
    </main>
  );
}
