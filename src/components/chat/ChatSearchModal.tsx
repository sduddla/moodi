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
    <div className='absolute top-full right-6 mt-2 w-[300px] bg-white rounded-lg shadow-lg z-50 p-4'>
      <div className='flex items-center'>
        <input
          type='text'
          placeholder='검색하기...'
          className='flex-1 bg-transparent text-sm text-gray-800 placeholder:text-[#575B65] focus:outline-none'
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
          className='text-sm text-gray-500 hover:text-gray-700 cursor-pointer'
          onClick={handleSearchClose}
        >
          취소
        </button>
      </div>
    </div>
  );
}
