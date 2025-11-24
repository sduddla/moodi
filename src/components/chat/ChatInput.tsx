'use client';

import { Send } from 'lucide-react';
import { useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  disabled = false,
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const isDisabled = disabled || !input.trim();

  const handleSend = () => {
    if (!isDisabled && !isComposing) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isDisabled && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className='relative flex items-center w-full'>
      <input
        type='text'
        placeholder='무엇이든 말해주세요.'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        className='w-full bg-transparent text-sm px-0 py-4 pr-10 focus:outline-none placeholder:text-[#A0A7BB]'
      />
      <button
        type='button'
        onClick={handleSend}
        disabled={isDisabled}
        className={`absolute right-0 top-1/2 -translate-y-1/2 transition-colors ${
          isDisabled
            ? 'text-gray-200 cursor-not-allowed'
            : 'text-[#10A37F] cursor-pointer'
        }`}
      >
        <Send size={18} />
      </button>
    </div>
  );
}
