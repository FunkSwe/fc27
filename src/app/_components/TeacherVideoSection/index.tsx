'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { teacherVideos } from '@/data/teacherVideos';
import styles from './TeacherVideoSection.module.scss';

export default function TeacherVideoSection() {
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
          Locking in motion
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.55, delay: 0.05 }}
        >
          Watch the teachers
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          A small taste of the funk, character, groove and locking history that
          these artists bring to Funkcamp 2027.
        </motion.p>
      </div>

      <div className={styles.videoGrid}>
        {teacherVideos.map((video, index) => {
          const embedUrl =
            typeof video.start === 'number'
              ? `https://www.youtube.com/embed/${video.embedId}?start=${video.start}`
              : `https://www.youtube.com/embed/${video.embedId}`;

          return (
            <motion.article
              key={video.id}
              className={styles.videoCard}
              initial={{
                opacity: 0,
                y: 44,
                rotate: index % 2 === 0 ? -1.2 : 1.2,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                rotate: 0,
              }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.6,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className={styles.videoFrame}>
                <iframe
                  src={embedUrl}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <div className={styles.cardInfo}>
                <div className={styles.cardTop}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span>{video.country}</span>
                </div>

                <h3>{video.teacherName}</h3>
                <p>{video.title}</p>
                <small>{video.subtitle}</small>

                <div className={styles.actions}>
                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.actionButton}
                  >
                    YouTube
                  </a>

                  {video.teacherSlug && (
                    <Link
                      href={`/teachers/${video.teacherSlug}`}
                      className={styles.actionButtonSecondary}
                    >
                      Teacher page
                    </Link>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}