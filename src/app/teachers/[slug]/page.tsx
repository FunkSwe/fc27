import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './TeacherSingle.module.scss';
import { teacherData } from '@/data/teachers';

type TeacherSinglePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return teacherData.map((teacher) => ({
    slug: teacher.slug,
  }));
}

export async function generateMetadata({ params }: TeacherSinglePageProps) {
  const { slug } = await params;
  const teacher = teacherData.find((item) => item.slug === slug);

  if (!teacher) {
    return {
      title: 'Teacher not found | Funkcamp 2027',
    };
  }

  return {
    title: `${teacher.name} | Funkcamp 2027`,
    description: teacher.desc,
  };
}

export default async function TeacherSinglePage({
  params,
}: TeacherSinglePageProps) {
  const { slug } = await params;
  const teacher = teacherData.find((item) => item.slug === slug);

  if (!teacher) {
    notFound();
  }

  return (
    <main className={styles.teacherPage}>
      <Link href='/teachers' className={styles.backLink}>
        Back to teachers
      </Link>

      <section className={styles.hero}>
        <div className={styles.imageWrap}>
          <Image
            src={teacher.img}
            alt={teacher.name}
            fill
            sizes='(max-width: 560px) 100vw, (max-width: 900px) 680px, 360px'
            className={styles.image}
            priority
          />
        </div>

        <div className={styles.content}>
          <p className={styles.kicker}>{teacher.country} / Funkcamp 2027</p>

          <h1>{teacher.name}</h1>

          <div className={styles.meta}>
            <p>{teacher.title}</p>
            <p>{teacher.subtitle}</p>
          </div>

          <p className={styles.desc}>{teacher.desc}</p>
        </div>
      </section>
    </main>
  );
}
