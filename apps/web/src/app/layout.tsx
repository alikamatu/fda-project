import { Geist, Geist_Mono, Montserrat } from "next/font/google"; // Keep font imports
import "@/styles/globals.css"; // Correct path to globals.css
import { siteMetadata } from "@/app/metadata"; // Correct path to metadata
import { Footer } from "@/features/landing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
