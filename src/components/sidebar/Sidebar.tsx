'use client';

import { useRef, useState } from 'react';
import SidebarChatList from './SidebarChatList';
import SidebarHeader from './SidebarHeader';
import { useSidebarStore } from '@/stores/useSidebarStore';

interface SidebarProps {
  openModalId?: string | null;
  onOpenModal?: (state: {
    chatId: string;
    onTitleRename: () => void;
    buttonElement: HTMLButtonElement;
  }) => void;
  onCloseModal?: () => void;
  currentRoomId: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  onOpenModal,
  onCloseModal,
  openModalId,
  currentRoomId,
  isMobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const { isCollapsed, toggle } = useSidebarStore();
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const showFullSidebar = isMobileOpen ? false : isCollapsed;

  return (
    <>
      <aside
        className={`${
          showFullSidebar ? 'w-[60px]' : 'w-[260px]'
        } h-screen flex flex-col z-50 bg-white dark:bg-dark
        fixed top-0 left-0 transform transition-transform duration-300 ease-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:transition-all md:duration-300 md:ease-out
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* 사이드바 헤더 */}
          <SidebarHeader
            isCollapsed={showFullSidebar}
            onToggle={() => {
              if (isMobileOpen && onMobileClose) {
                onMobileClose();
              } else {
                toggle();
              }
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* 최근 메시지 리스트 */}
        {!showFullSidebar && (
          <div className='flex-1 flex flex-col p-4 mt-6 min-h-0'>
            <p className='text-sm text-[#6D717C] mb-2'>최근 채팅</p>
            <div
              ref={scrollRef}
              className='flex-1 overflow-y-auto scrollbar-hide'
            >
              <SidebarChatList
                searchQuery={searchQuery}
                onOpenModal={onOpenModal}
                onCloseModal={onCloseModal}
                openModalId={openModalId}
                currentRoomId={currentRoomId}
                scrollRef={scrollRef}
              />
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
