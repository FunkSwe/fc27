'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './TeacherCard.module.scss';
import type { Teacher } from '@/data/teachers';

type TeacherCardProps = {
  teacher: Teacher;
  index: number;
};

export default function TeacherCard({ teacher, index }: TeacherCardProps) {
  const number = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      className={styles.cardMotion}
      initial={{ opacity: 0, y: 42, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/teachers/${teacher.slug}`} className={styles.card}>
        <div className={styles.imageWrap}>
          <Image
            src={teacher.img}
            alt={teacher.name}
            fill
            sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 28vw"
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
    </motion.div>
  );
}
