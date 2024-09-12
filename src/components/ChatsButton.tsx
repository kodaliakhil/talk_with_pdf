"use client";
import React from "react";
import { Button } from "./ui/button";
import { getEmbeddingsSample } from "@/lib/generateEmbeddings";
import Link from "next/link";

const ChatsButton = () => {
  return (
    <Link href="/chat/1">
      <Button
        
        // onClick={() => getEmbeddingsSample("This is a simple test.")}
      >
        Go to Chats
      </Button>
    </Link>
  );
};

export default ChatsButton;
