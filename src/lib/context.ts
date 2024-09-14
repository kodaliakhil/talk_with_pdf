import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { vector } from "drizzle-orm/pg-core";
import { getServerEmbeddings } from "./serverEmbeddings";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  const pinecone = new Pinecone({
    apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
    fetchApi: fetch 
  });
  const index = await pinecone.Index("chat-pdf");
  try {
    const namespace = convertToAscii(fileKey);
    const embeddingsArray = Array.isArray(embeddings) ? embeddings : Object.values(embeddings);

    const queryResult = await index.namespace(namespace).query({
      // If gets error here just replace namespace variable with "chat-pdf"
      topK: 5,
      vector: embeddingsArray as number[],
      includeMetadata: true,
    });
    console.log("-----------------Query Result",queryResult);
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
  const queryEmbeddings = await getServerEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
  console.log("-----------------Matches",matches);

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );

  type MetaData = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyingDocs.map(match=> (match.metadata as MetaData).text)
  console.log("-----------------Docs",docs);

  // 5 vectors
  return docs.join("\n").substring(0, 3000);
}
