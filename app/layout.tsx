import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import { GoogleAnalytics } from "@next/third-parties/google";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZenDB - Your Database Companion",
  description:
    "All-in-one database toolkit with normalization, index analysis, ER diagrams, and many more. Access community tips and daily resources to optimize your database skills.",
  keywords: [
    "database tools",
    "normalization",
    "index analyzer",
    "ER diagram",
    "database optimization",
    "SQL tips",
    "database community",
  ],
  authors: [{ name: "Golam Rabbani" }],
  creator: "Golam Rabbani",
  publisher: "CanWeBe!",
  openGraph: {
    title: "ZenDB - Your Database Companion",
    description:
      "All-in-one database toolkit with normalization, index analysis, ER diagrams, and many more. Access community tips and daily resources to optimize your database skills.",
    url: "https://zendb.vercel.app",
    siteName: "ZenDB",
    images: [
      {
        url: "https://zendb.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "ZenDB - Your Database Companion",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZenDB - Your Database Companion",
    description:
      "All-in-one database toolkit with normalization, index analysis, ER diagrams, and many more. Access community tips and daily resources to optimize your database skills.",
    creator: "@devrabbani",
    images: ["https://zendb.vercel.app/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "76C2hWhD9MhyJAHhDRqU-1zoKf3sK3pSFZxhqnXmRo4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">
            <Nav />
            <div className="mt-5 pb-10 space-y-5 container">{children}</div>
            <footer className="border-t mt-auto">
              <div className="container mx-auto py-4 text-center text-sm text-gray-600">
                © {new Date().getFullYear()} ZenDB. Created by{" "}
                <a
                  href="https://rabbani.updash.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline font-medium"
                >
                  devRabbani
                </a>
                .
              </div>
            </footer>
          </main>
          <Toaster />
          <NextTopLoader color="#6225C5" zIndex={999} />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_MEASUREMENT_ID!} />
    </html>
  );
}
