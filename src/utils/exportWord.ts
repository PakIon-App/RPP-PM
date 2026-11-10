import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  PageBreak,
} from "docx";
import { saveAs } from "file-saver";
import { ModulAjar } from "../types";
import { getKotaDanTanggal } from "./formatUtils";

export interface ExportOptions {
  paperSize: "a4" | "letter" | "legal";
  orientation: "portrait" | "landscape";
  scope: "ALL" | "MODUL" | "SOAL" | "LKPD" | "MATERI";
}

// Color palette
const COLOR_PRIMARY = "0369A1"; // Deep Sky Blue
const COLOR_DARK = "0F172A"; // Dark Slate
const COLOR_BG_LIGHT = "F1F5F9"; // Light Slate
const COLOR_BG_HEADER = "E2E8F0"; // Header Gray
const COLOR_BORDER = "CBD5E1"; // Border Gray

const createTitlePara = (text: string, subtitle?: string) => {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: text,
          bold: true,
          size: 28, // 14pt
          color: COLOR_DARK,
        }),
      ],
    }),
  ];

  if (subtitle) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: [
          new TextRun({
            text: subtitle,
            bold: true,
            size: 22, // 11pt
            color: COLOR_PRIMARY,
          }),
        ],
      })
    );
  }

  return children;
};

const createSectionHeader = (title: string) => {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 24, // 12pt
        color: COLOR_PRIMARY,
      }),
    ],
  });
};

const createSubHeader = (title: string) => {
  return new Paragraph({
    spacing: { before: 180, after: 80 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 22, // 11pt
        color: COLOR_DARK,
      }),
    ],
  });
};

const createCell = (
  text: string,
  bold = false,
  bgColor?: string,
  widthPercent = 25,
  colSpan = 1
) => {
  return new CellBuilder(text)
    .bold(bold)
    .bgColor(bgColor)
    .width(widthPercent)
    .colSpan(colSpan)
    .build();
};

class CellBuilder {
  private _text: string;
  private _bold = false;
  private _bgColor?: string;
  private _widthPercent = 25;
  private _colSpan = 1;

  constructor(text: string) {
    this._text = text || "-";
  }

  bold(b = true) {
    this._bold = b;
    return this;
  }

  bgColor(c?: string) {
    this._bgColor = c;
    return this;
  }

  width(w: number) {
    this._widthPercent = w;
    return this;
  }

  colSpan(c: number) {
    this._colSpan = c;
    return this;
  }

  build() {
    const rawText = this._text || "-";
    const lines = rawText.split("\n");
    const runs: TextRun[] = [];

    lines.forEach((line, idx) => {
      if (idx > 0) {
        runs.push(new TextRun({ break: 1 }));
      }
      runs.push(
        new TextRun({
          text: line,
          bold: this._bold,
          size: 20, // 10pt
          color: COLOR_DARK,
        })
      );
    });

    return new TableCell({
      columnSpan: this._colSpan,
      width: {
        size: this._widthPercent,
        type: WidthType.PERCENTAGE,
      },
      shading: this._bgColor ? { fill: this._bgColor } : undefined,
      margins: { top: 100, bottom: 100, left: 150, right: 150 },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
        left: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
        right: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
      },
      children: [
        new Paragraph({
          children: runs,
        }),
      ],
    });
  }
}

