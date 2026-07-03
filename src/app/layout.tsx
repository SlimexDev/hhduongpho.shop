import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { GlobalInjector } from "@/components/GlobalInjector/GlobalInjector";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "hhduongpho.shop - Khám phá và Chia sẻ bài viết",
  description: "Trang chia sẻ bài viết, hình ảnh, video và tùy biến mã nguồn mở ấn tượng.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={outfit.variable}>
      <body>
        {children}
        <GlobalInjector />
      </body>
    </html>
  );
}
