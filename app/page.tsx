"use client";

import { useEffect, useState, useCallback } from "react";
import TaskForm, { TaskFormValues } from "./components/TaskForm";
import TaskList from "./components/TaskList";
import type { Task, TaskStatus } from "@/lib/types";

type SortField = "topic" | "status" | "dueDate";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortField>("dueDate");
  const [showArchived, setShowArchived] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/tasks?sortBy=${sortBy}`);
    const data = await res.json();
    setTasks(data);
    setLoading(false);
  }, [sortBy]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function handleCreate(values: TaskFormValues) {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    await fetchTasks();
  }

  async function handleEditSave(values: TaskFormValues) {
    if (!editingTask) return;
    await fetch(`/api/tasks/${editingTask.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setEditingTask(null);
    await fetchTasks();
  }

  async function handleArchive(id: string) {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: true }),
    });
    await fetchTasks();
  }

  const visibleTasks = tasks.filter((t) => (showArchived ? true : !t.archived));

  return (
    <main className="max-w-2xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Todo</h1>

      {editingTask ? (
        <TaskForm
          submitLabel="Save changes"
          initialValues={{
            title: editingTask.title,
            description: editingTask.description ?? "",
            dueDate: editingTask.dueDate.slice(0, 10),
            topic: editingTask.topic,
            status: editingTask.status as TaskStatus,
          }}
          onSubmit={handleEditSave}
          onCancel={() => setEditingTask(null)}
        />
      ) : (
        <TaskForm submitLabel="Add task" onSubmit={handleCreate} />
      )}

      <div className="flex items-center gap-4">
        <label className="text-sm">
          Sort by:{" "}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortField)}
            className="border rounded px-2 py-1"
          >
            <option value="dueDate">Due Date</option>
            <option value="topic">Topic</option>
            <option value="status">Status</option>
          </select>
        </label>
        <label className="text-sm flex items-center gap-1">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
          />
          Show archived
        </label>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <TaskList tasks={visibleTasks} onArchive={handleArchive} onEdit={setEditingTask} />
      )}
    </main>
  );
}