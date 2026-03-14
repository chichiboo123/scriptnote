import { useLanguage } from "@/contexts/LanguageContext";
import { ScriptData } from "@/types/script";
import { Download, Copy, ExternalLink, Printer, FileText, Link } from "lucide-react";
import { exportToTxt, exportToPdf, copyToClipboard, openFullView } from "@/utils/exportUtils";
import { toast } from "sonner";

interface ActionButtonsProps {
  scriptData: ScriptData;
  onShareLink: () => void;
}

export function ActionButtons({ scriptData, onShareLink }: ActionButtonsProps) {
  const { t } = useLanguage();

  const handleCopy = async () => {
    await copyToClipboard(scriptData);
    toast.success(t("actions.copied"));
  };

  const actions = [
    {
      label: t("actions.download.txt"),
      icon: FileText,
      onClick: () => exportToTxt(scriptData),
      color: "border-[hsl(210,70%,82%)] bg-[hsl(210,60%,97%)] hover:bg-[hsl(210,60%,92%)] text-[hsl(210,70%,45%)]",
    },
    {
      label: t("actions.download.pdf"),
      icon: Download,
      onClick: () => exportToPdf(scriptData),
      color: "border-[hsl(0,60%,85%)] bg-[hsl(0,50%,97%)] hover:bg-[hsl(0,50%,93%)] text-[hsl(0,65%,50%)]",
    },
    {
      label: t("actions.copy"),
      icon: Copy,
      onClick: handleCopy,
      color: "border-[hsl(170,50%,80%)] bg-[hsl(170,50%,97%)] hover:bg-[hsl(170,50%,92%)] text-[hsl(170,55%,35%)]",
    },
    {
      label: t("actions.shareLink"),
      icon: Link,
      onClick: onShareLink,
      color: "border-[hsl(270,50%,85%)] bg-[hsl(270,40%,97%)] hover:bg-[hsl(270,40%,92%)] text-[hsl(270,60%,50%)]",
    },
    {
      label: t("actions.fullView"),
      icon: ExternalLink,
      onClick: () => openFullView(scriptData),
      color: "border-[hsl(40,60%,80%)] bg-[hsl(40,60%,97%)] hover:bg-[hsl(40,60%,92%)] text-[hsl(40,70%,35%)]",
    },
    {
      label: t("actions.print"),
      icon: Printer,
      onClick: () => window.print(),
      color: "border-[hsl(220,20%,85%)] bg-[hsl(220,20%,97%)] hover:bg-[hsl(220,20%,92%)] text-[hsl(220,20%,40%)]",
    },
  ];

  return (
    <div className="section-card animate-bounce-in no-print">
      <div className="section-header">
        <h2 className="section-title">
          <div className="icon-badge bg-muted">
            <Download className="w-5 h-5 text-muted-foreground" />
          </div>
          {t("actions.title")}
        </h2>
      </div>
      <div className="section-body">
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              title={action.label}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 font-semibold transition-all duration-200 active:scale-95 ${action.color}`}
            >
              <action.icon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline text-xs">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
