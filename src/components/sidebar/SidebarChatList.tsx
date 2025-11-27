'use client';

import { useChatStore } from '@/stores/useChatStore';
import { Ellipsis } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import useDebounce from '@/hooks/useDebounce';

interface SidebarChatListProps {
  searchQuery: string;
  onOpenModal?: (state: {
    chatId: string;
    onTitleRename: () => void;
    buttonElement: HTMLButtonElement;
  }) => void;
  onCloseModal?: () => void;
  openModalId?: string | null;
  currentRoomId: string;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export default function SidebarChatList({
  searchQuery,
  onOpenModal,
  onCloseModal,
  openModalId,
  currentRoomId,
  scrollRef,
}: SidebarChatListProps) {
  const { chatList, updateRoomTitle } = useChatStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debouncedSearchQuery = useDebounce({ value: searchQuery, delay: 300 });
  const SCROLL_POSITION_KEY = 'sidebar-scroll-position';

  const handleEllipsisClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    chatId: string
  ) => {
    if (openModalId === chatId && onCloseModal) {
      onCloseModal();
    } else if (onOpenModal) {
      handleOpenModal(e, chatId);
    }
  };

  const filteredChatList = !debouncedSearchQuery.trim()
    ? chatList
    : chatList.filter((chat) =>
        chat.title
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase().trim())
      );

  const handleChatClick = (chatId: string) => {
    if (scrollRef?.current) {
      const scrollTop = scrollRef.current.scrollTop;
      sessionStorage.setItem(SCROLL_POSITION_KEY, scrollTop.toString());
    }
    router.push(`/chat/${chatId}`);
  };

  const handleEditTitle = (chatId: string, currentTitle: string) => {
    setEditingId(chatId);
    setEditTitle(currentTitle);
  };

  const handleSaveTitle = (chatId: string) => {
    if (editTitle.trim()) {
      updateRoomTitle(chatId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleOpenModal = (
    e: React.MouseEvent<HTMLButtonElement>,
    chatId: string
  ) => {
    const chat = chatList.find((c) => c.id === chatId);
    if (onOpenModal && chat) {
      onOpenModal({
        chatId,
        onTitleRename: () => handleEditTitle(chatId, chat.title),
        buttonElement: e.currentTarget,
      });
    }
  };

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  const restoreScrollPosition = useCallback(() => {
    if (!scrollRef?.current) return;

    const savedScrollTop = sessionStorage.getItem(SCROLL_POSITION_KEY);
    if (!savedScrollTop) return;

    const scrollPosition = parseInt(savedScrollTop, 10);
    scrollRef.current.scrollTop = scrollPosition;
    sessionStorage.removeItem(SCROLL_POSITION_KEY);
  }, [scrollRef]);

  useEffect(() => {
    restoreScrollPosition();
  }, [currentRoomId, restoreScrollPosition]);

  return (
    <div>
      {debouncedSearchQuery.trim() && filteredChatList.length === 0 ? (
        <div className='text-xs text-gray-400'>검색 결과가 없습니다.</div>
      ) : (
        <>
          {filteredChatList.map((chat) => (
            <div
              key={chat.id}
              data-chat-id={chat.id}
              className={`group flex items-center text-black dark:text-white justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                editingId === chat.id || currentRoomId === chat.id
                  ? 'bg-chat-active dark:bg-dark-active'
                  : ''
              }`}
              onMouseEnter={(e) => {
                if (editingId !== chat.id && currentRoomId !== chat.id) {
                  e.currentTarget.classList.add(
                    'bg-chat-hover',
                    'dark:bg-dark-hover'
                  );
                }
              }}
              onMouseLeave={(e) => {
                if (editingId !== chat.id && currentRoomId !== chat.id) {
                  e.currentTarget.classList.remove(
                    'bg-chat-hover',
                    'dark:bg-dark-hover'
                  );
                }
              }}
              onClick={() => {
                if (editingId !== chat.id) {
                  handleChatClick(chat.id);
                }
              }}
            >
              <div>
                {editingId === chat.id ? (
                  <input
                    type='text'
                    ref={inputRef}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSaveTitle(chat.id);
                      } else if (e.key === 'Escape') {
                        setEditingId(null);
                        setEditTitle('');
                      }
                    }}
                    onBlur={() => handleSaveTitle(chat.id)}
                    className='w-full text-sm font-medium focus:outline-none focus:ring-0'
                  />
                ) : (
                  <p className='text-sm font-medium'>{chat.title}</p>
                )}
              </div>
              <div className='relative'>
                <div
                  className='w-6 h-6 flex items-center justify-center'
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className={`transition-opacity p-1 rounded cursor-pointer ${
                      openModalId === chat.id
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                    onClick={(e) => handleEllipsisClick(e, chat.id)}
                    onMouseEnter={(e) => {
                      const parent = e.currentTarget.closest(
                        '.group'
                      ) as HTMLElement;
                      if (parent && currentRoomId !== chat.id) {
                        parent.classList.remove(
                          'bg-chat-hover',
                          'dark:bg-dark-hover'
                        );
                      }
                    }}
                    onMouseLeave={(e) => {
                      const parent = e.currentTarget.closest(
                        '.group'
                      ) as HTMLElement;
                      if (parent && currentRoomId !== chat.id) {
                        parent.classList.add(
                          'bg-chat-hover',
                          'dark:bg-dark-hover'
                        );
                      }
                    }}
                  >
                    <Ellipsis size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
