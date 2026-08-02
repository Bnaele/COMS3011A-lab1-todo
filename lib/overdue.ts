export function isOverdue(dueDate: Date, status: string, archived: boolean): boolean {
  return !archived && status !== "Complete" && new Date(dueDate) < new Date();
}