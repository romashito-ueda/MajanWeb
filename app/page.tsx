"use client";

import { useMemo, useState } from "react";

type Problem = {
  id: string;
  title: string;
  situation: string;
  hand: string[];
  dora: string;
  expected: string;
  reason: string;
  tips: string[];
};

const problems: Problem[] = [
  {
    id: "Q1",
    title: "タンヤオ・ドラ1のスピード",
    situation: "南2局・東家・6巡目・供託0本場0",
    hand: [
      "2m",
      "3m",
      "4m",
      "5m",
      "6m",
      "7m",
      "3p",
      "4p",
      "5p",
      "6p",
      "6s",
      "7s",
      "8s",
      "北",
    ],
    dora: "5p",
    expected: "北",
    reason:
      "両面が3組あり打点も十分。ターツオーバーなので安全度が低い字牌を整理してスピード優先。",
    tips: [
      "ドラ周辺の5p6pは残すと打点アップ。",
      "中張牌を残してタンヤオを狙う。",
    ],
  },
  {
    id: "Q2",
    title: "役牌バックのバランス",
    situation: "東1局・南家・5巡目・供託0本場1",
    hand: [
      "1m",
      "2m",
      "3m",
      "6m",
      "7m",
      "8m",
      "2p",
      "3p",
      "5p",
      "5p",
      "白",
      "白",
      "7s",
      "9s",
    ],
    dora: "7s",
    expected: "9s",
    reason:
      "白が対子で役が見えている。浮いている9sを切って受け入れを最大化し、7sはドラで残す。",
    tips: [
      "役牌バックは速度が命。",
      "ドラはリャンメンができなくても保持。",
    ],
  },
  {
    id: "Q3",
    title: "両面変化を残す",
    situation: "南3局・西家・7巡目・供託1本場0",
    hand: [
      "3m",
      "4m",
      "5m",
      "6m",
      "7m",
      "8m",
      "4p",
      "5p",
      "6p",
      "2s",
      "3s",
      "4s",
      "9s",
      "南",
    ],
    dora: "4s",
    expected: "南",
    reason:
      "手牌はほぼ完成形。9sは端で価値が低く、南は孤立牌で安全度も低い。先に字牌を整理して待ちの質を維持。",
    tips: [
      "両面変化を残すと高打点を維持しやすい。",
      "安全度が低い字牌は早めに処理。",
    ],
  },
];

const allTiles = ["m", "p", "s"] as const;
type Suit = (typeof allTiles)[number];

const honorLabels: Record<string, string> = {
  東: "東",
  南: "南",
  西: "西",
  北: "北",
  白: "白",
  發: "發",
  中: "中",
};

type TileParts = {
  type: "honor" | "suited";
  label: string;
  number?: string;
  suit?: Suit;
};

const parseTile = (tile: string): TileParts => {
  if (tile.length === 1 && honorLabels[tile]) {
    return { type: "honor", label: honorLabels[tile] };
  }
  const suit = tile.slice(-1) as Suit;
  const number = tile.slice(0, -1);
  if (allTiles.includes(suit)) {
    return { type: "suited", label: `${number}${suit}`, number, suit };
  }
  return { type: "honor", label: tile };
};

const suitIcon = (suit: Suit, accent: string) => {
  if (suit === "p") {
    return (
      <>
        <circle cx="30" cy="52" r="14" fill="none" stroke={accent} strokeWidth="3" />
        <circle cx="30" cy="52" r="6" fill={accent} />
      </>
    );
  }

  if (suit === "s") {
    return (
      <>
        <rect x="24" y="40" width="4" height="24" rx="2" fill={accent} />
        <rect x="30" y="38" width="4" height="28" rx="2" fill={accent} />
        <rect x="36" y="40" width="4" height="24" rx="2" fill={accent} />
      </>
    );
  }

  return (
    <text
      x="30"
      y="58"
      textAnchor="middle"
      fontSize="22"
      fontFamily='"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif'
      fill={accent}
    >
      萬
    </text>
  );
};

const MahjongTile = ({ tile, size = "regular" }: { tile: string; size?: "regular" | "small" }) => {
  const parsed = parseTile(tile);
  const accent = parsed.type === "suited" ? "#1f6b5e" : "#1f1f1f";
  const numberColor = parsed.number === "5" ? "#c03232" : accent;

  return (
    <div className={`tile ${size === "small" ? "tile--small" : ""}`} aria-label={parsed.label}>
      <svg viewBox="0 0 60 80" role="img" aria-hidden="true">
        <rect x="2" y="2" width="56" height="76" rx="8" fill="#fffdf8" stroke="#1f1f1f" strokeWidth="2" />
        {parsed.type === "honor" ? (
          <text
            x="30"
            y="52"
            textAnchor="middle"
            fontSize="30"
            fontFamily='"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif'
            fill={accent}
          >
            {parsed.label}
          </text>
        ) : (
          <>
            <text
              x="30"
              y="28"
              textAnchor="middle"
              fontSize="20"
              fontFamily='"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif'
              fill={numberColor}
            >
              {parsed.number}
            </text>
            {parsed.suit && suitIcon(parsed.suit, accent)}
          </>
        )}
      </svg>
    </div>
  );
};

export default function Home() {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const problem = problems[index];
  const progress = useMemo(() => `${index + 1} / ${problems.length}`, [index]);

  const goNext = () => {
    setShowAnswer(false);
    setIndex((prev) => (prev + 1) % problems.length);
  };

  const goPrev = () => {
    setShowAnswer(false);
    setIndex((prev) => (prev - 1 + problems.length) % problems.length);
  };

  return (
    <main>
      <header>
        <h1>麻雀の切り方定石トレーニング</h1>
        <p>
          巡目・局面・ドラから「何を切るか」を考える定石問題集です。答えを見る前に思考してみましょう。
        </p>
      </header>

      <section className="section">
        <div className="problem-meta">
          <span>{problem.title}</span>
          <span>問題 {progress}</span>
          <span>{problem.situation}</span>
          <span className="tile-inline">
            ドラ: <MahjongTile tile={problem.dora} size="small" />
          </span>
        </div>
        <div className="tile-row">
          {problem.hand.map((tile, idx) => (
            <MahjongTile key={`${tile}-${idx}`} tile={tile} />
          ))}
        </div>

        <div className="action-bar">
          <button type="button" onClick={() => setShowAnswer(true)} disabled={showAnswer}>
            答えを見る
          </button>
          <button type="button" className="secondary" onClick={goPrev}>
            前の問題
          </button>
          <button type="button" className="secondary" onClick={goNext}>
            次の問題
          </button>
        </div>

        {showAnswer && (
          <div className="answer-panel">
            <strong className="tile-inline">
              推奨の切り牌: <MahjongTile tile={problem.expected} size="small" />
            </strong>
            <p>{problem.reason}</p>
            <ul>
              {problem.tips.map((tip) => (
                <li key={tip}>・{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="section">
        <h2>使い方のヒント</h2>
        <p>
          牌姿を見て、スピード・打点・安全度のバランスを意識しましょう。問題は追加しやすい構成なので、練習用の局面を増やして活用できます。
        </p>
      </section>

      <footer>作問: スピード重視 / バランス重視 / 変化重視の3パターン</footer>
    </main>
  );
}
