import { useLanguage } from "@/contexts/LanguageContext";
import { Character, CHARACTER_COLORS } from "@/types/script";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Plus, Trash2 } from "lucide-react";

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
    <div className="glass-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-do-hyeon flex items-center gap-2">
          <Users className="w-5 h-5 text-secondary" />
          {t("characters.title")}
        </h2>
        <Button onClick={addCharacter} size="sm" variant="outline" className="gap-1">
          <Plus className="w-4 h-4" />
          {t("characters.add")}
        </Button>
      </div>

      {characters.length === 0 ? (
        <p className="text-muted-foreground text-center py-6 text-sm">
          {t("characters.empty")}
        </p>
      ) : (
        <div className="space-y-3">
          {characters.map((char) => (
            <div
              key={char.id}
              className={`flex flex-col sm:flex-row gap-2 p-3 rounded-xl border ${char.colorClass}`}
            >
              <Input
                value={char.name}
                onChange={(e) => updateCharacter(char.id, "name", e.target.value)}
                placeholder={t("characters.name.placeholder")}
                className="bg-background/70 sm:w-40"
              />
              <Input
                value={char.description}
                onChange={(e) => updateCharacter(char.id, "description", e.target.value)}
                placeholder={t("characters.description.placeholder")}
                className="bg-background/70 flex-1"
              />
              <Button
                onClick={() => deleteCharacter(char.id)}
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
