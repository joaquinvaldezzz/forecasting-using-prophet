import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { exportChartToCSV } from "../chart-export";

describe("exportChartToCSV utility", () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it("handles empty array without crashing", () => {
    expect(() => {
      exportChartToCSV([]);
    }).not.toThrow();
    expect(warnSpy).toHaveBeenCalledWith("No data available to export to CSV.");
  });

  it("handles null/undefined data safely", () => {
    expect(() => {
      // @ts-expect-error testing invalid argument handling
      exportChartToCSV(null);
    }).not.toThrow();
    expect(warnSpy).toHaveBeenCalledWith("No data available to export to CSV.");
  });

  it("exports valid data without error", () => {
    const mockCreateObjectURL = vi.fn().mockReturnValue("blob:mock-url");
    const mockRevokeObjectURL = vi.fn();
    globalThis.URL.createObjectURL = mockCreateObjectURL;
    globalThis.URL.revokeObjectURL = mockRevokeObjectURL;

    const appendChildSpy = vi.spyOn(document.body, "appendChild");
    const removeChildSpy = vi.spyOn(document.body, "removeChild");

    const sampleData = [
      { month: "Jan", price: 100 },
      { month: "Feb", price: 120 },
    ];

    expect(() => {
      exportChartToCSV(sampleData, "test-data.csv");
    }).not.toThrow();

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });
});
