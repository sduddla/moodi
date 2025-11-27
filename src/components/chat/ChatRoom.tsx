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
import SidebarChatModal from '../sidebar/SidebarChatModal';
import toast from 'react-hot-toast';

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
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [highlightMessagesIds, setHighlightMessagesIds] = useState<string[]>(
    []
  );
  const currentHightlightIndexRef = useRef(0);
  const [currentHighlightMessageId, setCurrentHighlightMessageId] = useState<
    string | null
  >(null);
  const hasShownToast = useRef(false);
  const checkEnter = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setActiveSearchQuery('');
    }
  };

  // 검색어 변경될 때 하이라이트 메시지 계산
  const targetHighlightMessageId = activeSearchQuery.trim()
    ? highlightMessagesIds.length > 0
      ? highlightMessagesIds[highlightMessagesIds.length - 1]
      : null
    : null;

  useEffect(() => {
    hasShownToast.current = false;
    checkEnter.current = false;
  }, [activeSearchQuery]);

  useEffect(() => {
    if (activeSearchQuery.trim()) {
      if (highlightMessagesIds.length === 0) {
        if (checkEnter.current && !hasShownToast.current) {
          toast.error('검색 결과가 없습니다.');
          hasShownToast.current = true;
          checkEnter.current = false;
        }
      } else {
        hasShownToast.current = false;

        if (scrollRef.current) {
          const lastIndex = highlightMessagesIds.length - 1;
          currentHightlightIndexRef.current = lastIndex;

          const messageId = highlightMessagesIds[lastIndex];

          const messageElement = scrollRef.current.querySelector(
            `[data-message-id="${messageId}"]`
          ) as HTMLElement;

          if (messageElement) {
            messageElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
        }
      }
    } else {
      hasShownToast.current = false;
    }
  }, [activeSearchQuery, highlightMessagesIds]);

  // 하이라이트 메시지 업데이트
  useEffect(() => {
    setCurrentHighlightMessageId(targetHighlightMessageId);
  }, [targetHighlightMessageId]);

  const handleSend = async (message: string) => {
    // 사용자 메시지 추가
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: message,
      timestamp: Date.now(),
    };
    addMessage(roomId, userMessage);
    setIsLoading(true);

    try {
      const previousMessages = messages.slice(-10).map((msg) => ({
        role: msg.role,
        text: msg.text,
      }));

      const response = await sendChatMessage(message, previousMessages);

      // 무디 응답 추가
      const moodiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: response,
        timestamp: Date.now(),
      };
      addMessage(roomId, moodiMessage);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: '메시지를 보내는 중에 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
        timestamp: Date.now(),
      };
      addMessage(roomId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex h-screen bg-white relative'>
      <Sidebar
        openModalId={modalState?.chatId || null}
        onOpenModal={setModalState}
        onCloseModal={() => setModalState(null)}
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
          onSearchChange={handleSearchChange}
          chatId={roomId}
          highlightMessagesIds={highlightMessagesIds}
          currentHighlightIndexRef={currentHightlightIndexRef}
          scrollRef={scrollRef}
          onCurrentHighlightChange={setCurrentHighlightMessageId}
          onSearchEnter={() => {
            setActiveSearchQuery(searchQuery);
            checkEnter.current = true;
            hasShownToast.current = false;
          }}
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
