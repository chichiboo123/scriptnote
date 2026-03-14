import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Chapter, Block, LyricLine, Character } from "@/types/script";
import { CharacterMultiSelect } from "@/components/CharacterMultiSelect";
import { Plus, X, GripVertical, Layers } from "lucide-react";

/* ── Auto-resize textarea ── */
function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
  className,
  minRows = 1,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  minRows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      rows={minRows}
      style={{ overflow: "hidden" }}
    />
  );
}

/* ── Block grouping ── */
type BlockGroup =
  | { type: "dialogue-group"; blocks: Block[]; startIndex: number; lastIndex: number }
  | { type: "single"; block: Block; index: number };

function groupBlocks(blocks: Block[]): BlockGroup[] {
  const groups: BlockGroup[] = [];
  let i = 0;
  while (i < blocks.length) {
    if (blocks[i].type === "dialogue") {
      const dlg: Block[] = [];
      const startIndex = i;
      while (i < blocks.length && blocks[i].type === "dialogue") {
        dlg.push(blocks[i]);
        i++;
      }
      groups.push({ type: "dialogue-group", blocks: dlg, startIndex, lastIndex: i - 1 });
    } else {
      groups.push({ type: "single", block: blocks[i], index: i });
      i++;
    }
  }
  return groups;
}

/* ── Props ── */
interface ChapterManagementProps {
  chapters: Chapter[];
  characters: Character[];
  onChange: (chapters: Chapter[]) => void;
}

