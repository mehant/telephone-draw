import type { Metadata } from "next";
import PostHogProvider from "@/components/PostHogProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Telephone Draw",
  description: "A multiplayer drawing and guessing game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-white antialiased">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
