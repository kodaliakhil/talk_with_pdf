"use client";

import { pipeline } from "@xenova/transformers";

export async function getEmbeddingsSample(text: string) {
    console.log(text)
  try {
    const generateEmbeddings = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
    const result = await generateEmbeddings(text, {
      pooling: "mean",
      normalize: true,
    });

    // const result = await response.json();
    console.log(
      "--------------------------------",
      result,
      "--------------------------------"
    );
    // return result.data[0].embedding as number[];
  } catch (error) {
    console.log("error while getting embeddings (lib -> embeddings.ts)", error);
    throw error;
  }
}
