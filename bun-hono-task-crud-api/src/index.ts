import { Hono } from "hono";
import { initDatabase } from "./database/db";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { loginController, registerController } from "./controllers/auth";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { jwt } from "hono/jwt";
import {
  createTaskController,
  deleteTaskByIdController,
  getAllTasksController,
  getTaskByIdController,
  updateTaskByIdController,
} from "./controllers/tasks";

const app = new Hono();
const db = initDatabase();

app.use("*", cors());
app.use("*", logger());

const auth = jwt({
  secret: process.env.JWT_SERCET || "secret",
});

//Validation
const registerSchema = z.object({
  username: z.string().min(3).max(25),
  password: z.string().min(6),
  role: z.enum(["admin", "user"]),
});

const loginSchema = z.object({
  username: z.string().min(3).max(25),
  password: z.string().min(6),
});

const taskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]),
  user_id: z.number().int().positive(),
});

//AuthRoutes
app.post("/register", zValidator("json", registerSchema), (c) =>
  registerController(c, db)
);

app.post("/login", zValidator("json", loginSchema), (c) =>
  loginController(c, db)
);

//TaskRoutes

app.post("/tasks", auth, zValidator("json", taskSchema), (c) =>
  createTaskController(c, db)
);

app.get("/tasks", auth, (c) => getAllTasksController(c, db));
app.get("/tasks/:id", auth, (c) => getTaskByIdController(c, db));
app.put("/tasks/:id", auth, zValidator("json", taskSchema), (c) =>
  updateTaskByIdController(c, db)
);
app.delete("/tasks/:id", auth, (c) => deleteTaskByIdController(c, db));

app.get("/", (c) => {
  return c.text("Hello User & Task CRUD API");
});

app.get("/db-test", (c) => {
  const result = db.query("SELECT sqlite_version()").get();

  return c.json({
    message: "Database connected",
    sqlite_version: result,
  });
});

export default app;
