"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { MahjongTile, type TileId } from "./components/MahjongTile";

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
    hand: ["2m", "3m", "4m", "5m", "6m", "7m", "3p", "4p", "5p", "6p", "6s", "7s", "8s", "北"],
    dora: "5p",
    expected: "北",
    reason:
      "両面が3組あり打点も十分。ターツオーバーなので安全度が低い字牌を整理してスピード優先。",
    tips: ["ドラ周辺の5p6pは残すと打点アップ。", "中張牌を残してタンヤオを狙う。"],
  },
  {
    id: "Q2",
    title: "役牌バックのバランス",
    situation: "東1局・南家・5巡目・供託0本場1",
    hand: ["1m", "2m", "3m", "6m", "7m", "8m", "2p", "3p", "5p", "5p", "白", "白", "7s", "9s"],
    dora: "7s",
    expected: "9s",
    reason:
      "白が対子で役が見えている。浮いている9sを切って受け入れを最大化し、7sはドラで残す。",
    tips: ["役牌バックは速度が命。", "ドラはリャンメンができなくても保持。"],
  },
  {
    id: "Q3",
    title: "両面変化を残す",
    situation: "南3局・西家・7巡目・供託1本場0",
    hand: ["3m", "4m", "5m", "6m", "7m", "8m", "4p", "5p", "6p", "2s", "3s", "4s", "9s", "南"],
    dora: "4s",
    expected: "南",
    reason:
      "手牌はほぼ完成形。9sは端で価値が低く、南は孤立牌で安全度も低い。先に字牌を整理して待ちの質を維持。",
    tips: ["両面変化を残すと高打点を維持しやすい。", "安全度が低い字牌は早めに処理。"],
  },
];

// ---- 既存データ（東南西北白發中）を TileId（1z..7z）に変換 ----
const honorToZ: Record<string, TileId> = {
  東: "1z",
  南: "2z",
  西: "3z",
  北: "4z",
  白: "5z",
  發: "6z",
  中: "7z",
};

const isSuitTile = (t: string) => /^[0-9][mps]$/.test(t); // 0m..9s（赤5含む）
const toTileId = (tile: string): TileId => {
  if (honorToZ[tile]) return honorToZ[tile];
  if (isSuitTile(tile)) return tile as TileId;
  return "blank";
};

// -------------------- styled --------------------

const Main = styled.main`
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 8px;

  h1 {
    font-size: 2rem;
    font-weight: 700;
  }

  p {
    color: #4d4d4d;
  }

  @media (max-width: 640px) {
    h1 {
      font-size: 1.6rem;
    }
  }
`;

const Section = styled.section`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);

  @media (max-width: 640px) {
    padding: 18px;
  }
`;

const ProblemMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 0.95rem;
  color: #5a5a5a;
`;

const TileInline = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const TileRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 16px 0 8px;
  align-items: flex-end;

  @media (max-width: 640px) {
    gap: 10px;
  }
`;

const ActionBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
`;

const ButtonBase = styled.button`
  border: none;
  border-radius: 999px;
  padding: 12px 22px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(ButtonBase)`
  background: #1f6b5e;
  color: #fff;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(31, 107, 94, 0.2);
  }
`;

const SecondaryButton = styled(ButtonBase)`
  background: #f2efe7;
  color: #1f1f1f;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  }
`;

const AnswerPanel = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #f8f5ef;
  border-radius: 12px;
  border: 1px dashed #d9d2c2;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Footer = styled.footer`
  color: #6b6b6b;
  font-size: 0.85rem;
`;

// -------------------- page --------------------

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
    <Main>
      <Header>
        <h1>麻雀の切り方定石トレーニング</h1>
        <p>巡目・局面・ドラから「何を切るか」を考える定石問題集です。答えを見る前に思考してみましょう。</p>
      </Header>

      <Section>
        <ProblemMeta>
          <span>{problem.title}</span>
          <span>問題 {progress}</span>
          <span>{problem.situation}</span>
          <TileInline>
            ドラ: <MahjongTile tileId={toTileId(problem.dora)} widthPx={28} alt={`ドラ ${problem.dora}`} />
          </TileInline>
        </ProblemMeta>

        <TileRow>
          {problem.hand.map((tile, idx) => {
            const state = showAnswer && tile === problem.expected ? "hint" : "normal";
            return (
              <MahjongTile
                key={`${tile}-${idx}`}
                tileId={toTileId(tile)}
                widthPx={40}
                state={state}
                alt={tile}
              />
            );
          })}
        </TileRow>

        <ActionBar>
          <PrimaryButton type="button" onClick={() => setShowAnswer(true)} disabled={showAnswer}>
            答えを見る
          </PrimaryButton>
          <SecondaryButton type="button" onClick={goPrev}>
            前の問題
          </SecondaryButton>
          <SecondaryButton type="button" onClick={goNext}>
            次の問題
          </SecondaryButton>
        </ActionBar>

        {showAnswer && (
          <AnswerPanel>
            <strong>
              推奨の切り牌:{" "}
              <MahjongTile tileId={toTileId(problem.expected)} widthPx={28} state="selected" alt={`推奨 ${problem.expected}`} />
            </strong>
            <p>{problem.reason}</p>
            <ul>
              {problem.tips.map((tip) => (
                <li key={tip}>・{tip}</li>
              ))}
            </ul>
          </AnswerPanel>
        )}
      </Section>

      <Section>
        <h2>使い方のヒント</h2>
        <p>
          牌姿を見て、スピード・打点・安全度のバランスを意識しましょう。問題は追加しやすい構成なので、練習用の局面を増やして活用できます。
        </p>
      </Section>

      <Footer>作問: スピード重視 / バランス重視 / 変化重視の3パターン</Footer>
    </Main>
  );
}
