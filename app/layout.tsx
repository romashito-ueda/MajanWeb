import React from "react";
import StyledComponentsRegistry from "./lib/StyledComponentsRegistry";
import { GlobalStyle } from "./styles/GlobalStyle";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <StyledComponentsRegistry>
          <GlobalStyle />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
