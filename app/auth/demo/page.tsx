"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    // Set demo user data
    const demoUser = {
      id: "demo-user",
      name: "Demo User",
      email: "demo@example.com",
      avatar: "https://avatar.vercel.sh/demo.png",
    };
    localStorage.setItem("wave-user", JSON.stringify(demoUser));

    // Redirect to chat after a brief delay
    const timer = setTimeout(() => {
      router.push("/chat");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            ease: "linear",
            repeat: Infinity,
          }}
          className="inline-block mb-8"
        >
          <MessageSquare className="w-16 h-16 text-primary" />
        </motion.div>
        <h1 className="text-2xl font-bold mb-4">Loading Demo...</h1>
        <p className="text-muted-foreground">Setting up your demo experience</p>
      </motion.div>
    </div>
  );
}