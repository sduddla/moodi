'use client';

import { useEffect, useState, useRef } from 'react';
import Sidebar from '../sidebar/Sidebar';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import ChatList from './ChatList';
import sendChatMessage from '@/hooks/sendChatMessage';
import { useParams } from 'next/navigation';
import { useChatStore } from '@/stores/useChatStore';
import SidebarChatModal from '../sidebar/SidebarChatModal';
import { createMessage } from '@/utils/createMessage';
import { useSearchMessages } from '@/hooks/useSearchMessages';
import { ModalState } from '@/types/modal';

export default function ChatRoom() {
  const params = useParams();
  const roomId = params.id as string;
  const { addMessage, createChatRoom, chats } = useChatStore();
  const messages = chats[roomId] || [];
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const {
    searchQuery,
    activeSearchQuery,
    highlightMessagesIds,
    currentHighlightMessageId,
    currentHighlightIndexRef,
    handleSearchChange,
    handleSearchEnter,
    setHighlightMessagesIds,
    setCurrentHighlightMessageId,
  } = useSearchMessages({ scrollRef });

  useEffect(() => {
    if (roomId && !chats[roomId]) {
      createChatRoom(roomId);
    }
  }, [roomId, chats, createChatRoom]);

  // 새로운 메시지 있을 경우 자동으로 맨 아래로 스크롤
  useEffect(() => {
    if (scrollRef.current && messages.length > 0 && !searchQuery.trim()) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, searchQuery]);

  const handleSend = async (message: string) => {
    // 사용자 메시지 추가
    const userMessage = createMessage('user', message);
    addMessage(roomId, userMessage);
    setIsLoading(true);

    try {
      const previousMessages = messages.slice(-10).map((msg) => ({
        role: msg.role,
        text: msg.text,
      }));

      const response = await sendChatMessage(message, previousMessages);

      // 무디 응답 추가
      const moodiMessage = createMessage('assistant', response);
      addMessage(roomId, moodiMessage);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage = createMessage(
        'assistant',
        '메시지를 보내는 중에 오류가 발생했어요. 잠시 후 다시 시도해주세요.'
      );
      addMessage(roomId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex h-screen bg-white dark:bg-dark-active relative'>
      {isMobileSidebarOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 md:hidden'
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      <Sidebar
        openModalId={modalState?.chatId || null}
        onOpenModal={setModalState}
        onCloseModal={() => setModalState(null)}
        currentRoomId={roomId}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
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
          onSearchChange={handleSearchChange}
          chatId={roomId}
          highlightMessagesIds={highlightMessagesIds}
          currentHighlightIndexRef={currentHighlightIndexRef}
          scrollRef={scrollRef}
          onCurrentHighlightChange={setCurrentHighlightMessageId}
          onSearchEnter={handleSearchEnter}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        <div className='flex flex-1 flex-col bg-bg-light dark:bg-dark-bg min-h-0'>
          <div
            ref={scrollRef}
            className='flex-1 overflow-y-auto px-6 py-4 min-h-0'
          >
            <div className='max-w-3xl mx-auto mt-6'>
              <ChatList
                messages={messages}
                searchQuery={activeSearchQuery}
                onHighlightedMessagesChange={setHighlightMessagesIds}
                currentHighlightMessageId={currentHighlightMessageId}
                isLoading={isLoading}
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
