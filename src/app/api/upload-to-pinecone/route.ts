import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { convertToAscii } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";

let pinecone: Pinecone | null = null;
export const getPineconeClient = () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
    });
  }
  return pinecone;
};
export async function POST(req: Request, res: Response) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { file_key, file_name, vectors } = body;

    // Fix any potential array-to-object conversion
    const fixedVectors = vectors.map((vector: any) => ({
      ...vector,
      values: Array.isArray(vector.values)
        ? vector.values
        : Object.values(vector.values),
    }));
    // 4. Upload to Pinecone
    //Getting error while uploading to pinecone
    // Access to fetch at 'https://chat-pdf-cmf7ac9.svc.aped-4627-b74a.pinecone.io/vectors/upsert' from origin 'http://localhost:3000' has been blocked by CORS policy: Request header field x-pinecone-api-version is not allowed by Access-Control-Allow-Headers in preflight response.
    // We will get cors error if we try to upload to pinecone from client side.
    const client = await getPineconeClient();
    const pineconeIndex = client.Index("chat-pdf");
    console.log("Inserting vectors into Pinecone");
    const namespace = convertToAscii(file_key);
    await pineconeIndex.namespace(namespace).upsert(fixedVectors);

    return NextResponse.json(
      {
        // chat_id: chat_id[0].insertedId,
        message: "Vectors uploaded successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error in api upload-to-pinecone -> POST: ", error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
