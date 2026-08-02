export type TaskStatus = "Todo" | "In-Progress" | "Complete";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  topic: string;
  status: TaskStatus;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  overdue: boolean;
}