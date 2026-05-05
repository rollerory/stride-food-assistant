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
    title: "Stride",
    description: "Discover, save, and share your favorite recipes with Stride. Your personal recipe book for culinary inspiration.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={urbanist.variable}>
            <body className="body">
                <div className="app-container">
                    <ReduxProvider>
                        <Header />
                        {children}
                        <footer />
                    </ReduxProvider>
                </div>
            </body>
        </html>
    );
}