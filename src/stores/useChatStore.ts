import { ChatStore, Message } from '@/types/chat';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chatList: [],
      chats: {},
      currentChatRoomId: null,

      createChatRoom: (chatId) => {
        const state = get();
        if (state.chats[chatId]) {
          return;
        }

        const greetings = [
          '안녕?',
          '혹시 듣고 싶은 말 있어? 내가 다 해줄게.',
          '힘든 하루였어도, 넌 충분히 잘했어.',
          '잘 왔어! 이제부터는 나랑 수다 떨어볼까?',
          '말하지 않아도 알아, 너 진짜 잘하고 있어.',
          '너한테 무슨 일이 있었든, 나는 이해할 준비 돼있어.',
          '자자~ 여긴 안전지대. 아무 말 대잔치, 시작해볼까?',
          '오랜만이야? 아니면 첫 만남이야? 어쨌든 반가워!',
          '오늘 하루 어땠어? 편하게 말해줘, 내가 다 들어줄게!',
          '아무 말이나 좋아. 그냥 툭 던져봐.',
        ];

        const randomGreeting =
          greetings[Math.floor(Math.random() * greetings.length)];

        const defaultGreeting: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: randomGreeting,
        };

        set({
          chats: {
            ...state.chats,
            [chatId]: [defaultGreeting],
          },
          currentChatRoomId: chatId,
        });
      },

      deleteChatRoom: (chatId) => {
        set((state) => {
          const newChatList = state.chatList.filter(
            (chat) => chat.id !== chatId
          );
          const newChats = { ...state.chats };
          delete newChats[chatId];

          return {
            chatList: newChatList,
            chats: newChats,
            currentChatRoomId:
              state.currentChatRoomId === chatId
                ? newChatList[0]?.id || null
                : state.currentChatRoomId,
          };
        });
      },

      updateRoomTitle: (chatId, newTitle) => {
        const title =
          newTitle.length > 14 ? newTitle.slice(0, 14) + '...' : newTitle;
        set((state) => ({
          chatList: state.chatList.map((chat) =>
            chat.id === chatId ? { ...chat, title } : chat
          ),
        }));
      },

      addMessage: (chatId, message) => {
        set((state) => {
          const currentMessages = state.chats[chatId] || [];
          const newMessages = [...currentMessages, message];

          // 사용자 첫 메시지, 타이틀 설정
          if (
            message.role === 'user' &&
            currentMessages.length === 1 &&
            currentMessages[0].role === 'assistant'
          ) {
            const title =
              message.text.length > 14
                ? message.text.slice(0, 14) + '...'
                : message.text;

            return {
              chats: {
                ...state.chats,
                [chatId]: newMessages,
              },
              chatList: [
                {
                  id: chatId,
                  title,
                },
                ...state.chatList,
              ],
            };
          }

          return {
            chats: {
              ...state.chats,
              [chatId]: newMessages,
            },
          };
        });
      },

      getMessages: (chatId) => {
        return get().chats[chatId] || [];
      },
    }),
    {
      name: 'moodi-chat-storage',
    }
  )
);
