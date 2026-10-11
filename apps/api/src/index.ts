import "dotenv/config";
import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { db } from "./db.js";
import { LANGUAGES, PROBLEMS } from "./problems.js";
import { execute } from "./judge0.js";

const app = express();
const port = Number(process.env.PORT || 10000);
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173").split(",").map(v => v.trim());
app.use(cors({ origin: (origin, callback) => {
  if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error("Origin not allowed by CORS"));
}}));
app.use(express.json({ limit: "256kb" }));

app.get("/", (_req, res) => res.json({ service: "CodeForge API", health: "/api/health" }));
app.get("/api/health", (_req, res) => res.json({ ok: true, service: "codeforge-api", version: "0.2.0", executionConfigured: Boolean(process.env.JUDGE0_BASE_URL) }));
app.get("/api/languages", (_req, res) => res.json(LANGUAGES));
app.get("/api/problems", (_req, res) => res.json(PROBLEMS.map(({ starterCode, sampleInput, sampleOutput, ...p }) => p)));
app.get("/api/problems/:id", (req, res) => {
  const problem = PROBLEMS.find(p => p.id === req.params.id);
  if (!problem) return res.status(404).json({ error: "Problem not found" });
  return res.json(problem);
});
app.get("/api/paths", (_req, res) => res.json([
  { id: "foundations", title: "Algorithm Foundations", level: "Beginner", modules: [
    { title: "Arrays and Strings", problemIds: ["two-sum", "valid-palindrome"], mastery: "Solve both and explain O(n) vs O(n²)." },
    { title: "Dynamic Programming", problemIds: ["max-subarray"], mastery: "Explain the recurrence and implement Kadane's algorithm." }
  ] }
]));
app.get("/api/progress", (_req, res) => {
  const rows = db.prepare("SELECT verdict, COUNT(*) as count FROM submissions GROUP BY verdict").all() as { verdict: string; count: number }[];
  const total = rows.reduce((n, r) => n + r.count, 0);
  const accepted = rows.find(r => r.verdict === "Accepted")?.count ?? 0;
  return res.json({ totalAttempts: total, accepted, acceptanceRate: total ? Math.round(accepted / total * 100) : 0, byVerdict: rows });
});
const submissionSchema = z.object({
  problemId: z.string().min(1).max(100),
  languageId: z.number().int().positive(),
  language: z.string().min(1).max(40),
  sourceCode: z.string().min(1).max(100_000),
  stdin: z.string().max(50_000).default("")
});
app.post("/api/submissions", async (req, res) => {
  const parsed = submissionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid submission", details: parsed.error.flatten() });
  if (!PROBLEMS.some(p => p.id === parsed.data.problemId)) return res.status(404).json({ error: "Problem not found" });
  const language = LANGUAGES.find(l => l.id === parsed.data.languageId);
  if (!language) return res.status(400).json({ error: "Unsupported language ID" });
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  try {
    const result = await execute(parsed.data.sourceCode, parsed.data.languageId, parsed.data.stdin);
    db.prepare(`INSERT INTO submissions
      (id, problem_id, language_id, language, source_code, stdin, stdout, stderr, compile_output, verdict, time, memory, created_at)
      VALUES (@id,@problemId,@languageId,@language,@sourceCode,@stdin,@stdout,@stderr,@compileOutput,@verdict,@time,@memory,@createdAt)`).run({
        id, problemId: parsed.data.problemId, languageId: parsed.data.languageId, language: language.name,
        sourceCode: parsed.data.sourceCode, stdin: parsed.data.stdin, ...result, createdAt
      });
    return res.status(201).json({ id, problemId: parsed.data.problemId, language: language.name, ...result, createdAt });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Execution service failed";
    return res.status(503).json({ error: message, code: "EXECUTION_UNAVAILABLE" });
  }
});
app.get("/api/submissions/:id", (req, res) => {
  const row = db.prepare(`SELECT id, problem_id as problemId, language, stdout, stderr, compile_output as compileOutput, verdict, time, memory, created_at as createdAt FROM submissions WHERE id = ?`).get(req.params.id);
  if (!row) return res.status(404).json({ error: "Submission not found" });
  return res.json(row);
});
app.listen(port, "0.0.0.0", () => console.log(`CodeForge API listening on port ${port}`));