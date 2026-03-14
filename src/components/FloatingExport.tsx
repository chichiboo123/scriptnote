import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScriptData } from "@/types/script";
import {
  Download,
  Copy,
  ExternalLink,
  Printer,
  FileText,
  Link,
  X,
} from "lucide-react";
import {
  exportToTxt,
  exportToPdf,
  copyToClipboard,
  openFullView,
} from "@/utils/exportUtils";
import { toast } from "sonner";

interface FloatingExportProps {
  scriptData: ScriptData;
  onShareLink: () => void;
}

export function FloatingExport({ scriptData, onShareLink }: FloatingExportProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const run = (fn: () => void) => {
    fn();
    setOpen(false);
  };

  const handleCopy = async () => {
    await copyToClipboard(scriptData);
    toast.success(t("actions.copied"));
    setOpen(false);
  };

  const handleShare = () => {
    onShareLink();
    setOpen(false);
  };

  // Items listed in display order (top → bottom when open = closest to button first)
  const items = [
    {
      label: t("actions.copy"),
      icon: Copy,
      color: "text-teal-600",
      onClick: handleCopy,
    },
    {
      label: t("actions.shareLink"),
      icon: Link,
      color: "text-violet-500",
      onClick: handleShare,
    },
    {
      label: t("actions.download.txt"),
      icon: FileText,
      color: "text-blue-500",
      onClick: () => run(() => exportToTxt(scriptData)),
    },
    {
      label: t("actions.download.pdf"),
      icon: Download,
      color: "text-red-500",
      onClick: () => run(() => exportToPdf(scriptData)),
    },
    {
      label: t("actions.fullView"),
      icon: ExternalLink,
      color: "text-amber-600",
      onClick: () => run(() => openFullView(scriptData)),
    },
    {
      label: t("actions.print"),
      icon: Printer,
      color: "text-slate-600",
      onClick: () => run(() => window.print()),
    },
  ];


  return (
    <div
      ref={ref}
      className="fixed bottom-6 right-4 sm:right-6 z-50 no-print flex flex-col items-end gap-2"
    >
      {/* Menu items */}
      {open && (
        <div className="flex flex-col gap-1.5 mb-1">
          {items.map((item, i) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="flex items-center gap-2.5 pl-3 pr-4 py-2.5 bg-card border-2 border-border/60 rounded-2xl shadow-md text-sm font-semibold text-foreground/80 hover:border-primary/50 hover:shadow-lg transition-all active:scale-95 whitespace-nowrap animate-pop"
              style={{ animationDelay: `${i * 20}ms` }}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${item.color}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg text-sm font-bold transition-all active:scale-95 ${
          open
            ? "bg-foreground text-background hover:bg-foreground/90"
            : "bg-primary text-white hover:bg-primary/90"
        }`}
      >
        {open ? (
          <X className="w-4 h-4" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span>{open ? t("actions.close") : t("actions.title")}</span>
      </button>
    </div>
  );
}
