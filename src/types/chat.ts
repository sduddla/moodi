export interface Message {
  id: string;
  role: 'user' | 'moodi';
  text: string;
}

export interface ChatSummary {
  id: string;
  title: string;
  // preview?: string;
}

export interface ChatStore {
  chatList: ChatSummary[];
  chats: Record<string, Message[]>;
  currentChatRoomId: string | null;
  createChatRoom: (chatId: string) => void;
  updateRoomTitle: (chatId: string, newTitle: string) => void;
  deleteChatRoom: (chatId: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  getMessages: (chatId: string) => Message[];
}
