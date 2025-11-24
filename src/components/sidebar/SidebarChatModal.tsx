'use client';

import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/stores/useChatStore';
import { Pencil, Trash } from 'lucide-react';

interface SidebarChatModalProps {
  chatId: string;
  onClose: () => void;
  onTitleRename: () => void;
  buttonElement: HTMLButtonElement;
}

export default function SidebarChatModal({
  chatId,
  onClose,
  onTitleRename,
  buttonElement,
}: SidebarChatModalProps) {
  const { deleteChatRoom } = useChatStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (buttonElement) {
        const currentPosition = buttonElement.getBoundingClientRect();
        setPosition({
          top: currentPosition.bottom + 8,
          left: currentPosition.left,
        });
      }
    };
    updatePosition();
  }, [buttonElement]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        buttonElement &&
        !buttonElement.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, buttonElement]);

  const handleTitleRename = () => {
    onTitleRename();
    onClose();
  };

  const handleDelete = () => {
    deleteChatRoom(chatId);
    onClose();
  };

  const handleMouseEnter = () => {
    if (buttonElement) {
      const parent = buttonElement.closest('.group');
      if (parent) {
        parent.classList.add('bg-[#D8EFE9]');
      }
    }
  };

  const handleMouseLeave = () => {
    if (buttonElement) {
      const parent = buttonElement.closest('.group');
      if (parent) {
        parent.classList.remove('bg-[#D8EFE9]');
      }
    }
  };

  return (
    <div
      ref={modalRef}
      className='fixed bg-white rounded-lg shadow-lg border border-gray-200 z-60 py-1 min-w-[140px]'
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
