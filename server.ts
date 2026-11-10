import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize Gemini Client
const getGeminiAi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API: Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// API: Generate Complete Modul Ajar + Multi-Pertemuan + Pendukung (Soal & LKPD)
app.post("/api/generate-modul", async (req, res) => {
  try {
    const {
      namaSekolah,
      namaGuru,
      namaKepalaSekolah,
      nipGuru,
      nipKepalaSekolah,
      mataPelajaran,
      fase,
      kelas,
      semester,
      alokasiWaktu,
      jumlahPertemuan = 1,
      tahunAjaran,
      topikPembelajaran,
      targetPesertaDidik,
      catatanTambahan,
      dimensiProfilLulusan = [],
      uploadedMaterialText,
      uploadedFileName,
    } = req.body;

    const ai = getGeminiAi();
    const totalPertemuan = Math.min(Math.max(Number(jumlahPertemuan) || 1, 1), 35);
    const selectedDplList = Array.isArray(dimensiProfilLulusan) && dimensiProfilLulusan.length > 0 ? dimensiProfilLulusan : ["DPL3", "DPL4", "DPL5", "DPL6"];

    const prompt = `
Anda adalah seorang ahli penyusun Kurikulum Merdeka & Pendekatan Pembelajaran Mendalam (Deep Learning).
Buatkan draf Modul Ajar beserta SUPLEMEN PENDUKUNG (Soal Asesmen & Lembar Kerja Peserta Didik / LKPD untuk MASING-MASING PERTEMUAN) yang SANGAT LENGKAP, PROFESIONAL, dan BERKUALITAS TINGGI.

Data Input Pengguna:
- Nama Sekolah: ${namaSekolah || "SD/SMP/SMA Negeri"}
- Nama Guru: ${namaGuru || "Guru Pengampu"} (NIP: ${nipGuru || "-"})
- Nama Kepala Sekolah: ${namaKepalaSekolah || "Kepala Sekolah"} (NIP: ${nipKepalaSekolah || "-"})
- Mata Pelajaran: ${mataPelajaran}
- Fase: ${fase}
- Kelas: ${kelas}
- Semester: ${semester || "1 (Ganjil)"}
- Alokasi Waktu Keseluruhan: ${alokasiWaktu || `${totalPertemuan * 2} x 45 menit`}
- Jumlah Pertemuan Pembelajaran: ${totalPertemuan} Pertemuan
- Tahun Ajaran: ${tahunAjaran || "2024/2025"}
- Topik / Materi Utama: ${topikPembelajaran}
- Target Peserta Didik: ${targetPesertaDidik || "Peserta didik reguler/tipikal"}
- Dimensi Profil Lulusan Pilihan Guru: ${selectedDplList.join(", ")}
- File Bahan Ajar/Materi yang Diunggah Guru: ${uploadedFileName ? `Nama File: ${uploadedFileName}\nIsi Teks/Konten:\n"""${uploadedMaterialText}"""` : "Tidak ada file khusus diunggah."}
- Catatan Khusus: ${catatanTambahan || "Tidak ada"}

PENTING - ATURAN PENYUSUNAN KHUSUS SESUAI INSTRUKSI:
1. HASIL DIMENSI PROFIL LULUSAN (identifikasi.dimensiProfilLulusan):
   - WAJIB BERISI HANYA ARRAY DARI KODE DIMENSI PROFIL LULUSAN YANG DIPILIH GURU KETIKA MENGISI FORM: ${JSON.stringify(selectedDplList)}.
   - DILARANG MENAMBAH ATAU MENGUBAH DIMENSI PROFIL LULUSAN DI LUAR PILIHAN GURU TERSEBUT!

2. LANGKAH-LANGKAH PEMBELAJARAN (PENGALAMAN BELAJAR DEEP LEARNING):
   - Wajib Dibagi menjadi TEPAT ${totalPertemuan} Pertemuan (pertemuanList memuat ${totalPertemuan} elemen).
   - Setiap Pertemuan WAJIB dirancang sesuai 3 Prinsip Pengalaman Pembelajaran Mendalam:
     * Berkesadaran (Mindful): Di kegiatan awal (kesiapan mental, kehadiran penuh, grounding, pertanyaan pemantik kesadaran).
     * Bermakna (Meaningful): Di kegiatan inti (pemahaman konsep mendalam, eksploitasi materi, keterkaitan dengan kehidupan nyata & kasus nyata).
     * Menggembirakan (Joyful): Di kegiatan refleksi & penutup (kolaborasi interaktif, tantangan menyenangkan, permainan edukatif, selebrasi belajar).
   - PENTING - DETAIL & TIDAK KAKU:
     Setiap langkah kegiatan pada awal, intiMemahami, intiMengaplikasi, intiMerefleksi, dan penutup HARUS RINCI DAN DETAIL DENGAN EKSPLISIT MENULISKAN APA YANG DILAKUKAN GURU DAN APA YANG DILAKUKAN SISWA! (Contoh: "Guru mendemonstrasikan [aktivitas]. Siswa mengamati, mencatat, dan menanggapi...").
     Jumlah langkah aktivitas TIDAK BOLEH KAKU (TIDAK HARUS 2)! Setiap sub-tahap boleh berisi 2, 3, 4, atau 5 langkah variatif sesuai dinamika materi.

3. SOAL ASESMEN PEMBELAJARAN (SOAL PG & URAIAN HOTS):
   - Wajib buat TEPAT 10 SOAL PILIHAN GANDA (PG) (nomor 1 s.d 10) dengan opsi A, B, C, D, kunci jawaban, dan pembahasan rinci. Pastikan soal PG mengintegrasikan soal-soal HOTS (Higher Order Thinking Skills / Analisis, Evaluasi, Sintesis) untuk menguji berpikir kritis siswa.
   - Wajib buat TEPAT 3 SOAL URAIAN / ESSAY HOTS (nomor 1 s.d 3) berbasis studi kasus/penalaran mendalam HOTS, lengkap dengan Kunci Jawaban rinci dan Rubrik Penilaian (kriteria & skor).

4. LKPD UNTUK MASING-MASING PERTEMUAN (lkpdList):
   - Wajib hasilkan array \`lkpdList\` dengan TEPAT ${totalPertemuan} elemen LKPD (Satu LKPD khusus untuk setiap Pertemuan 1 s.d ${totalPertemuan}).
   - Petunjuk pengerjaan LKPD harus dibuat dengan bahasa yang ramah peserta didik, ringkas, mudah dipahami, dan SELARAS LANGSUNG dengan alur langkah-langkah pembelajaran (Mindful, Meaningful, Joyful) pada pertemuan tersebut.
   - Langkah aktivitas LKPD dan tugas kelompok mengarahkan siswa secara terpandu sesuai aktivitas nyata pada langkah pembelajaran.

5. RINGKASAN MATERI PEMBELAJARAN PER PERTEMUAN (materiSingkatList):
   - Wajib hasilkan array \`materiSingkatList\` dengan TEPAT ${totalPertemuan} elemen.
   - Jika pengguna mengunggah file bahan ajar/buku/PDF, Ringkasan Materi Pembelajaran WAJIB DISUSUN SECARA PRESISI DAN SETIA BERDASARKAN KONTEN & ISI FILE PDF/BUKU TERSEBUT.
   - Masing-masing memuat \`pertemuanKe\` (1..${totalPertemuan}), \`topikMateri\`, \`ringkasanMateri\` (penjelasan 2-3 paragraf kaya informasi), \`poinKunci\` (3-5 poin penting), dan \`glosarium\` (istilah & arti dari bahan ajar).

Kembalikan jawaban DALAM FORMAT JSON SESUAI SCHEMA berikut.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            identitas: {
              type: Type.OBJECT,
              properties: {
                namaSekolah: { type: Type.STRING },
                namaGuru: { type: Type.STRING },
                nipGuru: { type: Type.STRING },
                namaKepalaSekolah: { type: Type.STRING },
                nipKepalaSekolah: { type: Type.STRING },
                mataPelajaran: { type: Type.STRING },
                fase: { type: Type.STRING },
                kelas: { type: Type.STRING },
                semester: { type: Type.STRING },
                alokasiWaktu: { type: Type.STRING },
                jumlahPertemuan: { type: Type.INTEGER },
                tahunAjaran: { type: Type.STRING },
                targetPesertaDidik: { type: Type.STRING },
              },
              required: [
                "namaSekolah",
                "namaGuru",
                "namaKepalaSekolah",
                "mataPelajaran",
                "fase",
                "kelas",
                "targetPesertaDidik",
              ],
            },
            identifikasi: {
              type: Type.OBJECT,
              properties: {
                pesertaDidik: { type: Type.STRING },
                materiPelajaran: { type: Type.STRING },
                dimensiProfilLulusan: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "DPL1, DPL2, DPL3, DPL4, DPL5, DPL6, DPL7, DPL8 yang terpilih",
                },
              },
              required: ["pesertaDidik", "materiPelajaran", "dimensiProfilLulusan"],
            },
            desainPembelajaran: {
              type: Type.OBJECT,
              properties: {
                capaianPembelajaran: { type: Type.STRING },
                lintasDisiplinIlmu: { type: Type.STRING },
                tujuanPembelajaran: { type: Type.STRING },
                topikPembelajaran: { type: Type.STRING },
                praktikPedagogis: { type: Type.STRING },
                kemitraanPembelajaran: { type: Type.STRING },
                lingkunganPembelajaran: { type: Type.STRING },
                pemanfaatanDigital: { type: Type.STRING },
              },
              required: [
                "capaianPembelajaran",
                "lintasDisiplinIlmu",
                "tujuanPembelajaran",
                "topikPembelajaran",
                "praktikPedagogis",
                "kemitraanPembelajaran",
                "lingkunganPembelajaran",
                "pemanfaatanDigital",
              ],
            },
            pengalamanBelajar: {
              type: Type.OBJECT,
              properties: {
                jumlahPertemuan: { type: Type.INTEGER },
                pertemuanList: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      pertemuanKe: { type: Type.INTEGER },
                      alokasiWaktu: { type: Type.STRING },
                      fokusMateri: { type: Type.STRING },
                      awal: { type: Type.STRING },
                      intiMemahami: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      intiMengaplikasi: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      intiMerefleksi: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      penutup: { type: Type.STRING },
                    },
                    required: [
                      "pertemuanKe",
                      "awal",
                      "intiMemahami",
                      "intiMengaplikasi",
                      "intiMerefleksi",
                      "penutup",
                    ],
                  },
                },
              },
              required: ["pertemuanList"],
            },
            asesmenPembelajaran: {
              type: Type.OBJECT,
              properties: {
                asesmenAwal: { type: Type.STRING },
                asesmenProses: { type: Type.STRING },
                asesmenAkhir: { type: Type.STRING },
              },
              required: ["asesmenAwal", "asesmenProses", "asesmenAkhir"],
            },
            pendukung: {
              type: Type.OBJECT,
              properties: {
                soalAsesmen: {
                  type: Type.OBJECT,
                  properties: {
                    pilihanGanda: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          nomor: { type: Type.INTEGER },
                          pertanyaan: { type: Type.STRING },
                          opsi: {
                            type: Type.OBJECT,
                            properties: {
                              A: { type: Type.STRING },
                              B: { type: Type.STRING },
                              C: { type: Type.STRING },
                              D: { type: Type.STRING },
                            },
                            required: ["A", "B", "C", "D"],
                          },
                          kunciJawaban: { type: Type.STRING },
                          pembahasan: { type: Type.STRING },
                        },
                        required: ["nomor", "pertanyaan", "opsi", "kunciJawaban"],
                      },
                    },
                    uraian: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          nomor: { type: Type.INTEGER },
                          pertanyaan: { type: Type.STRING },
                          kunciJawaban: { type: Type.STRING },
                          rubrikPenilaian: { type: Type.STRING },
                        },
                        required: ["nomor", "pertanyaan", "kunciJawaban", "rubrikPenilaian"],
                      },
                    },
                    pedomanPenskoran: { type: Type.STRING },
                  },
                  required: ["pilihanGanda", "uraian", "pedomanPenskoran"],
                },
                lkpd: {
                  type: Type.OBJECT,
                  properties: {
                    pertemuanKe: { type: Type.INTEGER },
                    topikPertemuan: { type: Type.STRING },
                    judulLkpd: { type: Type.STRING },
                    petunjuk: { type: Type.STRING },
                    pertanyaanPemantik: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    langkahAktivitas: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    tugasKelompok: { type: Type.STRING },
                    lembarKerjaSiswa: { type: Type.STRING },
                  },
                  required: [
                    "judulLkpd",
                    "petunjuk",
                    "pertanyaanPemantik",
                    "langkahAktivitas",
                    "tugasKelompok",
                    "lembarKerjaSiswa",
                  ],
                },
                lkpdList: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      pertemuanKe: { type: Type.INTEGER },
                      topikPertemuan: { type: Type.STRING },
                      judulLkpd: { type: Type.STRING },
                      petunjuk: { type: Type.STRING },
                      pertanyaanPemantik: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      langkahAktivitas: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      tugasKelompok: { type: Type.STRING },
                      lembarKerjaSiswa: { type: Type.STRING },
                    },
                    required: [
                      "pertemuanKe",
                      "topikPertemuan",
                      "judulLkpd",
                      "petunjuk",
                      "pertanyaanPemantik",
                      "langkahAktivitas",
                      "tugasKelompok",
                      "lembarKerjaSiswa",
                    ],
                  },
                },
                materiSingkatList: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      pertemuanKe: { type: Type.INTEGER },
                      topikMateri: { type: Type.STRING },
                      ringkasanMateri: { type: Type.STRING },
                      poinKunci: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      glosarium: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            istilah: { type: Type.STRING },
                            arti: { type: Type.STRING },
                          },
                          required: ["istilah", "arti"],
                        },
                      },
                    },
                    required: ["pertemuanKe", "topikMateri", "ringkasanMateri", "poinKunci"],
                  },
                },
              },
            },
          },
          required: [
            "identitas",
            "identifikasi",
            "desainPembelajaran",
            "pengalamanBelajar",
            "asesmenPembelajaran",
          ],
        },
      },
    });

    const modulData = JSON.parse(response.text || "{}");
    if (modulData.identifikasi && Array.isArray(selectedDplList) && selectedDplList.length > 0) {
      modulData.identifikasi.dimensiProfilLulusan = selectedDplList;
    }
    res.json({ success: true, data: modulData });
  } catch (error: any) {
    console.error("Error generating modul:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Gagal membuat modul ajar.",
    });
  }
});

// API: Generate / Regenerate Soal Asesmen
app.post("/api/generate-soal", async (req, res) => {
  try {
    const { mataPelajaran, fase, kelas, topikPembelajaran, capaianPembelajaran, uploadedMaterialText } = req.body;
    const ai = getGeminiAi();

    const prompt = `
Anda adalah pembuat soal ujian dan instrumen evaluasi pembelajaran Kurikulum Merdeka.
Buatkan Bank Soal Asesmen Pembelajaran yang berkualitas tinggi untuk:
- Mata Pelajaran: ${mataPelajaran}
- Fase / Kelas: ${fase} / ${kelas}
- Topik: ${topikPembelajaran}
- Capaian Pembelajaran: ${capaianPembelajaran || "-"}
- Bahan Ajar Tambahan: ${uploadedMaterialText ? `"""${uploadedMaterialText}"""` : "Sesuai standar kurikulum"}

Hasilkan TEPAT KETENTUAN BERIKUT:
1. 10 Soal Pilihan Ganda (PG) (nomor 1 s.d 10) dengan Opsi A, B, C, D, Kunci Jawaban, dan Pembahasan rinci. Wajib mengintegrasikan soal-soal HOTS (Higher Order Thinking Skills / Analisis, Evaluasi, Sintesis) untuk menguji berpikir kritis siswa.
2. 3 Soal Uraian / Essay HOTS (nomor 1 s.d 3) berbasis studi kasus/penalaran mendalam, lengkap dengan Kunci Jawaban rinci dan Rubrik Penilaian (kriteria & skor).
3. Pedoman Penskoran dan Perhitungan Nilai Akhir.

Kembalikan format JSON sesuai schema.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pilihanGanda: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nomor: { type: Type.INTEGER },
                  pertanyaan: { type: Type.STRING },
                  opsi: {
                    type: Type.OBJECT,
                    properties: {
                      A: { type: Type.STRING },
                      B: { type: Type.STRING },
                      C: { type: Type.STRING },
                      D: { type: Type.STRING },
                    },
                    required: ["A", "B", "C", "D"],
                  },
                  kunciJawaban: { type: Type.STRING },
                  pembahasan: { type: Type.STRING },
                },
                required: ["nomor", "pertanyaan", "opsi", "kunciJawaban"],
              },
            },
            uraian: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nomor: { type: Type.INTEGER },
                  pertanyaan: { type: Type.STRING },
                  kunciJawaban: { type: Type.STRING },
                  rubrikPenilaian: { type: Type.STRING },
                },
                required: ["nomor", "pertanyaan", "kunciJawaban", "rubrikPenilaian"],
              },
            },
            pedomanPenskoran: { type: Type.STRING },
          },
          required: ["pilihanGanda", "uraian", "pedomanPenskoran"],
        },
      },
    });

    const soalData = JSON.parse(response.text || "{}");
    res.json({ success: true, data: soalData });
  } catch (error: any) {
    console.error("Error generating soal:", error);
    res.status(500).json({ success: false, error: error.message || "Gagal membuat bank soal." });
  }
});

