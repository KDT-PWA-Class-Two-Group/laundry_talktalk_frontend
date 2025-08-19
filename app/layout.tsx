import type { Metadata } from "next";
import { Nanum_Gothic } from "next/font/google";
import "./globals.css";

const nanumGothic = Nanum_Gothic({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

// Uncomment the following lines if you want to use Noto Serif Korean font
// const notoSerifKorean = Noto_Serif_KR({
//   variable: "--font-geist-serif",
//   subsets: ["latin"],
//   weight: ["400", "700", "800"],
// });


export const metadata: Metadata = {
  title: "Laundry TalkTalk",
  description: "Book Your Laundromat Easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={nanumGothic.className}>{children}</body>
    </html>
  );
}
