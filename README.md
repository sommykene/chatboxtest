
# Chatbox Test App

> Minimal Next.js chat widget + streaming API starter

## ✨ Current Features

- **Next.js** (App Router) running on **Node 22.15.0**
- **TypeScript** with `strict` mode enabled
- **Tailwind CSS** for rapid UI styling
- Fixed bottom‑right chatbox component
- `/api/stream` **Edge** route that streams an echo response ⚡️
- Stub for plugging an **OpenAI Assistant** to add side‑effects (analytics, logging, etc.)


## 🚀 How to get started

git clone git@github.com:AskVinny/chatboxtest.git
cd chatboxtest

ensure correct Node version

`nvm install 22.15.0`
`nvm use`
`npm install`
`npm run dev`

🧑‍💻 Best Practice Guidance

1. Strict TypeScript + ESLint (typescript-eslint)
2. Edge runtime for lower latency on the streaming route
3. Environment variables managed via env.example (ignored by Git)

🤖 OpenAI Assistant integration

app/api/stream/route.ts currently returns a simple echo. 

# Your Task
- Your task is to turn this chatbot into the most awesome possible chatbot it can be. 
- We want to ask the user three questions to onboard them to then chatbot.  What is their favourite country, their continent food and their favourite desitination.
- After these questions are answered the chatbot should be a general purpose chatbot that can answer questions on world geography.
- We want to see creativity, flare and strong architecural decisions. 
- We expect that this should take not less than 1 hour, anything more is up to you.  


## Additional Notes
1. Use the env vars from the .env.example(OpenAi Keys for this project)
2. Create a streaming chatbot for the chat that we are rendering in page.tsx(use the stream route endpoint to communicate)
3. Utilize OpenAi npm Packages, best practices and with your own ideas in terms of designs and functionality.
4. Use Gpt 4.1 Model.
5. Make the Chat to onboard the user, change his preferences and conversate about some information.(Side effects, db not needed, mock some data)

## When done ping rory by email (rory@askvinny.co.uk), and we'll set up a review call to go through what you've built. 