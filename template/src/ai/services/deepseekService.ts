import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

export const initializeDeepSeekModel = () => {
  return new ChatGroq({
    model: "deepseek-r1-distill-llama-70b",
    temperature: 0.7,
    apiKey: process.env.DEEPSEEK_API_KEY,
  });
};

export const getDeepSeekResponse = async (
  model: ChatGroq,
  chatHistory: (SystemMessage | HumanMessage | AIMessage)[]
) => {
  // Ensure system message is properly formatted
  if (chatHistory.length === 0 || !(chatHistory[0] instanceof SystemMessage)) {
    chatHistory.unshift(
      new SystemMessage("You are a helpful AI assistant. Greet the user warmly when they start a conversation.")
    );
  }
  
  return await model.invoke(chatHistory);
};

export const initializeDeepSeekChatHistory = () => [
  // More explicit system message
  new SystemMessage(`You are a friendly AI assistant. When the conversation starts, greet the user warmly and ask how you can help. 
  Respond conversationally and avoid code examples unless explicitly asked.`),
];