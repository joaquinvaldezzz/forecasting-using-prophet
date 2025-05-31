import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export const exportChartToCSV = (data: any[], filename: string = "chart-data.csv") => {
  // Convert data to CSV format
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) => headers.map((header) => row[header]).join(",")),
  ].join("\n");

  // Create and download CSV file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const exportChartToPNG = async (
  chartElement: HTMLElement,
  filename: string = "chart.png",
) => {
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
    console.error("Error exporting chart to PNG:", error);
  }
};

export const exportChartToPDF = async (
  chartElement: HTMLElement,
  filename: string = "chart.pdf",
) => {
  try {
    const canvas = await html2canvas(chartElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(filename);
  } catch (error) {
    console.error("Error exporting chart to PDF:", error);
  }
};
