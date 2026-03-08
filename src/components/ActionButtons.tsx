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
    { label: t("actions.download.txt"), icon: FileText, onClick: () => exportToTxt(scriptData) },
    { label: t("actions.download.docx"), icon: FileDown, onClick: () => exportToDocx(scriptData) },
    { label: t("actions.download.pdf"), icon: Download, onClick: () => exportToPdf(scriptData) },
    { label: t("actions.copy"), icon: Copy, onClick: handleCopy },
    { label: t("actions.fullView"), icon: ExternalLink, onClick: () => openFullView(scriptData) },
    { label: t("actions.print"), icon: Printer, onClick: () => window.print() },
  ];

  return (
    <div className="section-card animate-fade-in-up no-print">
      <div className="section-header">
        <h2 className="section-title">
          <div className="icon-badge bg-muted">
            <Download className="w-4 h-4 text-muted-foreground" />
          </div>
          {t("actions.title")}
        </h2>
      </div>
      <div className="section-body">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={action.onClick}
                className="flex items-center gap-2.5 px-4 py-3 rounded-lg border border-border/50 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/3 transition-all duration-200 text-left"
              >
                <Icon className="w-4 h-4 shrink-0" />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
