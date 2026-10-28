import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Preloader from "@/components/preloader";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Champions by Chaakra",
  description: "Online course website",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html suppressHydrationWarning={true}
      lang="en"
      className={`${montserrat.variable} h-full`}
    >
      <body suppressHydrationWarning={true} className="min-h-full flex flex-col">
        <Preloader />
        {children}</body>
    </html>
  );
}
