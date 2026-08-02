"use client";

import type { Task } from "@/lib/types";

interface TaskListProps {
  tasks: Task[];
  onArchive: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskList({ tasks, onArchive, onEdit }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-gray-500">No tasks to show.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={`border rounded-lg p-3 flex justify-between items-start ${
            task.overdue ? "border-red-400 bg-red-50" : "border-gray-200"
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{task.title}</h3>
              {task.overdue && (
                <span className="text-xs font-medium text-red-600 border border-red-400 rounded px-1.5 py-0.5">
                  Overdue
                </span>
              )}
              {task.archived && (
                <span className="text-xs font-medium text-gray-500 border border-gray-300 rounded px-1.5 py-0.5">
                  Archived
                </span>
              )}
            </div>
            {task.description && (
              <p className="text-sm text-gray-600">{task.description}</p>
            )}
            <p className="text-sm text-gray-500">
              {task.topic} · {task.status} · due {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => onEdit(task)} className="text-sm border rounded px-2 py-1">
              Edit
            </button>
            {!task.archived && (
              <button
                onClick={() => onArchive(task.id)}
                className="text-sm border rounded px-2 py-1"
              >
                Archive
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}