'use client';

import { useRouter } from 'next/navigation';
import mBlack from '@/assets/icons/m-black.png';
import mWhite from '@/assets/icons/m-white.png';
import Image from 'next/image';
import { PanelLeft, Plus, Search } from 'lucide-react';
import { useChatStore } from '@/stores/useChatStore';
interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function SidebarHeader({
  isCollapsed,
  onToggle,
  searchQuery,
  onSearchChange,
}: SidebarHeaderProps) {
  const router = useRouter();
  const { createChatRoom } = useChatStore();

  const goIntroPage = () => {
    router.push('/');
  };

  const handleCreateChatRoom = () => {
    const chatId = crypto.randomUUID();
    createChatRoom(chatId);
    router.push(`/chat/${chatId}`);
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
          className={`group flex items-center justify-center rounded-lg w-9 h-9 hover:bg-button-hover-alt dark:hover:bg-dark-active transition-colors 
          ${isCollapsed ? 'cursor-e-resize' : 'cursor-pointer'}`}
        >
          {isCollapsed ? (
            <div className='relative flex items-center justify-center w-full h-full'>
              <Image
                src={mBlack}
                alt='로고 이미지'
                width={16}
                height={16}
                className='absolute group-hover:hidden dark:hidden'
              />
              <Image
                src={mWhite}
                alt='로고 이미지'
                width={16}
                height={16}
                className='absolute hidden dark:block group-hover:hidden'
              />
              <PanelLeft
                size={18}
                className='absolute text-[#ABABAB] hidden group-hover:block'
              />
            </div>
          ) : (
            <>
              <Image
                src={mBlack}
                alt='로고 이미지'
                width={16}
                height={16}
                className='dark:hidden'
              />
              <Image
                src={mWhite}
                alt='로고 이미지'
                width={16}
                height={16}
                className='hidden dark:block'
              />
            </>
          )}
        </button>

        {/* 사이드바 접기 메뉴 */}
        {!isCollapsed && (
          <button
            type='button'
            onClick={onToggle}
            title='사이드바 닫기'
            className='flex items-center justify-center rounded-lg w-9 h-9 hover:bg-button-hover-alt dark:hover:bg-dark-active transition-colors cursor-w-resize'
          >
            <PanelLeft size={18} className='text-[#ABABAB]' />
          </button>
        )}

        {isCollapsed && (
          <button
            type='button'
            onClick={handleCreateChatRoom}
            className='w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center transition-colors hover:bg-primary-hover cursor-pointer'
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {!isCollapsed && (
        <div className='flex items-center gap-2 px-2'>
          <div className='flex flex-1 items-center gap-2 bg-bg-light dark:bg-dark-bg rounded-lg h-8 px-2'>
            <Search size={14} className='text-search-icon shrink-0' />
            <input
              type='text'
              placeholder='검색하기...'
              className='w-full bg-transparent text-xs placeholder:text-search-icon dark:text-white focus:outline-none'
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <button
            type='button'
            onClick={handleCreateChatRoom}
            className='w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary-hover transition-colors cursor-pointer'
          >
            <Plus size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
