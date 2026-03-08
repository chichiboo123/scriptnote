import { useLanguage } from "@/contexts/LanguageContext";
import { ScriptData, Character } from "@/types/script";
import { Button } from "@/components/ui/button";
import { Download, Copy, ExternalLink, Printer } from "lucide-react";
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

  return (
    <div className="glass-card animate-fade-in no-print">
      <h2 className="text-xl font-do-hyeon mb-4">{t("actions.title")}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <Button onClick={() => exportToTxt(scriptData)} variant="outline" className="gap-1.5 text-xs">
          <Download className="w-4 h-4" />
          {t("actions.download.txt")}
        </Button>
        <Button onClick={() => exportToDocx(scriptData)} variant="outline" className="gap-1.5 text-xs">
          <Download className="w-4 h-4" />
          {t("actions.download.docx")}
        </Button>
        <Button onClick={() => exportToPdf(scriptData)} variant="outline" className="gap-1.5 text-xs">
          <Download className="w-4 h-4" />
          {t("actions.download.pdf")}
        </Button>
        <Button onClick={handleCopy} variant="outline" className="gap-1.5 text-xs">
          <Copy className="w-4 h-4" />
          {t("actions.copy")}
        </Button>
        <Button onClick={() => openFullView(scriptData)} variant="outline" className="gap-1.5 text-xs">
          <ExternalLink className="w-4 h-4" />
          {t("actions.fullView")}
        </Button>
        <Button onClick={() => window.print()} variant="outline" className="gap-1.5 text-xs">
          <Printer className="w-4 h-4" />
          {t("actions.print")}
        </Button>
      </div>
    </div>
  );
}
