import React from "react";
import { ModulAjar } from "../types";
import { SAMPLE_MODULES } from "../sampleData";
import {
  GraduationCap,
  Sparkles,
  Printer,
  FolderOpen,
  Plus,
  Eye,
  Edit3,
  Columns,
} from "lucide-react";

interface Props {
  activeView: "edit" | "preview" | "split";
  onViewChange: (view: "edit" | "preview" | "split") => void;
  onOpenAiModal: () => void;
  onOpenSavedModal: () => void;
  onOpenExportModal: () => void;
  onSelectSample: (sample: ModulAjar) => void;
  onCreateNew: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeView,
  onViewChange,
  onOpenAiModal,
  onOpenSavedModal,
  onOpenExportModal,
  onSelectSample,
  onCreateNew,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* BRAND LOGO */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-900/50 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg tracking-tight leading-none text-white">
              Modul Ajar <span className="text-sky-400">Merdeka</span>
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Format Pembelajaran Mendalam (Deep Learning)
            </p>
          </div>
        </div>

        {/* VIEW MODE TOGGLE (DESKTOP/MOBILE) */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-lg border border-slate-700 text-xs font-semibold">
          <button
            onClick={() => onViewChange("edit")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition cursor-pointer ${
              activeView === "edit"
                ? "bg-sky-600 text-white shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Form Input
          </button>

          <button
            onClick={() => onViewChange("split")}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md transition cursor-pointer ${
              activeView === "split"
                ? "bg-sky-600 text-white shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            Split View
          </button>

          <button
            onClick={() => onViewChange("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition cursor-pointer ${
              activeView === "preview"
                ? "bg-sky-600 text-white shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview Dokumen
          </button>
        </div>

        {/* ACTIONS & SAMPLES */}
        <div className="flex flex-wrap items-center gap-2">
          {/* SAMPLE SELECTOR */}
          <select
            onChange={(e) => {
              const selected = SAMPLE_MODULES.find((s) => s.id === e.target.value);
              if (selected) onSelectSample(selected);
            }}
            defaultValue=""
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg px-2.5 py-2 focus:outline-none cursor-pointer"
          >
            <option value="" disabled>
              📋 Muat Contoh Modul...
            </option>
            {SAMPLE_MODULES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.identitas.mataPelajaran} ({s.identitas.fase})
              </option>
            ))}
          </select>

          {/* AI GENERATOR BTN */}
          <button
            onClick={onOpenAiModal}
            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            Buat via AI
          </button>

          {/* SAVED MODULES */}
          <button
            onClick={onOpenSavedModal}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5 text-sky-400" />
            Modul Saya
          </button>

          {/* PRINT & EXPORT PDF/WORD */}
          <button
            onClick={onOpenExportModal}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Ekspor PDF / Word
          </button>

          {/* NEW MODUL */}
          <button
            onClick={onCreateNew}
            title="Buat Modul Baru"
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-2 rounded-lg transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
