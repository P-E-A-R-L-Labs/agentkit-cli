// toolconfig.ts
import { AIMessage } from "@langchain/core/messages";

export type Tool = {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (params: Record<string, any>) => Promise<string>;
};

export type ToolResult = {
  toolName: string;
  output: string;
};

export class ToolManager {
  private tools: Record<string, Tool> = {};
  private enabled: boolean = false;

  constructor() {
    this.tools = {};
  }

  registerTool(tool: Tool): void {
    this.tools[tool.name] = tool;
    this.enabled = true;
  }

  getTool(name: string): Tool | undefined {
    return this.tools[name];
  }

  getAvailableTools(): Tool[] {
    return Object.values(this.tools);
  }

  getToolsPrompt(): string {
    if (!this.enabled || Object.keys(this.tools).length === 0) {
      return "";
    }

    const toolsList = this.getAvailableTools()
      .map(
        (tool) =>
          `- ${tool.name}: ${tool.description} (parameters: ${JSON.stringify(
            tool.parameters
          )})`
      )
      .join("\n");

    return `\n\nAVAILABLE TOOLS:\n${toolsList}\n\nWhen you need to use a tool, respond with JSON containing "tool_name" and "parameters". Example:\n\n{\n  "tool_name": "tool_name",\n  "parameters": {\n    "param1": "value1",\n    "param2": "value2"\n  }\n}\n`;
  }

  async processToolUse(message: AIMessage): Promise<ToolResult | null> {
    if (!this.enabled) return null;

    try {
      const content = message.content.toString();
      const toolCall = this.extractToolCall(content);

      if (!toolCall) return null;

      const tool = this.getTool(toolCall.tool_name);
      if (!tool) {
        throw new Error(`Tool ${toolCall.tool_name} not found`);
      }

      const result = await tool.execute(toolCall.parameters);
      return {
        toolName: tool.name,
        output: result,
      };
    } catch (error) {
      console.error("Tool processing error:", error);
      return null;
    }
  }

  private extractToolCall(
    content: string
  ): { tool_name: string; parameters: Record<string, any> } | null {
    // Try to parse the entire content as JSON
    try {
      const parsed = JSON.parse(content);
      if (parsed.tool_name && parsed.parameters) {
        return parsed;
      }
    } catch (e) {
      // Not JSON, continue to other methods
    }

    // Try to find JSON in code blocks
    const codeBlockRegex = /```(?:json)?\n([\s\S]*?)\n```/;
    const match = content.match(codeBlockRegex);
    if (match) {
      try {
        const parsed = JSON.parse(match[1]);
        if (parsed.tool_name && parsed.parameters) {
          return parsed;
        }
      } catch (e) {
        // JSON parse failed in code block
      }
    }

    return null;
  }
}

// Example tools (you can move these to a separate file if needed)
export const EXAMPLE_TOOLS: Tool[] = [
  {
    name: "calculator",
    description: "A simple calculator for basic arithmetic operations",
    parameters: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description:
            "The arithmetic expression to evaluate, e.g., '2 + 3 * 4'",
        },
      },
      required: ["expression"],
    },
    execute: async (params: Record<string, any>) => {
      try {
        // In a real implementation, you'd want to use a safe eval or math parser
        const result = eval(params.expression as string);
        return `The result of ${params.expression} is ${result}`;
      } catch (error) {
        return `Error calculating expression: ${error}`;
      }
    },
  },
  {
    name: "web_search",
    description: "Perform a web search and return relevant results",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query",
        },
        max_results: {
          type: "number",
          description: "Maximum number of results to return",
          default: 3,
        },
      },
      required: ["query"],
    },
    execute: async (params: Record<string, any>) => {
      // In a real implementation, you'd call a search API here
      return `Web search results for "${params.query}" (showing ${
        params.max_results || 3
      } results):\n1. Result 1\n2. Result 2\n3. Result 3`;
    },
  },
];
