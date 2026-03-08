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
    narration: { icon: MessageSquare, class: "block-narration", label: t("chapters.narration") },
    dialogue: { icon: Mic, class: "block-dialogue", label: t("chapters.dialogue") },
    song: { icon: Music, class: "block-song", label: t("chapters.song") },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="section-title">
          <div className="icon-badge bg-primary/8">
            <Layers className="w-4 h-4 text-primary" />
          </div>
          {t("chapters.title")}
        </h2>
        <button
          onClick={addChapter}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          {t("chapters.add")}
        </button>
      </div>

      {chapters.map((chapter, idx) => {
        const isExpanded = expandedChapters[chapter.id];
        return (
          <div key={chapter.id} className="section-card animate-fade-in-up">
            {/* Chapter Header */}
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left group"
            >
              <ChevronRight
                className={`w-4 h-4 text-muted-foreground/50 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
              />
              <span className="text-xs font-medium text-primary/70 uppercase tracking-widest shrink-0">
                {idx + 1}장
              </span>
              <span className="text-sm font-medium text-foreground/80 truncate">
                {chapter.title || t("chapters.chapterTitle.placeholder")}
              </span>
              <span className="ml-auto text-[10px] text-muted-foreground/40">
                {chapter.blocks.length} blocks
              </span>
            </button>

            {isExpanded && (
              <div className="border-t border-border/30">
                {/* Chapter Title Input */}
                <div className="px-6 py-4 border-b border-border/20">
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
                        className="text-muted-foreground/30 hover:text-destructive transition-colors p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Blocks */}
                <div className="px-5 py-4 space-y-3">
                  {chapter.blocks.length === 0 && (
                    <div className="text-center py-8">
                      <Layers className="w-7 h-7 text-muted-foreground/20 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground/50">{t("chapters.empty")}</p>
                    </div>
                  )}

                  {chapter.blocks.map((block) => {
                    const cfg = blockConfig[block.type];
                    const Icon = cfg.icon;
                    return (
                      <div key={block.id} className={`block-card ${cfg.class} animate-slide-in`}>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                            <Icon className="w-3.5 h-3.5" />
                            {cfg.label}
                          </span>
                          <button
                            onClick={() => deleteBlock(chapter.id, block.id)}
                            className="text-muted-foreground/30 hover:text-destructive transition-colors p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>

                        {block.type === "dialogue" && (
                          <Select
                            value={block.character || ""}
                            onValueChange={(val) => updateBlock(chapter.id, block.id, { character: val })}
                          >
                            <SelectTrigger className="w-full sm:w-44 h-8 text-xs bg-background/60 border-border/40">
                              <SelectValue placeholder={t("chapters.selectCharacter")} />
                            </SelectTrigger>
                            <SelectContent>
                              {characters.map((c) => (
                                <SelectItem key={c.id} value={c.id} className="text-xs">
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
                            className="field-textarea w-full min-h-[60px]"
                          />
                        )}

                        {block.type === "song" && (
                          <>
                            <input
                              value={block.songTitle || ""}
                              onChange={(e) => updateBlock(chapter.id, block.id, { songTitle: e.target.value })}
                              placeholder={t("chapters.songTitle.placeholder")}
                              className="field-input w-full font-medium"
                            />
                            <div className="space-y-2 pl-3 border-l-2 border-[hsl(var(--accent-warm))]/30 mt-2">
                              {(block.lyrics || []).map((lyric) => (
                                <div key={lyric.id} className="flex gap-2 items-center">
                                  <Select
                                    value={lyric.characters[0] || ""}
                                    onValueChange={(val) => updateLyricLine(chapter.id, block.id, lyric.id, { characters: [val] })}
                                  >
                                    <SelectTrigger className="w-28 h-8 text-xs bg-background/60 border-border/40 shrink-0">
                                      <SelectValue placeholder={t("chapters.selectSinger")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {characters.map((c) => (
                                        <SelectItem key={c.id} value={c.id} className="text-xs">
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
                                    className="text-muted-foreground/30 hover:text-destructive transition-colors p-1 shrink-0"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => addLyricLine(chapter.id, block.id)}
                                className="flex items-center gap-1 text-[11px] text-muted-foreground/50 hover:text-primary transition-colors pt-1"
                              >
                                <Plus className="w-3 h-3" />
                                {t("chapters.addLyric")}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}

                  {/* Add Block Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-border/20">
                    {(["narration", "dialogue", "song"] as const).map((type) => {
                      const cfg = blockConfig[type];
                      const Icon = cfg.icon;
                      return (
                        <Button
                          key={type}
                          onClick={() => addBlock(chapter.id, type)}
                          variant="outline"
                          size="sm"
                          className="btn-add h-8"
                        >
                          <Icon className="w-3 h-3" />
                          {cfg.label}
                        </Button>
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
