import React from "react";
import { ModulAjar } from "../types";
import { X, FolderOpen, Trash2, Copy, FileText, Plus } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  savedModules: ModulAjar[];
  activeModulId: string;
  onSelectModul: (modul: ModulAjar) => void;
  onDeleteModul: (id: string) => void;
  onDuplicateModul: (modul: ModulAjar) => void;
  onCreateNew: () => void;
}

export const SavedModulesModal: React.FC<Props> = ({
  isOpen,
  onClose,
  savedModules,
  activeModulId,
  onSelectModul,
  onDeleteModul,
  onDuplicateModul,
  onCreateNew,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
        {/* HEADER */}
        <div className="bg-slate-900 text-white p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-600 rounded-lg text-white">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Perpustakaan Modul Ajar Tersimpan</h3>
              <p className="text-xs text-slate-300">
                Kelola, buka kembali, atau gandakan draf modul ajar yang pernah dibuat.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LIST */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3 flex-1">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-500">
              Total Modul: {savedModules.length}
            </span>
            <button
              onClick={() => {
                onCreateNew();
                onClose();
              }}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Buat Modul Kosong Baru
            </button>
          </div>

          {savedModules.length === 0 ? (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <FileText className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-medium">Belum ada modul tersimpan.</p>
              <p className="text-xs">
                Modul yang Anda edit akan otomatis tersimpan di peramban ini.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {savedModules.map((m) => {
                const isActive = m.id === activeModulId;
                return (
                  <div
                    key={m.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isActive
                        ? "bg-sky-50/80 border-sky-500 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {m.title || "Modul Ajar Tanpa Judul"}
                        </span>
                        {isActive && (
                          <span className="bg-sky-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Aktif
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span>
                          <strong className="text-slate-700">Mapel:</strong>{" "}
                          {m.identitas?.mataPelajaran || "-"}
                        </span>
                        <span>•</span>
                        <span>
                          <strong className="text-slate-700">Fase:</strong>{" "}
                          {m.identitas?.fase || "-"}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(m.updatedAt || Date.now()).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => {
                          onSelectModul(m);
                          onClose();
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          isActive
                            ? "bg-sky-600 text-white hover:bg-sky-700"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                        }`}
                      >
                        {isActive ? "Sedang Dibuka" : "Buka Modul"}
                      </button>

                      <button
                        onClick={() => onDuplicateModul(m)}
                        title="Duplikat Modul Ini"
                        className="p-1.5 text-slate-600 hover:text-sky-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Hapus modul "${m.title}"?`)) {
                            onDeleteModul(m.id);
                          }
                        }}
                        title="Hapus Modul"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
