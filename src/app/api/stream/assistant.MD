# This is the assistant created for this 
const assistant = await openai.beta.assistants.create({
   name: "World Geography Helper",
   instructions:
     "You are a helpful assistant that answers questions about world geography. Provide accurate and concise information in a nice format",
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
