'use client';

import { useChatStore } from '@/stores/useChatStore';
import { Ellipsis } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import useDebounce from '@/hooks/useDebounce';
import SidebarChatModal from './SidebarChatModal';

export default function SidebarChatList({
  searchQuery,
}: {
  searchQuery: string;
}) {
  const { chatList, updateRoomTitle } = useChatStore();
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debouncedSearchQuery = useDebounce({ value: searchQuery, delay: 300 });

  const filteredChatList = !debouncedSearchQuery.trim()
    ? chatList
    : chatList.filter((chat) =>
        chat.title
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase().trim())
      );

  const handleChatClick = (chatId: string) => {
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

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  return (
    <div>
      {debouncedSearchQuery.trim() && filteredChatList.length === 0 ? (
        <div className='text-xs text-gray-400'>검색 결과가 없습니다.</div>
      ) : (
        <>
          {filteredChatList.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center justify-between p-2 pl-0 rounded-lg cursor-pointer transition-colors ${
                editingId === chat.id ? 'bg-[#D8EFE9]' : 'hover:bg-[#D8EFE9]'
              }`}
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
                    className='opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded cursor-pointer'
                    onClick={() => setOpenModalId(chat.id)}
                    onMouseEnter={(e) => {
                      const parent = e.currentTarget.closest('.group');
                      if (parent) {
                        parent.classList.remove('hover:bg-[#D8EFE9]');
                      }
                    }}
                    onMouseLeave={(e) => {
                      const parent = e.currentTarget.closest('.group');
                      if (parent) {
                        parent.classList.add('hover:bg-[#D8EFE9]');
                      }
                    }}
                  >
                    <Ellipsis size={16} />
                  </button>
                </div>

                {openModalId === chat.id && (
                  <SidebarChatModal
                    chatId={chat.id}
                    onClose={() => setOpenModalId(null)}
                    onTitleRename={() => handleEditTitle(chat.id, chat.title)}
                  />
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
