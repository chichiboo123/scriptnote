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
  characters: string[];
  content: string;
}

export interface Block {
  id: string;
  type: "narration" | "dialogue" | "song";
  content: string;
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

export const CHARACTER_COLORS = [
  "bg-pink-100 border-pink-200 text-pink-800",
  "bg-emerald-100 border-emerald-200 text-emerald-800",
  "bg-sky-100 border-sky-200 text-sky-800",
  "bg-yellow-100 border-yellow-200 text-yellow-800",
  "bg-violet-100 border-violet-200 text-violet-800",
  "bg-orange-100 border-orange-200 text-orange-800",
  "bg-teal-100 border-teal-200 text-teal-800",
  "bg-red-100 border-red-200 text-red-800",
  "bg-indigo-100 border-indigo-200 text-indigo-800",
  "bg-lime-100 border-lime-200 text-lime-800",
  "bg-fuchsia-100 border-fuchsia-200 text-fuchsia-800",
  "bg-cyan-100 border-cyan-200 text-cyan-800",
  "bg-rose-100 border-rose-200 text-rose-800",
  "bg-amber-100 border-amber-200 text-amber-800",
  "bg-blue-100 border-blue-200 text-blue-800",
];