// API: Generate / Regenerate LKPD
app.post("/api/generate-lkpd", async (req, res) => {
  try {
    const {
      mataPelajaran,
      fase,
      kelas,
      topikPembelajaran,
      capaianPembelajaran,
      uploadedMaterialText,
      jumlahPertemuan = 1,
      pertemuanList = [],
      pertemuanKe,
    } = req.body;
    const ai = getGeminiAi();

    const totalCount = Math.min(Math.max(Number(jumlahPertemuan) || 1, 1), 35);

    const isSingleMeetingRequest = typeof pertemuanKe === "number" && pertemuanKe >= 1;

    let meetingContext = "";
    if (isSingleMeetingRequest) {
      const pData = pertemuanList.find((p: any) => p.pertemuanKe === pertemuanKe) || {};
      meetingContext = `Hanya untuk Pertemuan Ke-${pertemuanKe}: Fokus Sub-Materi = "${pData.fokusMateri || topikPembelajaran}"`;
    } else if (pertemuanList.length > 0) {
      meetingContext = `Daftar Pertemuan (${totalCount} Pertemuan):\n` +
        pertemuanList.map((p: any) => `- Pertemuan ${p.pertemuanKe}: ${p.fokusMateri || "Sub-topik Pertemuan " + p.pertemuanKe}`).join("\n");
    } else {
      meetingContext = `Total ${totalCount} Pertemuan untuk topik utama "${topikPembelajaran}". Bagikan sub-topik LKPD sesuai alur ${totalCount} pertemuan.`;
    }

    const prompt = `
Anda adalah penyusun Lembar Kegiatan Peserta Didik (LKPD) Kurikulum Merdeka.
Buatkan Paket LKPD (Student Worksheets) interaktif dan sistematis untuk MASING-MASING PERTEMUAN:
- Mata Pelajaran: ${mataPelajaran}
- Fase / Kelas: ${fase} / ${kelas}
- Topik Utama: ${topikPembelajaran}
- Capaian Pembelajaran: ${capaianPembelajaran || "-"}
- Konteks Pertemuan: ${meetingContext}
- Bahan Ajar Tambahan File: ${uploadedMaterialText ? `"""${uploadedMaterialText}"""` : "Sesuai standar kurikulum"}

Instruksi:
${
  isSingleMeetingRequest
    ? `Hasilkan 1 LKPD khusus Pertemuan ke-${pertemuanKe}.`
    : `Hasilkan array lkpdList dengan TEPAT ${totalCount} elemen LKPD (Satu LKPD khusus untuk setiap Pertemuan 1 s.d. ${totalCount}).`
}

Setiap LKPD mencakup:
1. pertemuanKe (angka pertemuan)
2. topikPertemuan (sub-topik materi pertemuan)
3. judulLkpd yang menarik dan kontekstual
4. petunjuk pengerjaan yang ramah peserta didik, ringkas, sangat mudah dipahami, dan SELARAS LANGSUNG dengan alur langkah-langkah pembelajaran (Mindful, Meaningful, Joyful) pada pertemuan tersebut
5. 3 pertanyaan pemantik / masalah kontekstual
6. langkah aktivitas / praktikum yang terstruktur mengarahkan aktivitas nyata siswa
7. tugas diskusi kelompok
8. format lembar kerja siswa

Kembalikan format JSON sesuai schema.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lkpdList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pertemuanKe: { type: Type.INTEGER },
                  topikPertemuan: { type: Type.STRING },
                  judulLkpd: { type: Type.STRING },
                  petunjuk: { type: Type.STRING },
                  pertanyaanPemantik: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  langkahAktivitas: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  tugasKelompok: { type: Type.STRING },
                  lembarKerjaSiswa: { type: Type.STRING },
                },
                required: [
                  "pertemuanKe",
                  "topikPertemuan",
                  "judulLkpd",
                  "petunjuk",
                  "pertanyaanPemantik",
                  "langkahAktivitas",
                  "tugasKelompok",
                  "lembarKerjaSiswa",
                ],
              },
            },
          },
          required: ["lkpdList"],
        },
      },
    });

    const lkpdResult = JSON.parse(response.text || "{}");
    const list = lkpdResult.lkpdList || [];
    res.json({
      success: true,
      data: {
        lkpd: list[0] || null,
        lkpdList: list,
      },
    });
  } catch (error: any) {
    console.error("Error generating LKPD:", error);
    res.status(500).json({ success: false, error: error.message || "Gagal membuat LKPD." });
  }
});

// API: Generate / Regenerate Materi Singkat per Pertemuan
app.post("/api/generate-materi", async (req, res) => {
  try {
    const {
      mataPelajaran,
      fase,
      kelas,
      topikPembelajaran,
      jumlahPertemuan = 1,
      pertemuanList = [],
      uploadedMaterialText,
    } = req.body;
    const ai = getGeminiAi();

    const totalCount = Math.min(Math.max(Number(jumlahPertemuan) || 1, 1), 35);

    let meetingContext = "";
    if (pertemuanList.length > 0) {
      meetingContext = `Daftar Pertemuan (${totalCount} Pertemuan):\n` +
        pertemuanList.map((p: any) => `- Pertemuan ${p.pertemuanKe}: ${p.fokusMateri || "Sub-topik Pertemuan " + p.pertemuanKe}`).join("\n");
    } else {
      meetingContext = `Total ${totalCount} Pertemuan untuk topik utama "${topikPembelajaran}".`;
    }

    const prompt = `
Anda adalah penyusun materi ajar dan bahan bacaan Kurikulum Merdeka.
Buatkan Materi Singkat Pembelajaran (Ringkasan Materi Ajar) yang komunikatif, padat, dan terstruktur untuk MASING-MASING PERTEMUAN (${totalCount} Pertemuan):
- Mata Pelajaran: ${mataPelajaran}
- Fase / Kelas: ${fase} / ${kelas}
- Topik Utama: ${topikPembelajaran}
- Alur Pertemuan: ${meetingContext}
- Bahan Ajar Sumber (File Upload): ${uploadedMaterialText ? `"""${uploadedMaterialText}"""` : "Sesuai standar kurikulum & alur pengalaman belajar"}

Instruksi:
Hasilkan array materiSingkatList dengan TEPAT ${totalCount} elemen Ringkasan Materi (Satu materi singkat khusus untuk setiap Pertemuan 1 s.d. ${totalCount}).
JIKA ADA FILE BAHAN AJAR / BUKU / PDF YANG DIUNGGAH PENGGUNA, RINGKASAN MATERI PEMBELAJARAN PER PERTEMUAN WAJIB DISUSUN SECARA PRESISI DAN SETIA BERDASARKAN KONTEN TERSEBUT.

Setiap materi singkat mencakup:
1. pertemuanKe (angka 1 s.d ${totalCount})
2. topikMateri (sub-topik materi pertemuan)
3. ringkasanMateri (penjelasan ringkas, bermakna, komprehensif 2-3 paragraf yang setia pada dokumen/buku yang diunggah)
4. poinKunci (3-5 poin penting yang wajib diingat siswa dari bahan ajar)
5. glosarium (2-4 istilah penting beserta definisinya)

Kembalikan format JSON sesuai schema.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            materiSingkatList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pertemuanKe: { type: Type.INTEGER },
                  topikMateri: { type: Type.STRING },
                  ringkasanMateri: { type: Type.STRING },
                  poinKunci: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  glosarium: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        istilah: { type: Type.STRING },
                        arti: { type: Type.STRING },
                      },
                      required: ["istilah", "arti"],
                    },
                  },
                },
                required: ["pertemuanKe", "topikMateri", "ringkasanMateri", "poinKunci"],
              },
            },
          },
          required: ["materiSingkatList"],
        },
      },
    });

    const materiResult = JSON.parse(response.text || "{}");
    res.json({
      success: true,
      data: materiResult.materiSingkatList || [],
    });
  } catch (error: any) {
    console.error("Error generating materi singkat:", error);
    res.status(500).json({ success: false, error: error.message || "Gagal membuat materi singkat." });
  }
});

