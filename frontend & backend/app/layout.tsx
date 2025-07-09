import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from "@/components/user-provider"
import { SessionProvider } from "@/components/session-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tata Steel Learning & Development",
  description: "Empowering Employees Through Continuous Learning",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light" // Ensure light theme is default for original colors
            enableSystem
            disableTransitionOnChange
          >
            <UserProvider>
              <Navigation />
              <main>{children}</main>
              <Footer />
              <Toaster />
            </UserProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
