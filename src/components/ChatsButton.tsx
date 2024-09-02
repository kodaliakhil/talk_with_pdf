"use client";
import React from "react";
import { Button } from "./ui/button";
import { getEmbeddingsSample } from "@/lib/generateEmbeddings";

const ChatsButton = () => {
  return (
    <Button onClick={() => getEmbeddingsSample("This is a simple test.")}>
      Go to Chats
    </Button>
  );
};

export default ChatsButton;
