"use client";

import { create } from "zustand";
import { format } from "date-fns";

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  type: "text" | "image" | "video" | "audio" | "file";
  reactions: string[];
  replyTo?: string;
  mediaUrl?: string;
}

export interface Chat {
  id: string;
  name: string;
  type: "direct" | "group";
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  theme?: string;
  icon?: string;
}

interface WaveStore {
  chats: Chat[];
  activeChat: string | null;
  isTyping: boolean;
  currentUser: string;
  setActiveChat: (chatId: string) => void;
  sendMessage: (content: string, type?: Message["type"], mediaUrl?: string) => void;
  toggleReaction: (messageId: string, reaction: string) => void;
  markAsRead: (chatId: string) => void;
  setTyping: (typing: boolean) => void;
}

const mockChats: Chat[] = [
  {
    id: "1",
    name: "Frontend Team",
    type: "group",
    participants: ["Lead", "Manager", "Rohit", "Ted", "Ishan", "Akanksha"],
    messages: [],
    unreadCount: 0,
    theme: "blue",
  },
  {
    id: "2",
    name: "Rohit Dhanotia",
    type: "direct",
    participants: ["Rohit Dhanotia", "You"],
    messages: [],
    unreadCount: 0,
  },
  {
    id: "3",
    name: "Ishan Sharma",
    type: "direct",
    participants: ["Ishan Sharma", "You"],
    messages: [],
    unreadCount: 0,
    theme: "green",
  },
  {
    id: "4",
    name: "Akanksha Prasad",
    type: "direct",
    participants: ["Akanksha Prasad", "You"],
    messages: [],
    unreadCount: 0,
    theme: "purple",
  },
];

export const useWaveStore = create<WaveStore>((set, get) => ({
  chats: mockChats,
  activeChat: null,
  isTyping: false,
  currentUser: "user1",
  
  setActiveChat: (chatId) => set({ activeChat: chatId }),
  
  sendMessage: (content, type = "text", mediaUrl) => {
    const { chats, activeChat, currentUser } = get();
    if (!activeChat) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      content,
      sender: currentUser,
      timestamp: format(new Date(), "PPpp"),
      status: "sent",
      type,
      reactions: [],
      mediaUrl,
    };

    set({
      chats: chats.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: newMessage,
            }
          : chat
      ),
    });
  },

  toggleReaction: (messageId, reaction) => {
    const { chats, activeChat, currentUser } = get();
    if (!activeChat) return;

    set({
      chats: chats.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: chat.messages.map((msg) =>
                msg.id === messageId
                  ? {
                      ...msg,
                      reactions: msg.reactions.includes(reaction)
                        ? msg.reactions.filter((r) => r !== reaction)
                        : [...msg.reactions, reaction],
                    }
                  : msg
              ),
            }
          : chat
      ),
    });
  },

  markAsRead: (chatId) => {
    set({
      chats: get().chats.map((chat) =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      ),
    });
  },

  setTyping: (typing) => set({ isTyping: typing }),
}));