import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ScriptData, initialScriptData } from "@/types/script";
import { BasicInfo } from "@/components/BasicInfo";
import { CharacterManagement } from "@/components/CharacterManagement";
import { ChapterManagement } from "@/components/ChapterManagement";
import { ActionButtons } from "@/components/ActionButtons";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Button } from "@/components/ui/button";
import { RotateCcw, Globe, Feather } from "lucide-react";

const MusicalScript = () => {
  const { language, setLanguage, t } = useLanguage();
  const [scriptData, setScriptData] = useLocalStorage<ScriptData>(
    "musical-script-data",
    initialScriptData
  );
  const [showResetModal, setShowResetModal] = useState(false);

  const handleReset = () => {
    setScriptData(initialScriptData);
    setShowResetModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="no-print sticky top-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border/50">
        <div className="container max-w-3xl mx-auto px-5 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="icon-badge bg-primary/10">
              <Feather className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-semibold text-foreground tracking-tight">
                {t("header.title")}
              </h1>
              <p className="text-[11px] text-muted-foreground tracking-wide">
                {t("header.subtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={() => setLanguage(language === "ko" ? "en" : "ko")}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full border border-border/60 hover:border-border"
          >
            <Globe className="w-3.5 h-3.5" />
            {language === "ko" ? "EN" : "KO"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-3xl mx-auto px-5 py-8 space-y-6">
        <BasicInfo
          work={scriptData.work}
          onChange={(work) => setScriptData((prev) => ({ ...prev, work }))}
        />

        <CharacterManagement
          characters={scriptData.characters}
          onChange={(characters) => setScriptData((prev) => ({ ...prev, characters }))}
        />

        <ChapterManagement
          chapters={scriptData.chapters}
          characters={scriptData.characters}
          onChange={(chapters) => setScriptData((prev) => ({ ...prev, chapters }))}
        />

        <ActionButtons scriptData={scriptData} />

        {/* Reset */}
        <div className="flex justify-center no-print pt-4">
          <button
            onClick={() => setShowResetModal(true)}
            className="text-xs text-muted-foreground/60 hover:text-destructive transition-colors flex items-center gap-1.5 py-2"
          >
            <RotateCcw className="w-3 h-3" />
            {t("reset.button")}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-border/40 py-8 text-center">
        <p className="text-[11px] text-muted-foreground/50 tracking-widest uppercase">
          {t("footer.text")}
        </p>
      </footer>

      <ConfirmModal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleReset}
        title={t("reset.confirm.title")}
        message={t("reset.confirm.message")}
        confirmLabel={t("reset.confirm.yes")}
        cancelLabel={t("reset.confirm.no")}
      />
    </div>
  );
};

export default MusicalScript;
