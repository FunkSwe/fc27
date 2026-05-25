'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { teacherData } from '@/data/teachers';
import styles from './HomeTeacherLinks.module.scss';

export default function HomeTeacherLinks() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <motion.p
          className={styles.kicker}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45 }}
        >
          Line-up
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.55 }}
        >
          Meet the teachers
        </motion.h2>
      </div>

      <div className={styles.teacherList}>
        {teacherData.map((teacher, index) => (
          <motion.div
            key={teacher.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.5,
              delay: index * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href={`/teachers/${teacher.slug}`}
              className={styles.teacherRow}
            >
              <span className={styles.number}>
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className={styles.imageWrap}>
                <Image
                  src={teacher.img}
                  alt={teacher.name}
                  fill
                  sizes='72px'
                  className={styles.image}
                />
              </div>

              <div className={styles.text}>
                <h3>{teacher.name}</h3>
                <p>{teacher.title}</p>
              </div>

              <span className={styles.country}>{teacher.country}</span>
              <span className={styles.arrow}>→</span>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className={styles.footer}>
        <Link href='/teachers' className={styles.allTeachersButton}>
          View all teacher pages
        </Link>
      </div>
    </section>
  );
}
