'use client';

import { useEffect, useState, useRef } from 'react';
import { Message } from '@/types/chat';
import Sidebar from '../sidebar/Sidebar';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import ChatList from './ChatList';
import sendChatMessage from '@/hooks/sendChatMessage';
import { useParams } from 'next/navigation';
import { useChatStore } from '@/stores/useChatStore';
import useDebounce from '@/hooks/useDebounce';
import SidebarChatModal from '../sidebar/SidebarChatModal';

interface ModalState {
  chatId: string;
  onTitleRename: () => void;
  buttonElement: HTMLButtonElement;
}

export default function ChatRoom() {
  const params = useParams();
  const roomId = params.id as string;
  const { addMessage, createChatRoom, chats } = useChatStore();
  const messages = chats[roomId] || [];
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce({ value: searchQuery, delay: 300 });
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (roomId && !chats[roomId]) {
      createChatRoom(roomId);
    }
  }, [roomId, chats, createChatRoom]);

  // 새로운 메시지 있을 경우 자동으로 맨 아래로 스크롤
  useEffect(() => {
    if (scrollRef.current && messages.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = async (message: string) => {
    // 사용자 메시지 추가
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: message,
    };
    addMessage(roomId, userMessage);

    try {
      const response = await sendChatMessage(message);

      // 무디 응답 추가
      const moodiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'moodi',
        text: response,
      };
      addMessage(roomId, moodiMessage);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'moodi',
        text: '메시지를 보내는 중에 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
      };
      addMessage(roomId, errorMessage);
    }
  };

  return (
    <div className='flex h-screen bg-white relative'>
      <Sidebar
        openModalId={modalState?.chatId || null}
        onOpenModal={setModalState}
        currentRoomId={roomId}
      />
      {modalState && (
        <SidebarChatModal
          chatId={modalState.chatId}
          onClose={() => setModalState(null)}
          onTitleRename={modalState.onTitleRename}
          buttonElement={modalState.buttonElement}
          currentRoomId={roomId}
        />
      )}
      <div className='flex flex-1 flex-col relative z-0'>
        <ChatHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          chatId={roomId}
        />

        <div className='flex flex-1 flex-col bg-bg-light dark:bg-dark-bg min-h-0'>
          <div
            ref={scrollRef}
            className='flex-1 overflow-y-auto px-6 py-4 min-h-0'
          >
            <div className='max-w-3xl mx-auto mt-6'>
              <ChatList
                messages={messages}
                searchQuery={debouncedSearchQuery}
              />
            </div>
          </div>

          <div className='shrink-0 px-6 pb-6 pt-2'>
            <div className='max-w-3xl mx-auto'>
              <div className='bg-white dark:bg-dark-user rounded-lg shadow-[0_-4px_12px_rgba(0,0,0,0.06)] px-4'>
                <ChatInput onSend={handleSend} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
