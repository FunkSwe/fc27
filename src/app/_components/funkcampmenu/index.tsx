'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './FunkCampMenu.module.scss';

const CopyIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M16 4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 8h8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 12h8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

type MenuLink = {
  path: string;
  label: string;
};

const menuLinks: MenuLink[] = [
  { path: '/', label: 'Home' },
  { path: '/info', label: 'Info' },
  { path: '/teachers', label: 'Teachers' },
  { path: '/registration', label: 'Registration' },
];

export default function FunkCampMenu() {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';

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
    <div
      className={`${styles.menuContainer} ${
        isMenuOpen ? styles.menuIsOpen : ''
      }`}
    >
      <div
        className={`${styles.menuContainerBg} ${
          isScrolled ? styles.scrolled : ''
        }`}
      />

      <div className={styles.menuBar}>
        <div className={styles.menuLogo}>
          <Link href="/" aria-label="Go to Funkcamp home" onClick={closeMenu}>
            <img src="/fclogosmall.png" alt="Funkcamp logo" />
          </Link>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.menuOpen}
            onClick={toggleMenu}
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            aria-controls="funkcamp-menu-overlay"
          >
            <span>Menu</span>
          </button>
        </div>
      </div>

      <div
        id="funkcamp-menu-overlay"
        className={`${styles.menuOverlay} ${
          isMenuOpen ? styles.menuOverlayOpen : ''
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className={styles.menuOverlayBar}>
          <div className={styles.menuLogo}>
            <Link href="/" aria-label="Go to Funkcamp home" onClick={closeMenu}>
              <img src="/fclogosmall.png" alt="Funkcamp logo" />
            </Link>
          </div>

          <button
            type="button"
            className={styles.menuClose}
            onClick={toggleMenu}
            aria-label="Close menu"
            aria-expanded={isMenuOpen}
          >
            <span>Close</span>
          </button>
        </div>

        <div className={styles.menuCopy}>
          <nav className={styles.menuLinks} aria-label="Main navigation">
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
                type="button"
                className={styles.copyButton}
                onClick={copyToClipboard}
                aria-label="Copy email address"
              >
                <CopyIcon />
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
