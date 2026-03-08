import { useLanguage } from "@/contexts/LanguageContext";
import { X } from "lucide-react";

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

const guideContent = {
  ko: {
    title: "📖 사용법 안내",
    sections: [
      {
        heading: "1. 작품 기본정보 입력",
        body: "맨 위 '작품 기본정보' 섹션에서 뮤지컬 제목, 시간/공간 배경, 시놉시스를 입력하세요.",
      },
      {
        heading: "2. 등장인물 추가",
        body: "'인물 추가' 버튼을 눌러 캐릭터를 만드세요. 이름과 설명을 적으면 각 인물에 자동으로 색상이 지정됩니다.",
      },
      {
        heading: "3. 장(Scene) 구성",
        body: "장을 추가한 뒤, 각 장에 블록을 추가하세요. 블록은 3종류입니다:\n• 해설 — 무대 지시, 배경 설명\n• 대사 — 인물의 대사 (인물 선택 후 입력)\n• 노래 — 노래 제목과 가사 (가수 지정 가능)",
      },
      {
        heading: "4. 저장 및 불러오기",
        body: "• 상단의 💾 아이콘을 눌러 작성 중인 대본을 JSON 파일로 저장할 수 있습니다.\n• 📂 아이콘을 눌러 저장한 JSON 파일을 불러와 작업을 이어갈 수 있습니다.",
      },
      {
        heading: "5. 내보내기",
        body: "작성한 대본을 TXT, DOCX, PDF로 다운로드하거나, 클립보드 복사·전체 보기·인쇄할 수 있습니다.",
      },
      {
        heading: "6. 기타",
        body: "• 데이터는 브라우저에 자동 저장됩니다.\n• '데이터 초기화'를 누르면 모든 내용이 삭제됩니다.\n• 상단 언어 버튼으로 한국어/영어/일본어를 전환할 수 있습니다.",
      },
    ],
    developer: "개발자 : 교육뮤지컬 꿈꾸는 치수쌤",
    close: "닫기",
  },
  en: {
    title: "📖 How to Use",
    sections: [
      {
        heading: "1. Enter Basic Information",
        body: "Fill in the musical title, time/space setting, and synopsis in the 'Basic Information' section at the top.",
      },
      {
        heading: "2. Add Characters",
        body: "Click 'Add Character' to create characters. Each character is automatically assigned a unique color.",
      },
      {
        heading: "3. Build Scenes",
        body: "Add chapters, then add blocks to each chapter. There are 3 block types:\n• Narration — stage directions, scene descriptions\n• Dialogue — character lines (select a character first)\n• Song — song title and lyrics (assign singers)",
      },
      {
        heading: "4. Save & Load",
        body: "• Tap the 💾 icon at the top to save your script as a JSON file.\n• Tap the 📂 icon to load a previously saved JSON file and continue working.",
      },
      {
        heading: "5. Export",
        body: "Download your script as TXT, DOCX, or PDF. You can also copy to clipboard, view in full screen, or print.",
      },
      {
        heading: "6. Other Tips",
        body: "• Data is auto-saved in your browser.\n• 'Reset Data' will delete all content.\n• Use the language button at the top to switch between KO/EN/JA.",
      },
    ],
    developer: "Developer: 교육뮤지컬 꿈꾸는 치수쌤",
    close: "Close",
  },
  ja: {
    title: "📖 使い方ガイド",
    sections: [
      {
        heading: "1. 作品基本情報を入力",
        body: "上部の「作品基本情報」セクションで、ミュージカルのタイトル、時間・空間設定、あらすじを入力してください。",
      },
      {
        heading: "2. 登場人物を追加",
        body: "「人物追加」ボタンを押してキャラクターを作成します。各キャラクターには自動的に色が割り当てられます。",
      },
      {
        heading: "3. 章（シーン）を構成",
        body: "章を追加し、各章にブロックを追加します。ブロックは3種類あります：\n• ナレーション — 舞台指示、場面説明\n• セリフ — キャラクターのセリフ（人物を選択して入力）\n• 歌 — 曲名と歌詞（歌手を指定可能）",
      },
      {
        heading: "4. エクスポート",
        body: "作成した台本をTXT、DOCX、PDFでダウンロードできます。クリップボードへのコピー、全体表示、印刷も可能です。",
      },
      {
        heading: "5. その他",
        body: "• データはブラウザに自動保存されます。\n• 「データ初期化」を押すとすべてのデータが削除されます。\n• 上部の言語ボタンで韓国語/英語/日本語を切り替えられます。",
      },
    ],
    developer: "開発者：교육뮤지컬 꿈꾸는 치수쌤",
    close: "閉じる",
  },
};

export function HelpModal({ open, onClose }: HelpModalProps) {
  const { language } = useLanguage();
  const content = guideContent[language];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
      <div
        className="relative bg-card rounded-2xl border-2 border-border/60 shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-border/30 shrink-0">
          <h2 className="text-lg font-bold">{content.title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 py-4 space-y-5 flex-1">
          {content.sections.map((section, i) => (
            <div key={i}>
              <h3 className="text-sm font-bold text-foreground mb-1.5">{section.heading}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t-2 border-border/30 shrink-0 flex flex-col items-center gap-3">
          <a
            href="https://litt.ly/chichiboo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-primary hover:underline"
          >
            {content.developer}
          </a>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors active:scale-[0.98]"
          >
            {content.close}
          </button>
        </div>
      </div>
    </div>
  );
}
