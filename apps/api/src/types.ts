export type Difficulty = "Easy" | "Medium" | "Hard";
export type Problem = {
  id: string; title: string; difficulty: Difficulty; topics: string[];
  description: string; examples: { input: string; output: string; explanation?: string }[];
  constraints: string[]; starterCode: Record<string, string>;
  sampleInput: string; sampleOutput: string;
};
export type Verdict = "Accepted" | "Wrong Answer" | "Runtime Error" | "Time Limit Exceeded" | "Compilation Error" | "Queued" | "Execution Error";
export type Submission = {
  id: string; problemId: string; languageId: number; language: string;
  sourceCode: string; stdin: string; stdout: string; stderr: string;
  compileOutput: string; verdict: Verdict; time: string | null; memory: number | null;
  createdAt: string;
};