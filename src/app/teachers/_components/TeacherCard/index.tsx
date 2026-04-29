import Image from 'next/image';
import Link from 'next/link';
import styles from './TeacherCard.module.scss';
import type { Teacher } from '@/data/teachers';

type TeacherCardProps = {
  teacher: Teacher;
  index: number;
};

export default function TeacherCard({ teacher, index }: TeacherCardProps) {
  const number = String(index + 1).padStart(2, '0');

  return (
    <Link href={`/teachers/${teacher.slug}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={teacher.img}
          alt={teacher.name}
          fill
          sizes='(max-width: 560px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 20vw'
          className={styles.image}
          priority={index === 0}
        />
      </div>

      <div className={styles.cardInfo}>
        <div className={styles.top}>
          <span>{number}</span>
          <span>{teacher.country}</span>
        </div>

        <div className={styles.bottom}>
          <h2>{teacher.name}</h2>
          <p>{teacher.subtitle}</p>
        </div>
      </div>
    </Link>
  );
}
