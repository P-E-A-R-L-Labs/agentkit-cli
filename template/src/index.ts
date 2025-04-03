import { chatThread } from "./ai/langchain/thread_helper.ts";

function main() {
    chatThread().catch(console.error);
}

main();