// chatThread.ts
import * as readline from "readline-sync";
import * as dotenv from "dotenv";
import { initializeOpenaiModel, getOpenaiResponse } from "../services/openaiService.ts";
import { initializeDeepSeekModel, getDeepSeekResponse } from "../services/deepseekService.ts";
import { initializeClaudeModel, getClaudeResponse } from "../services/anthropicService.ts";
import { initializeQwenModel, getQwenResponse } from "../services/qwenService.ts";
import { initializeLlamaModel, getLlamaResponse } from "../services/llamaService.ts";
import { initializeMistralModel, getMistralResponse } from "../services/mistralService.ts";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";

import { ToolManager, EXAMPLE_TOOLS } from "./toolconfig.ts";

dotenv.config();

type ModelService = {
  name: string;
  initialize: () => any;
  getResponse: (model: any, history: any[]) => Promise<AIMessage>;
  envKey: string;
};

const MODEL_SERVICES: Record<string, ModelService> = {
  openai: {
    name: "OpenAI",
    initialize: initializeOpenaiModel,
    getResponse: getOpenaiResponse,
    envKey: "OPENAI_API_KEY"
  },
  deepseek: {
    name: "DeepSeek",
    initialize: initializeDeepSeekModel,
    getResponse: getDeepSeekResponse,
    envKey: "DEEPSEEK_API_KEY"
  },
  claude: {
    name: "Claude",
    initialize: initializeClaudeModel,
    getResponse: getClaudeResponse,
    envKey: "CLAUDE_API_KEY"
  },
  qwen: {
    name: "Qwen",
    initialize: initializeQwenModel,
    getResponse: getQwenResponse,
    envKey: "QWEN_API_KEY"
  },
  llama: {
    name: "Llama",
    initialize: initializeLlamaModel,
    getResponse: getLlamaResponse,
    envKey: "LLAMA_API_KEY"
  },
  mistral: {
    name: "Mistral",
    initialize: initializeMistralModel,
    getResponse: getMistralResponse,
    envKey: "LLAMA_API_KEY"
  }
};

async function selectModel(): Promise<string> {
  console.log("Select AI Model:");
  Object.entries(MODEL_SERVICES).forEach(([key, service], index) => {
    console.log(`${index + 1}. ${service.name}`);
  });

  while (true) {
    const input = readline.question(`Choice (1-${Object.keys(MODEL_SERVICES).length}): `);
    const choice = parseInt(input) - 1;
    const modelKeys = Object.keys(MODEL_SERVICES);
    
    if (choice >= 0 && choice < modelKeys.length) {
      return modelKeys[choice];
    }
    console.log(`Invalid. Enter 1-${modelKeys.length}`);
  }
}

export async function chatThread() {
  const modelKey = await selectModel();
  const service = MODEL_SERVICES[modelKey];

  if (!process.env[service.envKey]) {
    console.error(`Missing ${service.name} API key (${service.envKey})`);
    process.exit(1);
  }

  // Initialize tool manager
  const toolManager = new ToolManager();
  
  // Register example tools (in a real app, you might load these dynamically)
  EXAMPLE_TOOLS.forEach(tool => toolManager.registerTool(tool));

  const model = service.initialize();
  const chatHistory = [
    new SystemMessage(`You are a helpful AI assistant. ${toolManager.getToolsPrompt()}`)
  ];

  console.log(`\n${service.name} Chat Started. Type 'exit' to quit.\n`);

  // Initial response
  try {
    const firstReply = await service.getResponse(model, chatHistory);
    await processAIResponse(firstReply, chatHistory, toolManager, service, model);
  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }

  // Chat loop
  while (true) {
    const userInput = readline.question("\nYou: ");
    if (userInput.toLowerCase() === "exit") break;

    chatHistory.push(new HumanMessage(userInput));
    
    try {
      const response = await service.getResponse(model, chatHistory);
      await processAIResponse(response, chatHistory, toolManager, service, model);
    } catch (error) {
      console.error("API Error:", error);
      chatHistory.pop();
    }
  }
}

async function processAIResponse(response: AIMessage, chatHistory: any[], toolManager: ToolManager, service: ModelService, model: any) {
  // Check if the response is a tool call
  const toolResult = await toolManager.processToolUse(response);
  
  if (toolResult) {
    console.log(`\nAI used tool: ${toolResult.toolName}`);
    console.log(`\nTool result: ${toolResult.output}`);
    
    // Add the tool result to the chat history
    chatHistory.push(new AIMessage({
      content: `Tool ${toolResult.toolName} was used with result: ${toolResult.output}`,
      tool_calls: response.tool_calls // Preserve the original tool calls metadata if any
    }));
    
    // Get a new response from the model with the tool result
    const followUp = await service.getResponse(model, chatHistory);
    await processAIResponse(followUp, chatHistory, toolManager, service, model);
  } else {
    // Regular response
    console.log(`\nAI: ${response.content}`);
    chatHistory.push(response);
  }
}