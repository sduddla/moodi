'use client';

import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import TypingText from './TypingText';
import { useState } from 'react';

export default function IntroPage() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);

  const handleClick = () => {
    const chatId = uuidv4();
    router.push(`/chat/${chatId}`);
  };
  return (
    <>
      <div className='min-h-screen flex flex-col items-center justify-center gap-10'>
        <h1 className='flex flex-col items-center justify-center text-center'>
          <TypingText
            text={`안녕, 나는 Moodi야.\n누구보다 네 마음에 공감해줄게.`}
            logo='Moodi'
            speed={80}
            done={() => setShowButton(true)}
          />
        </h1>
        <div className='relative w-60'>
          {showButton && (
            <button
              onClick={handleClick}
              className='w-full border border-[#D8EFE9] rounded-xl text-sm px-4 py-2 cursor-pointer relative overflow-hidden drop-shadow-2xl group animate-fadeIn'
            >
              <span className='absolute w-0 inset-0 bg-[#10A37F] transition-all duration-800 ease-out group-hover:w-full '></span>
              <span className='relative z-10 text-black group-hover:text-white transition-all'>
                이야기하러 가기
              </span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
