import { Message } from '@/types/chat';

interface ChatListProps {
  messages: Message[];
}

export default function ChatList({ messages }: ChatListProps) {
  return (
    <div className='flex flex-col gap-4'>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-4 py-3 text-sm ${
              msg.role === 'user'
                ? 'bg-white text-black'
                : 'bg-[#D8EFE9] text-black'
            }`}
          >
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
}
