"use client";

import { useState, FormEvent } from "react";
import type { TaskStatus } from "@/lib/types";

export interface TaskFormValues {
  title: string;
  description: string;
  dueDate: string;
  topic: string;
  status: TaskStatus;
}

interface TaskFormProps {
  initialValues?: TaskFormValues;
  submitLabel: string;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel?: () => void;
}

const STATUSES: TaskStatus[] = ["Todo", "In-Progress", "Complete"];

export default function TaskForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [dueDate, setDueDate] = useState(initialValues?.dueDate ?? "");
  const [topic, setTopic] = useState(initialValues?.topic ?? "");
  const [status, setStatus] = useState<TaskStatus>(initialValues?.status ?? "Todo");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title || !dueDate || !topic) return;
    setSubmitting(true);
    await onSubmit({ title, description, dueDate, topic, status });
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 border border-gray-300 rounded-lg p-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Title</label>
        <input
          className="border rounded px-2 py-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="border rounded px-2 py-1"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-medium">Due Date</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-medium">Topic</label>
          <input
            className="border rounded px-2 py-1"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-medium">Status</label>
          <select
            className="border rounded px-2 py-1"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white rounded px-3 py-1 disabled:opacity-50"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="border rounded px-3 py-1">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}