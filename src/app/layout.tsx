import { Geist, Geist_Mono, Anton, Archivo_Black } from 'next/font/google';
import './globals.css';
import FunkCampMenu from './_components/funkcampmenu';
import PageLoader from './_components/PageLoader';
import FloatingActions from './_components/FloatingActions';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const anton = Anton({
  variable: '--font-anton',
  weight: '400',
  subsets: ['latin'],
});

const archivoBlack = Archivo_Black({
  variable: '--font-archivo-black',
  weight: '400',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Funkcamp 2027',
  description: 'Funkcamp 2027',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} ${archivoBlack.variable}`}
    >
      <body>
        <FunkCampMenu />
        <PageLoader />
        {children}
        <FloatingActions />
      </body>
    </html>
  );
}