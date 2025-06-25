import OpenAI from "openai";
export interface OnboardingData {
  favoriteCountry: string;
  favoriteContinent: string;
  favoriteDestination: string;
}

export interface ChatResponse {
  threadId: string;
  reply: string;
  onboardingData: OnboardingData | null;
  userTheme: string | null;
  error?: string;
}

const assistantId = "asst_Zd4bKoLDLLDogP67FBxsRXOL";

//  const assistant = await openai.beta.assistants.create({
//     name: "World Geography Helper",
//     instructions:
//       "You are a helpful assistant that answers questions about world geography. Provide accurate and concise information in a nice format",
//     model: "gpt-4.1",
//     tools: [
//       {
//         type: "function",
//         function: getOnboardingDataPrompt,
//       },
//       {
//         type: "function",
//         function: changeThemePrompt,
//       },
//     ],
//   });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseToolOutput(tool: any) {
  if (tool.function.name === "get_onboarding_data") {
    const data = JSON.parse(tool.function.arguments ?? "{}");
    return {
      id: tool.id,
      favoriteCountry: data.favoriteCountry,
      favoriteContinent: data.favoriteContinent,
      favoriteDestination: data.favoriteDestination,
    };
  }
  if (tool.function.name === "change_theme") {
    const data = JSON.parse(tool.function.arguments ?? "{}");
    return {
      id: tool.id,
      theme: data.theme,
    };
  }
  return null;
}

export async function handleChat({
  threadId,
  message,
  theme,
  apiKey,
}: {
  threadId?: string;
  message: string;
  theme?: string;
  apiKey: string;
}): Promise<ChatResponse> {
  let userTheme = theme ?? null;
  let onboardingData: OnboardingData | null = null;

  try {
    const openai = new OpenAI({ apiKey });

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
      assistant_id: assistantId,
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
            (tool) => parseToolOutput(tool)
          );

        toolOutputs?.forEach((output) => {
          if (output?.favoriteCountry) {
            onboardingData = {
              favoriteCountry: output.favoriteCountry,
              favoriteContinent: output.favoriteContinent,
              favoriteDestination: output.favoriteDestination,
            };
          }
          if (output?.theme) {
            userTheme = output.theme;
          }
        });

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
      return {
        threadId: thread_id,
        reply: "",
        onboardingData,
        userTheme,
        error: "Run failed",
      };
    }

    const messages = await openai.beta.threads.messages.list(thread_id);
    const assistantMessage = messages.data.find(
      (msg) => msg.role === "assistant"
    );

    const reply =
      assistantMessage?.content[0] && "text" in assistantMessage?.content[0]
        ? assistantMessage.content[0].text.value
        : "No reply from assistant";

    return {
      threadId: thread_id,
      reply,
      onboardingData,
      userTheme,
    };
  } catch (error) {
    throw new Error("OpenAI API error: " + (error as Error).message);
  }
}
