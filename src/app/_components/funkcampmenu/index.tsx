'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import styles from './FunkCampMenu.module.scss';

const LoginIcon = () => (
  <svg
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
  >
    <path
      d='M10 17l5-5-5-5'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M15 12H3'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <path
      d='M21 19V5a2 2 0 0 0-2-2H13'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const UserAddIcon = () => (
  <svg
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
  >
    <path
      d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <circle cx='9' cy='7' r='4' stroke='currentColor' strokeWidth='2' />
    <path
      d='M22 12h-4m2-2v4'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
    />
  </svg>
);

const CopyIcon = () => (
  <svg
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
  >
    <path
      d='M16 4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M8 8h8'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <path
      d='M8 12h8'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
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
  { path: '/dashboard', label: 'Dashboard' },
];

export default function FunkCampMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const [showLogoGif, setShowLogoGif] = useState<boolean>(false);
  const [logoGifKey, setLogoGifKey] = useState<number>(0);
  const logoGifTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const playLogoGif = () => {
    setLogoGifKey((prev) => prev + 1);
    setShowLogoGif(true);

    if (logoGifTimeoutRef.current) {
      clearTimeout(logoGifTimeoutRef.current);
    }

    logoGifTimeoutRef.current = setTimeout(() => {
      setShowLogoGif(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (logoGifTimeoutRef.current) {
        clearTimeout(logoGifTimeoutRef.current);
      }
    };
  }, []);

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
          {/*  <Link href='/' aria-label='Funkcamp home'>
            <img src='/fclogosmall.png' alt='Funkcamp logo' />
          </Link> */}

          <div className={styles.menuLogo}>
            <button
              type='button'
              aria-label='Play Funkcamp animation'
              onClick={playLogoGif}
            >
              <img src='/fclogosmall.png' alt='Funkcamp logo' />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link
            href='/auth/login'
            aria-label='Log in'
            style={{
              display: 'grid',
              placeContent: 'center',
              width: 34,
              height: 34,
              borderRadius: '50%',
              border: '1px solid rgba(0,0,0,0.12)',
              color: '#424141',
              background: 'rgba(255,255,255,0.9)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              pointerEvents: 'auto',
            }}
            onClick={closeMenu}
          >
            <LoginIcon />
          </Link>

          <Link
            href='/auth/signup'
            aria-label='Sign up'
            style={{
              display: 'grid',
              placeContent: 'center',
              width: 34,
              height: 34,
              borderRadius: '50%',
              border: '1px solid rgba(0,0,0,0.12)',
              color: '#424141',
              background: 'rgba(255,255,255,0.9)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              pointerEvents: 'auto',
            }}
            onClick={closeMenu}
          >
            <UserAddIcon />
          </Link>

          <button
            type='button'
            className={styles.menuOpen}
            onClick={toggleMenu}
            aria-label='Open menu'
            aria-expanded={isMenuOpen}
            aria-controls='funkcamp-menu-overlay'
          >
            <span>Menu</span>
          </button>
        </div>
      </div>

      <div
        id='funkcamp-menu-overlay'
        className={`${styles.menuOverlay} ${
          isMenuOpen ? styles.menuOverlayOpen : ''
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className={styles.menuOverlayBar}>
          <div className={styles.menuLogo}>
            {/*  <Link href='/' aria-label='Funkcamp home' onClick={closeMenu}>
              <img src='/fclogosmall.png' alt='Funkcamp logo' />
            </Link> */}
            <div className={styles.menuLogo}>
              <button
                type='button'
                aria-label='Play Funkcamp animation'
                onClick={playLogoGif}
              >
                <img src='/fclogosmall.png' alt='Funkcamp logo' />
              </button>
            </div>
          </div>

          <button
            type='button'
            className={styles.menuClose}
            onClick={toggleMenu}
            aria-label='Close menu'
            aria-expanded={isMenuOpen}
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

          <div style={{ marginTop: '1.5rem', display: 'grid', gap: '0.75rem' }}>
            <Link
              href='/auth/login'
              className={styles.menuLink}
              onClick={closeMenu}
            >
              Log in
            </Link>
            <Link
              href='/auth/signup'
              className={styles.menuLink}
              onClick={closeMenu}
            >
              Sign up
            </Link>
          </div>

          <div className={styles.menuInfo}>
            <div className={styles.menuInfoCol}>
              <p>Contact Us: funkcampswe@gmail.com</p>

              <button
                type='button'
                className={styles.copyButton}
                onClick={copyToClipboard}
                aria-label='Copy email address'
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

      {showLogoGif && (
        <div className={styles.logoGifOverlay} aria-hidden='true'>
          <img key={logoGifKey} src='/locker.gif' alt='' />
        </div>
      )}
    </div>
  );
}
