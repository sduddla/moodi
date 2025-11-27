'use client';

import Image from 'next/image';
import notFoundImageBlack from '@/assets/images/404-black.svg';
import notFoundImageWhite from '@/assets/images/404-white.svg';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-bg-light dark:bg-dark-active px-4'>
      <div className='flex flex-col items-center gap-6 max-w-md text-center'>
        <div className='relative w-40 h-40'>
          <Image
            src={notFoundImageBlack}
            alt='404 not found'
            fill
            className='object-contain dark:hidden'
          />
          <Image
            src={notFoundImageWhite}
            alt='404 not found'
            fill
            className='object-contain hidden dark:block'
          />
        </div>

        <div className='flex flex-col items-center gap-3'>
          <h1 className='text-6xl font-bold text-black dark:text-white'>404</h1>
          <p className='text-xl font-medium text-gray-700 dark:text-gray-300'>
            요청하신 페이지를 찾을 수 없습니다.
          </p>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            페이지가 이동되었거나 삭제되었을 수 있습니다.
          </p>
        </div>

        <button
          onClick={() => router.push('/')}
          className='mt-4 px-6 py-3 bg-primary-accent text-white rounded-lg hover:scale-105 active:scale-100 transition-transform cursor-pointer font-medium shadow-lg'
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
