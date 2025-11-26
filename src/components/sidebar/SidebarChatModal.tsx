'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/stores/useChatStore';
import { Pencil, Trash } from 'lucide-react';
import toast from 'react-hot-toast';

interface SidebarChatModalProps {
  chatId: string;
  onClose: () => void;
  onTitleRename: () => void;
  buttonElement: HTMLButtonElement;
  currentRoomId: string;
}

export default function SidebarChatModal({
  chatId,
  onClose,
  onTitleRename,
  buttonElement,
  currentRoomId,
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

  const getParentElement = useCallback(() => {
    return buttonElement.closest('.group') as HTMLElement | null;
  }, [buttonElement]);

  const resetParentBackground = useCallback(() => {
    const parent = getParentElement();
    if (parent) {
      parent.classList.remove('bg-chat-hover', 'dark:bg-dark-hover');
      if (currentRoomId !== chatId) {
        parent.classList.remove('bg-chat-active', 'dark:bg-dark-active');
      }
    }
  }, [getParentElement, currentRoomId, chatId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        buttonElement &&
        !buttonElement.contains(e.target as Node)
      ) {
        resetParentBackground();
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, buttonElement, resetParentBackground]);

  const handleTitleRename = () => {
    onTitleRename();
    resetParentBackground();
    onClose();
  };

  const handleDelete = () => {
    deleteChatRoom(chatId);
    resetParentBackground();
    onClose();
    toast.success('대화를 삭제했어요.');
  };

  const handleMouseEnter = () => {
    const parent = getParentElement();
    if (parent) {
      if (currentRoomId === chatId) {
        parent.classList.add('bg-chat-active', 'dark:bg-dark-active');
      } else {
        parent.classList.add('bg-chat-hover', 'dark:bg-dark-hover');
      }
    }
  };

  return (
    <div
      ref={modalRef}
      className='fixed bg-white dark:bg-dark rounded-lg border border-gray-200 dark:border-black/10 shadow-xl z-60 py-2 px-2 min-w-[140px]'
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      onMouseEnter={handleMouseEnter}
    >
      <button
        onClick={handleTitleRename}
        className='w-full px-2 py-2 text-sm text-left text-black dark:text-white transition-colors flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-modal-hover rounded-md'
      >
        <Pencil size={16} className='dark:text-gray-300' />
        <span>이름 바꾸기</span>
      </button>

      <button
        onClick={handleDelete}
        className='w-full px-2 py-2 text-sm text-left text-black dark:text-white hover:bg-red-50 dark:hover:bg-dark-red transition-colors flex items-center gap-2 cursor-pointer rounded-md'
      >
        <Trash size={16} className='text-red-600 dark:text-red-400' />
        <span className='text-red-600 dark:text-red-400'>삭제</span>
      </button>
    </div>
  );
}
