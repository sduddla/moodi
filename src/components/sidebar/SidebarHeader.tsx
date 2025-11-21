'use client';

import { useRouter } from 'next/navigation';
import mBlack from '@/assets/icons/m-black.png';
import Image from 'next/image';
import { PanelLeft, Plus, Search } from 'lucide-react';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function SidebarHeader({
  isCollapsed,
  onToggle,
}: SidebarHeaderProps) {
  const router = useRouter();

  const goIntroPage = () => {
    router.push('/');
  };

  return (
    <div
      className={`pt-2 ${
        isCollapsed ? 'flex flex-col items-center gap-4' : 'px-2'
      }`}
    >
      <div
        className={`flex w-full ${
          isCollapsed
            ? 'flex-col items-center gap-2'
            : 'items-center justify-between mb-6 gap-20'
        }`}
      >
        {/* 로고 */}
        <button
          type='button'
          onClick={isCollapsed ? onToggle : goIntroPage}
          title={isCollapsed ? '사이드바 열기' : ''}
          className={`flex items-center justify-center rounded-lg w-9 h-9 hover:bg-[#F9F9F9] transition-colors 
          ${isCollapsed ? 'cursor-e-resize' : 'cursor-pointer'}`}
        >
          <Image src={mBlack} alt='로고 이미지' width={16} height={16} />
        </button>

        {/* 사이드바 접기 메뉴 */}
        {!isCollapsed && (
          <button
            type='button'
            onClick={onToggle}
            title='사이드바 닫기'
            className='flex items-center justify-center rounded-lg w-9 h-9 hover:bg-[#F9F9F9] transition-colors cursor-w-resize'
          >
            <PanelLeft size={18} className='text-[#ABABAB]' />
          </button>
        )}

        {isCollapsed && (
          <button
            type='button'
            className='w-8 h-8 bg-[#23C69E] text-white rounded-lg flex items-center justify-center transition-colors hover:bg-[#1ea886] cursor-pointer'
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {!isCollapsed && (
        <div className='flex items-center gap-2 px-2'>
          <div className='flex flex-1 items-center gap-2 bg-[#F5F5F5] rounded-lg h-8 px-2'>
            <Search size={14} className='text-[#575B65] shrink-0' />
            <input
              type='text'
              placeholder='검색하기...'
              className='w-full bg-transparent text-xs text-gray-800 placeholder:text-[#575B65] focus:outline-none'
            />
          </div>

          <button
            type='button'
            className='w-8 h-8 bg-[#23C69E] text-white rounded-lg flex items-center justify-center hover:bg-[#1ea886] transition-colors cursor-pointer'
          >
            <Plus size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
