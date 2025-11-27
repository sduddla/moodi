import { Menu, Search, Trash } from 'lucide-react';
import { Rock_Salt } from 'next/font/google';
import { useState } from 'react';
import ChatSearchModal from './ChatSearchModal';
import { useChatStore } from '@/stores/useChatStore';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const rockSalt = Rock_Salt({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-rock-salt',
});
interface ChatHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  chatId: string;
  highlightMessagesIds?: string[];
  currentHighlightIndexRef?: React.RefObject<number>;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  onCurrentHighlightChange?: (messageId: string | null) => void;
  onSearchEnter?: () => void;
  onToggleSidebar?: () => void;
}

export default function ChatHeader({
  searchQuery,
  onSearchChange,
  chatId,
  highlightMessagesIds,
  currentHighlightIndexRef,
  scrollRef,
  onCurrentHighlightChange,
  onSearchEnter,
  onToggleSidebar,
}: ChatHeaderProps) {
  const [isInputOpen, setIsInputOpen] = useState(false);
  const { deleteChatRoom } = useChatStore();
  const router = useRouter();

  const handleDeleteClick = () => {
    deleteChatRoom(chatId);
    toast.success('대화를 삭제했어요.');
  };

  const handleSearchClick = () => {
    setIsInputOpen(true);
  };

  const handleSearchClose = () => {
    setIsInputOpen(false);
  };

  const handleLogoClick = () => {
    if (window.innerWidth < 768) {
      router.push('/');
    }
  };

  return (
    <div className='relative'>
      <div className='px-4 py-2 flex items-center justify-between bg-white dark:bg-dark'>
        <div className='flex items-center gap-4'>
          {/* 모바일 햄버거 버튼 */}
          {onToggleSidebar && (
            <button
              type='button'
              onClick={onToggleSidebar}
              className='md:hidden flex items-center justify-center w-9 h-9 hover:bg-button-hover rounded-lg dark:hover:bg-dark-hover cursor-pointer transition-colors'
            >
              <Menu size={16} className='text-dark-active dark:text-search' />
            </button>
          )}
          <button onClick={handleLogoClick}>
            <p
              className={`${rockSalt.className} font-semibold text-black dark:text-white cursor-pointer md:cursor-default `}
            >
              Moodi
            </p>
          </button>
        </div>
        <div className='flex gap-4'>
          <button
            type='button'
            onClick={handleSearchClick}
            className='flex items-center justify-center w-9 h-9 rounded-lg bg-button-bg hover:bg-button-hover dark:bg-dark-active dark:hover:bg-dark-hover cursor-pointer transition-colors'
          >
            <Search size={16} className='text-dark-active dark:text-search' />
          </button>

          <button
            type='button'
            onClick={handleDeleteClick}
            className='flex items-center justify-center w-9 h-9 rounded-lg bg-red-100 hover:bg-red-hover dark:bg-dark-red dark:hover:bg-dark-red-hover cursor-pointer transition-colors'
          >
            <Trash size={16} className='text-red-600 dark:text-red-400' />
          </button>
        </div>
      </div>
      {isInputOpen && (
        <>
          <ChatSearchModal
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onClose={handleSearchClose}
            highlightMessagesIds={highlightMessagesIds}
            currentHighlightIndexRef={currentHighlightIndexRef}
            scrollRef={scrollRef}
            onCurrentHighlightChange={onCurrentHighlightChange}
            onSearchEnter={onSearchEnter}
          />
        </>
      )}
    </div>
  );
}
