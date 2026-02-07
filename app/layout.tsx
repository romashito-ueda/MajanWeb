import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "麻雀の切り方定石トレーニング",
  description: "麻雀で何を切るかの定石問題を出題する学習アプリ。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
