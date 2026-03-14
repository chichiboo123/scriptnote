import { useState, useRef, useEffect } from "react";
import { Character, CHARACTER_SOLID_COLORS, TOGETHER_ID } from "@/types/script";
import { ChevronDown, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CharacterMultiSelectProps {
  characters: Character[];
  selected: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  compact?: boolean;
}

function getDotColor(char: Character, characters: Character[]): string {
  const idx = characters.findIndex((c) => c.id === char.id);
  return CHARACTER_SOLID_COLORS[idx % CHARACTER_SOLID_COLORS.length];
}

export function CharacterMultiSelect({
  characters,
  selected,
  onChange,
  placeholder = "인물 선택",
  compact = false,
}: CharacterMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const isAllTogether = selected.includes(TOGETHER_ID);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleTogether = () => {
    onChange(isAllTogether ? [] : [TOGETHER_ID]);
    setOpen(false); // close after selection
  };

  const toggleChar = (id: string) => {
    const without = selected.filter((s) => s !== TOGETHER_ID);
    if (without.includes(id)) {
      onChange(without.filter((s) => s !== id));
    } else {
      onChange([...without, id]);
    }
    setOpen(false); // close after single character click
  };

  const selectedChars = characters.filter((c) => selected.includes(c.id));

  const displayLabel = () => {
    if (isAllTogether) return t("characters.together");
    if (selectedChars.length === 0) return null;
    return selectedChars.map((c) => c.name || c.id).join(", ");
  };

  const label = displayLabel();

  return (
    <div
      ref={ref}
      className={`${compact ? "relative w-full max-w-[9rem] sm:max-w-[10rem]" : "relative w-full sm:w-48"}`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-9 sm:h-10 text-sm bg-white border-2 border-border/40 rounded-xl px-3 flex items-center justify-between gap-2 hover:border-primary/40 transition-colors"
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {isAllTogether && (
            <span className="text-xs shrink-0">✨</span>
          )}
          {!isAllTogether && selectedChars.length > 0 && (
            <div className="flex gap-0.5 shrink-0">
              {selectedChars.slice(0, 4).map((c) => (
                <span
                  key={c.id}
                  className="w-2.5 h-2.5 rounded-full block"
                  style={{ backgroundColor: getDotColor(c, characters) }}
                />
              ))}
            </div>
          )}
          <span
            className={`truncate text-xs ${
              label ? "text-foreground font-medium" : "text-muted-foreground/50"
            }`}
          >
            {label || placeholder}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 text-muted-foreground transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 bg-card border-2 border-border/60 rounded-xl shadow-lg overflow-hidden w-full min-w-[170px] max-w-[85vw] sm:max-w-none animate-pop">
          {/* Characters first */}
          {characters.map((char, idx) => {
            const isSelected = !isAllTogether && selected.includes(char.id);
            const dotColor = CHARACTER_SOLID_COLORS[idx % CHARACTER_SOLID_COLORS.length];
            return (
              <button
                key={char.id}
                type="button"
                onClick={() => toggleChar(char.id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors ${
                  isSelected
                    ? "bg-primary/5 font-semibold text-foreground"
                    : "hover:bg-muted text-foreground/70"
                }`}
              >
                <div
                  className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors"
                  style={
                    isSelected
                      ? { backgroundColor: dotColor, borderColor: dotColor }
                      : {}
                  }
                >
                  {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: dotColor }}
                />
                <span className="text-xs truncate">{char.name || char.id}</span>
              </button>
            );
          })}

          {/* 다함께 at bottom */}
          {characters.length > 0 && (
            <div className="border-t border-border/30" />
          )}
          <button
            type="button"
            onClick={toggleTogether}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold transition-colors ${
              isAllTogether
                ? "bg-amber-50 text-amber-700"
                : "hover:bg-muted text-foreground/80"
            }`}
          >
            <div
              className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                isAllTogether
                  ? "bg-amber-400 border-amber-400"
                  : "border-border"
              }`}
            >
              {isAllTogether && <Check className="w-2.5 h-2.5 text-white" />}
            </div>
            <span className="text-xs">✨ {t("characters.together")}</span>
          </button>
        </div>
      )}
    </div>
  );
}
