import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface UseSearchMessagesProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

interface UseSearchMessagesReturn {
  searchQuery: string;
  activeSearchQuery: string;
  highlightMessagesIds: string[];
  currentHighlightMessageId: string | null;
  currentHighlightIndexRef: React.RefObject<number>;
  handleSearchChange: (query: string) => void;
  handleSearchEnter: () => void;
  setHighlightMessagesIds: (ids: string[]) => void;
  setCurrentHighlightMessageId: (messageId: string | null) => void;
}

export const useSearchMessages = ({
  scrollRef,
}: UseSearchMessagesProps): UseSearchMessagesReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [highlightMessagesIds, setHighlightMessagesIds] = useState<string[]>(
    []
  );
  const [currentHighlightMessageId, setCurrentHighlightMessageId] = useState<
    string | null
  >(null);
  const currentHightlightIndexRef = useRef(0);
  const hasShownToast = useRef(false);
  const checkEnter = useRef(false);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setActiveSearchQuery('');
    }
  };

  const handleSearchEnter = () => {
    setActiveSearchQuery(searchQuery);
    checkEnter.current = true;
    hasShownToast.current = false;
  };

  // 검색어 변경될 때 하이라이트 메시지 계산
  const targetHighlightMessageId = activeSearchQuery.trim()
    ? highlightMessagesIds.length > 0
      ? highlightMessagesIds[highlightMessagesIds.length - 1]
      : null
    : null;

  useEffect(() => {
    hasShownToast.current = false;
    checkEnter.current = false;
  }, [activeSearchQuery]);

  useEffect(() => {
    if (activeSearchQuery.trim()) {
      if (highlightMessagesIds.length === 0) {
        if (checkEnter.current && !hasShownToast.current) {
          toast.error('검색 결과가 없습니다.');
          hasShownToast.current = true;
          checkEnter.current = false;
        }
      } else {
        hasShownToast.current = false;

        if (scrollRef.current) {
          const lastIndex = highlightMessagesIds.length - 1;
          currentHightlightIndexRef.current = lastIndex;

          const messageId = highlightMessagesIds[lastIndex];

          const messageElement = scrollRef.current.querySelector(
            `[data-message-id="${messageId}"]`
          ) as HTMLElement;

          if (messageElement) {
            messageElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
        }
      }
    } else {
      hasShownToast.current = false;
    }
  }, [activeSearchQuery, highlightMessagesIds, scrollRef]);

  // 하이라이트 메시지 업데이트
  useEffect(() => {
    setCurrentHighlightMessageId(targetHighlightMessageId);
  }, [targetHighlightMessageId]);

  return {
    searchQuery,
    activeSearchQuery,
    highlightMessagesIds,
    currentHighlightMessageId,
    currentHighlightIndexRef: currentHightlightIndexRef,
    handleSearchChange,
    handleSearchEnter,
    setHighlightMessagesIds,
    setCurrentHighlightMessageId,
  };
};
