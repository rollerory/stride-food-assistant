// src/app/layout.tsx
import ReduxProvider from "./providers/ReduxProvider";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "@/styles/globals.scss";

import Header from '@/components/Header'

const urbanist = Urbanist({
    subsets: ["latin"],
    weight: ["400", "600", "500"],
    variable: "--font-urbanist",
});

export const metadata: Metadata = {
    title: "My App",
    description: "Next.js app with App Router",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={urbanist.variable}>
            <body className="body">
                <ReduxProvider>
                    <Header />
                    {children}
                    <footer />
                </ReduxProvider>
            </body>
        </html>
    );
}