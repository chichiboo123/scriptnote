import { useLanguage } from "@/contexts/LanguageContext";
import { ScriptData } from "@/types/script";
import { Download, Copy, ExternalLink, Printer, FileText, FileDown } from "lucide-react";
import { exportToTxt, exportToDocx, exportToPdf, copyToClipboard, openFullView } from "@/utils/exportUtils";
import { toast } from "sonner";

interface ActionButtonsProps {
  scriptData: ScriptData;
}

export function ActionButtons({ scriptData }: ActionButtonsProps) {
  const { t } = useLanguage();

  const handleCopy = async () => {
    await copyToClipboard(scriptData);
    toast.success(t("actions.copied"));
  };

  const actions = [
    { label: t("actions.download.txt"), icon: FileText, emoji: "📄", onClick: () => exportToTxt(scriptData), color: "border-[hsl(210,70%,82%)] bg-[hsl(210,60%,96%)] hover:bg-[hsl(210,60%,92%)]" },
    { label: t("actions.download.docx"), icon: FileDown, emoji: "📘", onClick: () => exportToDocx(scriptData), color: "border-[hsl(230,60%,82%)] bg-[hsl(230,50%,96%)] hover:bg-[hsl(230,50%,92%)]" },
    { label: t("actions.download.pdf"), icon: Download, emoji: "📕", onClick: () => exportToPdf(scriptData), color: "border-[hsl(0,60%,85%)] bg-[hsl(0,50%,97%)] hover:bg-[hsl(0,50%,93%)]" },
    { label: t("actions.copy"), icon: Copy, emoji: "📋", onClick: handleCopy, color: "border-[hsl(170,50%,80%)] bg-[hsl(170,50%,96%)] hover:bg-[hsl(170,50%,92%)]" },
    { label: t("actions.fullView"), icon: ExternalLink, emoji: "👁️", onClick: () => openFullView(scriptData), color: "border-[hsl(270,50%,85%)] bg-[hsl(270,40%,97%)] hover:bg-[hsl(270,40%,93%)]" },
    { label: t("actions.print"), icon: Printer, emoji: "🖨️", onClick: () => window.print(), color: "border-[hsl(40,60%,80%)] bg-[hsl(40,60%,96%)] hover:bg-[hsl(40,60%,92%)]" },
  ];

  return (
    <div className="section-card animate-bounce-in no-print">
      <div className="section-header">
        <h2 className="section-title">
          <div className="icon-badge bg-muted">
            <Download className="w-5 h-5 text-muted-foreground" />
          </div>
          💾 {t("actions.title")}
        </h2>
      </div>
      <div className="section-body">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`fun-btn ${action.color} text-foreground/80 hover:text-foreground justify-center text-center flex-col sm:flex-row`}
            >
              <span className="text-lg">{action.emoji}</span>
              <span className="text-xs sm:text-sm">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
