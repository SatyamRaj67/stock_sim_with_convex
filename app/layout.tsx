import ConvexClientProvider from "@/components/auth/convex/convex-provider-with-auth";
import { Header } from "@/components/layout/header";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { env } from "@/env";
import { auth } from "@/server/auth";
import "@/styles/globals.css";

import { type Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import { cookies } from "next/headers";
import { Toaster } from "sonner";

import { TRPCReactProvider } from "trpc/react";

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
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const session = await auth();
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
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider>
              <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar />
                <SidebarInset>
                  <main>
                    <Header />
                    <Toaster />
                    {children}
                    {/* <Analytics />
                    <SpeedInsights /> */}
                  </main>
                </SidebarInset>
              </SidebarProvider>
            </TRPCReactProvider>
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
