import React, { useState } from "react";
import {
  ModulAjar,
  DIMENSI_PROFIL_LULUSAN,
  DAFTAR_FASE,
  PertemuanPengalamanBelajar,
  SoalPilihanGanda,
  SoalUraian,
} from "../types";
import { extractFileContent } from "../utils/fileExtractor";
import {
  Sparkles,
  Plus,
  Trash2,
  BookOpen,
  UserCheck,
  LayoutGrid,
  ListOrdered,
  FileCheck2,
  CheckSquare,
  Square,
  Loader2,
  FileCode,
  Upload,
  FileText,
  Calendar,
  Layers,
  HelpCircle,
  FileSpreadsheet,
} from "lucide-react";

interface Props {
  modul: ModulAjar;
  onChange: (updatedModul: ModulAjar) => void;
  onOpenAiGenerator: () => void;
}

export const ModulForm: React.FC<Props> = ({
  modul,
  onChange,
  onOpenAiGenerator,
}) => {
  const [activeTab, setActiveTab] = useState<
    "identitas" | "identifikasi" | "desain" | "langkah" | "asesmen" | "pendukung"
  >("identitas");

  const [activePertemuanIdx, setActivePertemuanIdx] = useState(0);
  const [loadingField, setLoadingField] = useState<string | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isGeneratingSoal, setIsGeneratingSoal] = useState(false);
  const [isGeneratingLkpd, setIsGeneratingLkpd] = useState(false);
  const [isGeneratingMateri, setIsGeneratingMateri] = useState(false);

  // Ensure experience list exists
  const getPertemuanList = (): PertemuanPengalamanBelajar[] => {
    if (modul.pengalamanBelajar?.pertemuanList?.length) {
      return modul.pengalamanBelajar.pertemuanList;
    }
    // Fallback if legacy
    return [
      {
        pertemuanKe: 1,
        alokasiWaktu: modul.identitas.alokasiWaktu || "2 x 45 Menit",
        fokusMateri: modul.desainPembelajaran.topikPembelajaran || "Materi Utama",
        awal: modul.pengalamanBelajar.awal || "",
        intiMemahami: modul.pengalamanBelajar.intiMemahami || [""],
        intiMengaplikasi: modul.pengalamanBelajar.intiMengaplikasi || [""],
        intiMerefleksi: modul.pengalamanBelajar.intiMerefleksi || [""],
        penutup: modul.pengalamanBelajar.penutup || "",
      },
    ];
  };

  const currentPertemuanList = getPertemuanList();

  // Helper function to update nested state
  const updateSection = (section: keyof ModulAjar, key: string, value: any) => {
    onChange({
      ...modul,
      updatedAt: new Date().toISOString(),
      [section]: {
        ...(modul[section] as any),
        [key]: value,
      },
    });
  };

  // Handle File Upload in Material section
  const handleMaterialFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsReadingFile(true);
    try {
      const extracted = await extractFileContent(file);
      onChange({
        ...modul,
        updatedAt: new Date().toISOString(),
        identifikasi: {
          ...modul.identifikasi,
          materialFile: {
            fileName: extracted.fileName,
            fileSize: extracted.fileSize,
            fileType: extracted.fileType,
            extractedText: extracted.text,
          },
        },
      });
    } catch (err) {
      console.error(err);
      alert("Gagal membaca file.");
    } finally {
      setIsReadingFile(false);
    }
  };

  const handleRemoveMaterialFile = () => {
    onChange({
      ...modul,
      updatedAt: new Date().toISOString(),
      identifikasi: {
        ...modul.identifikasi,
        materialFile: undefined,
      },
    });
  };

  // Helper function to toggle DPL checkboxes
  const toggleDpl = (dplId: string) => {
    const current = modul.identifikasi.dimensiProfilLulusan || [];
    const exists = current.includes(dplId);
    const updated = exists ? current.filter((id) => id !== dplId) : [...current, dplId];
    updateSection("identifikasi", "dimensiProfilLulusan", updated);
  };

  // Multi-pertemuan actions
  const setTotalPertemuan = (newCount: number) => {
    const list = [...currentPertemuanList];
    if (newCount > list.length) {
      for (let i = list.length + 1; i <= newCount; i++) {
        list.push({
          pertemuanKe: i,
          alokasiWaktu: "2 x 45 Menit",
          fokusMateri: `Sub-topik Pertemuan ${i}`,
          awal: "1. Orientasi dan apersepsi kontekstual.\n2. Motivasi awal.",
          intiMemahami: ["Siswa mengamati dan mendiskusikan konsep utama."],
          intiMengaplikasi: ["Siswa mengerjakan tantangan LKPD secara berkelompok."],
          intiMerefleksi: ["Siswa mempresentasikan hasil dan merumuskan refleksi."],
          penutup: "Kesimpulan bersama dan arahan pertemuan selanjutnya.",
        });
      }
    } else if (newCount < list.length && newCount >= 1) {
      list.splice(newCount);
    }

    onChange({
      ...modul,
      updatedAt: new Date().toISOString(),
      identitas: {
        ...modul.identitas,
        jumlahPertemuan: newCount,
        alokasiWaktu: `${newCount * 2} x 45 Menit (${newCount} Pertemuan)`,
      },
      pengalamanBelajar: {
        ...modul.pengalamanBelajar,
        jumlahPertemuan: newCount,
        pertemuanList: list,
      },
    });

    if (activePertemuanIdx >= newCount) {
      setActivePertemuanIdx(newCount - 1);
    }
  };

  const updateCurrentPertemuanField = (field: keyof PertemuanPengalamanBelajar, value: any) => {
    const list = [...currentPertemuanList];
    list[activePertemuanIdx] = {
      ...list[activePertemuanIdx],
      [field]: value,
    };

    onChange({
      ...modul,
      updatedAt: new Date().toISOString(),
      pengalamanBelajar: {
        ...modul.pengalamanBelajar,
        pertemuanList: list,
      },
    });
  };

  // Inti step helper for current active pertemuan
  const addIntiStepCurrent = (field: "intiMemahami" | "intiMengaplikasi" | "intiMerefleksi") => {
    const currentList = currentPertemuanList[activePertemuanIdx]?.[field] || [];
    updateCurrentPertemuanField(field, [...currentList, ""]);
  };

  const updateIntiStepCurrent = (
    field: "intiMemahami" | "intiMengaplikasi" | "intiMerefleksi",
    index: number,
    val: string
  ) => {
    const currentList = [...(currentPertemuanList[activePertemuanIdx]?.[field] || [])];
    currentList[index] = val;
    updateCurrentPertemuanField(field, currentList);
  };

  const removeIntiStepCurrent = (
    field: "intiMemahami" | "intiMengaplikasi" | "intiMerefleksi",
    index: number
  ) => {
    const currentList = [...(currentPertemuanList[activePertemuanIdx]?.[field] || [])];
    currentList.splice(index, 1);
    updateCurrentPertemuanField(field, currentList);
  };

  // AI Field Refine Helper
  const handleAiRefineField = async (
    fieldTypeName: string,
    section: keyof ModulAjar,
    fieldKey: string
  ) => {
    setLoadingField(`${section}.${fieldKey}`);
    try {
      const response = await fetch("/api/generate-field", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fieldType: fieldTypeName,
          contextInfo: {
            mataPelajaran: modul.identitas.mataPelajaran,
            fase: modul.identitas.fase,
            kelas: modul.identitas.kelas,
            topikPembelajaran: modul.desainPembelajaran.topikPembelajaran,
            targetPesertaDidik: modul.identitas.targetPesertaDidik,
          },
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.text) {
        updateSection(section, fieldKey, resData.text);
      } else {
        alert(resData.error || "Gagal mendapatkan saran AI.");
      }
    } catch (err: any) {
      console.error("AI Refine Error:", err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setLoadingField(null);
    }
  };

  // Generate Bank Soal via AI
  const handleGenerateSoal = async () => {
    setIsGeneratingSoal(true);
    try {
      const response = await fetch("/api/generate-soal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mataPelajaran: modul.identitas.mataPelajaran,
          fase: modul.identitas.fase,
          kelas: modul.identitas.kelas,
          topikPembelajaran: modul.desainPembelajaran.topikPembelajaran,
          capaianPembelajaran: modul.desainPembelajaran.capaianPembelajaran,
          uploadedMaterialText: modul.identifikasi.materialFile?.extractedText || "",
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        onChange({
          ...modul,
          updatedAt: new Date().toISOString(),
          pendukung: {
            ...modul.pendukung,
            soalAsesmen: resData.data,
          },
        });
      } else {
        alert(resData.error || "Gagal membuat bank soal.");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal menghubungkan ke server AI.");
    } finally {
      setIsGeneratingSoal(false);
    }
  };

  // Generate LKPD via AI (untuk semua pertemuan)
  const handleGenerateLkpd = async () => {
    setIsGeneratingLkpd(true);
    try {
      const response = await fetch("/api/generate-lkpd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mataPelajaran: modul.identitas.mataPelajaran,
          fase: modul.identitas.fase,
          kelas: modul.identitas.kelas,
          topikPembelajaran: modul.desainPembelajaran.topikPembelajaran,
          capaianPembelajaran: modul.desainPembelajaran.capaianPembelajaran,
          uploadedMaterialText: modul.identifikasi.materialFile?.extractedText || "",
          jumlahPertemuan: currentPertemuanList.length,
          pertemuanList: currentPertemuanList,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const lkpdList = resData.data.lkpdList || [];
        const mainLkpd = resData.data.lkpd || lkpdList[0] || undefined;
        onChange({
          ...modul,
          updatedAt: new Date().toISOString(),
          pendukung: {
            ...modul.pendukung,
            lkpd: mainLkpd,
            lkpdList: lkpdList.length > 0 ? lkpdList : (mainLkpd ? [mainLkpd] : []),
          },
        });
      } else {
        alert(resData.error || "Gagal membuat LKPD.");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal menghubungkan ke server AI.");
    } finally {
      setIsGeneratingLkpd(false);
    }
  };

  // Generate Materi Singkat via AI (untuk semua pertemuan)
  const handleGenerateMateri = async () => {
    setIsGeneratingMateri(true);
    try {
      const response = await fetch("/api/generate-materi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mataPelajaran: modul.identitas.mataPelajaran,
          fase: modul.identitas.fase,
          kelas: modul.identitas.kelas,
          topikPembelajaran: modul.desainPembelajaran.topikPembelajaran,
          jumlahPertemuan: currentPertemuanList.length,
          pertemuanList: currentPertemuanList,
          uploadedMaterialText: modul.identifikasi.materialFile?.extractedText || "",
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        onChange({
          ...modul,
          updatedAt: new Date().toISOString(),
          pendukung: {
            ...modul.pendukung,
            materiSingkatList: resData.data,
          },
        });
      } else {
        alert(resData.error || "Gagal membuat materi singkat.");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal menghubungkan ke server AI.");
    } finally {
      setIsGeneratingMateri(false);
    }
  };

  const activePertemuan = currentPertemuanList[activePertemuanIdx] || currentPertemuanList[0];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* FORM BANNER */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Formulir Penyusun Modul Ajar
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Dukung upload berkas materi, pengaturan jumlah pertemuan, Bank Soal, & LKPD.
          </p>
        </div>

        <button
          onClick={onOpenAiGenerator}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow hover:shadow-indigo-200 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-indigo-200 fill-indigo-200" />
          Buat Otomatis via AI
        </button>
      </div>

      {/* TABS */}
      <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab("identitas")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "identitas"
              ? "border-indigo-600 text-indigo-800 bg-white"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          1. Identitas
        </button>

        <button
          onClick={() => setActiveTab("identifikasi")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "identifikasi"
              ? "border-indigo-600 text-indigo-800 bg-white"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          2. Identifikasi & File
        </button>

        <button
          onClick={() => setActiveTab("desain")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "desain"
              ? "border-indigo-600 text-indigo-800 bg-white"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          3. Desain
        </button>

        <button
          onClick={() => setActiveTab("langkah")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "langkah"
              ? "border-indigo-600 text-indigo-800 bg-white"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          4. Pertemuan ({currentPertemuanList.length})
        </button>

        <button
          onClick={() => setActiveTab("asesmen")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "asesmen"
              ? "border-indigo-600 text-indigo-800 bg-white"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          5. Asesmen
        </button>

        <button
          onClick={() => setActiveTab("pendukung")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === "pendukung"
              ? "border-indigo-600 text-indigo-800 bg-white"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-600" />
          6. Soal & LKPD
        </button>
      </div>

      {/* FORM BODY */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* ================= TAB 1: IDENTITAS ================= */}
        {activeTab === "identitas" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2">
              A. Data Satuan Pendidikan & Pengampu
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Nama Sekolah <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={modul.identitas.namaSekolah}
                  onChange={(e) => updateSection("identitas", "namaSekolah", e.target.value)}
                  placeholder="SD Negeri 1 / SMP N 1 / SMA Perdana"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Mata Pelajaran <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={modul.identitas.mataPelajaran}
                  onChange={(e) => updateSection("identitas", "mataPelajaran", e.target.value)}
                  placeholder="Informatika / IPA / Matematika"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Nama Guru Pengampu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={modul.identitas.namaGuru}
                  onChange={(e) => updateSection("identitas", "namaGuru", e.target.value)}
                  placeholder="Nama lengkap beserta gelar"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">NIP Guru</label>
                <input
                  type="text"
                  value={modul.identitas.nipGuru}
                  onChange={(e) => updateSection("identitas", "nipGuru", e.target.value)}
                  placeholder="NIP / NIPPPK"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Nama Kepala Sekolah <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={modul.identitas.namaKepalaSekolah}
                  onChange={(e) => updateSection("identitas", "namaKepalaSekolah", e.target.value)}
                  placeholder="Nama Kepala Sekolah beserta gelar"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  value={modul.identitas.nipKepalaSekolah}
                  onChange={(e) => updateSection("identitas", "nipKepalaSekolah", e.target.value)}
                  placeholder="NIP Kepala Sekolah"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Kota / Kabupaten Lokasi Sekolah
                </label>
                <input
                  type="text"
                  value={modul.identitas.kotaSekolah || ""}
                  onChange={(e) => updateSection("identitas", "kotaSekolah", e.target.value)}
                  placeholder="Contoh: Pematangsiantar / Medan / Jakarta"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Tanggal Dokumen / RPP
                </label>
                <input
                  type="text"
                  value={modul.identitas.tanggalDokumen || ""}
                  onChange={(e) => updateSection("identitas", "tanggalDokumen", e.target.value)}
                  placeholder="Contoh: 28 Juli 2026"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 pt-2">
              B. Alokasi & Pertemuan Pembelajaran
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Fase Belajar <span className="text-red-500">*</span>
                </label>
                <select
                  value={modul.identitas.fase}
                  onChange={(e) => updateSection("identitas", "fase", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {DAFTAR_FASE.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Kelas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={modul.identitas.kelas}
                  onChange={(e) => updateSection("identitas", "kelas", e.target.value)}
                  placeholder="Contoh: VII (Tujuh)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Semester</label>
                <input
                  type="text"
                  value={modul.identitas.semester}
                  onChange={(e) => updateSection("identitas", "semester", e.target.value)}
                  placeholder="Contoh: 1 (Ganjil)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-indigo-900 mb-1">
                  Jumlah Pertemuan Pembelajaran
                </label>
                <select
                  value={currentPertemuanList.length}
                  onChange={(e) => setTotalPertemuan(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50/50 font-bold text-indigo-950"
                >
                  {Array.from({ length: 35 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} Pertemuan Pembelajaran
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Alokasi Waktu</label>
                <input
                  type="text"
                  value={modul.identitas.alokasiWaktu}
                  onChange={(e) => updateSection("identitas", "alokasiWaktu", e.target.value)}
                  placeholder="Contoh: 4 x 45 Menit (2 Pertemuan)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Tahun Ajaran</label>
                <input
                  type="text"
                  value={modul.identitas.tahunAjaran}
                  onChange={(e) => updateSection("identitas", "tahunAjaran", e.target.value)}
                  placeholder="2024/2025"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Target Peserta Didik
              </label>
              <textarea
                rows={2}
                value={modul.identitas.targetPesertaDidik}
                onChange={(e) => updateSection("identitas", "targetPesertaDidik", e.target.value)}
                placeholder="Peserta didik reguler/tipikal"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
              />
            </div>
          </div>
        )}

        {/* ================= TAB 2: IDENTIFIKASI & FILE ================= */}
        {activeTab === "identifikasi" && (
          <div className="space-y-6">
            {/* FILE MATERIAL UPLOAD BOX */}
            <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-200 space-y-3">
              <div className="flex justify-between items-center">
                <label className="block font-bold text-indigo-950 text-xs sm:text-sm flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-600" />
                  Lampiran Berkas Materi / Bahan Ajar
                </label>
                {modul.identifikasi.materialFile && (
                  <button
                    type="button"
                    onClick={handleRemoveMaterialFile}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus File
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-600">
                Unggah dokumen acuan (PDF, Word, Teks, Gambar) untuk memperkaya analisis materi & pembuat soal LKPD.
              </p>

              {modul.identifikasi.materialFile ? (
                <div className="p-3 bg-white border border-indigo-200 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">
                        {modul.identifikasi.materialFile.fileName}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {modul.identifikasi.materialFile.fileSize || "File Terlampir"}
                      </span>
                    </div>
                  </div>
                  {modul.identifikasi.materialFile.extractedText && (
                    <div className="text-[11px] bg-slate-50 p-2 rounded border border-slate-200 text-slate-700 max-h-24 overflow-y-auto font-mono">
                      {modul.identifikasi.materialFile.extractedText}
                    </div>
                  )}
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-indigo-300 hover:border-indigo-600 rounded-lg bg-white cursor-pointer transition text-center hover:bg-indigo-50/50">
                  <Upload className="w-6 h-6 text-indigo-500 mb-1" />
                  <span className="text-xs font-semibold text-slate-800">
                    {isReadingFile ? "Membaca berkas..." : "Pilih / Seret berkas bahan ajar di sini"}
                  </span>
                  <span className="text-[10px] text-slate-400">PDF, TXT, DOCX, MD, CSV, PNG, JPG</span>
                  <input
                    type="file"
                    onChange={handleMaterialFileUpload}
                    accept=".pdf,.txt,.doc,.docx,.md,.csv,.json,.png,.jpg,.jpeg"
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium text-slate-700 text-xs sm:text-sm">
                  1. Peserta Didik (Kesiapan & Kebutuhan Belajar)
                </label>
                <button
                  type="button"
                  onClick={() =>
                    handleAiRefineField("Peserta Didik (Identifikasi Kesiapan)", "identifikasi", "pesertaDidik")
                  }
                  disabled={loadingField === "identifikasi.pesertaDidik"}
                  className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer bg-indigo-50 px-2 py-1 rounded border border-indigo-200"
                >
                  {loadingField === "identifikasi.pesertaDidik" ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                  )}
                  Bantu Tulis AI
                </button>
              </div>
              <textarea
                rows={3}
                value={modul.identifikasi.pesertaDidik}
                onChange={(e) => updateSection("identifikasi", "pesertaDidik", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium text-slate-700 text-xs sm:text-sm">
                  2. Materi Pelajaran (Analisis & Nilai Karakter)
                </label>
                <button
                  type="button"
                  onClick={() =>
                    handleAiRefineField("Materi Pelajaran (Analisis & Karakter)", "identifikasi", "materiPelajaran")
                  }
                  disabled={loadingField === "identifikasi.materiPelajaran"}
                  className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer bg-indigo-50 px-2 py-1 rounded border border-indigo-200"
                >
                  {loadingField === "identifikasi.materiPelajaran" ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                  )}
                  Bantu Tulis AI
                </button>
              </div>
              <textarea
                rows={3}
                value={modul.identifikasi.materiPelajaran}
                onChange={(e) => updateSection("identifikasi", "materiPelajaran", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 text-xs sm:text-sm mb-1">
                3. Dimensi Profil Lulusan (DPL)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {DIMENSI_PROFIL_LULUSAN.map((dpl) => {
                  const isChecked = modul.identifikasi.dimensiProfilLulusan?.includes(dpl.id);
                  return (
                    <button
                      type="button"
                      key={dpl.id}
                      onClick={() => toggleDpl(dpl.id)}
                      className={`flex items-start gap-2.5 p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        isChecked
                          ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-400/20 text-indigo-950 font-medium"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-bold text-xs text-indigo-900 block">{dpl.id}</span>
                        <span className="text-xs leading-tight">{dpl.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: DESAIN PEMBELAJARAN ================= */}
        {activeTab === "desain" && (
          <div className="space-y-5 text-xs sm:text-sm">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-800">Capaian Pembelajaran (CP)</label>
                <button
                  type="button"
                  onClick={() =>
                    handleAiRefineField("Capaian Pembelajaran Resmi", "desainPembelajaran", "capaianPembelajaran")
                  }
                  disabled={loadingField === "desainPembelajaran.capaianPembelajaran"}
                  className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer bg-indigo-50 px-2 py-1 rounded border border-indigo-200"
                >
                  {loadingField === "desainPembelajaran.capaianPembelajaran" ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                  )}
                  Ambil CP Resmi via AI
                </button>
              </div>
              <textarea
                rows={3}
                value={modul.desainPembelajaran.capaianPembelajaran}
                onChange={(e) => updateSection("desainPembelajaran", "capaianPembelajaran", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-800 mb-1 block">Lintas Disiplin Ilmu</label>
                <input
                  type="text"
                  value={modul.desainPembelajaran.lintasDisiplinIlmu}
                  onChange={(e) => updateSection("desainPembelajaran", "lintasDisiplinIlmu", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 mb-1 block">Topik Pembelajaran</label>
                <input
                  type="text"
                  value={modul.desainPembelajaran.topikPembelajaran}
                  onChange={(e) => updateSection("desainPembelajaran", "topikPembelajaran", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-800">Tujuan Pembelajaran (TP)</label>
                <button
                  type="button"
                  onClick={() =>
                    handleAiRefineField("Tujuan Pembelajaran Terukur", "desainPembelajaran", "tujuanPembelajaran")
                  }
                  disabled={loadingField === "desainPembelajaran.tujuanPembelajaran"}
                  className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer bg-indigo-50 px-2 py-1 rounded border border-indigo-200"
                >
                  {loadingField === "desainPembelajaran.tujuanPembelajaran" ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                  )}
                  Bantu Tulis AI
                </button>
              </div>
              <textarea
                rows={3}
                value={modul.desainPembelajaran.tujuanPembelajaran}
                onChange={(e) => updateSection("desainPembelajaran", "tujuanPembelajaran", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-800 mb-1 block">Praktik Pedagogis</label>
                <input
                  type="text"
                  value={modul.desainPembelajaran.praktikPedagogis}
                  onChange={(e) => updateSection("desainPembelajaran", "praktikPedagogis", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 mb-1 block">Kemitraan Pembelajaran</label>
                <input
                  type="text"
                  value={modul.desainPembelajaran.kemitraanPembelajaran}
                  onChange={(e) => updateSection("desainPembelajaran", "kemitraanPembelajaran", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 mb-1 block">Lingkungan Pembelajaran</label>
                <input
                  type="text"
                  value={modul.desainPembelajaran.lingkunganPembelajaran}
                  onChange={(e) => updateSection("desainPembelajaran", "lingkunganPembelajaran", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 mb-1 block">Pemanfaatan Digital</label>
                <input
                  type="text"
                  value={modul.desainPembelajaran.pemanfaatanDigital}
                  onChange={(e) => updateSection("desainPembelajaran", "pemanfaatanDigital", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: LANGKAH PEMBELAJARAN MULTI-PERTEMUAN ================= */}
        {activeTab === "langkah" && (
          <div className="space-y-6 text-xs sm:text-sm">
            {/* PERTEMUAN SELECTOR HEADER */}
            <div className="bg-indigo-50/80 p-3.5 rounded-xl border border-indigo-200 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="font-bold text-indigo-950 text-sm block">
                    Langkah Pembelajaran ({currentPertemuanList.length} Pertemuan)
                  </span>
                  <span className="text-[11px] text-slate-600">
                    Pilih tab pertemuan di bawah ini untuk mengedit skenario pembelajaran per sesi:
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentPertemuanList.length < 35) {
                        setTotalPertemuan(currentPertemuanList.length + 1);
                      }
                    }}
                    disabled={currentPertemuanList.length >= 35}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Pertemuan
                  </button>
                  {currentPertemuanList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setTotalPertemuan(currentPertemuanList.length - 1)}
                      className="bg-white border border-red-300 hover:bg-red-50 text-red-600 font-bold px-2.5 py-1.5 rounded-lg text-xs cursor-pointer"
                    >
                      Hapus Terakhir
                    </button>
                  )}
                </div>
              </div>

              {/* PERTEMUAN TABS */}
              <div className="flex flex-wrap gap-2 pt-1">
                {currentPertemuanList.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePertemuanIdx(idx)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                      activePertemuanIdx === idx
                        ? "bg-indigo-700 text-white shadow-sm"
                        : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Pertemuan {p.pertemuanKe || idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIVE PERTEMUAN FORM */}
            {activePertemuan && (
              <div className="space-y-4 border border-slate-200 p-4 rounded-xl bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-200">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Fokus / Sub-Topik Pertemuan ke-{activePertemuanIdx + 1}
                    </label>
                    <input
                      type="text"
                      value={activePertemuan.fokusMateri || ""}
                      onChange={(e) => updateCurrentPertemuanField("fokusMateri", e.target.value)}
                      placeholder="Misal: Memahami Konsep Dekomposisi & Pengenalan Pola"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Alokasi Waktu Sesi Ini
                    </label>
                    <input
                      type="text"
                      value={activePertemuan.alokasiWaktu || "2 x 45 Menit"}
                      onChange={(e) => updateCurrentPertemuanField("alokasiWaktu", e.target.value)}
                      placeholder="2 x 45 Menit"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* AWAL */}
                <div>
                  <label className="font-bold text-slate-900 uppercase block mb-1">
                    1. Kegiatan AWAL (Orientasi, Apersepsi, Motivasi)
                  </label>
                  <textarea
                    rows={3}
                    value={activePertemuan.awal}
                    onChange={(e) => updateCurrentPertemuanField("awal", e.target.value)}
                    placeholder="Pembuka pembelajaran bermakna..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* INTI MEMAHAMI */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-indigo-950">2. INTI — Memahami</label>
                    <button
                      type="button"
                      onClick={() => addIntiStepCurrent("intiMemahami")}
                      className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2 py-1 rounded flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah
                    </button>
                  </div>
                  {activePertemuan.intiMemahami?.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="font-bold text-slate-500 w-5 text-center">{idx + 1}.</span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => updateIntiStepCurrent("intiMemahami", idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeIntiStepCurrent("intiMemahami", idx)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* INTI MENGAPLIKASI */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-indigo-950">3. INTI — Mengaplikasi</label>
                    <button
                      type="button"
                      onClick={() => addIntiStepCurrent("intiMengaplikasi")}
                      className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2 py-1 rounded flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah
                    </button>
                  </div>
                  {activePertemuan.intiMengaplikasi?.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="font-bold text-slate-500 w-5 text-center">{idx + 1}.</span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => updateIntiStepCurrent("intiMengaplikasi", idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeIntiStepCurrent("intiMengaplikasi", idx)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* INTI MEREFLEKSI */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-indigo-950">4. INTI — Merefleksi</label>
                    <button
                      type="button"
                      onClick={() => addIntiStepCurrent("intiMerefleksi")}
                      className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2 py-1 rounded flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah
                    </button>
                  </div>
                  {activePertemuan.intiMerefleksi?.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="font-bold text-slate-500 w-5 text-center">{idx + 1}.</span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => updateIntiStepCurrent("intiMerefleksi", idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeIntiStepCurrent("intiMerefleksi", idx)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* PENUTUP */}
                <div>
                  <label className="font-bold text-slate-900 uppercase block mb-1">
                    5. Kegiatan PENUTUP
                  </label>
                  <textarea
                    rows={3}
                    value={activePertemuan.penutup}
                    onChange={(e) => updateCurrentPertemuanField("penutup", e.target.value)}
                    placeholder="Umpan balik, kesimpulan bersama, rencana lanjutan..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: ASESMEN ================= */}
        {activeTab === "asesmen" && (
          <div className="space-y-5 text-xs sm:text-sm">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-800">1. Asesmen Awal (Diagnostik)</label>
                <button
                  type="button"
                  onClick={() =>
                    handleAiRefineField("Asesmen Awal Pembelajaran", "asesmenPembelajaran", "asesmenAwal")
                  }
                  disabled={loadingField === "asesmenPembelajaran.asesmenAwal"}
                  className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer bg-indigo-50 px-2 py-1 rounded border border-indigo-200"
                >
                  {loadingField === "asesmenPembelajaran.asesmenAwal" ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                  )}
                  Bantu Tulis AI
                </button>
              </div>
              <textarea
                rows={2}
                value={modul.asesmenPembelajaran.asesmenAwal}
                onChange={(e) => updateSection("asesmenPembelajaran", "asesmenAwal", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-800">2. Asesmen Proses (Formatik)</label>
                <button
                  type="button"
                  onClick={() =>
                    handleAiRefineField("Asesmen Proses Pembelajaran", "asesmenPembelajaran", "asesmenProses")
                  }
                  disabled={loadingField === "asesmenPembelajaran.asesmenProses"}
                  className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer bg-indigo-50 px-2 py-1 rounded border border-indigo-200"
                >
                  {loadingField === "asesmenPembelajaran.asesmenProses" ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                  )}
                  Bantu Tulis AI
                </button>
              </div>
              <textarea
                rows={2}
                value={modul.asesmenPembelajaran.asesmenProses}
                onChange={(e) => updateSection("asesmenPembelajaran", "asesmenProses", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-800">3. Asesmen Akhir (Sumatif)</label>
                <button
                  type="button"
                  onClick={() =>
                    handleAiRefineField("Asesmen Akhir Pembelajaran", "asesmenPembelajaran", "asesmenAkhir")
                  }
                  disabled={loadingField === "asesmenPembelajaran.asesmenAkhir"}
                  className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer bg-indigo-50 px-2 py-1 rounded border border-indigo-200"
                >
                  {loadingField === "asesmenPembelajaran.asesmenAkhir" ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                  )}
                  Bantu Tulis AI
                </button>
              </div>
              <textarea
                rows={2}
                value={modul.asesmenPembelajaran.asesmenAkhir}
                onChange={(e) => updateSection("asesmenPembelajaran", "asesmenAkhir", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        {/* ================= TAB 6: PENDUKUNG (SOAL & LKPD) ================= */}
        {activeTab === "pendukung" && (
          <div className="space-y-6 text-xs sm:text-sm">
            {/* AI GENERATION CONTROLS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 flex flex-col justify-between space-y-3">
                <div>
                  <span className="font-bold text-indigo-950 text-sm flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-indigo-600" /> Bank Soal Asesmen AI
                  </span>
                  <p className="text-xs text-slate-600 mt-1">
                    Otomatis generate 10 Pilihan Ganda HOTS (dengan opsi & pembahasan) + 3 Soal Uraian HOTS + Rubrik Penskoran.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateSoal}
                  disabled={isGeneratingSoal}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-2 shadow cursor-pointer transition"
                >
                  {isGeneratingSoal ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-indigo-200 fill-indigo-200" />
                  )}
                  {modul.pendukung?.soalAsesmen ? "Generate Ulang Soal" : "Generate Bank Soal via AI"}
                </button>
              </div>

              <div className="bg-sky-50 p-4 rounded-xl border border-sky-200 flex flex-col justify-between space-y-3">
                <div>
                  <span className="font-bold text-sky-950 text-sm flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-sky-600" /> Lembar Kerja Siswa (LKPD)
                  </span>
                  <p className="text-xs text-slate-600 mt-1">
                    Otomatis buat LKPD kelompok/mandiri lengkap dengan petunjuk, pertanyaan pemantik, & lembar jawab.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateLkpd}
                  disabled={isGeneratingLkpd}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-2 shadow cursor-pointer transition"
                >
                  {isGeneratingLkpd ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-sky-200 fill-sky-200" />
                  )}
                  {modul.pendukung?.lkpd ? "Generate Ulang LKPD" : "Generate LKPD via AI"}
                </button>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex flex-col justify-between space-y-3">
                <div>
                  <span className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-600" /> Materi Singkat Pertemuan
                  </span>
                  <p className="text-xs text-slate-600 mt-1">
                    Otomatis buat ringkasan materi ajar per pertemuan dari sumber file diunggah & alur pembelajaran.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateMateri}
                  disabled={isGeneratingMateri}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-2 shadow cursor-pointer transition"
                >
                  {isGeneratingMateri ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200" />
                  )}
                  {modul.pendukung?.materiSingkatList?.length ? "Generate Ulang Materi" : "Generate Materi via AI"}
                </button>
              </div>
            </div>

            {/* PREVIEW & EDIT SOAL ASESMEN */}
            {modul.pendukung?.soalAsesmen && (
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-2">
                  Preview Bank Soal Asesmen
                </h4>

                {/* PILIHAN GANDA */}
                <div className="space-y-3">
                  <span className="font-bold text-indigo-950 text-xs uppercase block">
                    A. Soal Pilihan Ganda ({modul.pendukung.soalAsesmen.pilihanGanda?.length || 0} Soal)
                  </span>
                  {modul.pendukung.soalAsesmen.pilihanGanda?.map((pg, idx) => (
                    <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-2">
                      <div className="font-bold text-slate-800">
                        {idx + 1}. {pg.pertanyaan}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-slate-600 pl-3">
                        <span>A. {pg.opsi?.A}</span>
                        <span>B. {pg.opsi?.B}</span>
                        <span>C. {pg.opsi?.C}</span>
                        <span>D. {pg.opsi?.D}</span>
                      </div>
                      <div className="text-[11px] bg-emerald-50 text-emerald-900 p-2 rounded border border-emerald-200 font-medium">
                        <strong>Kunci: {pg.kunciJawaban}</strong> — Pembahasan: {pg.pembahasan}
                      </div>
                    </div>
                  ))}
                </div>

                {/* URAIAN */}
                <div className="space-y-3 pt-2">
                  <span className="font-bold text-indigo-950 text-xs uppercase block">
                    B. Soal Uraian / Essay ({modul.pendukung.soalAsesmen.uraian?.length || 0} Soal)
                  </span>
                  {modul.pendukung.soalAsesmen.uraian?.map((ur, idx) => (
                    <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-2">
                      <div className="font-bold text-slate-800">
                        {idx + 1}. {ur.pertanyaan}
                      </div>
                      <div className="text-[11px] bg-indigo-50 text-indigo-950 p-2 rounded border border-indigo-200">
                        <strong>Kunci Jawaban:</strong> {ur.kunciJawaban}
                        <br />
                        <strong>Rubrik Penilaian:</strong> {ur.rubrikPenilaian}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PREVIEW & EDIT LKPD PERTEMUAN */}
            {((modul.pendukung?.lkpdList && modul.pendukung.lkpdList.length > 0) || modul.pendukung?.lkpd) && (
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
                <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-sky-600" />
                    Lembar Kerja Peserta Didik (LKPD) Per Pertemuan
                  </h4>
                  <span className="text-xs bg-sky-100 text-sky-800 font-bold px-2.5 py-0.5 rounded-full">
                    {modul.pendukung?.lkpdList?.length || 1} LKPD Tersedia
                  </span>
                </div>

                {/* RENDER LIST OF LKPD PER MEETING */}
                {((modul.pendukung?.lkpdList && modul.pendukung.lkpdList.length > 0)
                  ? modul.pendukung.lkpdList
                  : [modul.pendukung!.lkpd!]
                ).map((itemLkpd, index) => {
                  const pNum = itemLkpd.pertemuanKe || index + 1;
                  return (
                    <div key={index} className="bg-white p-4 border border-slate-200 rounded-xl space-y-3 text-xs shadow-sm">
                      <div className="bg-sky-50 border-b border-sky-100 p-2.5 rounded-lg flex items-center justify-between">
                        <span className="font-bold text-sky-950 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[11px]">
                            {pNum}
                          </span>
                          LKPD Pertemuan Ke-{pNum} {itemLkpd.topikPertemuan ? `: ${itemLkpd.topikPertemuan}` : ""}
                        </span>
                      </div>

                      <div>
                        <span className="font-bold text-slate-900 block">Judul LKPD:</span>
                        <span className="text-slate-800 font-semibold">{itemLkpd.judulLkpd}</span>
                      </div>

                      <div>
                        <span className="font-bold text-slate-900 block">Petunjuk Pengerjaan:</span>
                        <p className="whitespace-pre-line text-slate-700">{itemLkpd.petunjuk}</p>
                      </div>

                      {itemLkpd.pertanyaanPemantik && itemLkpd.pertanyaanPemantik.length > 0 && (
                        <div>
                          <span className="font-bold text-slate-900 block mb-1">Pertanyaan Pemantik / Masalah:</span>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200">
                            {itemLkpd.pertanyaanPemantik.map((pem, i) => (
                              <li key={i}>{pem}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {itemLkpd.langkahAktivitas && itemLkpd.langkahAktivitas.length > 0 && (
                        <div>
                          <span className="font-bold text-slate-900 block mb-1">Langkah Aktivitas & Praktikum:</span>
                          <ol className="list-decimal list-inside space-y-0.5 text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200">
                            {itemLkpd.langkahAktivitas.map((lang, i) => (
                              <li key={i}>{lang}</li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {itemLkpd.tugasKelompok && (
                        <div>
                          <span className="font-bold text-slate-900 block mb-1">Tugas Diskusi Kelompok:</span>
                          <p className="p-2.5 bg-amber-50 text-amber-950 rounded border border-amber-200">{itemLkpd.tugasKelompok}</p>
                        </div>
                      )}

                      {itemLkpd.lembarKerjaSiswa && (
                        <div>
                          <span className="font-bold text-slate-900 block mb-1">Format Lembar Kerja Siswa:</span>
                          <p className="p-2.5 bg-slate-100 text-slate-800 font-mono text-[11px] rounded border border-slate-200 whitespace-pre-line">{itemLkpd.lembarKerjaSiswa}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* PREVIEW & EDIT MATERI SINGKAT PERTEMUAN */}
            {modul.pendukung?.materiSingkatList && modul.pendukung.materiSingkatList.length > 0 && (
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
                <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    Lampiran Materi Singkat Pembelajaran Per Pertemuan
                  </h4>
                  <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full">
                    {modul.pendukung.materiSingkatList.length} Sesi Materi
                  </span>
                </div>

                {modul.pendukung.materiSingkatList.map((itemMateri, index) => {
                  const pNum = itemMateri.pertemuanKe || index + 1;
                  return (
                    <div key={index} className="bg-white p-4 border border-slate-200 rounded-xl space-y-3 text-xs shadow-sm">
                      <div className="bg-amber-50 border-b border-amber-100 p-2.5 rounded-lg flex items-center justify-between">
                        <span className="font-bold text-amber-950 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-[11px]">
                            {pNum}
                          </span>
                          Materi Pertemuan Ke-{pNum}: {itemMateri.topikMateri}
                        </span>
                      </div>

                      <div>
                        <span className="font-bold text-slate-900 block mb-1">Ringkasan Materi:</span>
                        <p className="whitespace-pre-line text-slate-800 bg-amber-50/30 p-3 rounded border border-amber-100 text-xs leading-relaxed">
                          {itemMateri.ringkasanMateri}
                        </p>
                      </div>

                      {itemMateri.poinKunci && itemMateri.poinKunci.length > 0 && (
                        <div>
                          <span className="font-bold text-slate-900 block mb-1">Poin-Poin Kunci Pembelajaran:</span>
                          <ul className="list-disc list-inside space-y-1 text-slate-800 bg-slate-50 p-2.5 rounded border border-slate-200">
                            {itemMateri.poinKunci.map((pk, i) => (
                              <li key={i}>{pk}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {itemMateri.glosarium && itemMateri.glosarium.length > 0 && (
                        <div>
                          <span className="font-bold text-slate-900 block mb-1">Glosarium / Istilah Penting:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {itemMateri.glosarium.map((glo, i) => (
                              <div key={i} className="p-2 bg-slate-100 rounded border border-slate-200">
                                <span className="font-bold text-slate-900 block">{glo.istilah}</span>
                                <span className="text-slate-600 text-[11px]">{glo.arti}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
