'use client';

import { Message } from '@/types/chat';
import { Fragment, useEffect } from 'react';
import { formatTime } from '@/utils/formatTime';
import { formDateLabel, shouldShowDateDivider } from '@/utils/formatDate';

interface ChatListProps {
  messages: Message[];
  searchQuery?: string;
  onHighlightedMessagesChange?: (messageIds: string[]) => void;
  currentHighlightMessageId?: string | null;
  isLoading?: boolean;
}

export default function ChatList({
  messages,
  searchQuery = '',
  onHighlightedMessagesChange,
  currentHighlightMessageId,
  isLoading = false,
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

  useEffect(() => {
    if (onHighlightedMessagesChange) {
      if (!searchQuery.trim()) {
        onHighlightedMessagesChange([]);
        return;
      }

      const query = searchQuery.toLowerCase();
      const highlightedMessageIds = messages
        .filter((msg) => msg.text.toLowerCase().includes(query))
        .map((msg) => msg.id);

      onHighlightedMessagesChange(highlightedMessageIds);
    }
  }, [messages, onHighlightedMessagesChange, searchQuery]);

  return (
    <div className='flex flex-col gap-4'>
      {messages.map((msg, index) => {
        const showDivider = index === 0 || shouldShowDateDivider(msg.timestamp, messages[index - 1].timestamp);
      return (
        <Fragment key={msg.id}>
          {showDivider && (
            <div className='flex items-center gap-4 my-4'>
              <div className='flex-1 bg-gray-300 dark:bg-gray-600 h-px'></div>
                <span className='text-xs text-gray-500 dark:text-gray-400'>{formDateLabel(msg.timestamp)}</span>
                <div className='flex-1 bg-gray-300 dark:bg-gray-600 h-px'></div>
            </div>
          )}
          <div
          key={msg.id}
          data-message-id={msg.id}
          className={`flex items-end gap-2 ${
            msg.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {msg.role === 'user' && msg.timestamp && (
            <span className='text-xs opacity-60 mb-1'>
              {formatTime(msg.timestamp)}
            </span>
          )}
          <div
            className={`max-w-[80%] rounded-lg px-4 py-3 text-sm ${
              msg.role === 'user'
                ? 'bg-white text-black dark:bg-dark-user dark:text-white'
                : 'bg-chat-active text-black dark:bg-dark-ai-bubble dark:text-dark-ai-bubble-text'
            } ${currentHighlightMessageId === msg.id ? 'animate-shake' : ''}`}
          >
            {highlightText(msg.text, searchQuery)}
          </div>
          {msg.role === 'assistant' && msg.timestamp && (
            <span className='text-xs opacity-60 mb-1'>
              {formatTime(msg.timestamp)}
            </span>
        )}
        </div>
        </Fragment>
      );
    })}
      {isLoading && (
        <div className='flex justify-start'>
          <div className='max-w-[80%] rounded-lg px-4 py-3 text-sm bg-chat-active text-black dark:bg-dark-ai-bubble dark:text-dark-ai-bubble-text'>
            <div className='flex gap-1 items-center'>
              <span className='loading-dot w-1 h-1 rounded-full bg-current'></span>
              <span className='loading-dot w-1 h-1 rounded-full bg-current'></span>
              <span className='loading-dot w-1 h-1 rounded-full bg-current'></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
