'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import styles from './PageLoader.module.scss';

const ROWS = 10;
const COLUMNS = 11;

function pseudoRandom(rowIndex: number, blockIndex: number) {
  const value = Math.sin(rowIndex * 12.9898 + blockIndex * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function calculateBlockDelay(rowIndex: number, blockIndex: number) {
  const blockDelay = pseudoRandom(rowIndex, blockIndex) * 0.05;
  const rowDelay = (ROWS - rowIndex - 1) * 0.05;

  return blockDelay + rowDelay;
}

export default function PageLoader() {
  const pathname = usePathname();

  return (
    <div className={styles.pageLoader} key={pathname}>
      {Array.from({ length: ROWS }).map((_, rowIndex) => (
        <div className={styles.row} key={rowIndex}>
          {Array.from({ length: COLUMNS }).map((_, blockIndex) => (
            <motion.div
              key={blockIndex}
              className={styles.block}
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
                delay: calculateBlockDelay(rowIndex, blockIndex),
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
