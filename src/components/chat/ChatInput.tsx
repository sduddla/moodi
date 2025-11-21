'use client';

import { Send } from 'lucide-react';
import { useState } from 'react';

export default function ChatInput() {
  const [input, setInput] = useState('');
  const canSend = input.trim().length > 0;

  return (
    <div className='relative flex items-center w-full'>
      <input
        type='text'
        placeholder='무엇이든 말해주세요.'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className='w-full bg-transparent text-sm px-0 py-4 pr-10 focus:outline-none placeholder:text-[#A0A7BB]'
      />
      <button
        type='button'
        className={`absolute right-0 top-1/2 -translate-y-1/2 transition-colors ${
          canSend
            ? 'text-[#10A37F]'
            : 'text-gray-200 cursor-not-allowed opacity-50'
        }`}
      >
        <Send size={18} />
      </button>
    </div>
  );
}
