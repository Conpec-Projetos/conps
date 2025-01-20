import React, { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";
import { ThemeProvider } from "@/components/theme-provider";
import { Roboto, Poppins, Lato } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Planejador de PS",
  description: "Planejador de PS 2025",
};

const roboto_init = Roboto({
  subsets: ['latin'],
  weight: ['100', '400', '500', '700', '900'],
  variable: '--font-roboto'
});

const poppins_init = Poppins({
  subsets: ['latin'],
  weight: ['100', '400', '500', '700', '900'],
  variable: '--font-poppins'
});

const lato_init = Lato({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
  variable: '--font-lato'
});

export default function RootLayout({ children }: Readonly<{ children: ReactNode; }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={twMerge(inter.className, `${roboto_init.variable} ${poppins_init.variable} ${lato_init.variable} antialiased`)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
