import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { pipeline,env } from "@xenova/transformers";
import { getContext } from "@/lib/context";

// env.allowLocalModels = false;
// export const runtime = "edge";

// const config = new Configuration({
//   apiKey: process.env.NEXT_PUBLIC_OPEN_AI_API_KEY,
// });

// const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length !== 1) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }
    const fileKey = _chats[0].fileKey;
    // const response = await openai.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages,
    //   stream: true,
    // });
    const lastMessage = messages[messages.length - 1];
    const question = lastMessage.content;
    const context = await getContext(question, fileKey);
    const answerer = await pipeline(
      "question-answering",
      "Xenova/distilbert-base-uncased-distilled-squad"
    );
    console.log('-----------------------question',question,'----------------------------context',context)
    const response = await answerer(question, context);
    console.log(response);
    // const stream = OpenAIStream(response);
    // return new StreamingTextResponse(stream);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log("Error in /api/chat------>", error);
  }
}
