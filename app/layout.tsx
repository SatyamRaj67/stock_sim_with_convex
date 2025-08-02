import { Header } from "@/components/layout/header";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import ConvexClientProvider from "@/components/providers/convex/convex-provider-with-auth";
import { ThemeProvider } from "@/components/providers/themes/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/server/auth";
import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { cookies } from "next/headers";
import { Toaster } from "sonner";

import { TRPCReactProvider } from "trpc/react";

import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "SmartStock - Your Smart Trading Partner",
  description: "SmartStock - Your Smart Trading Partner",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <head>
        {/* {process.env.NODE_ENV === "development" && (
          <Script
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
            strategy="afterInteractive"
          />
        )} */}
      </head>
      <body>
        <ConvexClientProvider session={session}>
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar />
                <SidebarInset>
                  <Header />
                  <main>
                    <Toaster />
                    {children}
                    <Analytics />
                  </main>
                </SidebarInset>
              </SidebarProvider>
            </ThemeProvider>
          </TRPCReactProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
