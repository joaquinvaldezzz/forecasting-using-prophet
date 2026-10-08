import { describe, expect, it } from "vitest";

import { cn, formatAsCurrency } from "../utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    expect(cn("px-2 py-1", "bg-card")).toBe("px-2 py-1 bg-card");
  });

  it("handles conditional class names and falsy values", () => {
    expect(cn("p-2", false && "hidden", null, undefined, "text-center")).toBe("p-2 text-center");
  });

  it("resolves tailwind class conflicts using tailwind-merge", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("text-primary", "text-destructive")).toBe("text-destructive");
  });
});

describe("formatAsCurrency utility", () => {
  it("formats standard positive numbers as PHP currency", () => {
    const formatted = formatAsCurrency(1234.56);
    expect(formatted).toMatch(/₱|PHP/);
    expect(formatted).toContain("1,234.56");
  });

  it("formats zero as PHP currency", () => {
    const formatted = formatAsCurrency(0);
    expect(formatted).toMatch(/₱|PHP/);
    expect(formatted).toContain("0.00");
  });

  it("formats decimal values with correct decimal places", () => {
    const formatted = formatAsCurrency(45.5);
    expect(formatted).toContain("45.50");
  });
});
