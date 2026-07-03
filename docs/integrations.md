# Integrations

LangDrift sends `POST { locale, input, scenarioId }` to your agent and expects back `{ text, toolCalls, structured }`. That's the entire contract. The examples below show the minimal adapter for the most common setups.

## OpenAI SDK (Node.js)

```ts
import OpenAI from "openai";
import express from "express";

const client = new OpenAI();
const app = express();
app.use(express.json());

app.post("/api/agent", async (req, res) => {
  const { input, locale } = req.body;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: `Respond in the user's language. Locale: ${locale}` },
      { role: "user", content: input },
    ],
    tools: yourTools,
  });

  const message = response.choices[0].message;

  res.json({
    text: message.content ?? "",
    toolCalls: (message.tool_calls ?? []).map((tc) => ({
      name: tc.function.name,
      arguments: JSON.parse(tc.function.arguments),
    })),
    structured: null,
  });
});

app.listen(3010);
```

## Vercel AI SDK

```ts
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import express from "express";

const app = express();
app.use(express.json());

app.post("/api/agent", async (req, res) => {
  const { input, locale } = req.body;

  const { text, toolCalls } = await generateText({
    model: openai("gpt-4o-mini"),
    system: `Respond in the user's language. Locale: ${locale}`,
    prompt: input,
    tools: yourTools,
  });

  res.json({
    text,
    toolCalls: toolCalls.map((tc) => ({
      name: tc.toolName,
      arguments: tc.args,
    })),
    structured: null,
  });
});

app.listen(3010);
```

## LangChain (Node.js)

```ts
import { ChatOpenAI } from "@langchain/openai";
import express from "express";

const app = express();
app.use(express.json());

const model = new ChatOpenAI({ model: "gpt-4o-mini" }).bindTools(yourTools);

app.post("/api/agent", async (req, res) => {
  const { input, locale } = req.body;

  const response = await model.invoke([
    { role: "system", content: `Respond in the user's language. Locale: ${locale}` },
    { role: "user", content: input },
  ]);

  res.json({
    text: typeof response.content === "string" ? response.content : "",
    toolCalls: (response.tool_calls ?? []).map((tc) => ({
      name: tc.name,
      arguments: tc.args,
    })),
    structured: null,
  });
});

app.listen(3010);
```

## Anthropic SDK (Node.js)

```ts
import Anthropic from "@anthropic-ai/sdk";
import express from "express";

const client = new Anthropic();
const app = express();
app.use(express.json());

app.post("/api/agent", async (req, res) => {
  const { input, locale } = req.body;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: `Respond in the user's language. Locale: ${locale}`,
    messages: [{ role: "user", content: input }],
    tools: yourTools,
  });

  const toolCalls = response.content
    .filter((block) => block.type === "tool_use")
    .map((block) => ({ name: block.name, arguments: block.input }));

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  res.json({ text, toolCalls, structured: null });
});

app.listen(3010);
```

## Plain HTTP handler (Fastify)

```ts
import Fastify from "fastify";

const app = Fastify();

app.post("/api/agent", async (request, reply) => {
  const { input, locale } = request.body as {
    input: string;
    locale: string;
    scenarioId: string;
  };

  // call your model here, get back text and tool calls
  const { text, toolCalls } = await yourAgentLogic(input, locale);

  return { text, toolCalls, structured: null };
});

app.listen({ port: 3010 });
```

## Notes

**`locale` is just a string.** LangDrift passes it through verbatim from the scenario file (e.g. `"fr"`, `"zh"`, `"sw"`). How you use it is up to you — pass it as a system prompt hint, use it to select a prompt template, or ignore it if your model handles language automatically.

**`toolCalls` shape.** Each entry must have a `name` string. `arguments` is optional but required for argument assertions to work. Extra fields are ignored.

**`scenarioId` is informational.** LangDrift sends it so your agent can log or branch on it. Most adapters can ignore it.

**Non-2xx responses fail the locale.** If your handler throws or returns a non-2xx status, LangDrift records it as `target_error` (a transport failure, kept distinct from behavioral modes like `no_tool_call`) with the HTTP status as the detail. A malformed or non-JSON 2xx body is also a `target_error`.
