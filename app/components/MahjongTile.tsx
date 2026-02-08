"use client";

import React from "react";
import styled, { css } from "styled-components";

export type TileState = "normal" | "selected" | "hint" | "disabled" | "danger";

export type Suit = "m" | "p" | "s";
export type NumberTile = `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}${Suit}`;
export type HonorTile = `${1 | 2 | 3 | 4 | 5 | 6 | 7}z`; // 1z..7z
export type RedFiveTile = `0${Suit}`; // 赤5
export type TileId = NumberTile | HonorTile | RedFiveTile | "back" | "blank";

type MahjongTileProps = {
  tileId: TileId;
  widthPx?: number;
  state?: TileState;
  rotateDeg?: 0 | 90 | 180 | 270;
  alt?: string;
  title?: string;

  onClick?: () => void;
  disabled?: boolean;
};

const tileAssetMap = {
  Back: "/assets/tiles/svg/Back.svg",
  Blank: "/assets/tiles/svg/Blank.svg",
  Chun: "/assets/tiles/svg/Chun.svg",
  Front: "/assets/tiles/svg/Front.svg",
  Haku: "/assets/tiles/svg/Haku.svg",
  Hatsu: "/assets/tiles/svg/Hatsu.svg",
  Man1: "/assets/tiles/svg/Man1.svg",
  Man2: "/assets/tiles/svg/Man2.svg",
  Man3: "/assets/tiles/svg/Man3.svg",
  Man4: "/assets/tiles/svg/Man4.svg",
  Man5: "/assets/tiles/svg/Man5.svg",
  "Man5-Dora": "/assets/tiles/svg/Man5-Dora.svg",
  Man6: "/assets/tiles/svg/Man6.svg",
  Man7: "/assets/tiles/svg/Man7.svg",
  Man8: "/assets/tiles/svg/Man8.svg",
  Man9: "/assets/tiles/svg/Man9.svg",
  Nan: "/assets/tiles/svg/Nan.svg",
  Pei: "/assets/tiles/svg/Pei.svg",
  Pin1: "/assets/tiles/svg/Pin1.svg",
  Pin2: "/assets/tiles/svg/Pin2.svg",
  Pin3: "/assets/tiles/svg/Pin3.svg",
  Pin4: "/assets/tiles/svg/Pin4.svg",
  Pin5: "/assets/tiles/svg/Pin5.svg",
  "Pin5-Dora": "/assets/tiles/svg/Pin5-Dora.svg",
  Pin6: "/assets/tiles/svg/Pin6.svg",
  Pin7: "/assets/tiles/svg/Pin7.svg",
  Pin8: "/assets/tiles/svg/Pin8.svg",
  Pin9: "/assets/tiles/svg/Pin9.svg",
  Shaa: "/assets/tiles/svg/Shaa.svg",
  Sou1: "/assets/tiles/svg/Sou1.svg",
  Sou2: "/assets/tiles/svg/Sou2.svg",
  Sou3: "/assets/tiles/svg/Sou3.svg",
  Sou4: "/assets/tiles/svg/Sou4.svg",
  Sou5: "/assets/tiles/svg/Sou5.svg",
  "Sou5-Dora": "/assets/tiles/svg/Sou5-Dora.svg",
  Sou6: "/assets/tiles/svg/Sou6.svg",
  Sou7: "/assets/tiles/svg/Sou7.svg",
  Sou8: "/assets/tiles/svg/Sou8.svg",
  Sou9: "/assets/tiles/svg/Sou9.svg",
  Ton: "/assets/tiles/svg/Ton.svg",
} as const;

type AssetKey = keyof typeof tileAssetMap;

