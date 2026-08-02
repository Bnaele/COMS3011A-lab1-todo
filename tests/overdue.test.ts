import { describe, it, expect } from "vitest";
import { isOverdue } from "../lib/overdue";

describe("isOverdue", () => {
  it("returns true for a past due date with a non-complete status", () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24);
    expect(isOverdue(pastDate, "Todo", false)).toBe(true);
  });

  it("returns false for a future due date", () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24);
    expect(isOverdue(futureDate, "Todo", false)).toBe(false);
  });

  it("returns false when status is Complete, even if the due date has passed", () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24);
    expect(isOverdue(pastDate, "Complete", false)).toBe(false);
  });

  it("returns false when the task is archived, even if the due date has passed", () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24);
    expect(isOverdue(pastDate, "In-Progress", true)).toBe(false);
  });
});