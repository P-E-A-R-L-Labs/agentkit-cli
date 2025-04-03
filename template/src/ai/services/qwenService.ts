import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

export const initializeQwenModel = () => {
  return new ChatGroq({
    model: "qwen-2.5-32b",
    temperature: 0.7,
    apiKey: process.env.QWEN_API_KEY,
  });
};

export const getQwenResponse = async (
    model: ChatGroq,
    chatHistory: (SystemMessage | HumanMessage | AIMessage)[]
) => {
    return await model.invoke(chatHistory);
}

export const initializeQwenChatHistory = () => [
    new SystemMessage("You are a helpful AI assistant"),
];