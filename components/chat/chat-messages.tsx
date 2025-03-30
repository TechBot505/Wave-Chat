"use client";

import { useEffect, useRef } from "react";
import { useWaveStore } from "@/lib/store";
import { MessageBubble } from "./message-bubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

export function ChatMessages() {
  const { chats, activeChat, currentUser } = useWaveStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentChat = chats.find((chat) => chat.id === activeChat);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentChat?.messages]);

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <ScrollArea ref={scrollRef} className="flex-1 p-4">
      <div className="space-y-4">
        {currentChat.messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.sender === currentUser}
          />
        ))}
      </div>
    </ScrollArea>
  );
}