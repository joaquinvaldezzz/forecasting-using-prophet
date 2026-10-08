import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Safely exports an array of objects to a downloadable CSV file.
 *
 * @param data - Array of records to export.
 * @param filename - Target filename.
 */
export const exportChartToCSV = (
  data: Record<string, unknown>[],
  filename = "chart-data.csv",
): void => {
  if (data == null || data.length === 0 || data[0] == null) {
    // eslint-disable-next-line no-console
    console.warn("No data available to export to CSV.");
    return;
  }

  const headers = Object.keys(data[0]);
  const formatCell = (val: unknown): string => {
    if (val == null) return '""';
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.map(formatCell).join(","),
    ...data.map((row) => headers.map((header) => formatCell(row[header])).join(",")),
  ].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
};

/**
 * Exports a DOM element containing a chart to a PNG file.
 *
 * @param chartElement - The DOM element to capture.
 * @param filename - Target filename.
 */
export const exportChartToPNG = async (
  chartElement: HTMLElement,
  filename = "chart.png",
): Promise<void> => {
  try {
    const canvas = await html2canvas(chartElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      backgroundColor: null,
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = filename;
    link.click();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error exporting chart to PNG:", error);
  }
};

/**
 * Exports a DOM element containing a chart to a PDF file.
 *
 * @param chartElement - The DOM element to capture.
 * @param filename - Target filename.
 */
export const exportChartToPDF = async (
  chartElement: HTMLElement,
  filename = "chart.pdf",
): Promise<void> => {
  try {
    const canvas = await html2canvas(chartElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });

    const imgData = canvas.toDataURL("image/png");
    // eslint-disable-next-line new-cap
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(filename);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error exporting chart to PDF:", error);
  }
};
