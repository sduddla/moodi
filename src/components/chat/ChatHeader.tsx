import { Ellipsis, Search } from 'lucide-react';
import { Rock_Salt } from 'next/font/google';
import { useState } from 'react';
import ChatSearchModal from './ChatSearchModal';

const rockSalt = Rock_Salt({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-rock-salt',
});
interface ChatHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ChatHeader({
  searchQuery,
  onSearchChange,
}: ChatHeaderProps) {
  const [isInputOpen, setIsInputOpen] = useState(false);

  const handleSearchClick = () => {
    setIsInputOpen(true);
  };

  const handleSearchClose = () => {
    setIsInputOpen(false);
  };

  return (
    <div className='relative'>
      <div className='px-6 py-2 flex items-center justify-between'>
        <p className={`${rockSalt.className} font-semibold cursor-default`}>
          Moodi
        </p>
        <div className='flex gap-4'>
          <button
            type='button'
            onClick={handleSearchClick}
            className='flex items-center justify-center w-9 h-9 rounded-lg bg-[#EFEFEF] hover:bg-[#E8E8E8] cursor-pointer transition-colors'
          >
            <Search size={16} />
          </button>

          <button
            type='button'
            className='flex items-center justify-center w-9 h-9 rounded-lg bg-[#EFEFEF] hover:bg-[#E8E8E8] cursor-pointer transition-colors'
          >
            <Ellipsis size={16} />
          </button>
        </div>
      </div>
      {isInputOpen && (
        <>
          <div
            className='fixed inset-0 bg-black/10 z-40'
            onClick={handleSearchClose}
          />
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
