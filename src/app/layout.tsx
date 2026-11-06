import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import Preloader from "@/components/preloader";
import { cn } from "@/lib/utils";

const inter = Montserrat({subsets:['latin'],variable:'--font-sans'});

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
      className={cn("h-full", montserrat.variable, "font-sans", inter.variable)}
    >
      <body suppressHydrationWarning={true} className="min-h-full flex flex-col">
        <Preloader />
        {children}</body>
    </html>
  );
}
