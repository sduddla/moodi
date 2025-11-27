'use client';

import { Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isDisabled = disabled || !input.trim();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!isDisabled && !isComposing) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isDisabled && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className='relative flex items-center w-full '>
      <textarea
        ref={textareaRef}
        placeholder='무엇이든 말해주세요.'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        className='w-full text-sm px-0 py-4 pr-10 focus:outline-none placeholder:text-placeholder resize-none max-h-32 overflow-y-auto scrollbar-hide'
        rows={1}
      />
      <button
        type='button'
        onClick={handleSend}
        disabled={isDisabled}
        className={`absolute right-0 top-1/2 -translate-y-1/2 transition-colors ${
          isDisabled
            ? 'text-gray-500 opacity-40 cursor-not-allowed'
            : 'text-primary-accent cursor-pointer'
        }`}
      >
        <Send size={18} />
      </button>
    </div>
  );
}
