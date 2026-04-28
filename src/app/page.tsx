import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className={styles.intro}>
          <h1>FUNKCAMP 2027.</h1>
          <p>
           Lets go to a new era, best of the best{" "}
          </p>
        </div>
      </main>
    </div>
  );
}
