'use client';

import { useState } from 'react';
import SidebarChatList from './SidebarChatList';
import SidebarHeader from './SidebarHeader';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };
  return (
    <>
      <aside
        className={`${
          isCollapsed ? 'w-[60px] border-r border-[#EAEAEA]' : 'w-[260px]'
        } h-screen flex flex-col transition-all duration-200`}
      >
        <div>
          {/* 사이드바 헤더 */}
          <SidebarHeader isCollapsed={isCollapsed} onToggle={toggleSidebar} />
        </div>

        {/* 최근 메시지 리스트 */}
        {!isCollapsed && (
          <div className='flex-1 overflow-y-auto p-4 mt-6'>
            <p className='text-sm text-[#6D717C] mb-2'>최근 채팅</p>
            <SidebarChatList />
          </div>
        )}
      </aside>
    </>
  );
}
