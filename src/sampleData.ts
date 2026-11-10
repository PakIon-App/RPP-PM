import { ModulAjar } from "./types";

export const SAMPLE_MODULES: ModulAjar[] = [
  {
    id: "sample-1",
    title: "Modul Ajar Informatika Fase E - Berpikir Komputasional",
    createdAt: "2024-07-20T08:00:00.000Z",
    updatedAt: "2024-07-25T10:30:00.000Z",
    identitas: {
      namaSekolah: "SMA Negeri 1 Pembelajaran",
      namaGuru: "Drs. Budi Santoso, M.Kom",
      nipGuru: "198203152008011005",
      namaKepalaSekolah: "Dr. Siti Aminah, M.Pd",
      nipKepalaSekolah: "197508202000032001",
      mataPelajaran: "Informatika / Koding",
      fase: "Fase E",
      kelas: "X (Sepuluh)",
      semester: "1 (Ganjil)",
      alokasiWaktu: "4 x 45 Menit (2 Pertemuan)",
      jumlahPertemuan: 2,
      tahunAjaran: "2024/2025",
      targetPesertaDidik: "Peserta didik reguler/tipikal (36 siswa) dengan beragam tingkat literasi digital awal.",
      tanggalDokumen: "Jakarta, 15 Juli 2024",
    },
    identifikasi: {
      pesertaDidik:
        "Identifikasi kesiapan peserta didik: Sebagian besar siswa (70%) sudah terbiasa menggunakan smartphone, namun baru 30% yang memahami logika algoritma dasar. Kebutuhan belajar dipetakan melalui pre-test visual untuk mengelompokkan siswa ke dalam kelompok pemula, menengah, dan mahir.",
      materiPelajaran:
        "Analisis materi pelajaran: Pengetahuan prosedural dan konseptual tentang Berpikir Komputasional (Dekomposisi, Pengenalan Pola, Abstraksi, dan Algoritma). Relevan dengan pemecahan masalah sehari-hari dan integrasi nilai penalaran kritis serta kemandirian.",
      dimensiProfilLulusan: ["DPL3", "DPL4", "DPL5", "DPL6", "DPL8"],
    },
    desainPembelajaran: {
      capaianPembelajaran:
        "Pada akhir Fase E, peserta didik mampu menerapkan strategi algoritmik standar untuk menghasilkan beberapa solusi persoalan dengan data diskrit bervolume besar, serta mengkritisi efisiensi dan kebenaran algoritma.",
      lintasDisiplinIlmu:
        "Matematika (Logika Informatika & Himpunan) dan Bahasa Indonesia (Penyusunan Argumen Runtut).",
      tujuanPembelajaran:
        "Melalui model Problem Based Learning, peserta didik mampu:\n1. Menganalisis masalah kompleks dengan teknik dekomposisi secara tepat.\n2. Merancang langkah-langkah algoritma penyelesaian masalah secara sistematis dan terukur.",
      topikPembelajaran:
        "Penerapan 4 Pilar Berpikir Komputasional dalam Pemecahan Masalah Efisiensi Logistik.",
      praktikPedagogis:
        "Problem Based Learning (PBL) berbasis studi kasus nyata kehidupan sehari-hari.",
      kemitraanPembelajaran:
        "Kolaborasi antarsiswa dalam kelompok heterogen dan berdiskusi dengan mentor mahasiswa teknik informatika lokal.",
      lingkunganPembelajaran:
        "Ruang kelas interaktif dengan susunan meja berkelompok, dipadukan dengan Google Classroom dan media visual digital.",
      pemanfaatanDigital:
        "Platform Kahoot untuk evaluasi awal, LKPD Digital via Google Docs, dan simulasi algoritma interaktif.",
    },
    pengalamanBelajar: {
      jumlahPertemuan: 2,
      pertemuanList: [
        {
          pertemuanKe: 1,
          alokasiWaktu: "2 x 45 Menit",
          fokusMateri: "Dekomposisi dan Pengenalan Pola dalam Masalah Logistik",
          awal: "1. Orientasi Bermakna: Guru menyapa dan memeriksa kesiapan belajar siswa secara inklusif.\n2. Apersepsi Kontekstual: Guru menampilkan video pendek tentang kemacetan dan alur kurir pengiriman barang.\n3. Motivasi Menggembirakan: Permainan tebak pola algoritma singkat untuk membakar semangat belajar.",
          intiMemahami: [
            "Peserta didik mengamati studi kasus rute terpendek pengiriman paket pada peta digital.",
            "Siswa menyimak penjelasan interaktif guru mengenai 4 pilar Berpikir Komputasional (fokus pada Dekomposisi dan Pengenalan Pola).",
            "Kelompok mendiskusikan pertanyaan pemantik untuk membedakan abstraksi dan dekomposisi.",
          ],
          intiMengaplikasi: [
            "Peserta didik secara berkelompok (4-5 orang) membedah masalah rute kurir pada LKPD Digital.",
            "Masing-masing kelompok mengelompokkan variabel rute dan jarak tempuh.",
          ],
          intiMerefleksi: [
            "Siswa merefleksikan bagaimana dekomposisi membantu menyederhanakan masalah yang terlihat rumit.",
          ],
          penutup:
            "Guru menyimpulkan poin penting Pertemuan 1 dan menyampaikan gambaran penulisan algoritma pada Pertemuan 2.",
        },
        {
          pertemuanKe: 2,
          alokasiWaktu: "2 x 45 Menit",
          fokusMateri: "Abstraksi dan Perancangan Algoritma Flowchart",
          awal: "1. Review singkat hasil analisis Dekomposisi dari Pertemuan 1.\n2. Guru menyampaikan tujuan Pertemuan 2 yaitu membuat Flowchart Algoritma Solusi.",
          intiMemahami: [
            "Siswa mempelajari simbol standar Flowchart dan kaidah penulisan pseudocode.",
            "Guru memberikan contoh analisis efisiensi dua rute alternatif.",
          ],
          intiMengaplikasi: [
            "Kelompok menyusun diagram alur (Flowchart) rute paling efisien.",
            "Setiap kelompok mempresentasikan rancangan solusinya di depan kelas untuk ditanggapi kelompok lain.",
          ],
          intiMerefleksi: [
            "Peserta didik menilai kelebihan dan kelemahan algoritma yang disusun kelompoknya dibanding kelompok lain.",
            "Siswa menuliskan satu hal baru yang dipelajari dan satu tantangan pada padlet refleksi.",
          ],
          penutup:
            "Guru bersama peserta didik menyimpulkan materi utama, memberikan umpan balik konstruktif, serta menginfokan asesmen sumatif.",
        },
      ],
    },
    asesmenPembelajaran: {
      asesmenAwal:
        "Kuis interaktif diagnostik kognitif (5 soal pilihan ganda) untuk mengukur pemahaman awal logika algoritma.",
      asesmenProses:
        "Observasi unjuk kerja kelompok, penilaian antar-teman (Peer Assessment), dan rubrik partisipasi diskusi.",
      asesmenAkhir:
        "Tes tertulis berupa soal studi kasus uraian terstruktur dan penyerahan produk diagram alur solusi (LKPD).",
    },
    pendukung: {
      soalAsesmen: {
        pilihanGanda: [
          {
            nomor: 1,
            pertanyaan: "Teknik memecahkan masalah besar dan kompleks menjadi bagian-bagian kecil yang lebih mudah dikelola dalam berpikir komputasional disebut...",
            opsi: {
              A: "Abstraksi",
              B: "Dekomposisi",
              C: "Pengenalan Pola",
              D: "Algoritma",
            },
            kunciJawaban: "B",
            pembahasan: "Dekomposisi adalah proses membagi masalah kompleks menjadi sub-masalah yang lebih kecil dan sederhana.",
          },
          {
            nomor: 2,
            pertanyaan: "Proses mengabaikan rincian informasi yang tidak relevan agar fokus pada aspek inti masalah merupakan pilar...",
            opsi: {
              A: "Abstraksi",
              B: "Dekomposisi",
              C: "Evaluasi",
              D: "Simulasi",
            },
            kunciJawaban: "A",
            pembahasan: "Abstraksi berfokus pada menyaring informasi penting dan membuang rincian tak relevan.",
          },
          {
            nomor: 3,
            pertanyaan: "Urutan langkah-langkah logis dan terstruktur untuk menyelesaikan suatu masalah dinamakan...",
            opsi: {
              A: "Pseudocode",
              B: "Algoritma",
              C: "Flowchart",
              D: "Koding",
            },
            kunciJawaban: "B",
            pembahasan: "Algoritma adalah himpunan instruksi terurut untuk menyelesaikan tugas tertentu.",
          },
          {
            nomor: 4,
            pertanyaan: "(HOTS) Sebuah perusahaan ekspedisi ingin menghemat bahan bakar armada pengirimannya. Tindakan manakah yang paling mencerminkan penerapan pilar Abstraksi?",
            opsi: {
              A: "Mencatat nama seluruh pengemudi dan nomor plat kendaraan secara rinci.",
              B: "Mengabaikan warna paket dan fokus pada jarak geografis serta kemacetan jalan.",
              C: "Membagi wilayah paket menjadi 5 zona area pengantaran.",
              D: "Membuat daftar tugas harian untuk staf administrasi gudang.",
            },
            kunciJawaban: "B",
            pembahasan: "Abstraksi mengabaikan atribut sekunder (warna paket) dan memprioritaskan data krusial (jarak & kemacetan).",
          },
          {
            nomor: 5,
            pertanyaan: "Simbol flowchart berbentuk belah ketupat (diamond) digunakan untuk menggambarkan...",
            opsi: {
              A: "Proses perhitungan",
              B: "Input/Output data",
              C: "Keputusan / Kondisi Percabangan",
              D: "Awal / Akhir algoritma",
            },
            kunciJawaban: "C",
            pembahasan: "Belah ketupat melambangkan percabangan keputusan (Decision) dalam flowchart.",
          },
          {
            nomor: 6,
            pertanyaan: "(HOTS) Jika seorang kurir menghadapi rute dengan 3 persimpangan berlampu merah, algoritma manakah yang paling efisien memilih rute alternatif?",
            opsi: {
              A: "Algoritma pencarian rute dengan bobot waktu berdasarkan trafik real-time.",
              B: "Algoritma yang selalu memilih jalur lurus tanpa memperhatikan lampu lalu lintas.",
              C: "Algoritma acak yang mengubah arah di setiap persimpangan.",
              D: "Algoritma manual berdasarkan ingatan kurir tanpa mengecek kondisi jalan.",
            },
            kunciJawaban: "A",
            pembahasan: "Algoritma berbasis data bobot waktu real-time menghasilkan efisiensi tertinggi dalam memilih rute.",
          },
          {
            nomor: 7,
            pertanyaan: "Pilihan mana yang merupakan urutan logis perancangan solusi komputasional?",
            opsi: {
              A: "Koding -> Dekomposisi -> Abstraksi -> Algoritma",
              B: "Dekomposisi -> Pengenalan Pola -> Abstraksi -> Algoritma",
              C: "Algoritma -> Pengenalan Pola -> Koding -> Testing",
              D: "Abstraksi -> Koding -> Dekomposisi -> Evaluasi",
            },
            kunciJawaban: "B",
            pembahasan: "Urutan standar 4 pilar komputasional: Dekomposisi, Pengenalan Pola, Abstraksi, dan Algoritma.",
          },
          {
            nomor: 8,
            pertanyaan: "(HOTS) Analisislah dampak negatif jika pilar Dekomposisi diabaikan saat merancang sistem navigasi pintar!",
            opsi: {
              A: "Sistem menjadi terlalu cepat dalam mengolah data peta.",
              B: "Program rumit dan sulit di-debug karena masalah besar tidak dipecah menjadi modul kecil.",
              C: "Tampilan visual peta menjadi berwarna-warni.",
              D: "Kebutuhan memori penyimpanan berkurang drastis.",
            },
            kunciJawaban: "B",
            pembahasan: "Tanpa dekomposisi, kompleksitas sistem membengkak sehingga pemeliharaan dan perbaikan menjadi sangat sulit.",
          },
          {
            nomor: 9,
            pertanyaan: "Dalam penulisan pseudocode, perintah untuk menerima masukan pengguna biasanya menggunakan kata kunci...",
            opsi: {
              A: "PRINT / WRITE",
              B: "READ / INPUT",
              C: "IF / ELSE",
              D: "WHILE / LOOP",
            },
            kunciJawaban: "B",
            pembahasan: "READ atau INPUT digunakan untuk mengambil data masukan dari pengguna.",
          },
          {
            nomor: 10,
            pertanyaan: "(HOTS) Sebuah tim menguji algoritma rute pengiriman dan menemukan adanya kondisi loop tak terbatas (infinite loop). Langkah evaluasi terbaik yang harus dilakukan adalah...",
            opsi: {
              A: "Menghapus seluruh baris kode dan membuat ulang dari awal.",
              B: "Meneliti kondisi terminasi (stopping condition) pada struktur perulangan algoritma.",
              C: "Mengubah variabel input menjadi angka acak.",
              D: "Abaikan masalah tersebut karena jarang terjadi.",
            },
            kunciJawaban: "B",
            pembahasan: "Infinite loop terjadi karena kondisi berhenti (stopping condition) tidak pernah bernilai true/memenuhi kriteria.",
          },
        ],
        uraian: [
          {
            nomor: 1,
            pertanyaan: "(HOTS) Jelaskan bagaimana 4 pilar Berpikir Komputasional diterapkan secara konkret ketika seorang kurir ingin mengantar 10 paket ke 10 alamat berbeda secara efisien dan tepat waktu!",
            kunciJawaban: "Dekomposisi: membagi 10 alamat berdasarkan wilayah/kecamatan. Pengenalan Pola: melihat rute langganan yang bebas macet. Abstraksi: mengabaikan nama penerima dan fokus pada lokasi geografis. Algoritma: urutan mengantar paket dari terdekat ke terjauh.",
            rubrikPenilaian: "Skor 4: Menjelaskan 4 pilar secara akurat, logis, dan kontekstual. Skor 2: Menjelaskan 2-3 pilar. Skor 1: Jawaban kurang relevan.",
          },
          {
            nomor: 2,
            pertanyaan: "(HOTS) Sebuah aplikasi navigasi menunjukkan dua pilihan rute: Rute A (10 km, lancar) dan Rute B (6 km, macet padat). Analisis rute mana yang harus dipilih berdasarkan perhitungan algoritma waktu tempuh efisien!",
            kunciJawaban: "Analisis harus membandingkan Estimasi Waktu Tempuh (ETA) bukan hanya jarak fisik. Jika Rute A (10 km dengan kecepatan rata-rata 50 km/jam = 12 menit) dan Rute B (6 km dengan kecepatan 15 km/jam = 24 menit), maka Rute A lebih efisien secara waktu.",
            rubrikPenilaian: "Skor 4: Memberikan perhitungan perbandingan waktu dan kesimpulan logis. Skor 2: Hanya memilih rute tanpa argumen angka/waktu. Skor 1: Pilihan salah.",
          },
          {
            nomor: 3,
            pertanyaan: "(HOTS) Rancanglah sebuah flowchart (diagram alur) sederhana beserta penjelasannya untuk sistem keputusan pemilihan rute pengiriman barang berdasarkan kondisi cuaca (Hujan vs Cerah)!",
            kunciJawaban: "Flowchart memuat: Start -> Input Data Cuaca -> Decision (Apakah Cuaca Hujan?) -> Jika Ya: Pilih Rute Utama Berkanopi/Bebas Genangan -> Jika Tidak: Pilih Rute Jalan Pintas -> Output Rute Terpilih -> End.",
            rubrikPenilaian: "Skor 4: Flowchart menggunakan simbol standar resmi (start, input, decision, output, end) dan alur logika akurat. Skor 2: Simbol tidak sesuai. Skor 1: Tidak lengkap.",
          },
        ],
        pedomanPenskoran: "Nilai Akhir = (Skor PG x 5) + (Skor Uraian x 16.6). Total Maksimal = 100.",
      },
      lkpd: {
        judulLkpd: "LKPD Berpikir Komputasional: Efisiensi Rute Logistik Kurir",
        petunjuk: "1. Kerjakan secara berkelompok (4-5 orang).\n2. Bacalah studi kasus dengan teliti.\n3. Diskusikan solusi berdasarkan 4 pilar Berpikir Komputasional.",
        pertanyaanPemantik: [
          "Bagaimana cara menemukan rute terpendek jika ada 5 lokasi yang harus dikunjungi dalam satu waktu?",
          "Mengapa kemacetan jalan harus dimasukkan dalam pertimbangan algoritma?",
        ],
        langkahAktivitas: [
          "Buka peta lokasi pengiriman pada modul.",
          "Terapkan Dekomposisi dengan memetakan titik awal dan 5 alamat tujuan.",
          "Terapkan Abstraksi dengan menghilangkan informasi nama pemilik dan jenis barang.",
          "Gambar diagram alur (flowchart) rute perjalanan di lembar jawab.",
        ],
        tugasKelompok: "Buatlah kesepakatan rute paling hemat waktu dan presentasikan di depan kelas!",
        lembarKerjaSiswa: "Nama Kelompok: ..............\nAnggota:\n1. ............\n2. ............\n\nHasil Rancangan Algoritma & Flowchart:\n[Tuliskan/Gambarkan di sini]",
      },
      materiSingkatList: [
        {
          pertemuanKe: 1,
          topikMateri: "Dekomposisi dan Pengenalan Pola dalam Masalah Logistik",
          ringkasanMateri:
            "Berpikir komputasional adalah landasan penting dalam memecahkan masalah kompleks. Dekomposisi dilakukan dengan membagi masalah besar (seperti rute kurir mengantar belasan paket) menjadi bagian-bagian kecil per daerah pengiriman.\n\nSetelah masalah dipecah, langkah berikutnya adalah Pengenalan Pola, yaitu mengamati kemiripan rute, kepadatan lalu lintas pada jam tertentu, dan urutan titik lokasi agar waktu tempuh lebih efisien.",
          poinKunci: [
            "Dekomposisi memecah masalah kompleks menjadi komponen sederhana yang mudah dikelola.",
            "Pengenalan Pola mengenali kesamaan dan pola logis dari pengalaman atau data masa lalu.",
            "Penerapan pilar ini secara nyata membantu optimalisasi waktu dan sumber daya.",
          ],
          glosarium: [
            { istilah: "Dekomposisi", arti: "Teknik memecah masalah besar menjadi sub-masalah kecil." },
            { istilah: "Pengenalan Pola", arti: "Kemampuan menemukan kesamaan pola dalam data atau masalah." },
          ],
        },
        {
          pertemuanKe: 2,
          topikMateri: "Abstraksi dan Perancangan Algoritma Flowchart",
          ringkasanMateri:
            "Abstraksi berfungsi menyaring informasi yang tidak relevan (seperti warna kendaraan atau bentuk kemasan) agar pembelajar berfokus penuh pada koordinat dan waktu tempuh.\n\nAlgoritma merupakan urutan langkah logis yang dituangkan ke dalam diagram alur (Flowchart). Simbol oval digunakan untuk Mulai/Selesai, persegi panjang untuk Proses, dan belah ketupat untuk Keputusan.",
          poinKunci: [
            "Abstraksi menyaring detail tak penting agar fokus pada inti persoalan.",
            "Algoritma adalah himpunan instruksi terstruktur untuk menyelesaikan tugas.",
            "Flowchart menggambarkan alur logika secara visual menggunakan standar simbol resmi.",
          ],
          glosarium: [
            { istilah: "Abstraksi", arti: "Proses mengabaikan detail yang tidak relevan dengan inti masalah." },
            { istilah: "Flowchart", arti: "Diagram alur yang menggambarkan tahapan proses dan keputusan." },
          ],
        },
      ],
    },
  },
  {
    id: "sample-2",
    title: "Modul Ajar Bahasa Indonesia Fase A - Mengenal Huruf & Kata",
    createdAt: "2024-07-21T09:00:00.000Z",
    updatedAt: "2024-07-24T14:15:00.000Z",
    identitas: {
      namaSekolah: "SD Nusantara Ceria",
      namaGuru: "Siti Rahmawati, S.Pd",
      nipGuru: "199005122015032004",
      namaKepalaSekolah: "H. Ahmad Fauzi, M.Pd",
      nipKepalaSekolah: "196811101992031008",
      mataPelajaran: "Bahasa Indonesia",
      fase: "Fase A",
      kelas: "I (Satu)",
      semester: "1 (Ganjil)",
      alokasiWaktu: "2 x 35 Menit (1 Pertemuan)",
      jumlahPertemuan: 1,
      tahunAjaran: "2024/2025",
      targetPesertaDidik: "Peserta didik reguler kelas 1 SD (28 anak).",
      tanggalDokumen: "Bandung, 18 Juli 2024",
    },
    identifikasi: {
      pesertaDidik:
        "Siswa aktif dan senang bermain. 80% siswa sudah mengenal abjad, 20% masih membutuhkan bimbingan melafalkan suku kata sederhana.",
      materiPelajaran:
        "Pengetahuan fonemik dan suku kata 'ba-', 'bi-', 'bu-', 'be-', 'bo-'. Mengintegrasikan nilai keberanian dan sikap santun santun berbicara.",
      dimensiProfilLulusan: ["DPL1", "DPL4", "DPL7", "DPL8"],
    },
    desainPembelajaran: {
      capaianPembelajaran:
        "Peserta didik mampu mengeja suku kata dan kata-kata yang sering ditemui sehari-hari dengan lancar dan benar.",
      lintasDisiplinIlmu: "Seni Budaya (Lagu Anak Fonik) dan PJOK (Gerak Motorik Halus).",
      tujuanPembelajaran:
        "Melalui permainan kartu kata bergambar, peserta didik dapat membaca dan menyusun 5 kata yang berawalan huruf 'B' dengan benar.",
      topikPembelajaran: "Membaca dan Menyusun Kata Berawalan Huruf 'B'.",
      praktikPedagogis: "Pembelajaran Kontekstual & Metode Sentra Game Edukatif.",
      kemitraanPembelajaran: "Pendampingan Orang Tua di rumah untuk membacakan cerita pendek.",
      lingkunganPembelajaran: "Pojok Baca Ceria di kelas dengan alas karpet bernuansa ramah anak.",
      pemanfaatanDigital: "Video animasi lagu abjad dan aplikasi kartu kata interaktif.",
    },
    pengalamanBelajar: {
      jumlahPertemuan: 1,
      pertemuanList: [
        {
          pertemuanKe: 1,
          alokasiWaktu: "2 x 35 Menit",
          fokusMateri: "Membaca Suku Kata 'ba, bi, bu, be, bo'",
          awal: "Menyanyikan lagu 'Abjad B' bersama-sama diiringi gerakan tubuh dan tepuk semangat.",
          intiMemahami: [
            "Siswa mengamati benda nyata yang diawali huruf B (bola, buku, boneka).",
            "Guru mendemonstrasikan pelafalan suku kata ba, bi, bu, be, bo secara nyaring.",
          ],
          intiMengaplikasi: [
            "Siswa berpasangan mencocokkan kartu gambar dengan kartu suku kata yang tepat.",
            "Siswa menempelkan suku kata hingga membentuk kata utuh di papan tempel.",
          ],
          intiMerefleksi: [
            "Siswa menyebutkan kembali 3 kata favorit yang diawali huruf B yang baru dipelajari.",
          ],
          penutup: "Pemberian bintang apresiasi dan doa penutup pembelajaran.",
        },
      ],
    },
    asesmenPembelajaran: {
      asesmenAwal: "Tanya jawab lisan tebak gambar berawalan huruf B.",
      asesmenProses: "Lembar observasi kemampuan membaca suku kata.",
      asesmenAkhir: "Unjuk kerja menyusun kata pada lembar aktivitas bergambar.",
    },
  },
];
