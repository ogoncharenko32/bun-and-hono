import type { Context } from "hono";
import { Database } from "bun:sqlite";
import { Task } from "../types";

export const createTaskController = async (c: Context, db: Database) => {
  const userId = c.get("jwtPayload").userId;

  if (!userId) {
    return c.json(
      {
        error: "Anauthenticated user",
        message: "Anauthenticated user",
      },
      404
    );
  }

  const userRole = c.get("jwtPayload").role;
  const { title, description, user_id, status } = await c.req.json();

  if (userRole !== "admin") {
    return c.json(
      {
        error: "You are not authorized to create tasks",
        message: "You are not authorized to create tasks",
      },
      401
    );
  }

  if (userId !== user_id) {
    return c.json(
      {
        error: "You are not authorized to create tasks for this user",
        message: "You are not authorized to create tasks for this user",
      },
      401
    );
  }

  try {
    const result = db
      .query(
        "INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?) RETURNING *"
      )
      .get(user_id, title, description, status) as Task;

    return c.json(result, 201);
  } catch (error) {
    console.log(error);

    return c.json(
      {
        error: "Error creating task",
        message: "Error creating task",
      },
      500
    );
  }
};

export const getAllTasksController = async (c: Context, db: Database) => {
  try {
    const result = db.query("SELECT * FROM tasks").all() as Task[];

    return c.json(result, 200);
  } catch (error) {
    console.log(error);

    return c.json(
      {
        error: "Error getting tasks",
        message: "Error getting tasks",
      },
      500
    );
  }
};

export const getTaskByIdController = async (c: Context, db: Database) => {
  const { id } = c.req.param();

  try {
    const result = db.query("SELECT * FROM tasks WHERE id = ?").get(id) as
      | Task
      | undefined;

    if (!result) {
      return c.json(
        {
          error: "Task not found",
          message: "Task not found",
        },
        404
      );
    }

    return c.json(result, 200);
  } catch (error) {
    console.log(error);

    return c.json(
      {
        error: "Error getting task",
        message: "Error getting task",
      },
      500
    );
  }
};

export const updateTaskByIdController = async (c: Context, db: Database) => {
  const userId = c.get("jwtPayload").userId;
  const userRole = c.get("jwtPayload").role;
  const { id } = c.req.param();
  const { user_id } = await c.req.json();

  if (!userId) {
    return c.json(
      {
        error: "Anauthenticated user",
        message: "Anauthenticated user",
      },
      404
    );
  }

  if (userRole !== "admin") {
    return c.json(
      {
        error: "You are not authorized to update tasks",
        message: "You are not authorized to update tasks",
      },
      401
    );
  }

  if (userId !== user_id) {
    return c.json(
      {
        error: "You are not authorized to update tasks for this user",
        message: "You are not authorized to update tasks for this user",
      },
      401
    );
  }

  const { title, description, status } = await c.req.json();

  try {
    const task = db.query("SELECT * FROM tasks WHERE id = ?").get(id) as
      | Task
      | undefined;

    if (!task) {
      return c.json(
        {
          error: "Task not found",
          message: "Task not found",
        },
        404
      );
    }

    const result = db
      .query(
        "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? RETURNING *"
      )
      .get(
        title || task.title,
        description !== undefined ? description : task.description,
        status || task.status,
        id
      ) as Task;

    return c.json(result, 200);
  } catch (error) {
    console.log(error);

    return c.json(
      {
        error: "Error updating task",
        message: "Error updating task",
      },
      500
    );
  }
};
export const deleteTaskByIdController = async (c: Context, db: Database) => {
  const userId = c.get("jwtPayload").userId;
  const userRole = c.get("jwtPayload").role;
  const { id } = c.req.param();

  if (!userId) {
    return c.json(
      {
        error: "Anauthenticated user",
        message: "Anauthenticated user",
      },
      404
    );
  }

  if (userRole !== "admin") {
    return c.json(
      {
        error: "You are not authorized to delete tasks",
        message: "You are not authorized to delete tasks",
      },
      401
    );
  }

  try {
    const result = db.query("DELETE FROM tasks WHERE id = ?").run(id);

    if (result.changes === 0) {
      return c.json(
        {
          error: "Task not found",
          message: "Task not found",
        },
        404
      );
    }

    return c.json({ message: "Task deleted successfully" }, 200);
  } catch (error) {
    console.log(error);

    return c.json(
      {
        error: "Error deleting task",
        message: "Error deleting task",
      },
      500
    );
  }
};
