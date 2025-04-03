import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

export const initializeMistralModel = () => {
  return new ChatGroq({
    model: "mistral-saba-24b",
    temperature: 0.7,
    apiKey: process.env.MISTRAL_API_KEY,
  });
};

export const getMistralResponse = async (
    model: ChatGroq,
    chatHistory: (SystemMessage | HumanMessage | AIMessage)[]
) => {
    return await model.invoke(chatHistory);
}

export const initializeMistralChatHistory = () => [
    new SystemMessage("You are a helpful AI assistant"),
];