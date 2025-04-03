import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

export const initializeLlamaModel = () => {
  return new ChatGroq({
    model: "llama-3.3-70b-specdec",
    temperature: 0.7,
    apiKey: process.env.LLAMA_API_KEY,
  });
};

export const getLlamaResponse = async (
    model: ChatGroq,
    chatHistory: (SystemMessage | HumanMessage | AIMessage)[]
) => {
    return await model.invoke(chatHistory);
}

export const initializeLlamaChatHistory = () => [
    new SystemMessage("You are a helpful AI assistant"),
];