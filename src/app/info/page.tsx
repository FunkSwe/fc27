import Link from 'next/link';
import { teacherData } from '@/data/teachers';
import styles from './Info.module.scss';

const venueQuery = encodeURIComponent('SKH, Brinellvägen 58, 114 28 Stockholm, Sweden');
const venueMapUrl = `https://www.google.com/maps/search/?api=1&query=${venueQuery}`;

export const metadata = {
  title: 'Information | Funkcamp 2027',
  description:
    'Plan your Funkcamp 2027 trip: dates, schedule, SKH venue and map, airport transfers and getting around Stockholm.',
};

export default function Info() {
  return (
    <main className={styles.infoPage}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Funkcamp 2027</p>
        <h1>Information</h1>
        <p>
          Everything you need to know before joining Funkcamp 2027. More details
          will be updated as we get closer to the camp.
        </p>
      </section>

      <section className={`${styles.card} ${styles.venue}`} aria-labelledby="venue-heading">
        <div className={styles.venueDetails}>
          <h2 id="venue-heading">Venue</h2>
          <p>
            <strong>Friday–Monday, 26–29 March</strong>
          </p>
          <p>
            <strong>SKH — Stockholms konstnärliga högskola</strong>
            <br />
            Stockholm University of the Arts
          </p>
          <address>
            Brinellvägen 58
            <br />
            114 28 Stockholm, Sweden
          </address>
          <p>
            All four days take place at SKH&apos;s dance campus, including
            Friday&apos;s kick-off.
          </p>
          <p>
            The Friday venue might change. If so, it will be announced shortly.
          </p>
          <div className={styles.venueLinks}>
            <a
              href="https://www.skh.se/english/about-skh/premises/brinellvagen-58/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit SKH&apos;s website
            </a>
            <a href={venueMapUrl} target="_blank" rel="noopener noreferrer">
              Open venue in Google Maps
            </a>
          </div>
          <p>On your phone? Tap the Google Maps link to find your way here.</p>
        </div>
        <iframe
          className={styles.venueMap}
          title="Google Maps: SKH dance campus, Brinellvägen 58, Stockholm"
          src={`https://www.google.com/maps?q=${venueQuery}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </section>

      <section className={styles.contentGrid}>
        <article className={styles.card}>
          <span>01</span>
          <h2>Date</h2>
          <p>
            Funkcamp 2027 will take place from <strong>26 March</strong> to{' '}
            <strong>29 March 2027</strong>.
          </p>
        </article>

        <article className={styles.card}>
          <span>02</span>
          <h2>Schedule</h2>
          <ul>
            <li>Friday 26 March: 17.00–late</li>
            <li>Saturday 27 March: 11.00–17.00</li>
            <li>Sunday 28 March: 11.00–17.00</li>
            <li>Monday 29 March: 11.00–15.00</li>
          </ul>
          <p>
            All times are local to Stockholm. The schedule may change closer to
            the camp.
          </p>
        </article>

        <article className={styles.card}>
          <span>03</span>
          <h2>Friday kick-off</h2>
          <p>
            On Friday 26 March, we&apos;ll kick things off with a lil&apos; sum
            sum to get the weekend started. Come ready to get down, meet the
            Funkcamp family and have some fun!
          </p>
          <p>
            Join us at SKH, Brinellvägen 58, from 17.00 until late. More details
            are coming soon.
          </p>
        </article>

        <article className={styles.card}>
          <span>04</span>
          <h2>Flying in</h2>
          <p>
            <strong>Stockholm Arlanda Airport (ARN)</strong> is the nearest major
            international airport. The fastest way into town is the{' '}
            <a href="https://www.arlandaexpress.com/" target="_blank" rel="noopener noreferrer">
              Arlanda Express
            </a>
            , taking around 18 minutes to Stockholm Central Station.
          </p>
          <p>
            Check their website for tickets and departures. Arlanda Express
            requires a separate ticket from SL public transport.
          </p>
        </article>

        <article className={styles.card}>
          <span>05</span>
          <h2>Around Stockholm</h2>
          <p>
            Use <strong>SL</strong> for the metro (tunnelbana), commuter trains
            (pendeltåg), buses and trams. From Stockholm Central, follow the
            signs to T-Centralen for the metro.
          </p>
          <p>
            Plan your route in the SL app or on{' '}
            <a href="https://sl.se/en/in-english" target="_blank" rel="noopener noreferrer">
              SL&apos;s English website
            </a>
            . You can buy tickets in the app or use a contactless payment card.
            Remember to tap your ticket or card when boarding or at the gates.
          </p>
          <p>
            <a href="https://sl.se/en/getting-around" target="_blank" rel="noopener noreferrer">
              SL travel information &amp; maps
            </a>
            <br />
            <a href="https://sl.se/en/fares-and-tickets" target="_blank" rel="noopener noreferrer">
              SL tickets &amp; travel passes
            </a>
          </p>
        </article>

        <article className={styles.card}>
          <span>06</span>
          <h2>Coming by train</h2>
          <p>
            Travelling from another city in Sweden? Check{' '}
            <a href="https://www.sj.se/en" target="_blank" rel="noopener noreferrer">
              SJ for train journeys and tickets
            </a>{' '}
            to Stockholm Central Station, then continue with SL for your journey
            around town.
          </p>
          <p>
            SJ is for travel between cities; SL is for local public transport.
            Check which tickets you need for each part of your trip.
          </p>
        </article>

        <article className={styles.card}>
          <span>07</span>
          <h2>Teachers</h2>
          <ul>
            {teacherData.map((teacher) => (
              <li key={teacher.id}>
                <Link href={`/teachers/${teacher.slug}`}>{teacher.name}</Link>
              </li>
            ))}
          </ul>
        </article>

        <article className={styles.card}>
          <span>08</span>
          <h2>Community</h2>
          <p>
            Funkcamp is built around locking, culture, history, connection and
            learning directly from people who carry the dance forward.
          </p>
        </article>

        <article className={styles.card}>
          <span>09</span>
          <h2>Questions &amp; waiting list</h2>
          <p>
            Have questions about the camp? Send us a message through the{' '}
            <Link href="/registration">contact form</Link> or email{' '}
            <a href="mailto:funkcampswe@gmail.com">funkcampswe@gmail.com</a>.
          </p>
          <p>
            Interested in participating?{' '}
            <a href="mailto:funkcampswe@gmail.com?subject=Funkcamp%202027%20Waiting%20List">
              Join the waiting list
            </a>{' '}
            by emailing us with your name.
          </p>
        </article>
      </section>

      <section className={styles.notice}>
        <h2>Get ready to get down!</h2>
        <p>
          We&apos;re looking forward to having you all in Stockholm for Funkcamp
          2027. Bring your energy, your love for the dance and get ready for a
          weekend of good music, connection and fun.
        </p>
        <p>More info will be added as we get closer to the camp. See you there!</p>
      </section>
    </main>
  );
}
