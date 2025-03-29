export type User = {
  id: number;
  username: string;
  password: string;
  role: "admin" | "user";
};

export type Task = {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  created_at: Date;
};
