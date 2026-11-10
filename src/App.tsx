import { useState, useEffect } from "react";
import { ModulAjar } from "./types";
import { SAMPLE_MODULES } from "./sampleData";
import { Navbar } from "./components/Navbar";
import { ModulForm } from "./components/ModulForm";
import { ModulPreview } from "./components/ModulPreview";
import { AiGeneratorModal } from "./components/AiGeneratorModal";
import { SavedModulesModal } from "./components/SavedModulesModal";
import { ExportModal } from "./components/ExportModal";

const STORAGE_KEY = "MERDEKA_MODUL_SAVED_LIST_V1";

export default function App() {
  const [savedModules, setSavedModules] = useState<ModulAjar[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to parse saved modules:", e);
    }
    return SAMPLE_MODULES;
  });

  const [currentModul, setCurrentModul] = useState<ModulAjar>(
    () => savedModules[0] || SAMPLE_MODULES[0]
  );

  const [activeView, setActiveView] = useState<"edit" | "preview" | "split">("split");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Sync saved modules to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedModules));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }, [savedModules]);

  // Handler to update active modul & sync into saved list
  const handleUpdateModul = (updated: ModulAjar) => {
    setCurrentModul(updated);
    setSavedModules((prev) => {
      const exists = prev.some((m) => m.id === updated.id);
      if (exists) {
        return prev.map((m) => (m.id === updated.id ? updated : m));
      } else {
        return [updated, ...prev];
      }
    });
  };

  // Create new empty modul
  const handleCreateNew = () => {
    const newEmpty: ModulAjar = {
      id: `modul-${Date.now()}`,
      title: "Modul Ajar Baru",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      identitas: {
        namaSekolah: "",
        namaGuru: "",
        nipGuru: "",
        namaKepalaSekolah: "",
        nipKepalaSekolah: "",
        mataPelajaran: "",
        fase: "Fase D",
        kelas: "VII",
        semester: "1 (Ganjil)",
        alokasiWaktu: "2 x 45 Menit",
        tahunAjaran: "2024/2025",
        targetPesertaDidik: "Peserta didik reguler/tipikal",
        tanggalDokumen: `${new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`,
      },
      identifikasi: {
        pesertaDidik: "",
        materiPelajaran: "",
        dimensiProfilLulusan: ["DPL3", "DPL5"],
      },
      desainPembelajaran: {
        capaianPembelajaran: "",
        lintasDisiplinIlmu: "",
        tujuanPembelajaran: "",
        topikPembelajaran: "",
        praktikPedagogis: "Problem Based Learning",
        kemitraanPembelajaran: "",
        lingkunganPembelajaran: "",
        pemanfaatanDigital: "",
      },
      pengalamanBelajar: {
        awal: "",
        intiMemahami: [""],
        intiMengaplikasi: [""],
        intiMerefleksi: [""],
        penutup: "",
      },
      asesmenPembelajaran: {
        asesmenAwal: "",
        asesmenProses: "",
        asesmenAkhir: "",
      },
    };

    handleUpdateModul(newEmpty);
    setActiveView("edit");
  };

  // Duplicate modul
  const handleDuplicateModul = (modulToDuplicate: ModulAjar) => {
    const duplicated: ModulAjar = {
      ...modulToDuplicate,
      id: `modul-${Date.now()}`,
      title: `${modulToDuplicate.title || "Modul"} (Salinan)`,
      updatedAt: new Date().toISOString(),
    };
    handleUpdateModul(duplicated);
  };

  // Delete modul
  const handleDeleteModul = (idToDelete: string) => {
    const filtered = savedModules.filter((m) => m.id !== idToDelete);
    setSavedModules(filtered);
    if (currentModul.id === idToDelete) {
      if (filtered.length > 0) {
        setCurrentModul(filtered[0]);
      } else {
        handleCreateNew();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-sky-500 selection:text-white">
      {/* NAVBAR */}
      <Navbar
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onSelectSample={(sample) => {
          setCurrentModul(sample);
          handleUpdateModul(sample);
        }}
        onCreateNew={handleCreateNew}
      />

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6">
        {activeView === "edit" && (
          <div className="max-w-4xl mx-auto">
            <ModulForm
              modul={currentModul}
              onChange={handleUpdateModul}
              onOpenAiGenerator={() => setIsAiModalOpen(true)}
            />
          </div>
        )}

        {activeView === "preview" && (
          <div className="max-w-5xl mx-auto">
            <ModulPreview
              modul={currentModul}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          </div>
        )}

        {activeView === "split" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <ModulForm
                modul={currentModul}
                onChange={handleUpdateModul}
                onOpenAiGenerator={() => setIsAiModalOpen(true)}
              />
            </div>

            <div className="lg:col-span-7 bg-slate-200/60 p-4 sm:p-6 rounded-2xl border border-slate-300/80 shadow-inner overflow-x-auto">
              <ModulPreview
                modul={currentModul}
                onOpenExportModal={() => setIsExportModalOpen(true)}
              />
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      <AiGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onGenerated={(newModul) => {
          handleUpdateModul(newModul);
          setActiveView("split");
        }}
      />

      <SavedModulesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedModules={savedModules}
        activeModulId={currentModul.id}
        onSelectModul={setCurrentModul}
        onDeleteModul={handleDeleteModul}
        onDuplicateModul={handleDuplicateModul}
        onCreateNew={handleCreateNew}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        modul={currentModul}
      />
    </div>
  );
}
