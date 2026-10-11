import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const filename = process.env.DATABASE_PATH || "./data/codeforge.sqlite";
fs.mkdirSync(path.dirname(path.resolve(filename)), { recursive: true });
export const db = new Database(filename);
db.pragma("journal_mode = WAL");
db.exec(`
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY, problem_id TEXT NOT NULL, language_id INTEGER NOT NULL,
  language TEXT NOT NULL, source_code TEXT NOT NULL, stdin TEXT NOT NULL,
  stdout TEXT NOT NULL DEFAULT '', stderr TEXT NOT NULL DEFAULT '',
  compile_output TEXT NOT NULL DEFAULT '', verdict TEXT NOT NULL,
  time TEXT, memory INTEGER, created_at TEXT NOT NULL
);
`);