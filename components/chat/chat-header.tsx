"use client";

import { useWaveStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Phone,
  Video,
  Users,
  Settings,
  UserCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export function ChatHeader() {
  const { chats, activeChat } = useWaveStore();
  const router = useRouter();
  const currentChat = chats.find((chat) => chat.id === activeChat);

  if (!currentChat) return null;

  return (
    <div className="p-4 border-b bg-background/95 backdrop-blur-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={`https://avatar.vercel.sh/${currentChat.id}.png`} />
          <AvatarFallback>
            {currentChat.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="font-semibold">{currentChat.name}</h2>
          {currentChat.type === "group" && (
            <p className="text-sm text-muted-foreground">
              {currentChat.participants.length} members
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="hidden md:flex items-center gap-2"
          onClick={() => router.push("/profile")}
        >
          <UserCircle className="h-4 w-4" />
          Profile
        </Button>

        <Button size="icon" variant="ghost">
          <Phone className="h-5 w-5" />
        </Button>
        
        <Button size="icon" variant="ghost">
          <Video className="h-5 w-5" />
        </Button>

        {currentChat.type === "group" && (
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost">
                <Users className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Group Members</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {currentChat.participants.map((participant, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://avatar.vercel.sh/${participant}.png`} />
                      <AvatarFallback>{participant[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{participant}</p>
                      <p className="text-sm text-muted-foreground">Online</p>
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <UserCircle className="h-4 w-4 mr-2" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Chat Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Leave Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}