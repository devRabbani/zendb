import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";

const suse = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZenDB",
  description: "A collection of tools for database developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${suse.className} antialiased`}>
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
    </html>
  );
}
