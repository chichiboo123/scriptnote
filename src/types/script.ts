export interface WorkInfo {
  title: string;
  timeSetting: string;
  spaceSetting: string;
  synopsis: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  colorClass: string;
}

export interface LyricLine {
  id: string;
  type?: "lyric" | "narration"; // undefined = 'lyric' (backward compat)
  characters: string[];
  content: string;
}

export interface Block {
  id: string;
  type: "narration" | "dialogue" | "song";
  content: string;
  characters?: string[]; // multi-select; TOGETHER_ID means 다함께
  /** @deprecated use characters instead */
  character?: string;
  songTitle?: string;
  lyrics?: LyricLine[];
}

export interface Chapter {
  id: string;
  title: string;
  blocks: Block[];
}

export interface ScriptData {
  work: WorkInfo;
  characters: Character[];
  chapters: Chapter[];
}

export const initialScriptData: ScriptData = {
  work: { title: "", timeSetting: "", spaceSetting: "", synopsis: "" },
  characters: [],
  chapters: [{ id: "chapter-1", title: "", blocks: [] }],
};

export const TOGETHER_ID = "__all__";

// Solid dot colors matching CHARACTER_COLORS order
export const CHARACTER_SOLID_COLORS = [
  "#f472b6", // pink
  "#34d399", // emerald
  "#38bdf8", // sky
  "#facc15", // yellow
  "#a78bfa", // violet
  "#fb923c", // orange
  "#2dd4bf", // teal
  "#f87171", // red
  "#818cf8", // indigo
  "#a3e635", // lime
  "#e879f9", // fuchsia
  "#22d3ee", // cyan
  "#fb7185", // rose
  "#fbbf24", // amber
  "#60a5fa", // blue
];

// Lighter pastel palette: -50 bg, -200 border, -700 text for readability
export const CHARACTER_COLORS = [
  "bg-pink-50 border-pink-200 text-pink-700",
  "bg-emerald-50 border-emerald-200 text-emerald-700",
  "bg-sky-50 border-sky-200 text-sky-700",
  "bg-yellow-50 border-yellow-200 text-yellow-700",
  "bg-violet-50 border-violet-200 text-violet-700",
  "bg-orange-50 border-orange-200 text-orange-700",
  "bg-teal-50 border-teal-200 text-teal-700",
  "bg-red-50 border-red-200 text-red-700",
  "bg-indigo-50 border-indigo-200 text-indigo-700",
  "bg-lime-50 border-lime-200 text-lime-700",
  "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700",
  "bg-cyan-50 border-cyan-200 text-cyan-700",
  "bg-rose-50 border-rose-200 text-rose-700",
  "bg-amber-50 border-amber-200 text-amber-700",
  "bg-blue-50 border-blue-200 text-blue-700",
];
