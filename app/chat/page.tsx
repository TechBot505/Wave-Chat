"use client";

import { ChatList } from "@/components/chat/chat-list";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MessageInput } from "@/components/chat/message-input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Canvas } from "@react-three/fiber";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function Background() {
  const { viewport } = useThree();
  const points = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.x += 0.0003;
      points.current.rotation.y += 0.0002;
    }
  });

  const particlesGeometry = new THREE.BufferGeometry();
  const count = 2000;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  return (
    <points ref={points}>
      <bufferGeometry attach="geometry" {...particlesGeometry} />
      <pointsMaterial
        attach="material"
        size={0.02}
        sizeAttenuation
        color="#88c0d0"
        transparent
        opacity={0.3}
      />
    </points>
  );
}

export default function ChatPage() {
  return (
    <div className="h-screen flex">
      <div className="fixed inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Background />
        </Canvas>
      </div>

      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
          <ChatList />
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel defaultSize={75}>
          <div className="h-screen flex flex-col">
            <ChatHeader />
            <ChatMessages />
            <MessageInput />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}