import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isOverdue } from "@/lib/overdue";

const VALID_STATUSES = ["Todo", "In-Progress", "Complete"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { title, description, dueDate, topic, status, archived } = body;

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `status must be one of: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (dueDate !== undefined) data.dueDate = new Date(dueDate);
  if (topic !== undefined) data.topic = topic;
  if (status !== undefined) data.status = status;
  if (archived !== undefined) data.archived = archived;

  const task = await prisma.task.update({ where: { id }, data });

  return NextResponse.json({
    ...task,
    overdue: isOverdue(task.dueDate, task.status, task.archived),
  });
}