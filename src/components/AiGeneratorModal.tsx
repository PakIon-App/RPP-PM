import React, { useState } from "react";
import { ModulAjar, DAFTAR_FASE, DIMENSI_PROFIL_LULUSAN } from "../types";
import { extractFileContent } from "../utils/fileExtractor";
import { Sparkles, X, Wand2, CheckCircle2, Upload, FileText, Trash2, FileUp, CheckSquare, Square } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (newModul: ModulAjar) => void;
}

export const AiGeneratorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onGenerated,
}) => {
  const [mataPelajaran, setMataPelajaran] = useState("");
  const [topikPembelajaran, setTopikPembelajaran] = useState("");
  const [fase, setFase] = useState("Fase D");
  const [kelas, setKelas] = useState("VII (Tujuh)");
  const [jumlahPertemuan, setJumlahPertemuan] = useState(2);
  const [alokasiWaktu, setAlokasiWaktu] = useState("4 x 45 Menit");
  const [namaSekolah, setNamaSekolah] = useState("SMP Negeri 1");
  const [namaGuru, setNamaGuru] = useState("");
  const [namaKepalaSekolah, setNamaKepalaSekolah] = useState("");
  const [catatan, setCatatan] = useState("");
  const [selectedDpl, setSelectedDpl] = useState<string[]>(["DPL3", "DPL4", "DPL5", "DPL6"]);

  const toggleDpl = (id: string) => {
    if (selectedDpl.includes(id)) {
      setSelectedDpl(selectedDpl.filter((item) => item !== id));
    } else {
      setSelectedDpl([...selectedDpl, id]);
    }
  };

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<{
    fileName: string;
    fileSize: string;
    text: string;
  } | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsReadingFile(true);
    try {
      const extracted = await extractFileContent(file);
      setUploadedFile({
        fileName: extracted.fileName,
        fileSize: extracted.fileSize,
        text: extracted.text,
      });
      // Auto fill topic or subject if empty
      if (!topikPembelajaran) {
        const cleanName = extracted.fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setTopikPembelajaran(cleanName);
      }
    } catch (err) {
      console.error("Failed to read file:", err);
      alert("Gagal membaca file yang diunggah.");
    } finally {
      setIsReadingFile(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mataPelajaran || !topikPembelajaran) {
      alert("Mohon isi Mata Pelajaran dan Topik Pembelajaran.");
      return;
    }

    setIsLoading(true);
    setLoadingStep(1);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 2000);

    try {
      const response = await fetch("/api/generate-modul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mataPelajaran,
          topikPembelajaran,
          fase,
          kelas,
          alokasiWaktu: alokasiWaktu || `${jumlahPertemuan * 2} x 45 Menit`,
          jumlahPertemuan,
          namaSekolah,
          namaGuru: namaGuru || "Guru Mata Pelajaran",
          namaKepalaSekolah: namaKepalaSekolah || "Kepala Sekolah",
          catatanTambahan: catatan,
          dimensiProfilLulusan: selectedDpl,
          uploadedMaterialText: uploadedFile?.text || "",
          uploadedFileName: uploadedFile?.fileName || "",
        }),
      });

      const resData = await response.json();
      clearInterval(stepInterval);

        if (resData.success && resData.data) {
          const generatedData = resData.data;

          const lkpdList = generatedData.pendukung?.lkpdList || [];
          const mainLkpd = generatedData.pendukung?.lkpd || lkpdList[0] || undefined;

          const newModul: ModulAjar = {
            id: `modul-ai-${Date.now()}`,
            title: `Modul Ajar ${mataPelajaran} - ${topikPembelajaran}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            identitas: {
              ...generatedData.identitas,
              jumlahPertemuan,
              tanggalDokumen: `${new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}`,
            },
            identifikasi: {
              ...generatedData.identifikasi,
              materialFile: uploadedFile
                ? {
                    fileName: uploadedFile.fileName,
                    fileSize: uploadedFile.fileSize,
                    extractedText: uploadedFile.text.substring(0, 500) + "...",
                  }
                : undefined,
            },
            desainPembelajaran: generatedData.desainPembelajaran,
            pengalamanBelajar: generatedData.pengalamanBelajar,
            asesmenPembelajaran: generatedData.asesmenPembelajaran,
            pendukung: generatedData.pendukung
              ? {
                  ...generatedData.pendukung,
                  lkpd: mainLkpd,
                  lkpdList: lkpdList.length > 0 ? lkpdList : (mainLkpd ? [mainLkpd] : []),
                }
              : undefined,
          };

          onGenerated(newModul);
          onClose();
      } else {
        alert(resData.error || "Gagal menghasilkan modul ajar.");
      }
    } catch (err) {
      console.error("AI Generation Error:", err);
      alert("Terjadi masalah koneksi saat menghubungi server AI.");
    } finally {
      setIsLoading(false);
      setLoadingStep(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
              <Sparkles className="w-5 h-5 fill-indigo-200 text-indigo-100" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Buat Modul Ajar Otomatis (AI)</h3>
              <p className="text-xs text-indigo-200">
                Sistem AI akan menyusun Modul Ajar, Kegiatan per Pertemuan, Soal Asesmen, LKPD, & Materi Singkat.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        {isLoading ? (
          <div className="p-8 text-center space-y-6 flex-1 flex flex-col items-center justify-center">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <Wand2 className="w-6 h-6 text-indigo-700 absolute" />
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-base">
                Gemini AI Sedang Menyusun Paket Pembelajaran...
              </h4>
              <p className="text-xs text-slate-500">
                Menyusun {jumlahPertemuan} Pertemuan, Modul Utama, Bank Soal, & LKPD Siswa
              </p>
            </div>

            <div className="max-w-sm w-full text-left space-y-2 text-xs bg-indigo-50/80 p-4 rounded-xl border border-indigo-100">
              <div className={`flex items-center gap-2 ${loadingStep >= 1 ? "text-indigo-900 font-semibold" : "text-slate-400"}`}>
                <CheckCircle2 className={`w-4 h-4 ${loadingStep >= 1 ? "text-indigo-600" : "text-slate-300"}`} />
                <span>1. Menyiapkan CP & {jumlahPertemuan} Pertemuan Langkah Pembelajaran</span>
              </div>
              <div className={`flex items-center gap-2 ${loadingStep >= 2 ? "text-indigo-900 font-semibold" : "text-slate-400"}`}>
                <CheckCircle2 className={`w-4 h-4 ${loadingStep >= 2 ? "text-indigo-600" : "text-slate-300"}`} />
                <span>2. Memproses Bahan Ajar File Upload & Analisis Materi</span>
              </div>
              <div className={`flex items-center gap-2 ${loadingStep >= 3 ? "text-indigo-900 font-semibold" : "text-slate-400"}`}>
                <CheckCircle2 className={`w-4 h-4 ${loadingStep >= 3 ? "text-indigo-600" : "text-slate-300"}`} />
                <span>3. Menggenerate Bank Soal Pilihan Ganda, Uraian, & LKPD</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm overflow-y-auto flex-1">
            {/* UPLOAD FILE SECTION */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <label className="block font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-indigo-600" />
                Unggah File Bahan / Materi Ajar (Opsional)
              </label>
              <p className="text-[11px] text-slate-500">
                Upload PDF, Word, Teks (.txt/.md), atau gambar ringkasan materi. AI akan membaca isinya untuk menyusun modul & LKPD yang akurat.
              </p>

              {uploadedFile ? (
                <div className="flex items-center justify-between p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg text-xs">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-slate-900 truncate">{uploadedFile.fileName}</p>
                      <p className="text-[10px] text-slate-500">{uploadedFile.fileSize} • Terbaca oleh AI</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-lg bg-white cursor-pointer transition text-center hover:bg-indigo-50/30">
                  <FileUp className="w-6 h-6 text-indigo-500 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">
                    {isReadingFile ? "Membaca berkas..." : "Klik untuk memilih file bahan ajar"}
                  </span>
                  <span className="text-[10px] text-slate-400">PDF, TXT, DOC, MD, PNG, JPG</span>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.txt,.doc,.docx,.md,.csv,.json,.png,.jpg,.jpeg"
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mata Pelajaran <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={mataPelajaran}
                  onChange={(e) => setMataPelajaran(e.target.value)}
                  placeholder="Contoh: Informatika / IPA / Bahasa Indonesia"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Fase Belajar <span className="text-red-500">*</span>
                </label>
                <select
                  value={fase}
                  onChange={(e) => setFase(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {DAFTAR_FASE.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Topik / Materi Pembelajaran Utama <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={topikPembelajaran}
                onChange={(e) => setTopikPembelajaran(e.target.value)}
                placeholder="Contoh: Berpikir Komputasional / Ekosistem / Panca Indra"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* DIMENSI PROFIL LULUSAN (MULTI-SELECT) */}
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-800 text-xs">
                  Dimensi Profil Lulusan (Bisa Pilih Lebih dari Satu)
                </label>
                <span className="text-[11px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {selectedDpl.length} Dimensi Terpilih
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Pilih dimensi karakter & kompetensi yang ingin dikembangkan pada modul ajar ini:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DIMENSI_PROFIL_LULUSAN.map((dpl) => {
                  const isChecked = selectedDpl.includes(dpl.id);
                  return (
                    <button
                      type="button"
                      key={dpl.id}
                      onClick={() => toggleDpl(dpl.id)}
                      className={`flex items-start gap-2 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        isChecked
                          ? "bg-indigo-50 border-indigo-500 text-indigo-950 font-semibold"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-bold text-[11px] text-indigo-900 block">{dpl.id}</span>
                        <span className="text-[10px] leading-tight block text-slate-700">{dpl.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* JUMLAH PERTEMUAN & ALOKASI WAKTU */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
              <div>
                <label className="block font-bold text-indigo-950 mb-1">
                  Jumlah Pertemuan Pembelajaran <span className="text-red-500">*</span>
                </label>
                <select
                  value={jumlahPertemuan}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setJumlahPertemuan(val);
                    setAlokasiWaktu(`${val * 2} x 45 Menit (${val} Pertemuan)`);
                  }}
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-semibold text-indigo-900"
                >
                  {Array.from({ length: 35 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} Pertemuan {num === 1 ? "(Single Session)" : `(${num} Sesi Pembelajaran)`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-indigo-950 mb-1">
                  Alokasi Waktu Keseluruhan
                </label>
                <input
                  type="text"
                  value={alokasiWaktu}
                  onChange={(e) => setAlokasiWaktu(e.target.value)}
                  placeholder="Contoh: 4 x 45 Menit (2 Pertemuan)"
                  className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kelas</label>
                <input
                  type="text"
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  placeholder="Contoh: VII / X"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Sekolah</label>
                <input
                  type="text"
                  value={namaSekolah}
                  onChange={(e) => setNamaSekolah(e.target.value)}
                  placeholder="Nama sekolah Anda"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Guru (Opsional)</label>
                <input
                  type="text"
                  value={namaGuru}
                  onChange={(e) => setNamaGuru(e.target.value)}
                  placeholder="Nama lengkap pengampu"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Kepala Sekolah (Opsional)</label>
                <input
                  type="text"
                  value={namaKepalaSekolah}
                  onChange={(e) => setNamaKepalaSekolah(e.target.value)}
                  placeholder="Nama Kepala Sekolah"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan / Model (Opsional)</label>
              <textarea
                rows={2}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Misal: Gunakan metode Problem Based Learning dengan tugas kelompok..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center gap-2 shadow-md hover:shadow-indigo-200 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-200 fill-indigo-200" />
                Hasilkan Modul Ajar + Soal + LKPD
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
