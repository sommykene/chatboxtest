import {
  changeThemePrompt,
  getOnboardingDataPrompt,
} from "@/app/api/stream/toolFunctions";
import { NextResponse } from "next/server";
import OpenAI from "openai";
export const runtime = "edge";

export async function POST(req: Request) {
  const { threadId, message, theme } = await req.json();
  let userTheme = theme ?? null;

  let onboardingData: {
    favoriteCountry: string;
    favoriteContinent: string;
    favoriteDestination: string;
  } | null = null;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

  const assistant = await openai.beta.assistants.create({
    name: "World Geography Helper",
    instructions:
      "You are a helpful assistant that answers questions about world geography. Provide accurate and concise information.",
    model: "gpt-4.1",
    tools: [
      {
        type: "function",
        function: getOnboardingDataPrompt,
      },
      {
        type: "function",
        function: changeThemePrompt,
      },
    ],
  });

  try {
    let thread_id = threadId;
    if (!thread_id) {
      const thread = await openai.beta.threads.create();
      thread_id = thread.id;
    }

    await openai.beta.threads.messages.create(thread_id, {
      role: "user",
      content: `If you dont already know - ask me:
        1. What is their favorite country?
        2. What is their favorite continent?
        3. What is their favorite destination?

        trigger get_onboarding_data tool to get this data.`,
    });

    await openai.beta.threads.messages.create(thread_id, {
      role: "user",
      content: message,
    });

    const run = await openai.beta.threads.runs.create(thread_id, {
      assistant_id: assistant.id,
    });

    let runStatus = run.status;

    while (runStatus !== "completed" && runStatus !== "failed") {
      const updatedRun = await openai.beta.threads.runs.retrieve(run.id, {
        thread_id,
      });
      runStatus = updatedRun.status;

      if (runStatus === "requires_action") {
        const toolOutputs =
          updatedRun?.required_action?.submit_tool_outputs.tool_calls.map(
            (tool) => {
              if (tool.function.name === "get_onboarding_data") {
                const data = JSON.parse(tool.function.arguments ?? "{}");
                onboardingData = {
                  favoriteCountry: data.favoriteCountry,
                  favoriteContinent: data.favoriteContinent,
                  favoriteDestination: data.favoriteDestination,
                };
                return {
                  id: tool.id,
                  favoriteCountry: data.favoriteCountry,
                  favoriteContinent: data.favoriteContinent,
                  favoriteDestination: data.favoriteDestination,
                };
              }

              if (tool.function.name === "change_theme") {
                const data = JSON.parse(tool.function.arguments ?? "{}");
                userTheme = data.theme;
                return {
                  id: tool.id,
                  theme: data.theme,
                };
              }
            }
          );

        await openai.beta.threads.runs.submitToolOutputsAndPoll(updatedRun.id, {
          thread_id,
          tool_outputs:
            toolOutputs?.map((output) => ({
              tool_call_id: output?.id ?? "",
              output: JSON.stringify(output),
            })) ?? [],
        });
        break;
      }

      await new Promise((r) => setTimeout(r, 1000));
    }

    if (runStatus === "failed") {
      return NextResponse.json({ error: "Run failed" });
    }

    // 5. Get latest assistant reply
    const messages = await openai.beta.threads.messages.list(thread_id);
    const assistantMessage = messages.data.find(
      (msg) => msg.role === "assistant"
    );

    const reply =
      assistantMessage?.content[0]?.text?.value ?? "No reply from assistant";

    return NextResponse.json({
      threadId: thread_id,
      reply,
      onboardingData,
      userTheme,
    });
  } catch (error: any) {
    console.error("OpenAI error:", error);
    return NextResponse.json({ error: "Internal server error" });
  }
}
