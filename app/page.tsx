"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            className="flex items-center justify-center mb-8"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MessageSquare className="w-16 h-16 text-primary" />
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Welcome to Wave
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Experience messaging reimagined. Clean, intuitive, and beautifully crafted
            for meaningful conversations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/auth/login">
                Get Started
              </Link>
            </Button>
            
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-background/50 backdrop-blur-sm"
            >
              <Link href="/auth/demo">
                Try Demo
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="p-6 rounded-lg bg-background/50 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-2">Real-time Chat</h3>
            <p className="text-muted-foreground">
              Instant messaging with typing indicators and read receipts
            </p>
          </div>
          
          <div className="p-6 rounded-lg bg-background/50 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-2">Rich Media</h3>
            <p className="text-muted-foreground">
              Share images, videos, and files with beautiful previews
            </p>
          </div>
          
          <div className="p-6 rounded-lg bg-background/50 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-2">Group Chats</h3>
            <p className="text-muted-foreground">
              Create groups with custom themes and advanced features
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}