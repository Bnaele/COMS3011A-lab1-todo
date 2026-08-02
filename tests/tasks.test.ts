import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "../lib/prisma";
import { isOverdue } from "../lib/overdue";

beforeEach(async () => {
  await prisma.task.deleteMany();
});

describe("Task persistence", () => {
  it("creates a task with default status Todo and archived false", async () => {
    const task = await prisma.task.create({
      data: {
        title: "Write report",
        dueDate: new Date("2026-12-01"),
        topic: "ECON2001A",
      },
    });

    expect(task.status).toBe("Todo");
    expect(task.archived).toBe(false);
  });

  it("archiving a task means it is never flagged as overdue, regardless of due date", async () => {
    const pastDate = new Date("2020-01-01");
    const task = await prisma.task.create({
      data: {
        title: "Old task",
        dueDate: pastDate,
        topic: "STAT2012A",
      },
    });

    const archived = await prisma.task.update({
      where: { id: task.id },
      data: { archived: true },
    });

    expect(archived.archived).toBe(true);
    expect(isOverdue(archived.dueDate, archived.status, archived.archived)).toBe(false);
  });

  it("sorts tasks by topic in ascending order", async () => {
    await prisma.task.create({
      data: { title: "B task", dueDate: new Date(), topic: "Zebra" },
    });
    await prisma.task.create({
      data: { title: "A task", dueDate: new Date(), topic: "Apple" },
    });

    const tasks = await prisma.task.findMany({ orderBy: { topic: "asc" } });

    expect(tasks[0].topic).toBe("Apple");
    expect(tasks[1].topic).toBe("Zebra");
  });
});