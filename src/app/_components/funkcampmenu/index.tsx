'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RiFileCopyLine } from 'react-icons/ri';
import styles from './FunkCampMenu.module.scss';

const menuLinks = [
  { path: '/', label: 'Home' },
  { path: '/info', label: 'Info' },
  // { path: '/schedule', label: 'Schedule' },
  // { path: '/contact', label: 'Contact' },
];

export default function FunkCampMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('funkcampswe@gmail.com');

      setCopySuccess(true);

      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Could not copy email:', error);
    }
  };

  return (
    <div className={styles.menuContainer}>
      <div
        className={`${styles.menuContainerBg} ${
          isScrolled ? styles.scrolled : ''
        }`}
      />

      <div className={styles.menuBar}>
        <div className={styles.menuLogo}>
          <Link href='/' aria-label='Funkcamp home'>
            <img src='/fclogosmall.png' alt='Funkcamp logo' />
          </Link>
        </div>

        <button
          type='button'
          className={styles.menuOpen}
          onClick={toggleMenu}
          aria-label='Open menu'
          aria-expanded={isMenuOpen}
        >
          <span>Menu</span>
        </button>
      </div>

      <div
        className={`${styles.menuOverlay} ${
          isMenuOpen ? styles.menuOverlayOpen : ''
        }`}
      >
        <div className={styles.menuOverlayBar}>
          <div className={styles.menuLogo}>
            <Link href='/' aria-label='Funkcamp home' onClick={closeMenu}>
              <img src='/fclogosmall.png' alt='Funkcamp logo' />
            </Link>
          </div>

          <button
            type='button'
            className={styles.menuClose}
            onClick={toggleMenu}
            aria-label='Close menu'
          >
            <span>Close</span>
          </button>
        </div>

        <div className={styles.menuCopy}>
          <nav className={styles.menuLinks} aria-label='Main navigation'>
            {menuLinks.map((link, linkIndex) => (
              <div
                className={styles.menuLinkItem}
                key={link.label}
                style={{
                  transitionDelay: isMenuOpen
                    ? `${0.18 + linkIndex * 0.05}s`
                    : '0s',
                }}
              >
                <Link
                  href={link.path}
                  className={styles.menuLink}
                  onClick={closeMenu}
                >
                  {link.label.split('').map((letter, index) => (
                    <span
                      key={`${letter}-${index}`}
                      className={styles.menuLetter}
                    >
                      {letter}
                    </span>
                  ))}
                </Link>
              </div>
            ))}
          </nav>

          <div className={styles.menuInfo}>
            <div className={styles.menuInfoCol}>
              <p>Contact Us: funkcampswe@gmail.com</p>

              <button
                type='button'
                className={styles.copyButton}
                onClick={copyToClipboard}
                aria-label='Copy email address'
              >
                <RiFileCopyLine />
              </button>

              {copySuccess && (
                <span className={styles.copySuccess}>Copied!</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
