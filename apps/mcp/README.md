# CodeForge IDE for ChatGPT

This service exposes CodeForge as an MCP app with an embedded coding IDE widget.

## Deploy on Render

- Runtime: Docker
- Docker context: `.`
- Dockerfile path: `apps/mcp/Dockerfile`
- Environment variable: `API_BASE_URL=https://codeforge-api-live.onrender.com`
- Render supplies `PORT` automatically.

The MCP endpoint is `/mcp`. The root URL is a health check.

## Connect to ChatGPT

1. Wait until the Render service is live.
2. In ChatGPT open Settings → Apps (or Connectors) → Advanced settings and enable Developer mode if available.
3. Create/add a custom MCP app using the service URL ending in `/mcp`.
4. Review the tool list and create the connection.
5. Start a new chat, select CodeForge, and ask it to open the IDE.

The IDE widget uses the ChatGPT `window.openai.callTool` compatibility bridge to call the server-side MCP tools. The backend delegates problem data and code execution to the existing CodeForge API and Judge0 integration.

## Important limitations

- This is a first functional integration; it is not yet a production multi-user service.
- The existing API has a per-IP in-memory limit and SQLite on ephemeral storage on the free Render plan.
- Execution and verdict accuracy depend on the configured Judge0 instance and problem input/output format.
- No account authentication is implemented yet.
