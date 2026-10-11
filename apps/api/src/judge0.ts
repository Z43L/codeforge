import type { Verdict } from "./types.js";

const BASE = process.env.JUDGE0_BASE_URL?.replace(/\/+$/, "");
const TOKEN = process.env.JUDGE0_AUTH_TOKEN;
const wait = process.env.JUDGE0_WAIT !== "false";

export type JudgeResult = {
  stdout: string | null; stderr: string | null; compile_output: string | null;
  time: string | null; memory: number | null;
  status: { id: number; description: string };
};

export async function execute(sourceCode: string, languageId: number, stdin: string, expectedOutput = ""): Promise<{
  verdict: Verdict; stdout: string; stderr: string; compileOutput: string;
  time: string | null; memory: number | null;
}> {
  if (!BASE) throw new Error("Code execution is not configured. Set JUDGE0_BASE_URL on the API server.");
  const url = new URL(`${BASE}/submissions`);
  url.searchParams.set("base64_encoded", "false");
  url.searchParams.set("wait", wait ? "true" : "false");
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (TOKEN) headers["X-Auth-Token"] = TOKEN;
  const response = await fetch(url, {
    method: "POST", headers,
    body: JSON.stringify({ source_code: sourceCode, language_id: languageId, stdin, ...(expectedOutput ? { expected_output: expectedOutput } : {}), cpu_time_limit: 2, wall_time_limit: 5, memory_limit: 128000 })
  });
  if (!response.ok) throw new Error(`Execution service returned HTTP ${response.status}.`);
  let data = await response.json() as JudgeResult & { token?: string };
  if (data.token && !data.status) {
    const poll = new URL(`${BASE}/submissions/${encodeURIComponent(data.token)}`);
    poll.searchParams.set("base64_encoded", "false");
    for (let i = 0; i < 20; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const r = await fetch(poll, { headers: TOKEN ? { "X-Auth-Token": TOKEN } : {} });
      if (!r.ok) throw new Error(`Execution service polling failed with HTTP ${r.status}.`);
      data = await r.json() as JudgeResult;
      if (data.status?.id > 2) break;
    }
  }
  const statusId = data.status?.id ?? 0;
  const verdict: Verdict = statusId === 3 ? "Accepted"
    : statusId === 4 ? "Wrong Answer"
    : statusId === 5 ? "Time Limit Exceeded"
    : statusId === 6 ? "Compilation Error"
    : [7, 8, 9, 10, 11, 12].includes(statusId) ? "Runtime Error"
    : statusId <= 2 ? "Queued" : "Execution Error";
  return {
    verdict, stdout: data.stdout ?? "", stderr: data.stderr ?? "",
    compileOutput: data.compile_output ?? "", time: data.time ?? null, memory: data.memory ?? null
  };
}