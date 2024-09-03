"use client";
// import { OpenAIApi, Configuration } from "openai-edge";
// import OpenAI from "openai";
import { pipeline } from "@xenova/transformers";
import { getEmbeddingsSample } from "./generateEmbeddings";

// const config = new Configuration({
//   apiKey: process.env.NEXT_PUBLIC_OPEN_AI_API_KEY,
// });
// const openai = new OpenAI({
//   apiKey: process.env.NEXT_PUBLIC_OPEN_AI_API_KEY, // This is the default and can be omitted
// });

// const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
  try {
    // const response = await openai.createEmbedding({
    //   model: "text-embedding-ada-002",
    //   input: text.replace(/\n/g, ""),
    // });
    // const result = await openai.embeddings.create({
    //   model: "text-embedding-ada-002",
    //   input: text.replace(/\n/g, ""),
    //   encoding_format: "float",
    // });
    // const generateEmbeddings = await pipeline(
    //   "feature-extraction",
    //   "Xenova/all-MiniLM-L6-v2"
    // );
    // console.log(text.replace(/\n/g, ""))
    const result = await getEmbeddingsSample(text.replace(/\n/g, ""));

    // const result = await response.json();
    console.log(
      "--------------------------------",
      result,
      "--------------------------------"
    );
    return result as number[];
  } catch (error) {
    console.log("error while getting embeddings (lib -> embeddings.ts)", error);
    throw error;
  }
}


