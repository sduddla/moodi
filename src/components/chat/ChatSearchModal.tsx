import { ArrowDown, ArrowUp } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

interface ChatSearchModalProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose: () => void;
  highlightMessagesIds?: string[];
  currentHighlightIndexRef?: React.RefObject<number>;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  onCurrentHighlightChange?: (messageId: string | null) => void;
  onSearchEnter?: () => void;
}

export default function ChatSearchModal({
  searchQuery,
  onSearchChange,
  onClose,
  highlightMessagesIds = [],
  currentHighlightIndexRef,
  scrollRef,
  onCurrentHighlightChange,
  onSearchEnter,
}: ChatSearchModalProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleSearchClose = () => {
    onSearchChange('');
    onClose();
  };

  const multipleHighlights = highlightMessagesIds.length > 1;

  const defaultIndex = useMemo(() => {
    return highlightMessagesIds.length > 0
      ? highlightMessagesIds.length - 1
      : 0;
  }, [highlightMessagesIds.length]);

  const [currentIndex, setCurrentIndex] = useState(defaultIndex);

  useEffect(() => {
    if (currentHighlightIndexRef) {
      currentHighlightIndexRef.current = defaultIndex;
    }
  }, [currentHighlightIndexRef, defaultIndex]);

  useEffect(() => {
    setCurrentIndex(defaultIndex);
  }, [defaultIndex]);

  const handlePreviousHighlight = () => {
    if (!currentHighlightIndexRef || !scrollRef?.current) return;

    if (currentIndex === 0) {
      toast.error('더이상 검색 결과가 없습니다.');
      return;
    }

    const newIndex = currentIndex - 1;
    currentHighlightIndexRef.current = newIndex;
    setCurrentIndex(newIndex);

    if (newIndex === 0) {
      toast.error('더이상 검색 결과가 없습니다.');
    }

    const messageId = highlightMessagesIds[newIndex];
    onCurrentHighlightChange?.(messageId);

    const messageElement = scrollRef.current.querySelector(
      `[data-message-id="${messageId}"]`
    ) as HTMLElement;

    if (messageElement) {
      messageElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const handleNextHighlight = () => {
    if (!currentHighlightIndexRef || !scrollRef?.current) return;

    if (currentIndex === highlightMessagesIds.length - 1) {
      toast.error('더이상 검색 결과가 없습니다.');
      return;
    }

    const newIndex = currentIndex + 1;
    currentHighlightIndexRef.current = newIndex;
    setCurrentIndex(newIndex);

    const messageId = highlightMessagesIds[newIndex];
    onCurrentHighlightChange?.(messageId);

    const messageElement = scrollRef.current.querySelector(
      `[data-message-id="${messageId}"]`
    ) as HTMLElement;

    if (messageElement) {
      messageElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <div className='absolute top-full right-6 mt-2 w-[300px] bg-white dark:bg-dark rounded-lg shadow-xl dark:shadow-[0_8px_24px_rgba(0,0,0,0.2)] z-50 p-4'>
      <div className='flex items-center'>
        <input
          type='text'
          placeholder='검색하기...'
          className='flex-1 bg-transparent text-sm text-gray-800 dark:text-white placeholder:text-placeholder dark:placeholder:text-gray-400 focus:outline-none'
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              handleSearchClose();
            } else if (e.key === 'Enter') {
              onSearchEnter?.();
            }
          }}
          autoFocus
        />

        {multipleHighlights ? (
          <div className='flex '>
            <button
              type='button'
              onClick={handlePreviousHighlight}
              disabled={currentIndex === 0}
              className='flex items-center justify-center w-6 h-6 rounded transition-colors hover:bg-gray-100 dark:hover:bg-dark-modal-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <ArrowUp size={16} className='text-black dark:text-gray-400' />
            </button>
            <button
              type='button'
              onClick={handleNextHighlight}
              disabled={currentIndex === highlightMessagesIds.length - 1}
              className='flex items-center justify-center w-6 h-6 rounded transition-colors hover:bg-gray-100 dark:hover:bg-dark-modal-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <ArrowDown size={16} className='text-black dark:text-gray-400' />
            </button>
          </div>
        ) : (
          <button
            type='button'
            className='text-sm text-black dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 cursor-pointer'
            onClick={handleSearchClose}
          >
            취소
          </button>
        )}
      </div>
    </div>
  );
}
