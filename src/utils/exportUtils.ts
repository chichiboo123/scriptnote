import { ScriptData, Character } from "@/types/script";
import jsPDF from "jspdf";

function getCharacterName(characters: Character[], id: string): string {
  return characters.find((c) => c.id === id)?.name || id;
}

function formatScriptForExport(data: ScriptData): string {
  const lines: string[] = [];
  const { work, characters, chapters } = data;

  lines.push(work.title || "무제");
  lines.push("==============");
  lines.push("");
  lines.push("작품 정보");
  lines.push("--------");
  if (work.timeSetting) lines.push(`시간 배경: ${work.timeSetting}`);
  if (work.spaceSetting) lines.push(`공간 배경: ${work.spaceSetting}`);
  if (work.synopsis) lines.push(`시놉시스: ${work.synopsis}`);
  lines.push("");

  if (characters.length > 0) {
    lines.push("등장인물");
    lines.push("--------");
    characters.forEach((c) => {
      lines.push(`• ${c.name}${c.description ? ` - ${c.description}` : ""}`);
    });
    lines.push("");
  }

  chapters.forEach((chapter, idx) => {
    lines.push(`${idx + 1}장${chapter.title ? ` - ${chapter.title}` : ""}`);
    lines.push("=============");
    lines.push("");

    chapter.blocks.forEach((block) => {
      switch (block.type) {
        case "narration":
          lines.push(`[해설] ${block.content}`);
          break;
        case "dialogue":
          const charName = block.character
            ? getCharacterName(characters, block.character)
            : "???";
          lines.push(`${charName}: ${block.content}`);
          break;
        case "song":
          lines.push(`[노래] ${block.songTitle || ""}`);
          (block.lyrics || []).forEach((l) => {
            const singer = l.characters[0]
              ? getCharacterName(characters, l.characters[0])
              : "???";
            lines.push(`${singer}: ${l.content}`);
          });
          break;
      }
      lines.push("");
    });
  });

  return lines.join("\n");
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToTxt(data: ScriptData) {
  const text = formatScriptForExport(data);
  const bom = "\uFEFF";
  const blob = new Blob([bom + text], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, `${data.work.title || "script"}.txt`);
}

export function exportToDocx(data: ScriptData) {
  const text = formatScriptForExport(data);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  if (isMobile) {
    const rtfContent = `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Malgun Gothic;}}\\f0\\fs24 ${text
      .replace(/\\/g, "\\\\")
      .replace(/\{/g, "\\{")
      .replace(/\}/g, "\\}")
      .replace(/\n/g, "\\par ")}
    }`;
    const blob = new Blob([rtfContent], { type: "application/rtf" });
    downloadBlob(blob, `${data.work.title || "script"}.rtf`);
  } else {
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br/>");
    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><style>body{font-family:'Malgun Gothic',sans-serif;font-size:12pt;}</style></head>
    <body>${escaped}</body></html>`;
    const blob = new Blob(["\uFEFF" + html], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    downloadBlob(blob, `${data.work.title || "script"}.docx`);
  }
}

export function exportToPdf(data: ScriptData) {
  const text = formatScriptForExport(data);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  if (isMobile) {
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    pdf.setFont("helvetica");
    pdf.setFontSize(11);
    const lines = pdf.splitTextToSize(text, 170);
    let y = 20;
    lines.forEach((line: string) => {
      if (y > 275) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(line, 20, y);
      y += 6;
    });
    pdf.save(`${data.work.title || "script"}.pdf`);
  } else {
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br/>");
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
        <title>${data.work.title || "Script"}</title>
        <style>body{font-family:'Malgun Gothic','Noto Sans KR',sans-serif;font-size:12pt;max-width:700px;margin:40px auto;line-height:1.8;}</style>
        </head><body>${escaped}</body></html>`);
      printWindow.document.close();
      printWindow.print();
    }
  }
}

export async function copyToClipboard(data: ScriptData) {
  const text = formatScriptForExport(data);
  await navigator.clipboard.writeText(text);
}

export function openFullView(data: ScriptData) {
  const text = formatScriptForExport(data);
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <title>${data.work.title || "Script"}</title>
    <style>body{font-family:'Malgun Gothic','Noto Sans KR',sans-serif;font-size:14pt;max-width:700px;margin:40px auto;line-height:1.8;padding:20px;}</style>
    </head><body>${escaped}</body></html>`;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  if (isMobile) {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  } else {
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  }
}

export function exportToJson(data: ScriptData) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  downloadBlob(blob, `${data.work.title || "script"}.json`);
}

export function importFromJson(): Promise<ScriptData> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return reject(new Error("No file selected"));
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string) as ScriptData;
          if (!data.work || !data.characters || !data.chapters) {
            throw new Error("Invalid format");
          }
          resolve(data);
        } catch {
          reject(new Error("Invalid JSON"));
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });
}
