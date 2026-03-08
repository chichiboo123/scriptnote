import { useLanguage } from "@/contexts/LanguageContext";
import { Chapter, Block, LyricLine, Character } from "@/types/script";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Layers,
  Plus,
  X,
  MessageSquare,
  Mic,
  Music,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface ChapterManagementProps {
  chapters: Chapter[];
  characters: Character[];
  onChange: (chapters: Chapter[]) => void;
}

export function ChapterManagement({ chapters, characters, onChange }: ChapterManagementProps) {
  const { t } = useLanguage();
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({ "chapter-1": true });

  const toggleChapter = (id: string) => {
    setExpandedChapters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addChapter = () => {
    const ch: Chapter = { id: `chapter-${Date.now()}`, title: "", blocks: [] };
    onChange([...chapters, ch]);
    setExpandedChapters((prev) => ({ ...prev, [ch.id]: true }));
  };

  const deleteChapter = (id: string) => {
    if (chapters.length <= 1) return;
    onChange(chapters.filter((c) => c.id !== id));
  };

  const updateChapterTitle = (id: string, title: string) => {
    onChange(chapters.map((c) => (c.id === id ? { ...c, title } : c)));
  };

  const addBlock = (chapterId: string, type: Block["type"]) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: "",
      ...(type === "dialogue" ? { character: "" } : {}),
      ...(type === "song" ? { songTitle: "", lyrics: [] } : {}),
    };
    onChange(chapters.map((c) => c.id === chapterId ? { ...c, blocks: [...c.blocks, newBlock] } : c));
  };

  const updateBlock = (chapterId: string, blockId: string, updates: Partial<Block>) => {
    onChange(chapters.map((c) => c.id === chapterId ? { ...c, blocks: c.blocks.map((b) => b.id === blockId ? { ...b, ...updates } : b) } : c));
  };

  const deleteBlock = (chapterId: string, blockId: string) => {
    onChange(chapters.map((c) => c.id === chapterId ? { ...c, blocks: c.blocks.filter((b) => b.id !== blockId) } : c));
  };

  const addLyricLine = (chapterId: string, blockId: string) => {
    const newLine: LyricLine = { id: `lyric-${Date.now()}`, characters: [], content: "" };
    onChange(chapters.map((c) => c.id === chapterId ? { ...c, blocks: c.blocks.map((b) => b.id === blockId ? { ...b, lyrics: [...(b.lyrics || []), newLine] } : b) } : c));
  };

  const updateLyricLine = (chapterId: string, blockId: string, lyricId: string, updates: Partial<LyricLine>) => {
    onChange(chapters.map((c) => c.id === chapterId ? { ...c, blocks: c.blocks.map((b) => b.id === blockId ? { ...b, lyrics: (b.lyrics || []).map((l) => l.id === lyricId ? { ...l, ...updates } : l) } : b) } : c));
  };

  const deleteLyricLine = (chapterId: string, blockId: string, lyricId: string) => {
    onChange(chapters.map((c) => c.id === chapterId ? { ...c, blocks: c.blocks.map((b) => b.id === blockId ? { ...b, lyrics: (b.lyrics || []).filter((l) => l.id !== lyricId) } : b) } : c));
  };

  const blockConfig = {
    narration: { icon: MessageSquare, class: "block-narration", label: t("chapters.narration"), emoji: "📜" },
    dialogue: { icon: Mic, class: "block-dialogue", label: t("chapters.dialogue"), emoji: "💬" },
    song: { icon: Music, class: "block-song", label: t("chapters.song"), emoji: "🎵" },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="section-title">
          <div className="icon-badge bg-accent/30">
            <Layers className="w-5 h-5 text-accent-foreground" />
          </div>
          {t("chapters.title")}
        </h2>
        <button
          onClick={addChapter}
          className="flex items-center gap-1.5 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-xl transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          {t("chapters.add")}
        </button>
      </div>

      {chapters.map((chapter, idx) => {
        const isExpanded = expandedChapters[chapter.id];
        return (
          <div key={chapter.id} className="section-card animate-bounce-in">
            {/* Chapter Header */}
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4 text-left group"
            >
              <ChevronRight
                className={`w-5 h-5 text-primary transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
              />
              <span className="text-sm font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg shrink-0">
                {t("chapters.chapterLabel")} {idx + 1}
              </span>
              <span className="text-sm font-semibold text-foreground truncate">
                {chapter.title || t("chapters.chapterTitle.placeholder")}
              </span>
              <span className="ml-auto text-xs font-semibold text-muted-foreground/40 bg-muted rounded-full px-2 py-0.5">
                {chapter.blocks.length}
              </span>
            </button>

            {isExpanded && (
              <div className="border-t-2 border-border/20">
                {/* Chapter Title Input */}
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-b-2 border-border/10">
                  <label className="field-label">{t("chapters.chapterTitle")}</label>
                  <div className="flex items-center gap-2">
                    <input
                      value={chapter.title}
                      onChange={(e) => updateChapterTitle(chapter.id, e.target.value)}
                      placeholder={t("chapters.chapterTitle.placeholder")}
                      className="field-input flex-1"
                    />
                    {chapters.length > 1 && (
                      <button
                        onClick={() => deleteChapter(chapter.id)}
                        className="text-muted-foreground/30 hover:text-destructive transition-colors p-2 rounded-xl hover:bg-destructive/10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Blocks */}
                <div className="px-3 sm:px-5 py-3 sm:py-4 space-y-3">
                  {chapter.blocks.length === 0 && (
                    <div className="text-center py-10">
                      <span className="text-4xl block mb-2">✍️</span>
                      <p className="text-sm text-muted-foreground">{t("chapters.empty")}</p>
                    </div>
                  )}

                  {chapter.blocks.map((block) => {
                    const cfg = blockConfig[block.type];
                    return (
                      <div key={block.id} className={`block-card ${cfg.class} animate-pop`}>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-sm font-bold text-foreground/70">
                            <span>{cfg.emoji}</span>
                            {cfg.label}
                          </span>
                          <button
                            onClick={() => deleteBlock(chapter.id, block.id)}
                            className="text-muted-foreground/30 hover:text-destructive transition-colors p-1 rounded-lg hover:bg-destructive/10"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {block.type === "dialogue" && (
                          <Select
                            value={block.character || ""}
                            onValueChange={(val) => updateBlock(chapter.id, block.id, { character: val })}
                          >
                            <SelectTrigger className="w-full sm:w-44 h-9 text-sm bg-card/80 border-2 border-border/40 rounded-xl">
                              <SelectValue placeholder={t("chapters.selectCharacter")} />
                            </SelectTrigger>
                            <SelectContent>
                              {characters.map((c) => (
                                <SelectItem key={c.id} value={c.id} className="text-sm">
                                  {c.name || c.id}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {(block.type === "narration" || block.type === "dialogue") && (
                          <textarea
                            value={block.content}
                            onChange={(e) => updateBlock(chapter.id, block.id, { content: e.target.value })}
                            placeholder={block.type === "narration" ? t("chapters.narration.placeholder") : t("chapters.dialogue.placeholder")}
                            className="field-textarea w-full min-h-[70px]"
                          />
                        )}

                        {block.type === "song" && (
                          <>
                            <input
                              value={block.songTitle || ""}
                              onChange={(e) => updateBlock(chapter.id, block.id, { songTitle: e.target.value })}
                              placeholder={t("chapters.songTitle.placeholder")}
                              className="field-input w-full font-bold"
                            />
                            <div className="space-y-2 pl-3 border-l-[3px] border-accent/50 mt-2">
                              {(block.lyrics || []).map((lyric) => (
                                <div key={lyric.id} className="flex gap-2 items-center">
                                  <Select
                                    value={lyric.characters[0] || ""}
                                    onValueChange={(val) => updateLyricLine(chapter.id, block.id, lyric.id, { characters: [val] })}
                                  >
                                    <SelectTrigger className="w-28 h-9 text-sm bg-card/80 border-2 border-border/40 rounded-xl shrink-0">
                                      <SelectValue placeholder={t("chapters.selectSinger")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {characters.map((c) => (
                                        <SelectItem key={c.id} value={c.id} className="text-sm">
                                          {c.name || c.id}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <input
                                    value={lyric.content}
                                    onChange={(e) => updateLyricLine(chapter.id, block.id, lyric.id, { content: e.target.value })}
                                    placeholder={t("chapters.lyric.placeholder")}
                                    className="field-input flex-1"
                                  />
                                  <button
                                    onClick={() => deleteLyricLine(chapter.id, block.id, lyric.id)}
                                    className="text-muted-foreground/30 hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-destructive/10 shrink-0"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => addLyricLine(chapter.id, block.id)}
                                className="flex items-center gap-1.5 text-sm font-semibold text-accent-foreground/60 hover:text-primary transition-colors pt-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                {t("chapters.addLyric")}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}

                  {/* Add Block Buttons */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t-2 border-border/15">
                    {(["narration", "dialogue", "song"] as const).map((type) => {
                      const cfg = blockConfig[type];
                      return (
                        <button
                          key={type}
                          onClick={() => addBlock(chapter.id, type)}
                          className="btn-add flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-dashed border-border text-sm font-semibold text-muted-foreground hover:text-primary hover:border-primary/40 transition-all active:scale-95"
                        >
                          <span>{cfg.emoji}</span>
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
