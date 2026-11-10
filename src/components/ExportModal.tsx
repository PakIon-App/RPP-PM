import React, { useState } from "react";
import { ModulAjar } from "../types";
import { exportModulToPdf, printModulDocument, applyPrintPageStyle } from "../utils/exportPdf";
import { exportModulToWord } from "../utils/exportWord";
import {
  X,
  FileText,
  FileSpreadsheet,
  Printer,
  Download,
  Settings,
  Layers,
  Check,
  FileCheck,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  modul: ModulAjar;
  activeScope?: "ALL" | "MODUL" | "SOAL" | "LKPD" | "MATERI";
  onScopeChange?: (scope: "ALL" | "MODUL" | "SOAL" | "LKPD" | "MATERI") => void;
  onEnsurePreviewMounted?: () => void;
}

export const ExportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  modul,
  activeScope = "ALL",
  onScopeChange,
  onEnsurePreviewMounted,
}) => {
  const [format, setFormat] = useState<"pdf" | "docx" | "print">("pdf");
  const [paperSize, setPaperSize] = useState<"a4" | "letter" | "legal">("a4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [scope, setScope] = useState<"ALL" | "MODUL" | "SOAL" | "LKPD" | "MATERI">(activeScope);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string>("");
  const [exportSuccess, setExportSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleScopeSelect = (newScope: "ALL" | "MODUL" | "SOAL" | "LKPD" | "MATERI") => {
    setScope(newScope);
    onScopeChange?.(newScope);
  };

  const handleExecuteExport = async () => {
    setIsExporting(true);
    setErrorMessage(null);
    setExportSuccess(false);

    const selectedFormat = format;
    const selectedPaper = paperSize;
    const selectedOrient = orientation;
    const selectedScope = scope;

    if (selectedFormat === "print") {
      // For direct browser printing, close modal first so print dialog captures clean page
      onClose();
      setTimeout(() => {
        printModulDocument(selectedPaper, selectedOrient);
      }, 250);
      setIsExporting(false);
      return;
    }

    try {
      if (selectedFormat === "docx") {
        setExportStatus("Menyusun berkas Microsoft Word (.docx)...");
        await exportModulToWord(modul, {
          paperSize: selectedPaper,
          orientation: selectedOrient,
          scope: selectedScope,
        });
        setExportSuccess(true);
        setExportStatus("Berkas Word (.docx) berhasil diunduh!");
        setTimeout(() => {
          onClose();
          setIsExporting(false);
          setExportSuccess(false);
        }, 1200);
      } else if (selectedFormat === "pdf") {
        setExportStatus("Merender dan menyusun berkas PDF...");
        onEnsurePreviewMounted?.();

        // Brief delay to allow DOM styles/layout to settle if view was switched
        await new Promise((resolve) => setTimeout(resolve, 200));

        const result = await exportModulToPdf(
          "modul-preview-document",
          modul.title || "Modul_Ajar_Merdeka",
          { paperSize: selectedPaper, orientation: selectedOrient }
        );

        if (result.success) {
          setExportSuccess(true);
          setExportStatus("Berkas PDF berhasil diunduh!");
          setTimeout(() => {
            onClose();
            setIsExporting(false);
            setExportSuccess(false);
          }, 1200);
        } else {
          setErrorMessage(
            result.error ||
              "Gagal membuat PDF dokumen. Anda juga dapat menggunakan opsi 'Cetak Langsung' untuk Simpan sebagai PDF."
          );
          setIsExporting(false);
        }
      }
    } catch (err: any) {
      console.error("Export error:", err);
      setErrorMessage(
        err?.message ||
          "Terjadi kesalahan saat memproses ekspor berkas. Silakan coba kembali."
      );
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn no-print">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sky-300">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Opsi Ekspor & Cetak Dokumen</h3>
              <p className="text-xs text-sky-200/80">
                Pilih format berkas, ukuran kertas (A4/Letter/Legal), dan bagian dokumen.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh] text-xs sm:text-sm">
          {/* 1. FORMAT SELECTION */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-sky-600" />
              1. Format Berkas (File Format)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormat("pdf")}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer ${
                  format === "pdf"
                    ? "border-sky-600 bg-sky-50 text-sky-950 font-bold ring-2 ring-sky-500/30"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                }`}
              >
                <div className={`p-2 rounded-lg ${format === "pdf" ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs">PDF Document (.pdf)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat("docx")}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer ${
                  format === "docx"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-950 font-bold ring-2 ring-indigo-500/30"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                }`}
              >
                <div className={`p-2 rounded-lg ${format === "docx" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <span className="text-xs">Microsoft Word (.docx)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat("print")}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer ${
                  format === "print"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/30"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                }`}
              >
                <div className={`p-2 rounded-lg ${format === "print" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                  <Printer className="w-5 h-5" />
                </div>
                <span className="text-xs">Cetak Langsung (Print)</span>
              </button>
            </div>
          </div>

          {/* 2. PAPER SIZE SELECTION */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-sky-600" />
              2. Ukuran Kertas (Paper Size)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaperSize("a4")}
                className={`p-3 rounded-xl border flex flex-col items-start gap-1 transition cursor-pointer ${
                  paperSize === "a4"
                    ? "border-sky-600 bg-sky-50/70 text-sky-950 font-bold"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs">A4 (Standar)</span>
                  {paperSize === "a4" && <Check className="w-4 h-4 text-sky-600" />}
                </div>
                <span className="text-[11px] text-slate-500 font-normal">210 x 297 mm</span>
              </button>

              <button
                type="button"
                onClick={() => setPaperSize("letter")}
                className={`p-3 rounded-xl border flex flex-col items-start gap-1 transition cursor-pointer ${
                  paperSize === "letter"
                    ? "border-sky-600 bg-sky-50/70 text-sky-950 font-bold"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs">Letter</span>
                  {paperSize === "letter" && <Check className="w-4 h-4 text-sky-600" />}
                </div>
                <span className="text-[11px] text-slate-500 font-normal">216 x 279 mm</span>
              </button>

              <button
                type="button"
                onClick={() => setPaperSize("legal")}
                className={`p-3 rounded-xl border flex flex-col items-start gap-1 transition cursor-pointer ${
                  paperSize === "legal"
                    ? "border-sky-600 bg-sky-50/70 text-sky-950 font-bold"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs">Legal (F4/Folio)</span>
                  {paperSize === "legal" && <Check className="w-4 h-4 text-sky-600" />}
                </div>
                <span className="text-[11px] text-slate-500 font-normal">216 x 356 mm</span>
              </button>
            </div>
          </div>

          {/* 3. ORIENTATION */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              3. Orientasi Halaman
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrientation("portrait")}
                className={`p-2.5 rounded-xl border text-center transition cursor-pointer font-semibold ${
                  orientation === "portrait"
                    ? "border-sky-600 bg-sky-50 text-sky-950"
                    : "border-slate-200 text-slate-700"
                }`}
              >
                Potret (Vertical / Portrait)
              </button>

              <button
                type="button"
                onClick={() => setOrientation("landscape")}
                className={`p-2.5 rounded-xl border text-center transition cursor-pointer font-semibold ${
                  orientation === "landscape"
                    ? "border-sky-600 bg-sky-50 text-sky-950"
                    : "border-slate-200 text-slate-700"
                }`}
              >
                Lanskap (Horizontal / Landscape)
              </button>
            </div>
          </div>

          {/* 4. DOCUMENT SCOPE */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-sky-600" />
              4. Bagian Dokumen Yang Di-Ekspor
            </label>
            <select
              value={scope}
              onChange={(e) => handleScopeSelect(e.target.value as any)}
              disabled={isExporting}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white font-medium text-slate-900 disabled:opacity-60"
            >
              <option value="ALL">📦 Paket Lengkap (Modul Ajar + Soal + LKPD + Materi Singkat)</option>
              <option value="MODUL">📄 Modul Ajar Utama Saja</option>
              <option value="SOAL">❓ Bank Soal Asesmen (Pilihan Ganda & Uraian)</option>
              <option value="LKPD">📝 LKPD Siswa (Semua Pertemuan)</option>
              <option value="MATERI">📖 Materi Singkat Pembelajaran (Semua Pertemuan)</option>
            </select>
          </div>

          {/* STATUS NOTIFICATIONS */}
          {isExporting && (
            <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl flex items-center gap-3 text-sky-900">
              <div className="w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <span className="text-xs font-semibold">{exportStatus || "Sedang memproses ekspor berkas..."}</span>
            </div>
          )}

          {exportSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-900 animate-fadeIn">
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold">{exportStatus}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5 text-rose-900 animate-fadeIn">
              <p className="text-xs font-bold flex items-center gap-1.5 text-rose-700">
                <span>⚠️</span> {errorMessage}
              </p>
              <p className="text-[11px] text-rose-600 leading-normal">
                Tips: Anda juga dapat menggunakan opsi <strong>Cetak Langsung (Print)</strong> lalu pilih tujuan <strong>"Save as PDF" / "Simpan sebagai PDF"</strong> di browser.
              </p>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleExecuteExport}
            disabled={isExporting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold shadow-md shadow-sky-600/30 flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isExporting
              ? "Memproses..."
              : format === "docx"
              ? "Unduh Word (.docx)"
              : format === "pdf"
              ? `Unduh PDF (${paperSize.toUpperCase()})`
              : "Buka Jendela Cetak"}
          </button>
        </div>
      </div>
    </div>
  );
};
