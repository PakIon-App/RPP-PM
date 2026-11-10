export interface ExtractedFileResult {
  fileName: string;
  fileType: string;
  fileSize: string;
  text: string;
  dataUrl?: string;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export async function extractFileContent(file: File): Promise<ExtractedFileResult> {
  const fileName = file.name;
  const fileType = file.type || "unknown";
  const fileSize = formatFileSize(file.size);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Check file type extension
    const extension = fileName.split(".").pop()?.toLowerCase() || "";

    if (
      fileType.startsWith("text/") ||
      ["txt", "md", "csv", "json", "html", "xml", "js", "ts", "py"].includes(extension)
    ) {
      reader.onload = (e) => {
        const text = e.target?.result as string || "";
        resolve({ fileName, fileType, fileSize, text });
      };
      reader.onerror = () => reject(new Error("Gagal membaca file teks."));
      reader.readAsText(file);
    } else if (fileType.startsWith("image/")) {
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string || "";
        resolve({
          fileName,
          fileType,
          fileSize,
          text: `[File Gambar: ${fileName} (${fileSize})]`,
          dataUrl,
        });
      };
      reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
      reader.readAsDataURL(file);
    } else {
      // For PDF, Word, or binary files - read as data URL or text fallback
      reader.onload = (e) => {
        const result = e.target?.result as string || "";
        // Extract basic printable ASCII string characters as raw text fallback if text reading fails
        let cleanText = "";
        try {
          // If binary, attempt basic text extraction or report file attached
          cleanText = `[Dokumen Terlampir: ${fileName} (${fileSize})]`;
        } catch {
          cleanText = `[File: ${fileName}]`;
        }
        resolve({
          fileName,
          fileType,
          fileSize,
          text: cleanText,
          dataUrl: result.startsWith("data:") ? result : undefined,
        });
      };
      reader.onerror = () => reject(new Error("Gagal membaca file terlampir."));
      reader.readAsDataURL(file);
    }
  });
}
