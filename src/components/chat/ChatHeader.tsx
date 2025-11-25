import { Search, Trash } from 'lucide-react';
import { Rock_Salt } from 'next/font/google';
import { useState } from 'react';
import ChatSearchModal from './ChatSearchModal';
import { useChatStore } from '@/stores/useChatStore';

const rockSalt = Rock_Salt({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-rock-salt',
});
interface ChatHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  chatId: string;
}

export default function ChatHeader({
  searchQuery,
  onSearchChange,
  chatId,
}: ChatHeaderProps) {
  const [isInputOpen, setIsInputOpen] = useState(false);
  const { deleteChatRoom } = useChatStore();

  const handleDeleteClick = () => {
    deleteChatRoom(chatId);
  };

  const handleSearchClick = () => {
    setIsInputOpen(true);
  };

  const handleSearchClose = () => {
    setIsInputOpen(false);
  };

  return (
    <div className='relative'>
      <div className='px-6 py-2 flex items-center justify-between bg-white dark:bg-dark'>
        <p
          className={`${rockSalt.className} font-semibold cursor-default text-black dark:text-white`}
        >
          Moodi
        </p>
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
          />
        </>
      )}
    </div>
  );
}
