import type { Metadata } from "next";
import "./globals.css";
import { inter } from "./fonts";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Kirai",
  description: "Tree Monitoring for Cisadane",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider dynamic={true}
    publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            <div className="flex flex-col min-h-screen">
              <main className="flex-1">{children}</main>
              {/* <Footer /> */}
            </div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
};
