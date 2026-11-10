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
): Promise<{ success: boolean; error?: string }> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Elemen dengan ID "${elementId}" tidak ditemukan.`);
    return {
      success: false,
      error: `Elemen dokumen tidak ditemukan di layar. Pastikan tampilan pratinjau dokumen sedang aktif.`,
    };
  }

  const paperFormat = options?.paperSize || "a4";
  const orientation = options?.orientation || "portrait";

  applyPrintPageStyle(paperFormat, orientation);

  // Temporarily remove shadow and border for clean PDF rendering
  const prevBoxShadow = element.style.boxShadow;
  const prevBorder = element.style.border;
  element.style.boxShadow = "none";
  element.style.border = "none";

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // 2x high resolution for clear text & crisp table borders
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: 0,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({
      orientation: orientation,
      unit: "mm",
      format: paperFormat,
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pdfHeight;

    // Use a small 3mm threshold to avoid empty trailing page due to rounding
    while (heightLeft > 3) {
      position = heightLeft - imgHeight;
      pdf.addPage(paperFormat, orientation);
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pdfHeight;
    }

    const cleanFileName = `${(filename || "Modul_Ajar_Merdeka").replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
    pdf.save(cleanFileName);
    return { success: true };
  } catch (err: any) {
    console.error("PDF Direct Canvas generation failed:", err);
    return {
      success: false,
      error: err?.message || "Gagal merender PDF dokumen.",
    };
  } finally {
    element.style.boxShadow = prevBoxShadow;
    element.style.border = prevBorder;
  }
};

export const printModulDocument = (
  paperSize: "a4" | "letter" | "legal" = "a4",
  orientation: "portrait" | "landscape" = "portrait"
) => {
  applyPrintPageStyle(paperSize, orientation);
  window.print();
};
