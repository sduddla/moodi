'use client';

import { useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import ChatList, { Message } from './ChatList';

const exMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    text: '안녕하세요! 오늘 기분이 어떠세요?',
  },
  {
    id: '2',
    role: 'user',
    text: '안녕! 오늘 좀 피곤해',
  },
  {
    id: '3',
    role: 'assistant',
    text: '피곤하시는군요. 무슨 일이 있었나요? 이야기해주시면 듣고 싶어요.',
  },
  {
    id: '4',
    role: 'user',
    text: '일이 너무 많아서 스트레스 받아',
  },
  {
    id: '5',
    role: 'assistant',
    text: '힘든 하루 보내셨군요. 충분히 쉬시고, 내일은 더 나은 하루가 될 거예요. 제가 옆에서 응원할게요!',
  },
];

export default function ChatRoom() {
  // TODO: 메시지 추가 기능 구현 시 사용 예정
  const [messages] = useState<Message[]>(exMessages);

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
                <ChatInput />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
