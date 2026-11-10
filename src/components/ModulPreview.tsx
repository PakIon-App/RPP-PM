import React, { useState } from "react";
import { ModulAjar, DIMENSI_PROFIL_LULUSAN } from "../types";
import { getKotaDanTanggal } from "../utils/formatUtils";
import {
  CheckSquare,
  Square,
  FileText,
  HelpCircle,
  FileSpreadsheet,
  BookOpen,
  Layers,
  Calendar,
  Download,
} from "lucide-react";

interface Props {
  modul: ModulAjar;
  onOpenExportModal?: () => void;
}

export const ModulPreview: React.FC<Props> = ({ modul, onOpenExportModal }) => {
  const { identitas, identifikasi, desainPembelajaran, pengalamanBelajar, asesmenPembelajaran, pendukung } = modul;

  const [documentView, setDocumentView] = useState<"ALL" | "MODUL" | "SOAL" | "LKPD" | "MATERI">("ALL");

  // Determine list of meetings
  const pertemuanList = pengalamanBelajar?.pertemuanList?.length
    ? pengalamanBelajar.pertemuanList
    : [
        {
          pertemuanKe: 1,
          alokasiWaktu: identitas.alokasiWaktu || "2 x 45 Menit",
          fokusMateri: desainPembelajaran.topikPembelajaran,
          awal: pengalamanBelajar.awal || "-",
          intiMemahami: pengalamanBelajar.intiMemahami || [],
          intiMengaplikasi: pengalamanBelajar.intiMengaplikasi || [],
          intiMerefleksi: pengalamanBelajar.intiMerefleksi || [],
          penutup: pengalamanBelajar.penutup || "-",
        },
      ];

  return (
    <div className="w-full flex flex-col items-center gap-6 py-4 print:py-0">
      {/* FILTER VIEW TABS (Hidden on Print) */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold print:hidden shadow-sm">
        <button
          onClick={() => setDocumentView("ALL")}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
            documentView === "ALL"
              ? "bg-indigo-700 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
          }`}
        >
          <Layers className="w-4 h-4" /> Paket Lengkap (Semua)
        </button>

        <button
          onClick={() => setDocumentView("MODUL")}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
            documentView === "MODUL"
              ? "bg-indigo-700 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" /> Modul Utama
        </button>

        {pendukung?.soalAsesmen && (
          <button
            onClick={() => setDocumentView("SOAL")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
              documentView === "SOAL"
                ? "bg-indigo-700 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Bank Soal Asesmen
          </button>
        )}

        {((pendukung?.lkpdList && pendukung.lkpdList.length > 0) || pendukung?.lkpd) && (
          <button
            onClick={() => setDocumentView("LKPD")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
              documentView === "LKPD"
                ? "bg-indigo-700 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> LKPD Siswa
          </button>
        )}

        {pendukung?.materiSingkatList && pendukung.materiSingkatList.length > 0 && (
          <button
            onClick={() => setDocumentView("MATERI")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
              documentView === "MATERI"
                ? "bg-indigo-700 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Materi Singkat
          </button>
        )}

        {onOpenExportModal && (
          <button
            onClick={onOpenExportModal}
            className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer ml-1"
          >
            <Download className="w-4 h-4" />
            Ekspor (PDF / Word)
          </button>
        )}
      </div>

      {/* DOCUMENT WRAPPER */}
      <div
        id="modul-preview-document"
        className="w-full max-w-[1120px] bg-white text-slate-900 border border-slate-300 shadow-xl rounded-sm p-6 sm:p-8 font-sans print:shadow-none print:border-none print:p-4 print:max-w-none text-xs sm:text-sm leading-relaxed"
      >
        {/* ================= HEADER IDENTITAS ================= */}
        {(documentView === "ALL" || documentView === "MODUL") && (
          <>
            <div className="border-b-2 border-slate-800 pb-4 mb-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold uppercase tracking-wide text-slate-900">
                    MODUL AJAR (PEMBELAJARAN MENDALAM)
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-sky-800">
                    {identitas.namaSekolah || "NAMA SEKOLAH"} — KURIKULUM MERDEKA
                  </p>
                </div>
                <div className="text-left md:text-right text-xs text-slate-600 bg-slate-100 p-2 rounded border border-slate-200 print:bg-transparent print:border-none">
                  <p><span className="font-semibold">Tahun Ajaran:</span> {identitas.tahunAjaran || "-"}</p>
                  <p><span className="font-semibold">Semester:</span> {identitas.semester || "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-xs border-t border-slate-200 pt-3">
                <div>
                  <span className="font-semibold text-slate-600 block">Mata Pelajaran:</span>
                  <span className="font-bold text-slate-900">{identitas.mataPelajaran || "-"}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-600 block">Fase / Kelas:</span>
                  <span className="font-bold text-slate-900">{identitas.fase} / {identitas.kelas}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-600 block">Alokasi Waktu:</span>
                  <span className="font-bold text-slate-900">
                    {identitas.alokasiWaktu || `${pertemuanList.length} Pertemuan`}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-slate-600 block">Guru Pengampu:</span>
                  <span className="font-bold text-slate-900">{identitas.namaGuru || "-"}</span>
                </div>
              </div>
            </div>

            {/* HALAMAN 1: IDENTIFIKASI & DESAIN PEMBELAJARAN */}
            <div className="flex flex-col gap-0 border border-sky-900 rounded overflow-hidden mb-6">
              {/* SECTION 1: IDENTIFIKASI */}
              <div className="grid grid-cols-1 md:grid-cols-12 border-b border-sky-900">
                <div className="md:col-span-3 bg-[#0d4b75] text-white p-4 font-bold text-base md:text-lg flex items-center justify-center text-center">
                  Identifikasi
                </div>
                <div className="md:col-span-9 flex flex-col divide-y divide-sky-800 bg-sky-50/20">
                  <div className="p-3">
                    <p className="font-bold text-sky-950 mb-1">Peserta Didik:</p>
                    <p className="whitespace-pre-line text-slate-800">{identifikasi.pesertaDidik || "-"}</p>
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sky-950 mb-1">Materi Pelajaran:</p>
                    <p className="whitespace-pre-line text-slate-800">{identifikasi.materiPelajaran || "-"}</p>
                    {identifikasi.materialFile && (
                      <div className="mt-2 text-xs bg-indigo-50/80 p-2 rounded border border-indigo-200 text-indigo-950 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>
                          <strong>File Acuan Terlampir:</strong> {identifikasi.materialFile.fileName} ({identifikasi.materialFile.fileSize || "Bahan Ajar"})
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sky-950 mb-2">Dimensi Profil Lulusan:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {DIMENSI_PROFIL_LULUSAN.map((dpl) => {
                        const isChecked = identifikasi.dimensiProfilLulusan?.includes(dpl.id);
                        return (
                          <div
                            key={dpl.id}
                            className={`flex items-start gap-1.5 p-1.5 rounded border ${
                              isChecked
                                ? "bg-sky-100/80 border-sky-400 font-semibold text-sky-950"
                                : "bg-white/60 border-slate-200 text-slate-500"
                            }`}
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <span className="font-bold text-[10px] block text-sky-900">{dpl.id}</span>
                              <span className="leading-tight">{dpl.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: DESAIN PEMBELAJARAN */}
              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-3 bg-[#0d4b75] text-white p-4 font-bold text-base md:text-lg flex flex-col items-center justify-center text-center">
                  <span>Desain</span>
                  <span>Pembelajaran</span>
                </div>
                <div className="md:col-span-9 flex flex-col divide-y divide-sky-800 bg-white">
                  <div className="p-3">
                    <p className="font-bold text-sky-950 mb-1">Capaian Pembelajaran :</p>
                    <p className="whitespace-pre-line text-slate-800">{desainPembelajaran.capaianPembelajaran || "-"}</p>
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sky-950 mb-1">Lintas Disiplin Ilmu :</p>
                    <p className="whitespace-pre-line text-slate-800">{desainPembelajaran.lintasDisiplinIlmu || "-"}</p>
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sky-950 mb-1">Tujuan Pembelajaran :</p>
                    <p className="whitespace-pre-line text-slate-800">{desainPembelajaran.tujuanPembelajaran || "-"}</p>
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sky-950 mb-1">Topik Pembelajaran:</p>
                    <p className="whitespace-pre-line text-slate-800">{desainPembelajaran.topikPembelajaran || "-"}</p>
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sky-950 mb-1">Praktik Pedagogis:</p>
                    <p className="whitespace-pre-line text-slate-800">{desainPembelajaran.praktikPedagogis || "-"}</p>
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sky-950 mb-1">Kemitraan Pembelajaran:</p>
                    <p className="whitespace-pre-line text-slate-800">{desainPembelajaran.kemitraanPembelajaran || "-"}</p>
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sky-950 mb-1">Lingkungan Pembelajaran:</p>
                    <p className="whitespace-pre-line text-slate-800">{desainPembelajaran.lingkunganPembelajaran || "-"}</p>
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sky-950 mb-1">Pemanfaatan Digital:</p>
                    <p className="whitespace-pre-line text-slate-800">{desainPembelajaran.pemanfaatanDigital || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* HALAMAN 2: PENGALAMAN BELAJAR MULTI PERTEMUAN & ASESMEN */}
            <div className="flex flex-col gap-0 border border-sky-900 rounded overflow-hidden mb-6">
              {/* SECTION 3: PENGALAMAN BELAJAR MULTI-PERTEMUAN */}
              <div className="grid grid-cols-1 md:grid-cols-12 border-b border-sky-900">
                <div className="md:col-span-3 bg-[#0d4b75] text-white p-4 font-bold text-base md:text-lg flex flex-col items-center justify-center text-center">
                  <span>Pengalaman</span>
                  <span>Belajar</span>
                  <span className="text-xs font-normal text-sky-200 mt-1">({pertemuanList.length} Pertemuan)</span>
                </div>
                <div className="md:col-span-9 flex flex-col bg-white divide-y divide-sky-800">
                  <div className="bg-[#135286] text-white font-bold p-2 text-center text-xs uppercase tracking-wider">
                    Langkah-Langkah Pembelajaran Berdasarkan Alokasi Pertemuan
                  </div>

                  {pertemuanList.map((p, pIdx) => (
                    <div key={pIdx} className="p-4 space-y-3 bg-white border-b border-sky-800 last:border-b-0">
                      <div className="flex items-center justify-between bg-sky-900 text-white p-2 px-3 rounded text-xs font-bold">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> Pertemuan ke-{p.pertemuanKe || pIdx + 1}
                        </span>
                        <span className="text-[11px] font-normal text-sky-200">
                          Alokasi Waktu: {p.alokasiWaktu || "2 x 45 Menit"}
                        </span>
                      </div>

                      {p.fokusMateri && (
                        <p className="text-xs font-bold text-sky-950 italic">
                          Fokus Sub-materi: {p.fokusMateri}
                        </p>
                      )}

                      {/* AWAL */}
                      <div className="p-2.5 bg-sky-50/50 rounded border border-sky-100">
                        <p className="font-bold text-sky-950 mb-1 text-xs uppercase">
                          AWAL <span className="font-normal text-[10px] text-slate-600">(Berkesadaran, Bermakna, Menggembirakan)</span>
                        </p>
                        <p className="whitespace-pre-line text-slate-800">{p.awal || "-"}</p>
                      </div>

                      {/* INTI */}
                      <div className="space-y-2.5 pl-2 border-l-2 border-sky-600">
                        <p className="font-bold text-sky-950 uppercase text-xs">INTI</p>

                        {/* Memahami */}
                        <div>
                          <p className="font-bold text-sky-900 text-xs">
                            Memahami <span className="font-normal text-slate-500">(berkesadaran, bermakna)</span>:
                          </p>
                          <ol className="list-decimal list-inside space-y-0.5 text-slate-800 pl-1">
                            {p.intiMemahami?.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                        </div>

                        {/* Mengaplikasi */}
                        <div>
                          <p className="font-bold text-sky-900 text-xs">
                            Mengaplikasi <span className="font-normal text-slate-500">(berkesadaran, bermakna)</span>:
                          </p>
                          <ol className="list-decimal list-inside space-y-0.5 text-slate-800 pl-1">
                            {p.intiMengaplikasi?.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                        </div>

                        {/* Merefleksi */}
                        <div>
                          <p className="font-bold text-sky-900 text-xs">
                            Merefleksi <span className="font-normal text-slate-500">(berkesadaran, bermakna)</span>:
                          </p>
                          <ol className="list-decimal list-inside space-y-0.5 text-slate-800 pl-1">
                            {p.intiMerefleksi?.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      </div>

                      {/* PENUTUP */}
                      <div className="p-2.5 bg-sky-50/50 rounded border border-sky-100">
                        <p className="font-bold text-sky-950 mb-1 text-xs uppercase">
                          PENUTUP <span className="font-normal text-[10px] text-slate-600">(Umpan Balik & Simpulan)</span>
                        </p>
                        <p className="whitespace-pre-line text-slate-800">{p.penutup || "-"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: ASESMEN PEMBELAJARAN */}
              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-3 bg-[#0d4b75] text-white p-4 font-bold text-base md:text-lg flex flex-col items-center justify-center text-center">
                  <span>Asesmen</span>
                  <span>Pembelajaran</span>
                </div>
                <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-12 divide-y sm:divide-y-0 sm:divide-x divide-sky-800 bg-white">
                  <div className="sm:col-span-6 p-3 flex flex-col gap-2.5">
                    <div>
                      <p className="font-bold text-sky-950 text-xs">Asesmen Awal (Diagnostik):</p>
                      <p className="text-slate-800 mt-0.5">{asesmenPembelajaran.asesmenAwal || "-"}</p>
                    </div>
                    <div>
                      <p className="font-bold text-sky-950 text-xs">Asesmen Proses (Formatik):</p>
                      <p className="text-slate-800 mt-0.5">{asesmenPembelajaran.asesmenProses || "-"}</p>
                    </div>
                    <div>
                      <p className="font-bold text-sky-950 text-xs">Asesmen Akhir (Sumatif):</p>
                      <p className="text-slate-800 mt-0.5">{asesmenPembelajaran.asesmenAkhir || "-"}</p>
                    </div>
                  </div>

                  <div className="sm:col-span-6 p-3 bg-sky-50/20 text-xs text-slate-700 flex flex-col justify-center">
                    <p className="leading-relaxed">
                      Asesmen dalam pembelajaran mendalam disesuaikan dengan <span className="italic font-semibold">assessment as learning</span>, <span className="italic font-semibold">assessment for learning</span>, dan <span className="italic font-semibold">assessment of learning</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ================= SUPLEMENTAL SECTION: BANK SOAL ASESMEN ================= */}
        {(documentView === "ALL" || documentView === "SOAL") && pendukung?.soalAsesmen && (
          <div className="break-before-page pt-4 mt-6 border-t-2 border-indigo-900">
            <div className="bg-indigo-950 text-white p-3 px-4 rounded-t-md font-bold text-base flex justify-between items-center">
              <span className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-300" /> SUPLEMEN: BANK SOAL ASESMEN PEMBELAJARAN
              </span>
              <span className="text-xs font-normal text-indigo-200">
                {identitas.mataPelajaran} — {identitas.fase}
              </span>
            </div>

            <div className="border border-indigo-900 border-t-0 p-4 space-y-5 bg-white text-xs">
              {/* PILIHAN GANDA */}
              <div>
                <h3 className="font-bold text-slate-900 uppercase text-xs border-b border-slate-300 pb-1.5 mb-3">
                  I. Soal Pilihan Ganda (Pilihlah satu jawaban yang paling tepat)
                </h3>
                <div className="space-y-4">
                  {pendukung.soalAsesmen.pilihanGanda?.map((pg, i) => (
                    <div key={i} className="space-y-1.5 pl-1">
                      <p className="font-bold text-slate-900">
                        {pg.nomor || i + 1}. {pg.pertanyaan}
                      </p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-800 pl-4">
                        <p>A. {pg.opsi?.A}</p>
                        <p>B. {pg.opsi?.B}</p>
                        <p>C. {pg.opsi?.C}</p>
                        <p>D. {pg.opsi?.D}</p>
                      </div>
                      <div className="text-[11px] bg-slate-50 p-1.5 rounded border border-slate-200 text-slate-700 italic">
                        <strong>Kunci: {pg.kunciJawaban}</strong> — Pembahasan: {pg.pembahasan}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* URAIAN */}
              <div>
                <h3 className="font-bold text-slate-900 uppercase text-xs border-b border-slate-300 pb-1.5 mb-3">
                  II. Soal Uraian / Essay Terstruktur
                </h3>
                <div className="space-y-4">
                  {pendukung.soalAsesmen.uraian?.map((ur, i) => (
                    <div key={i} className="space-y-1.5 pl-1">
                      <p className="font-bold text-slate-900">
                        {ur.nomor || i + 1}. {ur.pertanyaan}
                      </p>
                      <div className="text-[11px] bg-indigo-50/70 p-2 rounded border border-indigo-200 space-y-1">
                        <p><strong>Kunci Jawaban:</strong> {ur.kunciJawaban}</p>
                        <p><strong>Rubrik Penskoran:</strong> {ur.rubrikPenilaian}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PEDOMAN PENSKORAN */}
              {pendukung.soalAsesmen.pedomanPenskoran && (
                <div className="p-3 bg-slate-100 rounded border border-slate-300 font-medium text-slate-800">
                  <strong>Pedoman Penskoran:</strong> {pendukung.soalAsesmen.pedomanPenskoran}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= SUPLEMENTAL SECTION: LKPD (PER PERTEMUAN) ================= */}
        {(documentView === "ALL" || documentView === "LKPD") && (pendukung?.lkpdList?.length || pendukung?.lkpd) && (
          <div className="space-y-6">
            {(pendukung.lkpdList && pendukung.lkpdList.length > 0
              ? pendukung.lkpdList
              : [pendukung.lkpd!]
            ).map((lkpdItem, idx) => {
              const pKe = lkpdItem.pertemuanKe || idx + 1;
              return (
                <div key={idx} className="break-before-page pt-4 mt-6 border-t-2 border-sky-900">
                  <div className="bg-sky-950 text-white p-3 px-4 rounded-t-md font-bold text-base flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5 text-sky-300" /> LEMBAR KEGIATAN PESERTA DIDIK (LKPD) — PERTEMUAN KE-{pKe}
                    </span>
                    <span className="text-xs font-normal text-sky-200">
                      {identitas.namaSekolah}
                    </span>
                  </div>

                  <div className="border border-sky-900 border-t-0 p-5 space-y-4 bg-white text-xs">
                    <div className="border-b border-slate-300 pb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded-full">
                          Pertemuan ke-{pKe} {lkpdItem.topikPertemuan ? `• ${lkpdItem.topikPertemuan}` : ""}
                        </span>
                      </div>
                      <h2 className="text-base font-bold text-slate-900 uppercase mt-1">{lkpdItem.judulLkpd}</h2>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-slate-700 font-semibold bg-sky-50/50 p-2 rounded">
                        <p>Mata Pelajaran: {identitas.mataPelajaran}</p>
                        <p>Fase / Kelas: {identitas.fase} / {identitas.kelas}</p>
                        <p>Nama Kelompok: ................................</p>
                        <p>Anggota Kelompok: ................................</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-bold text-sky-950 text-xs mb-1 uppercase">A. Petunjuk Pengerjaan:</p>
                      <p className="whitespace-pre-line text-slate-800 pl-2">{lkpdItem.petunjuk}</p>
                    </div>

                    {lkpdItem.pertanyaanPemantik && lkpdItem.pertanyaanPemantik.length > 0 && (
                      <div>
                        <p className="font-bold text-sky-950 text-xs mb-1 uppercase">B. Pertanyaan Pemantik / Masalah:</p>
                        <ul className="list-disc list-inside space-y-1 text-slate-800 pl-2">
                          {lkpdItem.pertanyaanPemantik.map((pem, i) => (
                            <li key={i}>{pem}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {lkpdItem.langkahAktivitas && lkpdItem.langkahAktivitas.length > 0 && (
                      <div>
                        <p className="font-bold text-sky-950 text-xs mb-1 uppercase">C. Langkah-Langkah Aktivitas & Praktikum:</p>
                        <ol className="list-decimal list-inside space-y-1 text-slate-800 pl-2">
                          {lkpdItem.langkahAktivitas.map((lang, i) => (
                            <li key={i}>{lang}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {lkpdItem.tugasKelompok && (
                      <div>
                        <p className="font-bold text-sky-950 text-xs mb-1 uppercase">D. Tugas Diskusi Kelompok:</p>
                        <p className="whitespace-pre-line text-slate-800 pl-2">{lkpdItem.tugasKelompok}</p>
                      </div>
                    )}

                    {/* LEMBAR JAWAB SISWA BOX */}
                    <div className="border-2 border-dashed border-sky-300 p-4 rounded-lg bg-sky-50/20 space-y-2 mt-4">
                      <p className="font-bold text-sky-950 text-xs uppercase">E. Lembar Hasil Kerja / Jawaban Siswa (Pertemuan {pKe}):</p>
                      <p className="text-slate-500 italic text-[11px]">{lkpdItem.lembarKerjaSiswa}</p>
                      <div className="h-28 border border-slate-200 bg-white rounded p-2 text-slate-300">
                        (Area Catatan & Hasil Jawaban Siswa)
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= LAMPIRAN 3: MATERI SINGKAT PERTEMUAN ================= */}
        {(documentView === "ALL" || documentView === "MATERI") && pendukung?.materiSingkatList && pendukung.materiSingkatList.length > 0 && (
          <div className="space-y-8 mt-10">
            {pendukung.materiSingkatList.map((materiItem, idx) => {
              const pKe = materiItem.pertemuanKe || idx + 1;
              return (
                <div key={idx} className="break-before-page pt-4 mt-6 border-t-2 border-amber-900">
                  <div className="bg-amber-950 text-white p-3 px-4 rounded-t-md font-bold text-base flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-amber-300" /> LAMPIRAN MATERI SINGKAT PEMBELAJARAN — PERTEMUAN KE-{pKe}
                    </span>
                    <span className="text-xs font-normal text-amber-200">
                      {identitas.namaSekolah}
                    </span>
                  </div>

                  <div className="border border-amber-900 border-t-0 p-5 space-y-4 bg-white text-xs">
                    <div className="border-b border-slate-300 pb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                          Materi Pertemuan ke-{pKe}
                        </span>
                      </div>
                      <h2 className="text-base font-bold text-slate-900 uppercase mt-1">{materiItem.topikMateri}</h2>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-slate-700 font-semibold bg-amber-50/50 p-2 rounded">
                        <p>Mata Pelajaran: {identitas.mataPelajaran}</p>
                        <p>Fase / Kelas: {identitas.fase} / {identitas.kelas}</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-bold text-amber-950 text-xs mb-1 uppercase">A. Ringkasan & Uraian Materi Ajar:</p>
                      <p className="whitespace-pre-line text-slate-800 leading-relaxed bg-amber-50/20 p-3 rounded border border-amber-100">{materiItem.ringkasanMateri}</p>
                    </div>

                    {materiItem.poinKunci && materiItem.poinKunci.length > 0 && (
                      <div>
                        <p className="font-bold text-amber-950 text-xs mb-1 uppercase">B. Poin-Poin Kunci Pembelajaran:</p>
                        <ul className="list-disc list-inside space-y-1 text-slate-800 pl-2">
                          {materiItem.poinKunci.map((pk, i) => (
                            <li key={i}>{pk}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {materiItem.glosarium && materiItem.glosarium.length > 0 && (
                      <div>
                        <p className="font-bold text-amber-950 text-xs mb-1 uppercase">C. Glosarium & Istilah Penting:</p>
                        <table className="w-full border-collapse border border-slate-300 text-xs mt-1">
                          <thead>
                            <tr className="bg-amber-100/60 text-slate-900 font-bold">
                              <th className="border border-slate-300 p-2 text-left w-1/3">Istilah / Kata Kunci</th>
                              <th className="border border-slate-300 p-2 text-left">Definisi / Arti</th>
                            </tr>
                          </thead>
                          <tbody>
                            {materiItem.glosarium.map((glo, i) => (
                              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                                <td className="border border-slate-300 p-2 font-bold text-slate-900">{glo.istilah}</td>
                                <td className="border border-slate-300 p-2 text-slate-800">{glo.arti}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= TANDA TANGAN PENGESAHAN ================= */}
        {(documentView === "ALL" || documentView === "MODUL") && (
          <div className="mt-10 pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs break-inside-avoid">
            {/* KIRI: KEPALA SEKOLAH */}
            <div className="flex flex-col items-center justify-between min-h-[160px] text-center">
              <div>
                <p className="text-slate-600 mb-1 font-medium">Mengetahui,</p>
                <p className="font-bold text-slate-900 leading-tight">
                  Kepala {identitas.namaSekolah || "Sekolah"}
                </p>
              </div>
              <div className="my-6"></div>
              <div>
                <p className="font-bold text-slate-900 underline decoration-1 underline-offset-2">
                  {identitas.namaKepalaSekolah || "(....................................)"}
                </p>
                <p className="text-slate-600 mt-0.5">
                  NIP. {identitas.nipKepalaSekolah || "...................................."}
                </p>
              </div>
            </div>

            {/* KANAN: GURU PENGAMPU */}
            <div className="flex flex-col items-center justify-between min-h-[160px] text-center">
              <div>
                <p className="text-slate-600 mb-1 font-medium">
                  {getKotaDanTanggal(identitas)}
                </p>
                <p className="font-bold text-slate-900 leading-tight">
                  Guru Mata Pelajaran
                </p>
              </div>
              <div className="my-6"></div>
              <div>
                <p className="font-bold text-slate-900 underline decoration-1 underline-offset-2">
                  {identitas.namaGuru || "(....................................)"}
                </p>
                <p className="text-slate-600 mt-0.5">
                  NIP. {identitas.nipGuru || "...................................."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-300 pt-2 mt-8">
          <span className="italic font-medium">Pembelajaran Mendalam Menuju Pendidikan Bermutu untuk Semua</span>
          <span>Sistem Generasi Modul Ajar Kurikulum Merdeka</span>
        </div>
      </div>
    </div>
  );
};
