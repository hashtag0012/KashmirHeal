import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KashmirHeal - Find the Best Doctors in J&K",
  description: "Connect with verified doctors across all districts of Kashmir. Instant bookings, real-time availability.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/doctors_stethoscope.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/Meshy_AI__Hyperrealistic_3D_re_1225112828_texture.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/Meshy_AI_Anatomical_Heart_Mode_1225111650_texture.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/pod.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_08_1k.hdr" as="fetch" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
