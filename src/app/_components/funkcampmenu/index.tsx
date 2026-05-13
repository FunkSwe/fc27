'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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

const LogoutIcon = () => (
  <svg
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
  >
    <path
      d='M14 17l-5-5 5-5'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M9 12h12'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <path
      d='M3 19V5a2 2 0 0 1 2-2h6'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const DashboardIcon = () => (
  <svg
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
  >
    <path
      d='M3 13h8V3H3v10Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinejoin='round'
    />
    <path
      d='M13 21h8V11h-8v10Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinejoin='round'
    />
    <path
      d='M13 3h8v6h-8V3Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinejoin='round'
    />
    <path
      d='M3 21h8v-6H3v6Z'
      stroke='currentColor'
      strokeWidth='2'
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

const CreatePostIcon = () => (
  <svg
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
  >
    <path
      d='M4 20h4l10-10-4-4L4 16v4Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M14 6l4 4'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
    />
    <path
      d='M7 17h.01'
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
  /* { path: '/dashboard', label: 'Dashboard' }, */
  { path: '/registration', label: 'Registration' },
  { path: '/contact', label: 'Contact' },
];

export default function FunkCampMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [showLogoGif, setShowLogoGif] = useState<boolean>(false);
  const [logoGifKey, setLogoGifKey] = useState<number>(0);
  const logoGifTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        cache: 'no-store',
        credentials: 'include',
      });

      setIsLoggedIn(response.ok);
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth, pathname]);

  useEffect(() => {
    const handleAuthChanged = () => {
      checkAuth();
    };

    window.addEventListener('auth-changed', handleAuthChanged);
    window.addEventListener('focus', handleAuthChanged);

    return () => {
      window.removeEventListener('auth-changed', handleAuthChanged);
      window.removeEventListener('focus', handleAuthChanged);
    };
  }, [checkAuth]);

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

  useEffect(() => {
    return () => {
      if (logoGifTimeoutRef.current) {
        clearTimeout(logoGifTimeoutRef.current);
      }
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setIsLoggedIn(false);
      closeMenu();

      window.dispatchEvent(new Event('auth-changed'));

      router.push('/auth/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
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
          <button
            type='button'
            aria-label='Play Funkcamp animation'
            onClick={playLogoGif}
          >
            <img src='/fclogosmall.png' alt='Funkcamp logo' />
          </button>
        </div>

        <div className={styles.headerActions}>
          {isLoggedIn ? (
            <>
              <Link
                href='/dashboard'
                aria-label='Dashboard'
                className={styles.headerIconButton}
                onClick={closeMenu}
              >
                <DashboardIcon />
              </Link>

              <button
                type='button'
                aria-label='Log out'
                className={styles.headerIconButton}
                onClick={handleLogout}
              >
                <LogoutIcon />
              </button>
            </>
          ) : (
            <>
              <Link
                href='/auth/login'
                aria-label='Log in'
                className={styles.headerIconButton}
                onClick={closeMenu}
              >
                <LoginIcon />
              </Link>

            </>
          )}

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
            <button
              type='button'
              aria-label='Play Funkcamp animation'
              onClick={playLogoGif}
            >
              <img src='/fclogosmall.png' alt='Funkcamp logo' />
            </button>
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

          <div className={styles.authMenuLinks}>
            {isLoggedIn ? (
              <>
                <Link
                  href='/dashboard/posts/new'
                  className={styles.authMenuLink}
                  onClick={closeMenu}
                >
                  Create post
                </Link>
                <Link
                  href='/dashboard/messages'
                  className={styles.authMenuLink}
                  onClick={closeMenu}
                >
                  Messages
                </Link>
                <Link
                  href='/dashboard'
                  className={styles.authMenuLink}
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>

                <button
                  type='button'
                  className={styles.authMenuButton}
                  onClick={handleLogout}
                  aria-label='Log out'
                >
                  <LogoutIcon />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href='/auth/login'
                  className={styles.authMenuLink}
                  onClick={closeMenu}
                >
                  Log in
                </Link>
              </>
            )}
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
