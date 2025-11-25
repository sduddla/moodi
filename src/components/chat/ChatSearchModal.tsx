interface ChatSearchModalProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose: () => void;
}

export default function ChatSearchModal({
  searchQuery,
  onSearchChange,
  onClose,
}: ChatSearchModalProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleSearchClose = () => {
    onSearchChange('');
    onClose();
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
            }
          }}
          autoFocus
        />
        <button
          type='button'
          className='text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer'
          onClick={handleSearchClose}
        >
          취소
        </button>
      </div>
    </div>
  );
}
