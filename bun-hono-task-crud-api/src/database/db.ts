import { Database } from "bun:sqlite";

export function initDatabase(): Database {
  const db = new Database("bun_hono_task_crud_api.sqlite");

  //users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'user')) NOT NULL DEFAULT 'user'
    )
    `);

  //tasks table

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK(status IN ('todo', 'in_progress', 'done')) NOT NULL DEFAULT 'todo',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
    )
    `);

  return db;
}
