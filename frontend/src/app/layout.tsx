import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata = {
  title: "TenaLink — Ethiopia's Health Interoperability Platform",
  description: "AI-driven wellness management and national health surveillance for Ethiopia.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-surface text-ink-primary`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