const tileIdToAssetNames = (tileId: TileId): { primary: AssetKey; fallback?: AssetKey } => {
  if (tileId === "back") return { primary: "Back", fallback: "Blank" };
  if (tileId === "blank") return { primary: "Blank" };

  if (tileId.endsWith("z")) {
    const n = Number(tileId[0]);
    switch (n) {
      case 1: return { primary: "Ton", fallback: "Blank" };
      case 2: return { primary: "Nan", fallback: "Blank" };
      case 3: return { primary: "Shaa", fallback: "Blank" };
      case 4: return { primary: "Pei", fallback: "Blank" };
      case 5: return { primary: "Haku", fallback: "Blank" };
      case 6: return { primary: "Hatsu", fallback: "Blank" };
      case 7: return { primary: "Chun", fallback: "Blank" };
      default: return { primary: "Blank" };
    }
  }

  const suit = tileId[tileId.length - 1] as Suit;
  const num = Number(tileId.slice(0, -1));
  const prefix = suit === "m" ? "Man" : suit === "p" ? "Pin" : "Sou";

  if (num === 0) {
    return {
      primary: `${prefix}5-Dora` as AssetKey,
      fallback: `${prefix}5` as AssetKey,
    };
  }

  if (num >= 1 && num <= 9) {
    return { primary: `${prefix}${num}` as AssetKey, fallback: "Blank" };
  }

  return { primary: "Blank" };
};

const resolveTileUrl = (tileId: TileId): string => {
  const { primary, fallback } = tileIdToAssetNames(tileId);
  return tileAssetMap[primary] ?? (fallback ? tileAssetMap[fallback] : undefined) ?? tileAssetMap.Blank;
};

const baseWrapperCss = css<{
  $width: number;
  $state: TileState;
  $disabled: boolean;
}>`
  width: ${(p) => p.$width}px;
  display: inline-block;
  position: relative;
  padding: 0;
  border: 0;
  background: transparent;
  line-height: 0;

  ${(p) =>
    p.$disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.85;
      filter: saturate(0.2) brightness(0.85);
    `}

  & > img {
    display: block;
    width: 100%;
    height: auto;
    user-select: none;
    -webkit-user-drag: none;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 10px;
    pointer-events: none;
    opacity: 0;
  }

  ${(p) =>
    p.$state === "hint" &&
    css`
      &::after {
        opacity: 1;
        background: rgba(255, 255, 255, 0.18);
      }
    `}

  ${(p) =>
    p.$state === "danger" &&
    css`
      &::after {
        opacity: 1;
        outline: 2px solid rgba(255, 80, 80, 0.9);
        outline-offset: -2px;
      }
    `}

  ${(p) =>
    p.$state === "selected" &&
    css`
      &::after {
        opacity: 1;
        outline: 2px solid rgba(255, 255, 255, 0.9);
        outline-offset: -2px;
      }
    `}
`;

const TileButton = styled.button<{
  $width: number;
  $state: TileState;
  $disabled: boolean;
}>`
  ${baseWrapperCss};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`;

const TileSpan = styled.span<{
  $width: number;
  $state: TileState;
  $disabled: boolean;
}>`
  ${baseWrapperCss};
`;

const computeTransform = (rotateDeg: number, state: TileState) => {
  const lift = state === "selected" ? " translateY(-2px)" : "";
  const rot = rotateDeg ? `rotate(${rotateDeg}deg)` : "";
  return `${rot}${lift}`.trim() || undefined;
};

export const MahjongTile = ({
  tileId,
  widthPx = 40,
  state = "normal",
  rotateDeg = 0,
  alt,
  title,
  onClick,
  disabled,
}: MahjongTileProps) => {
  const url = resolveTileUrl(tileId);
  const isInteractive = typeof onClick === "function";
  const isDisabled = Boolean(disabled) || state === "disabled";

  const transform = computeTransform(rotateDeg, state);

  if (isInteractive) {
    return (
      <TileButton
        type="button"
        onClick={isDisabled ? undefined : onClick}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        title={title}
        $width={widthPx}
        $state={state}
        $disabled={isDisabled}
        style={{ transform }}
      >
        <img src={url} alt={alt ?? tileId} loading="lazy" decoding="async" draggable={false} />
      </TileButton>
    );
  }

  return (
    <TileSpan
      aria-disabled={isDisabled}
      title={title}
      $width={widthPx}
      $state={state}
      $disabled={isDisabled}
      style={{ transform }}
    >
      <img src={url} alt={alt ?? tileId} loading="lazy" decoding="async" draggable={false} />
    </TileSpan>
  );
};
