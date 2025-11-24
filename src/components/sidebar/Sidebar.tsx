'use client';

import { useState } from 'react';
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
  currentRoomId: string;
}

export default function Sidebar({
  onOpenModal,
  openModalId,
  currentRoomId,
}: SidebarProps) {
  const { isCollapsed, toggle } = useSidebarStore();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <aside
        className={`${
          isCollapsed ? 'w-[60px] border-r border-[#EAEAEA]' : 'w-[260px]'
        } h-screen flex flex-col transition-all duration-200 relative z-50`}
      >
        <div>
          {/* 사이드바 헤더 */}
          <SidebarHeader
            isCollapsed={isCollapsed}
            onToggle={toggle}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* 최근 메시지 리스트 */}
        {!isCollapsed && (
          <div className='flex-1 overflow-y-auto p-4 mt-6'>
            <p className='text-sm text-[#6D717C] mb-2'>최근 채팅</p>
            <SidebarChatList
              searchQuery={searchQuery}
              onOpenModal={onOpenModal}
              openModalId={openModalId}
              currentRoomId={currentRoomId}
            />
          </div>
        )}
      </aside>
    </>
  );
}
