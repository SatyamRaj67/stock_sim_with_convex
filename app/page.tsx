import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/button/login-button";
import ConvexClientProvider from "@/components/providers/convex/convex-provider-with-auth";
import { auth } from "@/server/auth";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default async function HomePage() {
  const session = await auth();
  return (
    <ConvexClientProvider session={session}>
      <main className="flex min-h-screen w-full flex-col items-center justify-center">
        <div className="space-y-6 text-center">
          <h1
            className={cn(
              "text-6xl font-semibold text-white drop-shadow-md",
              font.className,
            )}
          >
            🔒Auth
          </h1>
          <p className="text-lg text-white">A simple authentication service</p>
          <div>
            <LoginButton asChild>
              <Button variant="secondary" size="lg" className="font-bold">
                Sign In
              </Button>
            </LoginButton>
          </div>
        </div>
      </main>
    </ConvexClientProvider>
  );
}
