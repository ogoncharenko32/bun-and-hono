import type { Context } from "hono";
import { Database } from "bun:sqlite";
import { User } from "../types";
import { password as bunPassword } from "bun";
import { sign } from "hono/jwt";

export const registerController = async (c: Context, db: Database) => {
  const { username, password, role = "user" } = await c.req.json();

  if (!username || !password) {
    return c.json(
      {
        error: "Username and password are required",
        message: "Username and password are required",
      },
      400
    );
  }

  if (!["admin", "user"].includes(role)) {
    return c.json(
      {
        error: "Role must be admin or user",
        message: "Role must be admin or user",
      },
      400
    );
  }

  try {
    const existingUser = db
      .query("SELECT * FROM users WHERE username = ?")
      .get(username) as User | undefined;

    if (existingUser) {
      return c.json(
        {
          error: "User already exists",
          message: "User already exists",
        },
        400
      );
    }
    const hashedPassword = await bunPassword.hash(password);

    db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [
      username,
      hashedPassword,
      role,
    ]);

    return c.json(
      {
        message: "User created successfully",
        data: {
          username,
          role,
        },
      },
      201
    );
  } catch (error) {
    console.log(error);

    return c.json(
      {
        error: "Internal server error",
        message: "Error creating user",
      },
      500
    );
  }
};

export const loginController = async (c: Context, db: Database) => {
  const { username, password } = await c.req.json();

  if (!username || !password) {
    return c.json(
      {
        error: "Username and password are required",
        message: "Username and password are required",
      },
      400
    );
  }

  try {
    const user = db
      .query("SELECT * FROM users WHERE username = ?")
      .get(username) as User | undefined;

    if (!user) {
      return c.json(
        {
          error: "User not found",
          message: "User not found",
        },
        404
      );
    }

    const isPasswordValid = await bunPassword.verify(password, user.password);

    if (!isPasswordValid) {
      return c.json(
        {
          error: "Invalid credentials",
          message: "Invalid credentials",
        },
        401
      );
    }

    const token = await sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET || "secret"
    );

    return c.json(
      {
        message: "User logged in successfully",
        data: {
          token,
        },
      },
      200
    );
  } catch (error) {
    console.log(error);

    return c.json(
      {
        error: "Internal server error",
        message: "Error creating user",
      },
      500
    );
  }
};
