import { handleChat } from "./openaiService";
import { NextResponse } from "next/server";
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { threadId, message, theme } = await req.json();
    const result = await handleChat({
      threadId,
      message,
      theme,
      apiKey: process.env.OPENAI_KEY!,
    });
    console.log("API result:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" });
  }
}
