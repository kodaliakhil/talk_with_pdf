// /api/create-chat

import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { file_key, file_name } = body;
    const documents = await loadS3IntoPinecone(file_key);
    // const chat_id = await db
    //   .insert(chats)
    //   .values({
    //     fileKey: file_key,
    //     pdfName: file_name,
    //     pdfUrl: getS3Url(file_key),
    //     userId: userId,
    //   })
    //   .returning({
    //     insertedId: chats.id,
    //   });

    return NextResponse.json(
      {
        // chat_id: chat_id[0].insertedId,
        message: "Documents Created successfully",
        documents: documents,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error in api create-chat -> POST: ", error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
