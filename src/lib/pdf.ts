import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function exportElementToPdf(element: HTMLElement, filename: string) {
  if (document.fonts) {
    await document.fonts.ready;
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#F5F6FB",
    logging: false,
    scrollX: 0,
    scrollY: 0,
    width: element.scrollWidth,
    height: element.scrollHeight,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageRatio = pageHeight / pageWidth;
  const sliceHeight = Math.floor(canvas.width * pageRatio);

  let y = 0;
  let pageIndex = 0;
  const epsilon = 4;

  while (y < canvas.height - epsilon) {
    const remainingHeight = canvas.height - y;
    const currentSliceHeight = Math.min(sliceHeight, remainingHeight);

    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeight;

    const ctx = pageCanvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context is not available");

    ctx.fillStyle = "#F5F6FB";
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

    ctx.drawImage(
      canvas,
      0,
      y,
      canvas.width,
      currentSliceHeight,
      0,
      0,
      canvas.width,
      currentSliceHeight
    );

    const imgData = pageCanvas.toDataURL("image/png");

    if (pageIndex > 0) {
      pdf.addPage();
    }

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

    y += sliceHeight;
    pageIndex++;
  }

  pdf.save(filename);
}