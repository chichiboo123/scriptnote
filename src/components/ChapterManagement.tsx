import { useLanguage } from "@/contexts/LanguageContext";
import { Chapter, Block, LyricLine, Character } from "@/types/script";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Trash2,
  MessageSquare,
  Mic,
  Music,
  ChevronDown,
  ChevronUp,
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
    const newChapter: Chapter = {
      id: `chapter-${Date.now()}`,
      title: "",
      blocks: [],
    };
    onChange([...chapters, newChapter]);
    setExpandedChapters((prev) => ({ ...prev, [newChapter.id]: true }));
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
    onChange(
      chapters.map((c) =>
        c.id === chapterId ? { ...c, blocks: [...c.blocks, newBlock] } : c
      )
    );
  };

  const updateBlock = (chapterId: string, blockId: string, updates: Partial<Block>) => {
    onChange(
      chapters.map((c) =>
        c.id === chapterId
          ? {
              ...c,
              blocks: c.blocks.map((b) => (b.id === blockId ? { ...b, ...updates } : b)),
            }
          : c
      )
    );
  };

  const deleteBlock = (chapterId: string, blockId: string) => {
    onChange(
      chapters.map((c) =>
        c.id === chapterId ? { ...c, blocks: c.blocks.filter((b) => b.id !== blockId) } : c
      )
    );
  };

  const addLyricLine = (chapterId: string, blockId: string) => {
    const newLine: LyricLine = {
      id: `lyric-${Date.now()}`,
      characters: [],
      content: "",
    };
    onChange(
      chapters.map((c) =>
        c.id === chapterId
          ? {
              ...c,
              blocks: c.blocks.map((b) =>
                b.id === blockId ? { ...b, lyrics: [...(b.lyrics || []), newLine] } : b
              ),
            }
          : c
      )
    );
  };

  const updateLyricLine = (
    chapterId: string,
    blockId: string,
    lyricId: string,
    updates: Partial<LyricLine>
  ) => {
    onChange(
      chapters.map((c) =>
        c.id === chapterId
          ? {
              ...c,
              blocks: c.blocks.map((b) =>
                b.id === blockId
                  ? {
                      ...b,
                      lyrics: (b.lyrics || []).map((l) =>
                        l.id === lyricId ? { ...l, ...updates } : l
                      ),
                    }
                  : b
              ),
            }
          : c
      )
    );
  };

  const deleteLyricLine = (chapterId: string, blockId: string, lyricId: string) => {
    onChange(
      chapters.map((c) =>
        c.id === chapterId
          ? {
              ...c,
              blocks: c.blocks.map((b) =>
                b.id === blockId
                  ? { ...b, lyrics: (b.lyrics || []).filter((l) => l.id !== lyricId) }
                  : b
              ),
            }
          : c
      )
    );
  };

  const blockIcon = (type: Block["type"]) => {
    switch (type) {
      case "narration": return <MessageSquare className="w-4 h-4" />;
      case "dialogue": return <Mic className="w-4 h-4" />;
      case "song": return <Music className="w-4 h-4" />;
    }
  };

  const blockLabel = (type: Block["type"]) => {
    switch (type) {
      case "narration": return t("chapters.narration");
      case "dialogue": return t("chapters.dialogue");
      case "song": return t("chapters.song");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-do-hyeon flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          {t("chapters.title")}
        </h2>
        <Button onClick={addChapter} size="sm" variant="outline" className="gap-1">
          <Plus className="w-4 h-4" />
          {t("chapters.add")}
        </Button>
      </div>

      {chapters.map((chapter, idx) => (
        <div key={chapter.id} className="glass-card animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {expandedChapters[chapter.id] ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            <span className="font-do-hyeon text-lg text-muted-foreground">{idx + 1}장</span>
            <Input
              value={chapter.title}
              onChange={(e) => updateChapterTitle(chapter.id, e.target.value)}
              placeholder={t("chapters.chapterTitle.placeholder")}
              className="bg-background/50 flex-1"
            />
            {chapters.length > 1 && (
              <Button
                onClick={() => deleteChapter(chapter.id)}
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          {expandedChapters[chapter.id] && (
            <div className="space-y-3">
              {chapter.blocks.length === 0 && (
                <p className="text-muted-foreground text-center py-4 text-sm">
                  {t("chapters.empty")}
                </p>
              )}

              {chapter.blocks.map((block) => (
                <div
                  key={block.id}
                  className="border border-border rounded-xl p-4 bg-background/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      {blockIcon(block.type)}
                      {blockLabel(block.type)}
                    </span>
                    <Button
                      onClick={() => deleteBlock(chapter.id, block.id)}
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive h-7 w-7"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  {block.type === "dialogue" && (
                    <Select
                      value={block.character || ""}
                      onValueChange={(val) =>
                        updateBlock(chapter.id, block.id, { character: val })
                      }
                    >
                      <SelectTrigger className="bg-background/50 w-full sm:w-48">
                        <SelectValue placeholder={t("chapters.selectCharacter")} />
                      </SelectTrigger>
                      <SelectContent>
                        {characters.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name || c.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {(block.type === "narration" || block.type === "dialogue") && (
                    <Textarea
                      value={block.content}
                      onChange={(e) =>
                        updateBlock(chapter.id, block.id, { content: e.target.value })
                      }
                      placeholder={
                        block.type === "narration"
                          ? t("chapters.narration.placeholder")
                          : t("chapters.dialogue.placeholder")
                      }
                      className="bg-background/50 min-h-[60px]"
                    />
                  )}

                  {block.type === "song" && (
                    <>
                      <Input
                        value={block.songTitle || ""}
                        onChange={(e) =>
                          updateBlock(chapter.id, block.id, { songTitle: e.target.value })
                        }
                        placeholder={t("chapters.songTitle.placeholder")}
                        className="bg-background/50"
                      />
                      <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                        {(block.lyrics || []).map((lyric) => (
                          <div key={lyric.id} className="flex gap-2 items-start">
                            <Select
                              value={lyric.characters[0] || ""}
                              onValueChange={(val) =>
                                updateLyricLine(chapter.id, block.id, lyric.id, {
                                  characters: [val],
                                })
                              }
                            >
                              <SelectTrigger className="bg-background/50 w-32 shrink-0">
                                <SelectValue placeholder={t("chapters.selectSinger")} />
                              </SelectTrigger>
                              <SelectContent>
                                {characters.map((c) => (
                                  <SelectItem key={c.id} value={c.id}>
                                    {c.name || c.id}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              value={lyric.content}
                              onChange={(e) =>
                                updateLyricLine(chapter.id, block.id, lyric.id, {
                                  content: e.target.value,
                                })
                              }
                              placeholder={t("chapters.lyric.placeholder")}
                              className="bg-background/50 flex-1"
                            />
                            <Button
                              onClick={() => deleteLyricLine(chapter.id, block.id, lyric.id)}
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive h-9 w-9 shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          onClick={() => addLyricLine(chapter.id, block.id)}
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-muted-foreground"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          {t("chapters.addLyric")}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => addBlock(chapter.id, "narration")}
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {t("chapters.narration")}
                </Button>
                <Button
                  onClick={() => addBlock(chapter.id, "dialogue")}
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs"
                >
                  <Mic className="w-3.5 h-3.5" />
                  {t("chapters.dialogue")}
                </Button>
                <Button
                  onClick={() => addBlock(chapter.id, "song")}
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs"
                >
                  <Music className="w-3.5 h-3.5" />
                  {t("chapters.song")}
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
