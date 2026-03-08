import { useLanguage } from "@/contexts/LanguageContext";
import { WorkInfo } from "@/types/script";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    <div className="glass-card animate-fade-in">
      <h2 className="text-xl font-do-hyeon flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        {t("basic.title")}
      </h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">
            {t("basic.workTitle")}
          </label>
          <Input
            value={work.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder={t("basic.workTitle.placeholder")}
            className="bg-background/50"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              {t("basic.timeSetting")}
            </label>
            <Input
              value={work.timeSetting}
              onChange={(e) => update("timeSetting", e.target.value)}
              placeholder={t("basic.timeSetting.placeholder")}
              className="bg-background/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              {t("basic.spaceSetting")}
            </label>
            <Input
              value={work.spaceSetting}
              onChange={(e) => update("spaceSetting", e.target.value)}
              placeholder={t("basic.spaceSetting.placeholder")}
              className="bg-background/50"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">
            {t("basic.synopsis")}
          </label>
          <Textarea
            value={work.synopsis}
            onChange={(e) => update("synopsis", e.target.value)}
            placeholder={t("basic.synopsis.placeholder")}
            className="bg-background/50 min-h-[80px]"
          />
        </div>
      </div>
    </div>
  );
}
