import { Message } from '@/types/chat';

export const createMessage = (
  role: 'user' | 'assistant',
  text: string
): Message => {
  return {
    id: crypto.randomUUID(),
    role,
    text,
    timestamp: Date.now(),
  };
};
