import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ScriptData, initialScriptData } from "@/types/script";
import { BasicInfo } from "@/components/BasicInfo";
import { CharacterManagement } from "@/components/CharacterManagement";
import { ChapterManagement } from "@/components/ChapterManagement";
import { ActionButtons } from "@/components/ActionButtons";
import { ConfirmModal } from "@/components/ConfirmModal";
import { RotateCcw, Globe } from "lucide-react";

const MusicalScript = () => {
  const { language, setLanguage, t } = useLanguage();
  const [scriptData, setScriptData] = useLocalStorage<ScriptData>(
    "musical-script-data",
    initialScriptData
  );
  const [showResetModal, setShowResetModal] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleReset = () => {
    setScriptData(initialScriptData);
    setShowResetModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="no-print sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b-2 border-border/40 shadow-sm">
        <div className="container max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl" role="img" aria-label="musical">🎭</span>
            <div>
              <h1 className="text-xl font-title text-primary tracking-tight">
                {t("header.title")}
              </h1>
              <p className="text-xs text-muted-foreground">
                {t("header.subtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const langs: Array<"ko" | "en" | "ja"> = ["ko", "en", "ja"];
              const next = langs[(langs.indexOf(language) + 1) % langs.length];
              setLanguage(next);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-xl bg-muted/60 hover:bg-muted"
          >
            <Globe className="w-3.5 h-3.5" />
            {language.toUpperCase()}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-3xl mx-auto px-4 py-6 space-y-5">
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
        <div className="flex justify-center no-print pt-2 pb-4">
          <button
            onClick={() => setShowResetModal(true)}
            className="text-xs text-muted-foreground/50 hover:text-destructive transition-colors flex items-center gap-1.5 py-2 px-4 rounded-xl hover:bg-destructive/5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t("reset.button")}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="no-print border-t-2 border-border/30 py-6 text-center">
        <a
          href="https://litt.ly/chichiboo"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground/40 font-medium hover:text-primary transition-colors"
        >
          {t("footer.text")}
        </a>
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
