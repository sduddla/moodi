import React, { useEffect, useState, useRef } from 'react';
import { Rock_Salt } from 'next/font/google';

const rockSalt = Rock_Salt({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-rock-salt',
});

interface TypingTextProps {
  text: string;
  logo: string;
  speed: number;
  done: () => void;
}

export default function TypingText({
  text,
  logo,
  speed,
  done,
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingComplete = displayedText.length === text.length;

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (displayedText.length < text.length) {
      timerRef.current = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [displayedText.length, text, speed, done]);

  useEffect(() => {
    if (isTypingComplete) {
      done();
    }
  }, [done, isTypingComplete]);

  // 줄바꿈 처리 함수
  const lineBreak = (text: string) => {
    return text.split('\n').map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && (
          <>
            <br />
            <span className='block h-4' />
          </>
        )}
      </React.Fragment>
    ));
  };

  // logo 기준으로 분리해서 다른 스타일 적용
  const renderText = () => {
    if (!logo) {
      return lineBreak(displayedText);
    }

    const logoStartIndex = text.indexOf(logo);

    if (logoStartIndex === -1) {
      return lineBreak(displayedText);
    }

    // displayedText가 logo 시작 위치에 도달했는지 확인
    if (displayedText.length <= logoStartIndex) {
      return lineBreak(displayedText);
    }

    const logoEndIndex = logoStartIndex + logo.length;

    const beforeLogo = displayedText.slice(0, logoStartIndex);
    const logoPart = displayedText.slice(logoStartIndex, logoEndIndex);
    const afterLogo = displayedText.slice(logoEndIndex);

    return (
      <>
        {lineBreak(beforeLogo)}
        <span className={rockSalt.className}>{logoPart}</span>
        {lineBreak(afterLogo)}
      </>
    );
  };

  return (
    <p className='text-2xl font-bold'>
      {renderText()}
      {!isTypingComplete && <span className='animate-pulse'>|</span>}
    </p>
  );
}
