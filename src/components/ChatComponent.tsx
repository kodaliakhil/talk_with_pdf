"use client";

import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";
import { useChat } from "ai/react";

type Props = { chatId: number };
// const messages = [
//   {
//     id: 1,
//     role: "user",
//     content: "Hello, how are you?",
//   },
//   {
//     id: 2,
//     role: "assistant",
//     content: "I'm doing well, thank you!",
//   },
// ];

const ChatComponent = ({ chatId }: Props) => {
  // Missing: need to destructure some functionalities from useChat of vercel ai SDK
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: { chatId },
  });
  return (
    <div className="relative max-h-screen overflow-auto">
      {/* header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>
      {/* message list */}
      <MessageList
        //    Missing: props
        messages={messages}
      />
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question related to PDF..."
            className="w-full"
          />
          <Button className="bg-blue-600 ml-2">
            <Send className="w-4 h-4 " />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
