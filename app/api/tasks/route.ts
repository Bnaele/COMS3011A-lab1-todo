import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isOverdue } from "@/lib/overdue";

const VALID_STATUSES = ["Todo", "In-Progress", "Complete"];
const VALID_SORT_FIELDS = ["topic", "status", "dueDate"];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get("sortBy");

  const orderBy =
    sortBy && VALID_SORT_FIELDS.includes(sortBy)
      ? { [sortBy]: "asc" as const }
      : { createdAt: "desc" as const };

  const tasks = await prisma.task.findMany({ orderBy });

  const tasksWithOverdue = tasks.map((task) => ({
    ...task,
    overdue: isOverdue(task.dueDate, task.status, task.archived),
  }));

  return NextResponse.json(tasksWithOverdue);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, dueDate, topic, status } = body;

  if (!title || !dueDate || !topic) {
    return NextResponse.json(
      { error: "title, dueDate, and topic are required" },
      { status: 400 }
    );
  }

  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `status must be one of: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  const task = await prisma.task.create({
    data: {
      title,
      description: description ?? null,
      dueDate: new Date(dueDate),
      topic,
      status: status ?? "Todo",
    },
  });

  return NextResponse.json(task, { status: 201 });
}