import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Short Linker',
  description:
    'Shorten links in seconds with Short Linker, security provided by the power of AI.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
