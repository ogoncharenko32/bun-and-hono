import { Database } from "bun:sqlite";

async function sqLiteDemo() {
  const db = new Database("bundb.sqlite");

  //create a table
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP)
    `
  );

  console.log("Table users created");

  const insertUser = db.prepare(
    "INSERT INTO users (name, email) VALUES (?, ?)"
  );

  // insertUser.run("John Doe", "aHx5R@example.com");
  // insertUser.run("Jane Doe", "YV8l2@example.com");
  // insertUser.run("Bob Smith", "Ri8dX@example.com");

  // console.log("Users inserted");

  const extractAllUsers = db.query("SELECT * FROM users").all();
  console.log(extractAllUsers);

  // db.run("UPDATE users SET name = ? WHERE email = ?", [
  //   "John Doe new",
  //   "aHx5R@example.com",
  // ]);

  // const getUpdatedUser = db
  //   .query("SELECT * FROM users WHERE email = ?")
  //   .get("aHx5R@example.com");

  // console.log(getUpdatedUser);

  db.run("DELETE FROM users WHERE email = ?", ["aHx5R@example.com"]);

  const extractRemainingUsers = db.query("SELECT * FROM users").all();
  console.log(extractRemainingUsers);
}

sqLiteDemo();
