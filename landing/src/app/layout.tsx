import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RabbitHole – Map your Wikipedia journey",
  description: "Track every Wikipedia article you visit and see your journey as a visual tree. Preview pages on hover, follow your path, and never lose your place—all in one Chrome side panel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
