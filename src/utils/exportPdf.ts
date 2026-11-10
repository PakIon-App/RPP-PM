import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export interface PdfExportOptions {
  paperSize?: "a4" | "letter" | "legal";
  orientation?: "portrait" | "landscape";
}

export const applyPrintPageStyle = (
  paperSize: "a4" | "letter" | "legal" = "a4",
  orientation: "portrait" | "landscape" = "portrait"
) => {
  let styleEl = document.getElementById("dynamic-print-paper-style") as HTMLStyleElement;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "dynamic-print-paper-style";
    document.head.appendChild(styleEl);
  }

  let sizeStr = "A4";
  if (paperSize === "letter") sizeStr = "letter";
  if (paperSize === "legal") sizeStr = "legal";

  styleEl.innerHTML = `
    @media print {
      @page {
        size: ${sizeStr} ${orientation};
        margin: 10mm 12mm 10mm 12mm;
      }
    }
  `;
};

export const exportModulToPdf = async (
  elementId: string,
  filename: string,
  options?: PdfExportOptions
) => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert("Elemen dokumen tidak ditemukan!");
    return;
  }

  const paperFormat = options?.paperSize || "a4";
  const orientation = options?.orientation || "portrait";

  applyPrintPageStyle(paperFormat, orientation);

  try {
    const canvas = await html2canvas(element, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({
      orientation: orientation,
      unit: "mm",
      format: paperFormat,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage(paperFormat, orientation);
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const cleanFileName = `${filename.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
    pdf.save(cleanFileName);
  } catch (err) {
    console.error("PDF Direct Canvas generation failed, falling back to browser print engine:", err);
    window.print();
  }
};

export const printModulDocument = (
  paperSize: "a4" | "letter" | "legal" = "a4",
  orientation: "portrait" | "landscape" = "portrait"
) => {
  applyPrintPageStyle(paperSize, orientation);
  window.print();
};
