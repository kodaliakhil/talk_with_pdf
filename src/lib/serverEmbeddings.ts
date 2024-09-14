import { pipeline } from "@xenova/transformers";

export async function getServerEmbeddings(text: string) {
  try {
    const generateEmbeddings = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
    const result = await generateEmbeddings(text.replace(/\n/g, ""), {
      pooling: "mean",
      normalize: true,
    });
    return result.data as number[];
  } catch (error) {
    console.log("error while getting embeddings (lib -> serverEmbeddings.ts)", error);
    throw error;
  }
}
