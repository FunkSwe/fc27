import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.scss';

type HeroProps = {
  desktopTitleLines?: string[];
  mobileTitleLines?: string[];
  subtitle?: string;
  imageSrc?: string;
  numberText?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export default function Hero({
  desktopTitleLines = ['FUNKCAMP', '2027'],
  mobileTitleLines = ['FUNK', 'CAMP', '2027'],
  subtitle = 'Funkcamp 2027',
  imageSrc = '/images/hero-players.png',
  numberText = '26–29 MARCH',
  ctaHref = '/registration',
  ctaLabel = 'Registeration closed',
}: HeroProps) {
  const barcodeBars = [
    8, 18, 28, 12, 34, 22, 40, 16, 30, 38, 14, 24, 42, 20, 32, 10, 36, 26, 44,
    18, 30, 12, 40, 22,
  ];

  return (
    <section className={styles.hero}>
      <div className={styles.grain} />

      <div className={styles.posterFrame}>
        <div className={styles.metaGrid}>
          <div>
            <span>Funkcamp</span>
            <p>2027</p>
          </div>

          <div>
            <span>Style</span>
            <p>Locking</p>
          </div>

          <div>
            <span>Location</span>
            <p>Stockholm</p>
          </div>

          <div>
            <span>Date</span>
            <p>26.03.2027</p>
          </div>
        </div>

        <h1 className={styles.bigTitle} aria-label='Funkcamp 2027'>
          <span className={styles.desktopTitle}>
            {desktopTitleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </span>

          <span className={styles.mobileTitle}>
            {mobileTitleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </span>
        </h1>

        <div className={styles.imageArea}>
          <div className={styles.imageWrapper}>
            <Image
              src={imageSrc}
              alt={subtitle}
              fill
              priority
              className={styles.heroImage}
            />
          </div>
        </div>

        <div className={styles.bottomContent}>
          <p className={styles.number}>{numberText}</p>

          <div className={styles.barcode} aria-hidden='true'>
            {barcodeBars.map((height, index) => (
              <span key={index} style={{ height: `${height}px` }} />
            ))}
          </div>

          <Link href={ctaHref} className={styles.ctaButton}>
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
