
# Chatbox Test App

> Minimal Next.js chat widget + streaming API starter

## ✨ Features

- **Next.js** (App Router) running on **Node 22.15.0**
- **TypeScript** with `strict` mode enabled
- **Tailwind CSS** for rapid UI styling
- Fixed bottom‑right chatbox component
- `/api/stream` **Edge** route that streams an echo response ⚡️
- Stub for plugging an **OpenAI Assistant** to add side‑effects (analytics, logging, etc.)


## 🚀 Quick start

git clone git@github.com:AskVinny/chatboxtest.git
cd chatboxtest

# ensure correct Node version

nvm install 22.15.0
nvm use

npm install
npm run dev

🧑‍💻 Best practices followed

Strict TypeScript + ESLint (typescript-eslint)

Edge runtime for lower latency on the streaming route

Environment variables managed via env.example (ignored by Git)

🤖 OpenAI Assistant integration

app/api/stream/route.ts currently returns a simple echo. 

- Create the most awesome Chatbox

1. Use the env vars from the .env.example(OpenAi Keys for this project)
2. Create a streaming chatbot for the chat that we are rendering in page.tsx(use the stream route endpoint to communicate)
3. Utilize OpenAi npm Packages, best practices and with your own ideas in terms of designs and functionality.
4. Use Gpt 4.1 Model.
5. Make the Chat to onboard the user, change his preferences and conversate about some information.(Side effects, db not needed, mock some data)
