import OpenAI from "openai";

export const handleRunStatus = async (
  openai: OpenAI,
  run: OpenAI.Beta.Threads.Runs.Run,
  threadId: string
) => {
    while (
      runStatus !== "completed" &&
      runStatus !== "requires_action" &&
      runStatus !== "failed"
    ) {
      const updatedRun = await openai.beta.threads.runs.retrieve(run.id, {
        thread_id,
      });
      //   console.log(runStatus);
      runStatus = updatedRun.status;
      await new Promise((r) => setTimeout(r, 1000)); // wait 1 second
    }

   

    if (runStatus === "failed") {
      return NextResponse.json({ error: "Run failed" });
    }
  // Check if the run is completed
  if (run.status === "completed") {
    const messages = await openai.beta.threads.messages.list(threadId);
    console.log(messages.data);
    return messages.data;
  } else if (run.status === "requires_action") {
    console.log(run.status);
    return await handleRequiresAction(openai, run, threadId);
  } else {
    console.error("Run did not complete:", run);
  }
};

export const handleRequiresAction = async (
  openai: OpenAI,
  run: OpenAI.Beta.Threads.Runs.Run,
  threadId: string
) => {
  // Check if there are tools that require outputs
  if (
    run.required_action &&
    run.required_action.submit_tool_outputs &&
    run.required_action.submit_tool_outputs.tool_calls
  ) {
    // Loop through each tool in the required action section
    const toolOutputs = run.required_action.submit_tool_outputs.tool_calls.map(
      (tool) => {
        if (tool.function.name === "getCurrentTemperature") {
          return {
            tool_call_id: tool.id,
            output: "57",
          };
        } else if (tool.function.name === "getRainProbability") {
          return {
            tool_call_id: tool.id,
            output: "0.06",
          };
        }
      }
    );

    // Submit all tool outputs at once after collecting them in a list
    if (toolOutputs.length > 0) {
      run = await openai.beta.threads.runs.submitToolOutputsAndPoll(run.id, {
        threadId,
        tool_outputs: toolOutputs ?? [],
      });
      console.log("Tool outputs submitted successfully.");
    } else {
      console.log("No tool outputs to submit.");
    }

    // Check status after submitting tool outputs
    return handleRunStatus(openai, run, threadId);
  }
};
