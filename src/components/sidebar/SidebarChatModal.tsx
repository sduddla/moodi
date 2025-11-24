'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/stores/useChatStore';
import { Pencil, Trash } from 'lucide-react';

interface SidebarChatModalProps {
  chatId: string;
  onClose: () => void;
  onTitleRename: () => void;
}

export default function SidebarChatModal({
  chatId,
  onClose,
  onTitleRename,
}: SidebarChatModalProps) {
  const { deleteChatRoom } = useChatStore();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleTitleRename = () => {
    onTitleRename();
    onClose();
  };

  const handleDelete = () => {
    deleteChatRoom(chatId);
    onClose();
  };

  return (
    <div
      ref={modalRef}
      className='absolute right-2 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[140px]'
    >
      <button
        onClick={handleTitleRename}
        className='w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer'
      >
        <Pencil size={16} />
        <span>이름 바꾸기</span>
      </button>

      <button
        onClick={handleDelete}
        className='w-full px-4 py-2 text-sm text-left hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer'
      >
        <Trash size={16} className='text-red-600' />
        <span className='text-red-600'>삭제</span>
      </button>
    </div>
  );
}
