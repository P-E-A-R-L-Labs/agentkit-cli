# agentkit-cli

PEARL Agentkit is an AI SDK to create blockchain based tools directly on Monad Testnet. The SDK scaffolds the file system which setups the complete configurations to run the SDK. Developers can add tools from their side as well. 
For developments happening from team side refer: https://github.com/P-E-A-R-L-Labs/Backend-Boilerplate


<h4>How it works?</h4>

To install file system:
```bash
npx create-pearl-agent@latest <project_name>
```

To install dependencies:

```bash
bun install
```

To copy the .env.example:
```bash
cp .env.example .env
```

Once the .env file is created, you will have all the environment variables available:
``` code
OPENROUTER_API_KEY=
OPENROUTER_BASE_URL=

DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=

OPENAI_API_KEY=

CLAUDE_API_KEY=

QWEN_API_KEY=

LLAMA_API_KEY=

MISTRAL_API_KEY=

LANGSMITH_TRACING=
LANGSMITH_API_KEY=

WALLET_PRIVATE_KEY=
```

Minimum required variables are:
``` code
Atleast 1 LLM API key

LANGSMITH_TRACING=
LANGSMITH_API_KEY=

WALLET_PRIVATE_KEY=
```

To run:

```bash
bun run index.ts
```

<h3>Future Developments (core team)</h3>
<ul>
  <li>Secure Storage integrations using Nillion SecretVault</li>
  <li>Secure LLM integrations using Nillion SecretLLM</li>
  <li>Secure Interface deployed on Arweave and IPFS to provide with a lot more development flexibility.</li>
</ul>

<h3>Future Development (opensource devs)</h3>
<ul>
  <li>Developers can contribute to the SDK by building new tools and proper intializations.</li>
  <li>Examples: Multi-Wallet Support, DeFi, DeSci, DePIN and more. In short tools must be blockchain based.</li>
</ul>

