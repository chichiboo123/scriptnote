import { useLanguage } from "@/contexts/LanguageContext";
import { Character, CHARACTER_COLORS } from "@/types/script";
import { Users, Plus, X } from "lucide-react";

interface CharacterManagementProps {
  characters: Character[];
  onChange: (characters: Character[]) => void;
}

export function CharacterManagement({ characters, onChange }: CharacterManagementProps) {
  const { t } = useLanguage();

  const addCharacter = () => {
    const newChar: Character = {
      id: `char-${Date.now()}`,
      name: "",
      description: "",
      colorClass: CHARACTER_COLORS[characters.length % CHARACTER_COLORS.length],
    };
    onChange([...characters, newChar]);
  };

  const updateCharacter = (id: string, field: keyof Character, value: string) => {
    onChange(characters.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const deleteCharacter = (id: string) => {
    onChange(characters.filter((c) => c.id !== id));
  };

  return (
    <div className="section-card animate-fade-in-up">
      <div className="section-header">
        <h2 className="section-title">
          <div className="icon-badge bg-secondary/10">
            <Users className="w-4 h-4 text-secondary" />
          </div>
          {t("characters.title")}
          {characters.length > 0 && (
            <span className="text-xs font-noto font-normal text-muted-foreground ml-1">
              ({characters.length})
            </span>
          )}
        </h2>
        <button
          onClick={addCharacter}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          {t("characters.add")}
        </button>
      </div>

      <div className="section-body">
        {characters.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground/60">{t("characters.empty")}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {characters.map((char, idx) => (
              <div
                key={char.id}
                className="flex items-center gap-3 group py-2.5 animate-slide-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${char.colorClass.split(" ")[0]}`}
                />
                <input
                  value={char.name}
                  onChange={(e) => updateCharacter(char.id, "name", e.target.value)}
                  placeholder={t("characters.name.placeholder")}
                  className="field-input font-medium w-28 sm:w-36 shrink-0"
                />
                <input
                  value={char.description}
                  onChange={(e) => updateCharacter(char.id, "description", e.target.value)}
                  placeholder={t("characters.description.placeholder")}
                  className="field-input flex-1 text-muted-foreground"
                />
                <button
                  onClick={() => deleteCharacter(char.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-destructive transition-all p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
