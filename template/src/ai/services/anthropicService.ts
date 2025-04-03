// claudeService.ts
import { ChatAnthropic } from "@langchain/anthropic";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

export const initializeClaudeModel = () => {
  return new ChatAnthropic({
    modelName: "claude-3-sonnet-20240229", // or "claude-3-opus-20240229"
    temperature: 0.7,
    anthropicApiKey: process.env.CLAUDE_API_KEY,
    maxTokens: 1024,
  });
};

export const getClaudeResponse = async (
  model: ChatAnthropic,
  chatHistory: (SystemMessage | HumanMessage | AIMessage)[]
) => {
  return await model.invoke(chatHistory);
};

export const initializeClaudeChatHistory = () => [
  new SystemMessage("You are a helpful AI assistant."),
];