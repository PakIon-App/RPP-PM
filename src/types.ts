export interface IdentitasModul {
  namaSekolah: string;
  kotaSekolah?: string;
  namaGuru: string;
  nipGuru: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  mataPelajaran: string;
  fase: string; // Fase A, B, C, D, E, F
  kelas: string;
  semester: string;
  alokasiWaktu: string;
  jumlahPertemuan?: number; // e.g. 1, 2, 3, 4 pertemuan
  tahunAjaran: string;
  targetPesertaDidik: string;
  tanggalDokumen: string;
}

export interface UploadedMaterialInfo {
  fileName: string;
  fileSize?: string;
  fileType?: string;
  extractedText?: string;
}

export interface IdentifikasiModul {
  pesertaDidik: string;
  materiPelajaran: string;
  dimensiProfilLulusan: string[]; // e.g. ['DPL1', 'DPL3', 'DPL5']
  materialFile?: UploadedMaterialInfo;
}

export interface DesainPembelajaranModul {
  capaianPembelajaran: string;
  lintasDisiplinIlmu: string;
  tujuanPembelajaran: string;
  topikPembelajaran: string;
  praktikPedagogis: string;
  kemitraanPembelajaran: string;
  lingkunganPembelajaran: string;
  pemanfaatanDigital: string;
}

export interface PertemuanPengalamanBelajar {
  pertemuanKe: number;
  alokasiWaktu?: string;
  fokusMateri?: string;
  awal: string;
  intiMemahami: string[];
  intiMengaplikasi: string[];
  intiMerefleksi: string[];
  penutup: string;
}

export interface PengalamanBelajarModul {
  jumlahPertemuan?: number;
  pertemuanList?: PertemuanPengalamanBelajar[];
  // Legacy / fallback single-pertemuan fields:
  awal?: string;
  intiMemahami?: string[];
  intiMengaplikasi?: string[];
  intiMerefleksi?: string[];
  penutup?: string;
}

export interface AsesmenPembelajaranModul {
  asesmenAwal: string;
  asesmenProses: string;
  asesmenAkhir: string;
}

// ================= SUPLEMENTAL LEARNING SUPPORT (SOAL & LKPD) =================

export interface SoalPilihanGanda {
  nomor: number;
  pertanyaan: string;
  opsi: { A: string; B: string; C: string; D: string };
  kunciJawaban: "A" | "B" | "C" | "D";
  pembahasan: string;
}

export interface SoalUraian {
  nomor: number;
  pertanyaan: string;
  kunciJawaban: string;
  rubrikPenilaian: string;
}

export interface SoalAsesmen {
  pilihanGanda: SoalPilihanGanda[];
  uraian: SoalUraian[];
  pedomanPenskoran: string;
}

export interface LkpdModul {
  pertemuanKe?: number;
  topikPertemuan?: string;
  judulLkpd: string;
  petunjuk: string;
  pertanyaanPemantik: string[];
  langkahAktivitas: string[];
  tugasKelompok: string;
  lembarKerjaSiswa: string;
}

export interface MateriSingkatPertemuan {
  pertemuanKe: number;
  topikMateri: string;
  ringkasanMateri: string;
  poinKunci: string[];
  glosarium?: { istilah: string; arti: string }[];
}

export interface PendukungPembelajaran {
  soalAsesmen?: SoalAsesmen;
  lkpd?: LkpdModul;
  lkpdList?: LkpdModul[];
  materiSingkatList?: MateriSingkatPertemuan[];
}

// ================= MODUL AJAR UTAMA =================

export interface ModulAjar {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  identitas: IdentitasModul;
  identifikasi: IdentifikasiModul;
  desainPembelajaran: DesainPembelajaranModul;
  pengalamanBelajar: PengalamanBelajarModul;
  asesmenPembelajaran: AsesmenPembelajaranModul;
  pendukung?: PendukungPembelajaran;
}

export const DIMENSI_PROFIL_LULUSAN = [
  { id: "DPL1", label: "Keimanan dan Ketakwaan terhadap Tuhan YME" },
  { id: "DPL2", label: "Kewargaan" },
  { id: "DPL3", label: "Penalaran Kritis" },
  { id: "DPL4", label: "Kreativitas" },
  { id: "DPL5", label: "Kolaborasi" },
  { id: "DPL6", label: "Kemandirian" },
  { id: "DPL7", label: "Kesehatan" },
  { id: "DPL8", label: "Komunikasi" },
];

export const DAFTAR_FASE = [
  { id: "Fase A", label: "Fase A (Kelas 1 - 2 SD)" },
  { id: "Fase B", label: "Fase B (Kelas 3 - 4 SD)" },
  { id: "Fase C", label: "Fase C (Kelas 5 - 6 SD)" },
  { id: "Fase D", label: "Fase D (Kelas 7 - 9 SMP)" },
  { id: "Fase E", label: "Fase E (Kelas 10 SMA/SMK)" },
  { id: "Fase F", label: "Fase F (Kelas 11 - 12 SMA/SMK)" },
];
