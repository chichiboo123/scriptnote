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
    <div className="section-card animate-bounce-in">
      <div className="section-header">
        <h2 className="section-title">
          <div className="icon-badge bg-secondary/10">
            <Users className="w-5 h-5 text-secondary" />
          </div>
          🧑‍🤝‍🧑 {t("characters.title")}
          {characters.length > 0 && (
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full ml-1">
              {characters.length}명
            </span>
          )}
        </h2>
        <button
          onClick={addCharacter}
          className="flex items-center gap-1.5 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-xl transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          {t("characters.add")}
        </button>
      </div>

      <div className="section-body">
        {characters.length === 0 ? (
          <div className="text-center py-10">
            <span className="text-4xl block mb-3">🎭</span>
            <p className="text-sm text-muted-foreground">{t("characters.empty")}</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {characters.map((char) => (
              <div
                key={char.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center gap-2.5 p-3.5 rounded-2xl border-2 animate-pop ${char.colorClass}`}
              >
                <input
                  value={char.name}
                  onChange={(e) => updateCharacter(char.id, "name", e.target.value)}
                  placeholder={t("characters.name.placeholder")}
                  className="bg-card/80 rounded-xl px-3 py-2 text-sm font-bold w-full sm:w-32 border-2 border-transparent focus:border-primary/30 focus:outline-none transition-colors"
                />
                <input
                  value={char.description}
                  onChange={(e) => updateCharacter(char.id, "description", e.target.value)}
                  placeholder={t("characters.description.placeholder")}
                  className="bg-card/80 rounded-xl px-3 py-2 text-sm flex-1 w-full border-2 border-transparent focus:border-primary/30 focus:outline-none transition-colors"
                />
                <button
                  onClick={() => deleteCharacter(char.id)}
                  className="text-muted-foreground/40 hover:text-destructive transition-all p-1.5 rounded-lg hover:bg-destructive/10 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
