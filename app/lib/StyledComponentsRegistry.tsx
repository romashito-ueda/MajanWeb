"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

const StyledComponentsRegistry = ({ children }: { children: React.ReactNode }) => {
  const [sheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = sheet.getStyleElement();
    // flush（型定義が追いついていないので any）
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (sheet.instance as any).clearTag?.();
    return <>{styles}</>;
  });

  return <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>;
};

export default StyledComponentsRegistry;
