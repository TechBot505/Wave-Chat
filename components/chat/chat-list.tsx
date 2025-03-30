"use client";

import { useWaveStore, type Chat } from "@/lib/store";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function ChatList() {
  const { chats, activeChat, setActiveChat } = useWaveStore();

  return (
    <ScrollArea className="h-screen py-4">
      <div className="space-y-2 px-4">
        {chats.map((chat, index) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ChatItem
              chat={chat}
              isActive={chat.id === activeChat}
              onClick={() => setActiveChat(chat.id)}
            />
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
}

function ChatItem({
  chat,
  isActive,
  onClick,
}: {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "hover:bg-muted/50"
      )}
    >
      <Avatar>
        <AvatarImage src={`https://avatar.vercel.sh/${chat.id}.png`} />
        <AvatarFallback>
          {chat.name.split(" ").map((n) => n[0]).join("")}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium truncate">{chat.name}</p>
          {chat.lastMessage && (
            <span className="text-xs text-muted-foreground">
              {format(new Date(chat.lastMessage.timestamp), "p")}
            </span>
          )}
        </div>

        {chat.lastMessage && (
          <p className="text-sm text-muted-foreground truncate">
            {chat.lastMessage.content}
          </p>
        )}
      </div>

      {chat.unreadCount > 0 && (
        <div className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
          {chat.unreadCount}
        </div>
      )}
    </div>
  );
}