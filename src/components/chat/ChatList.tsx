'use client';

import { Message } from '@/types/chat';

interface ChatListProps {
  messages: Message[];
  searchQuery?: string;
}

export default function ChatList({
  messages,
  searchQuery = '',
}: ChatListProps) {
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) {
      return text;
    }

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <mark key={index} className='bg-yellow-200 text-black'>
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div className='flex flex-col gap-4'>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-4 py-3 text-sm ${
              msg.role === 'user'
                ? 'bg-white text-black'
                : 'bg-[#D8EFE9] text-black'
            }`}
          >
            {highlightText(msg.text, searchQuery)}
          </div>
        </div>
      ))}
    </div>
  );
}
