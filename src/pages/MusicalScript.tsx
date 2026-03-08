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
import { RotateCcw, Globe } from "lucide-react";

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
      <header className="no-print sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-do-hyeon text-foreground">
              🎭 {t("header.title")}
            </h1>
            <p className="text-sm text-muted-foreground">{t("header.subtitle")}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "ko" ? "en" : "ko")}
            className="gap-1.5"
          >
            <Globe className="w-4 h-4" />
            {language === "ko" ? t("lang.en") : t("lang.ko")}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
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
        <div className="flex justify-center no-print">
          <Button
            variant="ghost"
            onClick={() => setShowResetModal(true)}
            className="text-destructive hover:text-destructive gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            {t("reset.button")}
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-border py-6 text-center text-sm text-muted-foreground">
        {t("footer.text")}
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
