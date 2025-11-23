'use client';

import { Message } from '@/types/chat';
import Sidebar from '../sidebar/Sidebar';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import ChatList from './ChatList';
import { useState } from 'react';
import sendChatMessage from '@/hooks/sendChatMessage';

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: 'moodi',
      text: '안녕?',
    },
  ]);

  const handleSend = async (message: string) => {
    // 사용자 메시지 추가
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: message,
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await sendChatMessage(message);

      // 무디 응답 추가
      const moodiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'moodi',
        text: response,
      };
      setMessages((prev) => [...prev, moodiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'moodi',
        text: '메시지를 보내는 중에 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className='flex h-screen bg-white'>
      <Sidebar />
      <div className='flex flex-1 flex-col'>
        <ChatHeader />

        <div className='flex flex-1 flex-col bg-[#F5F5F5] rounded-l-lg'>
          <div className='flex-1 overflow-y-auto px-6 py-4'>
            <div className='max-w-3xl mx-auto mt-6'>
              <ChatList messages={messages} />
            </div>
          </div>

          <div className='px-6 pb-6 pt-2'>
            <div className='max-w-3xl mx-auto'>
              <div className='bg-white rounded-lg shadow-[0_-4px_12px_rgba(0,0,0,0.06)] border border-gray-100 px-4'>
                <ChatInput onSend={handleSend} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
