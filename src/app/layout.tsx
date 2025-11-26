import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Moodi',
  description:
    '무조건 공감해주는 AI 챗봇 Moodi와 이야기해보세요. 어떤 이야기든 재치있고 유쾌하게 공감해드립니다.',
  icons: {
    icon: [
      { url: '/logo.svg', media: '(prefers-color-scheme: light)' },
      { url: '/logo-white.svg', media: '(prefers-color-scheme: dark)' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body>
        {children}
        <Toaster position='top-center' />
      </body>
    </html>
  );
}
