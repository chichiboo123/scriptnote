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
        body: "'인물 추가' 버튼을 눌러 캐릭터를 만드세요. 이름(필수)과 설명을 적으면 각 인물에 자동으로 색상이 지정됩니다. 이름을 비워두면 빨간 테두리로 표시됩니다.",
      },
      {
        heading: "3. 장(Scene) 구성",
        body: "상단 탭으로 장을 추가·전환하세요. 각 장에 블록을 추가합니다:\n• 해설 — 무대 지시, 배경 설명\n• 대사 — 인물의 대사 (다중 인물 선택 가능, ✨ 다함께 옵션 포함)\n• 노래 — 노래 제목과 가사 (가수 지정, 가사 중 해설 줄 추가 가능)\n\n블록 사이의 + 버튼으로 원하는 위치에 블록을 삽입할 수 있습니다.",
      },
      {
        heading: "4. 블록 순서 변경 (드래그)",
        body: "• 각 블록 왼쪽의 ⠿ 아이콘을 드래그하면 블록을 원하는 위치로 이동할 수 있습니다.\n• 연속된 대사 블록 묶음은 그룹 헤더의 ⠿ 아이콘으로 묶음 전체를 한 번에 이동할 수 있습니다.",
      },
      {
        heading: "5. 저장 및 불러오기",
        body: "• 상단의 💾 아이콘: 대본을 JSON 파일로 저장\n• 📂 아이콘: 저장한 JSON 파일 불러오기\n• 링크 공유: 현재 대본을 URL로 압축하여 공유 (서버 불필요)",
      },
      {
        heading: "6. 내보내기 (우측 하단 버튼)",
        body: "• TXT / PDF 다운로드\n• 클립보드 복사 · 전체 보기 · 인쇄\n• 링크 공유 (URL에 데이터 포함)",
      },
      {
        heading: "7. 기타",
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
        body: "Click 'Add Character' to create characters. Name is required — an empty name shows a red border. Each character is automatically assigned a unique color.",
      },
      {
        heading: "3. Build Scenes",
        body: "Use the tabs at the top to add and switch chapters. Add blocks to each chapter:\n• Narration — stage directions, scene descriptions\n• Dialogue — character lines (multi-select supported, ✨ All Together option included)\n• Song — song title and lyrics (assign singers, add stage direction lines within songs)\n\nUse the + buttons between blocks to insert a block at any position.",
      },
      {
        heading: "4. Reorder Blocks (Drag & Drop)",
        body: "• Drag the ⠿ icon on the left of any block to move it.\n• For consecutive dialogue groups, drag the ⠿ icon in the group header to move the entire group at once.",
      },
      {
        heading: "5. Save & Load",
        body: "• 💾 icon at the top: Save script as a JSON file\n• 📂 icon: Load a previously saved JSON file\n• Share Link: Compress the current script into a URL (no server needed)",
      },
      {
        heading: "6. Export (bottom-right button)",
        body: "• Download as TXT or PDF\n• Copy to clipboard · Full view · Print\n• Share Link (data embedded in URL)",
      },
      {
        heading: "7. Other Tips",
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
        body: "「人物追加」ボタンを押してキャラクターを作成します。名前は必須です — 空欄のままにすると赤い枠で表示されます。各キャラクターには自動的に色が割り当てられます。",
      },
      {
        heading: "3. 章（シーン）を構成",
        body: "上部のタブで章を追加・切り替えます。各章にブロックを追加します：\n• ナレーション — 舞台指示、場面説明\n• セリフ — キャラクターのセリフ（複数人物の選択可、✨ みんなで オプションあり）\n• 歌 — 曲名と歌詞（歌手指定、歌の中にト書き行の追加も可能）\n\nブロック間の＋ボタンで任意の位置にブロックを挿入できます。",
      },
      {
        heading: "4. ブロックの並び替え（ドラッグ）",
        body: "• 各ブロック左側の ⠿ アイコンをドラッグして位置を変更できます。\n• 連続するセリフグループはグループヘッダーの ⠿ アイコンでまとめて移動できます。",
      },
      {
        heading: "5. 保存と読み込み",
        body: "• 上部の💾アイコン：台本をJSONファイルとして保存\n• 📂アイコン：保存したJSONファイルを読み込む\n• リンク共有：現在の台本をURLに圧縮して共有（サーバー不要）",
      },
      {
        heading: "6. エクスポート（右下ボタン）",
        body: "• TXT / PDF ダウンロード\n• クリップボードコピー・全体表示・印刷\n• リンク共有（データをURLに埋め込み）",
      },
      {
        heading: "7. その他",
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
