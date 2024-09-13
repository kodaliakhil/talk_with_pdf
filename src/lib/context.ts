import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { vector } from "drizzle-orm/pg-core";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  const pinecone = new Pinecone({
    apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
  });
  const index = await pinecone.Index("chat-pdf");
  try {
    const namespace = convertToAscii(fileKey);
    const queryResult = await index.namespace(namespace).query({
      // If gets error here just replace namespace variable with "chat-pdf"
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });
    return queryResult.matches || [];
  } catch (error) {
    console.log(
      " Error querying embeddings in getMatchesFromEmbeddings---------> ",
      error
    );
    throw error;
  }
}
export async function getContext(query: string, fileKey: string) {
    // const queryEmbeddings = await getEm
}
