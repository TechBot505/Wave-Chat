"use client";

import { useState, useRef, useEffect } from "react";
import { useWaveStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smile, Paperclip, Send, Mic, Square } from "lucide-react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import WaveSurfer from "wavesurfer.js";

export function MessageInput() {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { sendMessage, setTyping, activeChat } = useWaveStore();
  const waveformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRecording && waveformRef.current) {
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'rgb(200, 0, 0)',
        progressColor: 'rgb(100, 0, 0)',
        cursorWidth: 0,
        height: 30,
        interact: false,
      });
      setWavesurfer(ws);

      return () => {
        ws.destroy();
      };
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        sendMessage("Voice message", "audio", audioUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);

      const timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
        stream.getTracks().forEach(track => track.stop());
      };
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
      if (wavesurfer) {
        wavesurfer.destroy();
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      files.forEach((file) => {
        const type = file.type.startsWith("image")
          ? "image"
          : file.type.startsWith("video")
          ? "video"
          : "file";
        
        const mockUrl = URL.createObjectURL(file);
        sendMessage(file.name, type, mockUrl);
      });
    },
    noClick: true,
    noDrag: false,
    noKeyboard: true,
  });

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
      setTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachmentClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        Array.from(files).forEach((file) => {
          const type = file.type.startsWith("image")
            ? "image"
            : file.type.startsWith("video")
            ? "video"
            : "file";
          
          const mockUrl = URL.createObjectURL(file);
          sendMessage(file.name, type, mockUrl);
        });
      }
    };
    input.click();
  };

  if (!activeChat) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="p-4 border-t bg-background/95 backdrop-blur-sm"
    >
      <div
        {...getRootProps()}
        className={`flex items-end gap-2 ${
          isDragActive ? "bg-accent/50" : ""
        }`}
      >
        <input {...getInputProps()} />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              <Smile className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Picker
              data={data}
              onEmojiSelect={(emoji: any) => {
                setMessage((prev) => prev + emoji.native);
              }}
            />
          </PopoverContent>
        </Popover>

        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
          onClick={handleAttachmentClick}
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <div className="flex-1">
          {isRecording ? (
            <div className="bg-muted/50 rounded-md p-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-sm">Recording... {recordingTime}s</span>
                <div ref={waveformRef} className="flex-1" />
              </div>
            </div>
          ) : (
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setTyping(true);
              }}
              onKeyPress={handleKeyPress}
              onBlur={() => setTyping(false)}
              placeholder="Type a message..."
              className="bg-muted/50"
            />
          )}
        </div>

        {message ? (
          <Button size="icon" onClick={handleSend}>
            <Send className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            size="icon"
            variant={isRecording ? "destructive" : "default"}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
        )}
      </div>
    </motion.div>
  );
}