/* ── Main Component ── */
export function ChapterManagement({
  chapters,
  characters,
  onChange,
}: ChapterManagementProps) {
  const { t } = useLanguage();
  const [activeChapterId, setActiveChapterId] = useState<string>(
    chapters[0]?.id || ""
  );
  // Individual block drag
  const [dragBlockId, setDragBlockId] = useState<string | null>(null);
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null);
  // Group drag
  const [groupDragFirstId, setGroupDragFirstId] = useState<string | null>(null);
  const [groupDragOverKey, setGroupDragOverKey] = useState<string | null>(null);

  // Keep activeChapterId valid when chapters change
  useEffect(() => {
    if (chapters.length === 0) return;
    if (!chapters.find((c) => c.id === activeChapterId)) {
      setActiveChapterId(chapters[0].id);
    }
  }, [chapters, activeChapterId]);

  const activeChapter =
    chapters.find((c) => c.id === activeChapterId) ?? chapters[0];

  /* ── Chapter operations ── */
  const addChapter = () => {
    const ch: Chapter = { id: `chapter-${Date.now()}`, title: "", blocks: [] };
    onChange([...chapters, ch]);
    setActiveChapterId(ch.id);
  };

  const deleteChapter = (id: string) => {
    if (chapters.length <= 1) return;
    const idx = chapters.findIndex((c) => c.id === id);
    const next = chapters.filter((c) => c.id !== id);
    onChange(next);
    if (id === activeChapterId) {
      setActiveChapterId(next[Math.max(0, idx - 1)].id);
    }
  };

  const updateChapterTitle = (id: string, title: string) => {
    onChange(chapters.map((c) => (c.id === id ? { ...c, title } : c)));
  };

  /* ── Block helpers ── */
  const updateBlocks = useCallback(
    (blocks: Block[]) => {
      onChange(
        chapters.map((c) =>
          c.id === activeChapter?.id ? { ...c, blocks } : c
        )
      );
    },
    [chapters, onChange, activeChapter?.id]
  );

  const makeBlock = (type: Block["type"]): Block => ({
    id: `block-${Date.now()}`,
    type,
    content: "",
    ...(type === "dialogue" ? { characters: [] } : {}),
    ...(type === "song" ? { songTitle: "", lyrics: [] } : {}),
  });

  const addBlockAt = (type: Block["type"], afterIndex: number) => {
    const blocks = [...(activeChapter?.blocks || [])];
    blocks.splice(afterIndex + 1, 0, makeBlock(type));
    updateBlocks(blocks);
  };

  const addBlockToEnd = (type: Block["type"]) => {
    updateBlocks([...(activeChapter?.blocks || []), makeBlock(type)]);
  };

  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    updateBlocks(
      (activeChapter?.blocks || []).map((b) =>
        b.id === blockId ? { ...b, ...updates } : b
      )
    );
  };

  const deleteBlock = (blockId: string) => {
    updateBlocks((activeChapter?.blocks || []).filter((b) => b.id !== blockId));
  };

  /* ── Lyric helpers ── */
  const addLyric = (blockId: string) => {
    updateBlocks(
      (activeChapter?.blocks || []).map((b) =>
        b.id === blockId
          ? {
              ...b,
              lyrics: [
                ...(b.lyrics || []),
                { id: `lyric-${Date.now()}`, characters: [], content: "" },
              ],
            }
          : b
      )
    );
  };

  const addSongNarration = (blockId: string) => {
    updateBlocks(
      (activeChapter?.blocks || []).map((b) =>
        b.id === blockId
          ? {
              ...b,
              lyrics: [
                ...(b.lyrics || []),
                {
                  id: `lyric-${Date.now()}`,
                  type: "narration" as const,
                  characters: [],
                  content: "",
                },
              ],
            }
          : b
      )
    );
  };

  const updateLyric = (
    blockId: string,
    lyricId: string,
    updates: Partial<LyricLine>
  ) => {
    updateBlocks(
      (activeChapter?.blocks || []).map((b) =>
        b.id === blockId
          ? {
              ...b,
              lyrics: (b.lyrics || []).map((l) =>
                l.id === lyricId ? { ...l, ...updates } : l
              ),
            }
          : b
      )
    );
  };

  const deleteLyric = (blockId: string, lyricId: string) => {
    updateBlocks(
      (activeChapter?.blocks || []).map((b) =>
        b.id === blockId
          ? { ...b, lyrics: (b.lyrics || []).filter((l) => l.id !== lyricId) }
          : b
      )
    );
  };

  /* ── Individual block Drag & Drop ── */
  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (groupDragFirstId) return; // block drag blocked while group drag active
    setDragBlockId(id);
    e.dataTransfer.effectAllowed = "move";
    e.stopPropagation();
  };
  const handleDragEnd = () => {
    setDragBlockId(null);
    setDragOverBlockId(null);
  };
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (groupDragFirstId) return; // group drag in progress, skip
    if (dragBlockId !== id) setDragOverBlockId(id);
  };
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation(); // prevent bubbling to group container
    if (groupDragFirstId) return; // group drag in progress, skip
    if (!dragBlockId || dragBlockId === targetId) return handleDragEnd();
    const blocks = [...(activeChapter?.blocks || [])];
    const from = blocks.findIndex((b) => b.id === dragBlockId);
    const to = blocks.findIndex((b) => b.id === targetId);
    if (from < 0 || to < 0) return handleDragEnd();
    const [moved] = blocks.splice(from, 1);
    blocks.splice(to, 0, moved);
    updateBlocks(blocks);
    handleDragEnd();
  };

  const dragAttrs = (block: Block) => ({
    draggable: true as const,
    onDragStart: (e: React.DragEvent) => handleDragStart(e, block.id),
    onDragEnd: handleDragEnd,
    onDragOver: (e: React.DragEvent) => handleDragOver(e, block.id),
    onDrop: (e: React.DragEvent) => handleDrop(e, block.id),
  });

  /* ── Group Drag & Drop ── */
  const handleGroupDragStart = (e: React.DragEvent, firstBlockId: string) => {
    setGroupDragFirstId(firstBlockId);
    setDragBlockId(null);
    e.dataTransfer.effectAllowed = "move";
    e.stopPropagation();
  };
  const handleGroupDragEnd = () => {
    setGroupDragFirstId(null);
    setGroupDragOverKey(null);
  };
  const handleGroupDragOver = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    if (!groupDragFirstId) return;
    setGroupDragOverKey(key);
  };
  const handleGroupDrop = (e: React.DragEvent, targetKey: string, targetFirstBlockId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!groupDragFirstId) return handleGroupDragEnd();
    if (groupDragFirstId === targetFirstBlockId) return handleGroupDragEnd();

    const blocks = [...(activeChapter?.blocks || [])];
    const startIdx = blocks.findIndex((b) => b.id === groupDragFirstId);
    if (startIdx < 0) return handleGroupDragEnd();

    let endIdx = startIdx;
    while (endIdx + 1 < blocks.length && blocks[endIdx + 1].type === "dialogue") {
      endIdx++;
    }

    const groupIds = new Set(blocks.slice(startIdx, endIdx + 1).map((b) => b.id));
    if (groupIds.has(targetFirstBlockId)) return handleGroupDragEnd();

    const draggedGroup = blocks.slice(startIdx, endIdx + 1);
    const remaining = blocks.filter((b) => !groupIds.has(b.id));

    const newTargetIdx = remaining.findIndex((b) => b.id === targetFirstBlockId);
    if (newTargetIdx < 0) return handleGroupDragEnd();

    // If target is part of a dialogue group, advance to end of that group
    // so we insert after the entire group, not in the middle of it
    let insertAfter = newTargetIdx;
    while (
      insertAfter + 1 < remaining.length &&
      remaining[insertAfter + 1].type === "dialogue"
    ) {
      insertAfter++;
    }

    remaining.splice(insertAfter + 1, 0, ...draggedGroup);
    updateBlocks(remaining);
    handleGroupDragEnd();
  };

  /* ── Grouped blocks ── */
  const blockGroups = useMemo(
    () => groupBlocks(activeChapter?.blocks || []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeChapter?.blocks]
  );

  const blockConfig = {
    narration: { label: t("chapters.narration"), emoji: "📜" },
    dialogue: { label: t("chapters.dialogue"), emoji: "💬" },
    song: { label: t("chapters.song"), emoji: "🎵" },
  };

  /* ── Inline add bar ── */
  const InlineAddBar = ({ afterIndex }: { afterIndex: number }) => (
    <div className="flex items-center gap-1 py-0.5 my-0.5 opacity-40 hover:opacity-100 transition-opacity duration-150">
      <div className="flex-1 border-t border-dashed border-border/30" />
      <div className="flex gap-1">
        {(["narration", "dialogue", "song"] as const).map((type) => (
          <button
            key={type}
            onMouseDown={(e) => {
              e.preventDefault();
              addBlockAt(type, afterIndex);
            }}
            className="flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-[11px] font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <Plus className="w-2.5 h-2.5" />
            {blockConfig[type].label}
          </button>
        ))}
      </div>
      <div className="flex-1 border-t border-dashed border-border/30" />
    </div>
  );

  if (!activeChapter) return null;

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center px-1">
        <h2 className="section-title">
          <div className="icon-badge bg-accent/30">
            <Layers className="w-5 h-5 text-accent-foreground" />
          </div>
          {t("chapters.title")}
        </h2>
      </div>

      <div className="section-card overflow-hidden">
        {/* ── Tab bar ── */}
        <div
          className="flex items-end gap-0.5 px-3 pt-3 overflow-x-auto border-b-2 border-border/20"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {chapters.map((ch, idx) => {
            const isActive = ch.id === activeChapterId;
            return (
              <div key={ch.id} className="relative shrink-0">
                <button
                  onClick={() => setActiveChapterId(ch.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-card border-2 border-b-card border-border/40 text-primary -mb-[2px] z-10 relative"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span>
                    {t("chapters.chapterLabel")} {idx + 1}
                  </span>
                  {ch.title && (
                    <span className="opacity-70 max-w-[60px] truncate hidden sm:inline">
                      {ch.title}
                    </span>
                  )}
                </button>
                {chapters.length > 1 && isActive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChapter(ch.id);
                    }}
                    title={t("chapters.delete")}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-muted hover:bg-destructive text-muted-foreground hover:text-white rounded-full flex items-center justify-center transition-colors z-20"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            );
          })}
          <button
            onClick={addChapter}
            title={t("chapters.add")}
            className="flex items-center justify-center w-8 h-8 rounded-xl mb-1 ml-1 shrink-0 text-primary bg-primary/10 hover:bg-primary/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* ── Chapter title ── */}
        <div className="px-4 py-2.5 border-b border-border/10 bg-muted/10">
          <input
            value={activeChapter.title}
            onChange={(e) =>
              updateChapterTitle(activeChapter.id, e.target.value)
            }
            placeholder={t("chapters.chapterTitle.placeholder")}
            className="field-input w-full text-sm"
          />
        </div>

        {/* ── Blocks ── */}
        <div className="px-3 sm:px-4 py-3 space-y-0.5">
          {activeChapter.blocks.length === 0 && (
            <div className="text-center py-10">
              <span className="text-4xl block mb-2">✍️</span>
              <p className="text-sm text-muted-foreground">
                {t("chapters.empty")}
              </p>
            </div>
          )}

          {blockGroups.map((group) => {
            /* ── Single narration or song block ── */
            if (group.type === "single") {
              const { block, index } = group;
              const isDragging = dragBlockId === block.id;
              const isDragOver = dragOverBlockId === block.id;
              const isGroupDragOver = groupDragOverKey === block.id;

              return (
                <div key={block.id}>
                  <div
                    {...dragAttrs(block)}
                    onDragOver={(e) => {
                      handleDragOver(e, block.id);
                      handleGroupDragOver(e, block.id);
                    }}
                    onDrop={(e) => {
                      if (groupDragFirstId) {
                        handleGroupDrop(e, block.id, block.id);
                      } else {
                        handleDrop(e, block.id);
                      }
                    }}
                    className={`block-card ${
                      block.type === "narration" ? "block-narration" : "block-song"
                    } transition-all duration-150 ${
                      isDragging ? "opacity-40 scale-[0.98]" : ""
                    } ${isDragOver || isGroupDragOver ? "ring-2 ring-primary/40" : ""}`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-bold text-foreground/70">
                        <GripVertical
                          className="w-4 h-4 text-muted-foreground/30 hover:text-muted-foreground/70 cursor-grab active:cursor-grabbing shrink-0"
                          title={t("blocks.dragTooltip")}
                        />
                        <span>{blockConfig[block.type].emoji}</span>
                        {blockConfig[block.type].label}
                      </span>
                      <button
                        onClick={() => deleteBlock(block.id)}
                        className="text-muted-foreground/30 hover:text-destructive transition-colors p-1 rounded-lg hover:bg-destructive/10"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Narration */}
                    {block.type === "narration" && (
                      <AutoResizeTextarea
                        value={block.content}
                        onChange={(val) =>
                          updateBlock(block.id, { content: val })
                        }
                        placeholder={t("chapters.narration.placeholder")}
                        className="field-textarea w-full"
                        minRows={3}
                      />
                    )}

                    {/* Song */}
                    {block.type === "song" && (
                      <>
                        <input
                          value={block.songTitle || ""}
                          onChange={(e) =>
                            updateBlock(block.id, { songTitle: e.target.value })
                          }
                          placeholder={t("chapters.songTitle.placeholder")}
                          className="field-input w-full font-bold"
                        />
                        <div className="space-y-2 pl-3 border-l-[3px] border-accent/50 mt-2">
                          {(block.lyrics || []).map((lyric) => (
                            <div
                              key={lyric.id}
                              className="flex gap-2 items-start"
                            >
                              {lyric.type === "narration" ? (
                                /* Song-internal stage direction */
                                <>
                                  <span className="text-[10px] font-bold text-muted-foreground/60 bg-muted/60 rounded px-1.5 py-1.5 shrink-0 mt-0.5 whitespace-nowrap">
                                    {t("chapters.narration")}
                                  </span>
                                  <AutoResizeTextarea
                                    value={lyric.content}
                                    onChange={(val) =>
                                      updateLyric(block.id, lyric.id, {
                                        content: val,
                                      })
                                    }
                                    placeholder={t("chapters.songNarration.placeholder")}
                                    className="field-textarea flex-1 italic text-muted-foreground"
                                    minRows={1}
                                  />
                                </>
                              ) : (
                                /* Regular lyric line */
                                <>
                                  <CharacterMultiSelect
                                    characters={characters}
                                    selected={lyric.characters}
                                    onChange={(ids) =>
                                      updateLyric(block.id, lyric.id, {
                                        characters: ids,
                                      })
                                    }
                                    placeholder={t("chapters.selectSinger")}
                                    compact
                                  />
                                  <AutoResizeTextarea
                                    value={lyric.content}
                                    onChange={(val) =>
                                      updateLyric(block.id, lyric.id, {
                                        content: val,
                                      })
                                    }
                                    placeholder={t("chapters.lyric.placeholder")}
                                    className="field-textarea flex-1"
                                    minRows={1}
                                  />
                                </>
                              )}
                              <button
                                onClick={() => deleteLyric(block.id, lyric.id)}
                                className="text-muted-foreground/30 hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-destructive/10 shrink-0"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          <div className="flex items-center gap-3 pt-1">
                            <button
                              onClick={() => addLyric(block.id)}
                              className="flex items-center gap-1.5 text-sm font-semibold text-accent-foreground/60 hover:text-primary transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              {t("chapters.addLyric")}
                            </button>
                            <button
                              onClick={() => addSongNarration(block.id)}
                              className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              {t("chapters.addSongNarration")}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <InlineAddBar afterIndex={index} />
                </div>
              );
            }

            /* ── Dialogue group ── */
            const { blocks: dlgBlocks, lastIndex } = group;
            const groupKey = `dg-${dlgBlocks[0].id}`;
            const isGroupDragging = groupDragFirstId === dlgBlocks[0].id;
            const isGroupDragOver = groupDragOverKey === groupKey;

            return (
              <div key={groupKey}>
                <div
                  onDragOver={(e) => handleGroupDragOver(e, groupKey)}
                  onDrop={(e) => {
                    if (groupDragFirstId) {
                      handleGroupDrop(e, groupKey, dlgBlocks[0].id);
                    }
                  }}
                  className={`block-card block-dialogue transition-all duration-150 ${
                    isGroupDragging ? "opacity-40 scale-[0.98]" : ""
                  } ${isGroupDragOver ? "ring-2 ring-primary/40" : ""}`}
                >
                  {/* Group header with group drag grip */}
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground/70 mb-2">
                    {/* SVG can't be draggable reliably — wrap in span */}
                    <span
                      draggable
                      onDragStart={(e) => handleGroupDragStart(e, dlgBlocks[0].id)}
                      onDragEnd={handleGroupDragEnd}
                      className="inline-flex cursor-grab active:cursor-grabbing shrink-0"
                      title={t("blocks.dragTooltip")}
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground/30 hover:text-muted-foreground/70" />
                    </span>
                    <span>💬</span>
                    {t("chapters.dialogue")}
                  </div>

                  <div className="space-y-2">
                    {dlgBlocks.map((block) => {
                      const chars =
                        block.characters ??
                        (block.character ? [block.character] : []);
                      const isDragging = dragBlockId === block.id;
                      const isDragOver = dragOverBlockId === block.id;

                      return (
                        <div
                          key={block.id}
                          {...dragAttrs(block)}
                          className={`flex gap-2 items-start transition-all duration-150 rounded-xl ${
                            isDragging ? "opacity-40" : ""
                          } ${
                            isDragOver
                              ? "ring-2 ring-primary/30 bg-primary/5 p-1"
                              : ""
                          }`}
                        >
                          <GripVertical
                            className="w-4 h-4 text-muted-foreground/30 hover:text-muted-foreground/70 cursor-grab active:cursor-grabbing shrink-0 mt-2.5"
                            title={t("blocks.dragTooltip")}
                          />
                          <CharacterMultiSelect
                            characters={characters}
                            selected={chars}
                            onChange={(ids) =>
                              updateBlock(block.id, { characters: ids })
                            }
                            placeholder={t("chapters.selectCharacter")}
                            compact
                          />
                          <div className="flex-1 min-w-0">
                            <AutoResizeTextarea
                              value={block.content}
                              onChange={(val) =>
                                updateBlock(block.id, { content: val })
                              }
                              placeholder={t("chapters.dialogue.placeholder")}
                              className="field-textarea w-full"
                              minRows={1}
                            />
                          </div>
                          <button
                            onClick={() => deleteBlock(block.id)}
                            className="text-muted-foreground/30 hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-destructive/10 shrink-0 mt-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add dialogue within group */}
                  <button
                    onClick={() => addBlockAt("dialogue", lastIndex)}
                    className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/60 hover:text-primary transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {t("chapters.addDialogue")}
                  </button>
                </div>
                <InlineAddBar afterIndex={lastIndex} />
              </div>
            );
          })}

          {/* ── Bottom add buttons ── */}
          <div className="flex flex-wrap gap-2 pt-3 mt-1 border-t-2 border-border/15">
            {(["narration", "dialogue", "song"] as const).map((type) => (
              <button
                key={type}
                onClick={() => addBlockToEnd(type)}
                className="btn-add flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-dashed border-border text-sm font-semibold text-muted-foreground hover:text-primary hover:border-primary/40 transition-all active:scale-95"
              >
                <span>{blockConfig[type].emoji}</span>
                {blockConfig[type].label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
