"use client";

import { motion } from "framer-motion";
import { Message } from "@/lib/store";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Check, CheckCheck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);

  const statusIcon = {
    sent: <Check className="h-4 w-4" />,
    delivered: <CheckCheck className="h-4 w-4" />,
    read: <CheckCheck className="h-4 w-4 text-blue-500" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group flex flex-col max-w-[70%] space-y-2",
        isOwn ? "ml-auto items-end" : "items-start"
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "rounded-2xl px-4 py-2 shadow-sm",
          isOwn
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {message.type === "text" && <p>{message.content}</p>}
        
        {message.type === "image" && message.mediaUrl && (
          <div className="relative rounded-lg overflow-hidden">
            <Image
              src={message.mediaUrl}
              alt="Shared image"
              width={300}
              height={200}
              className="object-cover"
            />
          </div>
        )}

        {message.reactions.length > 0 && (
          <div className="flex gap-1 mt-2">
            {message.reactions.map((reaction, index) => (
              <span key={index} className="text-sm">
                {reaction}
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        className={cn(
          "flex items-center gap-2 text-xs text-muted-foreground",
          !isHovered && "opacity-0 group-hover:opacity-100 transition-opacity"
        )}
      >
        <span>{format(new Date(message.timestamp), "p")}</span>
        {isOwn && statusIcon[message.status]}
      </div>
    </motion.div>
  );
}