export const exportModulToWord = async (modul: ModulAjar, options: ExportOptions) => {
  const { identitas, identifikasi, desainPembelajaran, pengalamanBelajar, asesmenPembelajaran, pendukung } = modul;
  const { scope = "ALL" } = options;

  const docSections: any[] = [];
  const children: any[] = [];

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

  const lkpdList = pendukung?.lkpdList?.length
    ? pendukung.lkpdList
    : pendukung?.lkpd
    ? [pendukung.lkpd]
    : [];

  // ================= 1. MODUL AJAR UTAMA =================
  if (scope === "ALL" || scope === "MODUL") {
    // Title
    children.push(
      ...createTitlePara(
        "MODUL AJAR (PEMBELAJARAN MENDALAM / DEEP LEARNING)",
        `${(identitas.namaSekolah || "SEKOLAH").toUpperCase()} — KURIKULUM MERDEKA`
      )
    );

    // Section 1: Identitas
    children.push(createSectionHeader("I. IDENTITAS MODUL AJAR"));

    const tableIdentitas = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            createCell("I. IDENTITAS UTAMA DOKUMEN", true, COLOR_BG_LIGHT, 100, 4),
          ],
        }),
        new TableRow({
          children: [
            createCell("Mata Pelajaran", true, COLOR_BG_LIGHT, 20),
            createCell(identitas.mataPelajaran, false, undefined, 30),
            createCell("Tahun Ajaran", true, COLOR_BG_LIGHT, 20),
            createCell(identitas.tahunAjaran, false, undefined, 30),
          ],
        }),
        new TableRow({
          children: [
            createCell("Fase / Kelas", true, COLOR_BG_LIGHT, 20),
            createCell(`${identitas.fase} / ${identitas.kelas}`, false, undefined, 30),
            createCell("Semester", true, COLOR_BG_LIGHT, 20),
            createCell(identitas.semester, false, undefined, 30),
          ],
        }),
        new TableRow({
          children: [
            createCell("Jumlah Pertemuan", true, COLOR_BG_LIGHT, 20),
            createCell(`${identitas.jumlahPertemuan || pertemuanList.length} Pertemuan`, false, undefined, 30),
            createCell("Alokasi Waktu", true, COLOR_BG_LIGHT, 20),
            createCell(identitas.alokasiWaktu, false, undefined, 30),
          ],
        }),
        new TableRow({
          children: [
            createCell("Penyusun / Guru", true, COLOR_BG_LIGHT, 20),
            createCell(`${identitas.namaGuru} (${identitas.nipGuru ? "NIP. " + identitas.nipGuru : "-"})`, false, undefined, 30),
            createCell("Target Peserta Didik", true, COLOR_BG_LIGHT, 20),
            createCell(identitas.targetPesertaDidik || "Peserta didik reguler/tipikal", false, undefined, 30),
          ],
        }),
      ],
    });
    children.push(tableIdentitas);

    // Section 2: Identifikasi Murid
    children.push(createSectionHeader("II. IDENTIFIKASI MURID & PROFIL LULUSAN"));
    children.push(
      new Paragraph({
        spacing: { before: 80, after: 60 },
        children: [
          new TextRun({ text: "Pengetahuan Awal Siswa: ", bold: true, size: 20 }),
          new TextRun({ text: identifikasi.pesertaDidik || "-", size: 20 }),
        ],
      }),
      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun({ text: "Materi Pelajaran Utamaku: ", bold: true, size: 20 }),
          new TextRun({ text: identifikasi.materiPelajaran || "-", size: 20 }),
        ],
      }),
      new Paragraph({
        spacing: { before: 60, after: 120 },
        children: [
          new TextRun({ text: "Dimensi Profil Lulusan / Karakter: ", bold: true, size: 20 }),
          new TextRun({
            text: identifikasi.dimensiProfilLulusan?.join(", ") || "-",
            size: 20,
            color: COLOR_PRIMARY,
          }),
        ],
      })
    );

    // Section 3: Desain Pembelajaran
    children.push(createSectionHeader("III. DESAIN & STRATEGI PEMBELAJARAN"));

    const tableDesain = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            createCell("Capaian Pembelajaran (CP)", true, COLOR_BG_LIGHT, 30),
            createCell(desainPembelajaran.capaianPembelajaran, false, undefined, 70, 3),
          ],
        }),
        new TableRow({
          children: [
            createCell("Tujuan Pembelajaran (TP)", true, COLOR_BG_LIGHT, 30),
            createCell(desainPembelajaran.tujuanPembelajaran, false, undefined, 70, 3),
          ],
        }),
        new TableRow({
          children: [
            createCell("Topik Pembelajaran", true, COLOR_BG_LIGHT, 30),
            createCell(desainPembelajaran.topikPembelajaran, false, undefined, 70, 3),
          ],
        }),
        new TableRow({
          children: [
            createCell("Praktik Pedagogis", true, COLOR_BG_LIGHT, 30),
            createCell(desainPembelajaran.praktikPedagogis, false, undefined, 70, 3),
          ],
        }),
        new TableRow({
          children: [
            createCell("Pemanfaatan Digital", true, COLOR_BG_LIGHT, 30),
            createCell(desainPembelajaran.pemanfaatanDigital, false, undefined, 70, 3),
          ],
        }),
      ],
    });
    children.push(tableDesain);

    // Section 4: Pengalaman Belajar Per Pertemuan
    children.push(
      createSectionHeader(`IV. PENGALAMAN BELAJAR (${pertemuanList.length} PERTEMUAN)`)
    );

    pertemuanList.forEach((p) => {
      children.push(
        createSubHeader(
          `Pertemuan Ke-${p.pertemuanKe}: ${p.fokusMateri || desainPembelajaran.topikPembelajaran} (${p.alokasiWaktu || "2 x 45 Menit"})`
        )
      );

      // Kegiatan Awal
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ text: "Kegiatan Awal (Orientasi & Motivasi): ", bold: true, size: 20 }),
            new TextRun({ text: p.awal || "-", size: 20 }),
          ],
        })
      );

      // Kegiatan Inti - Memahami
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ text: "Kegiatan Inti — Memahami (Meaningful Learning): ", bold: true, size: 20 }),
            new TextRun({
              text: Array.isArray(p.intiMemahami) ? p.intiMemahami.join("; ") : p.intiMemahami || "-",
              size: 20,
            }),
          ],
        })
      );

      // Kegiatan Inti - Mengaplikasi
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ text: "Kegiatan Inti — Mengaplikasi (Active Learning): ", bold: true, size: 20 }),
            new TextRun({
              text: Array.isArray(p.intiMengaplikasi) ? p.intiMengaplikasi.join("; ") : p.intiMengaplikasi || "-",
              size: 20,
            }),
          ],
        })
      );

      // Kegiatan Inti - Merefleksi
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({ text: "Kegiatan Inti — Merefleksi (Joyful Learning): ", bold: true, size: 20 }),
            new TextRun({
              text: Array.isArray(p.intiMerefleksi) ? p.intiMerefleksi.join("; ") : p.intiMerefleksi || "-",
              size: 20,
            }),
          ],
        })
      );

      // Kegiatan Penutup
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 140 },
          children: [
            new TextRun({ text: "Kegiatan Penutup (Evaluasi & Refleksi): ", bold: true, size: 20 }),
            new TextRun({ text: p.penutup || "-", size: 20 }),
          ],
        })
      );
    });

    // Section 5: Asesmen Pembelajaran
    children.push(createSectionHeader("V. ASESMEN PEMBELAJARAN"));
    children.push(
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: "Asesmen Awal (Diagnostic Assessment): ", bold: true, size: 20 }),
          new TextRun({ text: asesmenPembelajaran.asesmenAwal || "-", size: 20 }),
        ],
      }),
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({ text: "Asesmen Proses (Formative Assessment): ", bold: true, size: 20 }),
          new TextRun({ text: asesmenPembelajaran.asesmenProses || "-", size: 20 }),
        ],
      }),
      new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 240 },
        children: [
          new TextRun({ text: "Asesmen Akhir (Summative Assessment): ", bold: true, size: 20 }),
          new TextRun({ text: asesmenPembelajaran.asesmenAkhir || "-", size: 20 }),
        ],
      })
    );

    // Signatures Table
    const signatureTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableTableCellNoBorder({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "Mengetahui,", size: 20 })],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `Kepala ${identitas.namaSekolah || "Sekolah"}`,
                      size: 20,
                      bold: true,
                    }),
                  ],
                }),
                new Paragraph({
                  spacing: { before: 800, after: 100 },
                  children: [],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: identitas.namaKepalaSekolah || "(....................................)",
                      bold: true,
                      underline: {},
                      size: 20,
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `NIP. ${identitas.nipKepalaSekolah || "...................................."}`,
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
            new TableTableCellNoBorder({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: getKotaDanTanggal(identitas),
                      size: 20,
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "Guru Mata Pelajaran",
                      size: 20,
                      bold: true,
                    }),
                  ],
                }),
                new Paragraph({
                  spacing: { before: 800, after: 100 },
                  children: [],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: identitas.namaGuru || "(....................................)",
                      bold: true,
                      underline: {},
                      size: 20,
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `NIP. ${identitas.nipGuru || "...................................."}`,
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
    children.push(signatureTable);
  }

  // ================= 2. BANK SOAL ASESMEN =================
  if ((scope === "ALL" || scope === "SOAL") && pendukung?.soalAsesmen) {
    if (scope === "ALL") {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }

    children.push(
      ...createTitlePara(
        "SUPLEMEN ASESMEN & BANK SOAL",
        `${identitas.mataPelajaran} — Kelas ${identitas.kelas} (${identitas.namaSekolah})`
      )
    );

    const soal = pendukung.soalAsesmen;

    // Pilihan Ganda
    children.push(createSectionHeader("A. SOAL PILIHAN GANDA (5 SOAL)"));

    soal.pilihanGanda?.forEach((pg, i) => {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({ text: `${i + 1}. `, bold: true, size: 20 }),
            new TextRun({ text: pg.pertanyaan, bold: true, size: 20 }),
          ],
        }),
        new Paragraph({
          indent: { left: 280 },
          children: [new TextRun({ text: `A. ${pg.opsi?.A || ""}`, size: 20 })],
        }),
        new Paragraph({
          indent: { left: 280 },
          children: [new TextRun({ text: `B. ${pg.opsi?.B || ""}`, size: 20 })],
        }),
        new Paragraph({
          indent: { left: 280 },
          children: [new TextRun({ text: `C. ${pg.opsi?.C || ""}`, size: 20 })],
        }),
        new Paragraph({
          indent: { left: 280 },
          children: [new TextRun({ text: `D. ${pg.opsi?.D || ""}`, size: 20 })],
        }),
        new Paragraph({
          indent: { left: 280 },
          spacing: { after: 120 },
          children: [
            new TextRun({ text: "Kunci Jawaban: ", bold: true, size: 19, color: COLOR_PRIMARY }),
            new TextRun({ text: `${pg.kunciJawaban} `, bold: true, size: 19, color: COLOR_PRIMARY }),
            new TextRun({ text: `| Pembahasan: ${pg.pembahasan}`, size: 19, color: "475569" }),
          ],
        })
      );
    });

    // Uraian
    children.push(createSectionHeader("B. SOAL URAIAN (ESSAY)"));

    soal.uraian?.forEach((ur, i) => {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({ text: `${i + 1}. `, bold: true, size: 20 }),
            new TextRun({ text: ur.pertanyaan, bold: true, size: 20 }),
          ],
        }),
        new Paragraph({
          indent: { left: 280 },
          children: [
            new TextRun({ text: "Kunci Jawaban: ", bold: true, size: 19 }),
            new TextRun({ text: ur.kunciJawaban, size: 19 }),
          ],
        }),
        new Paragraph({
          indent: { left: 280 },
          spacing: { after: 120 },
          children: [
            new TextRun({ text: "Rubrik Penilaian: ", bold: true, size: 19 }),
            new TextRun({ text: ur.rubrikPenilaian, size: 19 }),
          ],
        })
      );
    });
  }

  // ================= 3. LKPD SISWA PER PERTEMUAN =================
  if ((scope === "ALL" || scope === "LKPD") && lkpdList.length > 0) {
    lkpdList.forEach((lkpdItem, idx) => {
      if (scope === "ALL" || idx > 0) {
        children.push(new Paragraph({ children: [new PageBreak()] }));
      }

      const pKe = lkpdItem.pertemuanKe || idx + 1;

      children.push(
        ...createTitlePara(
          `LEMBAR KEGIATAN PESERTA DIDIK (LKPD) — PERTEMUAN KE-${pKe}`,
          `Sub-Topik: ${lkpdItem.topikPertemuan || desainPembelajaran.topikPembelajaran}`
        )
      );

      // Info Table
      const infoLkpdTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              createCell(`Judul LKPD: ${lkpdItem.judulLkpd}`, true, COLOR_BG_LIGHT, 50),
              createCell(`Mata Pelajaran: ${identitas.mataPelajaran}`, true, COLOR_BG_LIGHT, 50),
            ],
          }),
          new TableRow({
            children: [
              createCell(`Fase / Kelas: ${identitas.fase} / ${identitas.kelas}`, false, undefined, 50),
              createCell(`Kelompok / Anggota: ............................................`, false, undefined, 50),
            ],
          }),
        ],
      });
      children.push(infoLkpdTable);

      // Petunjuk Pengerjaan
      children.push(
        createSubHeader("A. PETUNJUK PENGERJAAN"),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: lkpdItem.petunjuk || "-", size: 20 })],
        })
      );

      // Pertanyaan Pemantik
      if (lkpdItem.pertanyaanPemantik?.length) {
        children.push(createSubHeader("B. PERTANYAAN PEMANTIK / MASALAH"));
        lkpdItem.pertanyaanPemantik.forEach((pem) => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              children: [new TextRun({ text: pem, size: 20 })],
            })
          );
        });
      }

      // Langkah Aktivitas
      if (lkpdItem.langkahAktivitas?.length) {
        children.push(createSubHeader("C. LANGKAH-LANGKAH AKTIVITAS & PRAKTIKUM"));
        lkpdItem.langkahAktivitas.forEach((lang, i) => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              children: [
                new TextRun({ text: `${i + 1}. `, bold: true, size: 20 }),
                new TextRun({ text: lang, size: 20 }),
              ],
            })
          );
        });
      }

      // Tugas Diskusi Kelompok
      if (lkpdItem.tugasKelompok) {
        children.push(
          createSubHeader("D. TUGAS DISKUSI KELOMPOK"),
          new Paragraph({
            spacing: { after: 100 },
            children: [new TextRun({ text: lkpdItem.tugasKelompok, size: 20 })],
          })
        );
      }

      // Format Lembar Kerja Siswa Box
      children.push(
        createSubHeader("E. LEMBAR HASIL KERJA SISWA"),
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: lkpdItem.lembarKerjaSiswa || "(Tuliskan Jawaban / Hasil Diskusi Kelompok)",
              italics: true,
              size: 19,
              color: "64748B",
            }),
          ],
        })
      );

      // Answer Box Table
      const answerBoxTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            height: { value: 2000, rule: "atLeast" },
            children: [
              new TableCell({
                borders: {
                  top: { style: BorderStyle.DASHED, size: 8, color: COLOR_PRIMARY },
                  bottom: { style: BorderStyle.DASHED, size: 8, color: COLOR_PRIMARY },
                  left: { style: BorderStyle.DASHED, size: 8, color: COLOR_PRIMARY },
                  right: { style: BorderStyle.DASHED, size: 8, color: COLOR_PRIMARY },
                },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "(Area Jawaban & Catatan Siswa)",
                        color: "CBD5E1",
                        italics: true,
                        size: 20,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      });
      children.push(answerBoxTable);
    });
  }

  // ================= 4. MATERI SINGKAT PEMBELAJARAN PER PERTEMUAN =================
  const materiSingkatList = pendukung?.materiSingkatList || [];
  if ((scope === "ALL" || scope === "MATERI") && materiSingkatList.length > 0) {
    materiSingkatList.forEach((materiItem, idx) => {
      if (scope === "ALL" || idx > 0 || lkpdList.length > 0) {
        children.push(new Paragraph({ children: [new PageBreak()] }));
      }

      const pKe = materiItem.pertemuanKe || idx + 1;

      children.push(
        ...createTitlePara(
          `LAMPIRAN MATERI SINGKAT PEMBELAJARAN — PERTEMUAN KE-${pKe}`,
          `Topik: ${materiItem.topikMateri || "Materi Pembelajaran"}`
        )
      );

      // Info Table
      const infoMateriTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              createCell(`Mata Pelajaran: ${identitas.mataPelajaran}`, true, COLOR_BG_LIGHT, 50),
              createCell(`Fase / Kelas: ${identitas.fase} / ${identitas.kelas}`, true, COLOR_BG_LIGHT, 50),
            ],
          }),
        ],
      });
      children.push(infoMateriTable);

      // Ringkasan Materi
      children.push(createSubHeader("A. RINGKASAN & URAIAN MATERI AJAR"));
      const ringkasanLines = (materiItem.ringkasanMateri || "-").split("\n");
      ringkasanLines.forEach((line) => {
        if (line.trim()) {
          children.push(
            new Paragraph({
              spacing: { after: 100 },
              children: [new TextRun({ text: line, size: 20 })],
            })
          );
        }
      });

      // Poin-Poin Kunci
      if (materiItem.poinKunci?.length) {
        children.push(createSubHeader("B. POIN-POIN KUNCI PEMBELAJARAN"));
        materiItem.poinKunci.forEach((pk) => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              children: [new TextRun({ text: pk, size: 20 })],
            })
          );
        });
      }

      // Glosarium
      if (materiItem.glosarium?.length) {
        children.push(createSubHeader("C. GLOSARIUM & ISTILAH PENTING"));
        const tableRows = [
          new TableRow({
            children: [
              createCell("Istilah / Kata Kunci", true, COLOR_BG_HEADER, 35),
              createCell("Definisi / Arti", true, COLOR_BG_HEADER, 65),
            ],
          }),
        ];

        materiItem.glosarium.forEach((glo) => {
          tableRows.push(
            new TableRow({
              children: [
                createCell(glo.istilah, true, undefined, 35),
                createCell(glo.arti, false, undefined, 65),
              ],
            })
          );
        });

        children.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
          })
        );
      }
    });
  }

  // Create Document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134, // 2cm
              bottom: 1134,
              left: 1134,
              right: 1134,
            },
          },
        },
        children: children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = (modul.title || "Modul_Ajar_Merdeka")
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase();
  const filename = `${cleanName}.docx`;

  saveAs(blob, filename);
};

class TableTableCellNoBorder extends TableCell {
  constructor(options: { children: Paragraph[] }) {
    super({
      width: { size: 50, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: "AUTO" },
        bottom: { style: BorderStyle.NONE, size: 0, color: "AUTO" },
        left: { style: BorderStyle.NONE, size: 0, color: "AUTO" },
        right: { style: BorderStyle.NONE, size: 0, color: "AUTO" },
      },
      children: options.children,
    });
  }
}
