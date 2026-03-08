import { useLanguage } from "@/contexts/LanguageContext";
import { WorkInfo } from "@/types/script";
import { BookOpen } from "lucide-react";

interface BasicInfoProps {
  work: WorkInfo;
  onChange: (work: WorkInfo) => void;
}

export function BasicInfo({ work, onChange }: BasicInfoProps) {
  const { t } = useLanguage();

  const update = (field: keyof WorkInfo, value: string) => {
    onChange({ ...work, [field]: value });
  };

  return (
    <div className="section-card animate-fade-in-up">
      <div className="section-header">
        <h2 className="section-title">
          <div className="icon-badge bg-primary/8">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          {t("basic.title")}
        </h2>
      </div>
      <div className="section-body space-y-5">
        <div>
          <label className="field-label">{t("basic.workTitle")}</label>
          <input
            value={work.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder={t("basic.workTitle.placeholder")}
            className="field-input w-full text-lg font-noto-serif font-medium"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="field-label">{t("basic.timeSetting")}</label>
            <input
              value={work.timeSetting}
              onChange={(e) => update("timeSetting", e.target.value)}
              placeholder={t("basic.timeSetting.placeholder")}
              className="field-input w-full"
            />
          </div>
          <div>
            <label className="field-label">{t("basic.spaceSetting")}</label>
            <input
              value={work.spaceSetting}
              onChange={(e) => update("spaceSetting", e.target.value)}
              placeholder={t("basic.spaceSetting.placeholder")}
              className="field-input w-full"
            />
          </div>
        </div>
        <div>
          <label className="field-label">{t("basic.synopsis")}</label>
          <textarea
            value={work.synopsis}
            onChange={(e) => update("synopsis", e.target.value)}
            placeholder={t("basic.synopsis.placeholder")}
            className="field-textarea w-full min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
}