// API: Refine / Generate Single Field via Gemini
app.post("/api/generate-field", async (req, res) => {
  try {
    const { fieldType, contextInfo } = req.body;
    const ai = getGeminiAi();

    const prompt = `
Anda adalah konsultan pendidikan Kurikulum Merdeka & Pembelajaran Mendalam.
Bantu tuliskan isi dari bagian "${fieldType}" untuk Modul Ajar berikut dalam bahasa Indonesia yang ringkas, baku, lugas, dan sistematis.

Konteks Pembelajaran:
Mata Pelajaran: ${contextInfo.mataPelajaran || "-"}
Fase: ${contextInfo.fase || "-"}
Kelas: ${contextInfo.kelas || "-"}
Topik: ${contextInfo.topikPembelajaran || "-"}
Target Peserta Didik: ${contextInfo.targetPesertaDidik || "-"}

Instruksi khusus untuk bagian "${fieldType}":
- Jika Capaian Pembelajaran (CP): Sertakan teks CP resmi Kemendikbudristek terkini untuk fase ini.
- Jika Tujuan Pembelajaran: Buat kalimat terukur dengan indikator keberhasilan.
- Jika Langkah Pembelajaran: Tulis poin-poin kegiatan pembelajaran yang aktif dan menyenangkan.
- Jika Asesmen: Jelaskan bentuk dan instrumen asesmen yang relevan (diagnostik, formatik, sumatif).

Tulis langsung hasilnya tanpa kalimat pembuka bertele-tele.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ success: true, text: response.text?.trim() || "" });
  } catch (error: any) {
    console.error("Error generating field:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Gagal memproses AI.",
    });
  }
});

// Start Express Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
