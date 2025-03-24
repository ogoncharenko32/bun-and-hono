import type { Server } from "bun";

interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Bob" },
  { id: 4, name: "Alice" },
  { id: 5, name: "Charlie" },
];
interface ApiResponse {
  message: string;
  method: string;
  route: string;
  data?: User | User[];
}

const server: Server = Bun.serve({
  port: 3000,

  fetch(req: Request): Response {
    const url = new URL(req.url);
    const method = req.method;

    let response: ApiResponse = {
      message: "Hello from Bun!",
      method: method,
      route: url.pathname,
    };

    if (url.pathname === "/") {
      if (method === "GET") {
        response.message = "Welcome to Bun!";
      } else {
        response.message = "Invalid method";
      }
    } else if (url.pathname === "/users") {
      switch (method) {
        case "GET":
          response.message = "List of users";
          response.data = users;
          break;
        case "POST":
          response.message = "User created";
          break;
        // case "PUT":
        //   response.message = "User updated";
        //   response.data = req.json();
        //   break;
        // case "DELETE":
        //   response.message = "User deleted";
        //   response.data = req.json();
        //   break;
        default:
          response.message = "Method no allowed for this route";
          break;
      }
    }
    return Response.json(response);
  },
});

console.log(`Listening on http://localhost:${server.port}`);
