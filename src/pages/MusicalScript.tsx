import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ScriptData, initialScriptData } from "@/types/script";
import { BasicInfo } from "@/components/BasicInfo";
import { CharacterManagement } from "@/components/CharacterManagement";
import { ChapterManagement } from "@/components/ChapterManagement";
import { ActionButtons } from "@/components/ActionButtons";
import { ConfirmModal } from "@/components/ConfirmModal";
import { HelpModal } from "@/components/HelpModal";
import { RotateCcw, Globe, HelpCircle } from "lucide-react";

const MusicalScript = () => {
  const { language, setLanguage, t } = useLanguage();
  const [scriptData, setScriptData] = useLocalStorage<ScriptData>(
    "musical-script-data",
    initialScriptData
  );
  const [showResetModal, setShowResetModal] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
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
        <div className="container max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="text-2xl sm:text-3xl shrink-0" role="img" aria-label="musical">🎭</span>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-title text-primary tracking-tight truncate">
                {t("header.title")}
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {t("header.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Language */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setShowLangMenu((v) => !v)}
                className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors px-2.5 py-2 rounded-xl bg-muted/60 hover:bg-muted"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language.toUpperCase()}</span>
              </button>
              {showLangMenu && (
                <div className="absolute right-0 top-full mt-1.5 bg-card border-2 border-border/60 rounded-xl shadow-lg overflow-hidden z-50 min-w-[110px] animate-pop">
                  {([
                    { code: "ko" as const, label: "한국어" },
                    { code: "en" as const, label: "English" },
                    { code: "ja" as const, label: "日本語" },
                  ]).map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                        language === lang.code
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/70 hover:bg-muted"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Help */}
            <button
              onClick={() => setShowHelp(true)}
              className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors px-2.5 py-2 rounded-xl bg-muted/60 hover:bg-muted"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-5 lg:space-y-6">
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
        <ActionButtons scriptData={scriptData} onImport={(data) => setScriptData(data)} />

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
          className="text-sm text-foreground/60 font-bold hover:text-primary transition-colors"
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

      <HelpModal open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

export default MusicalScript;
