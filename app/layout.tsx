import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "./providers/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OpenAddy - Property Delivery Management",
  description: "Manage property delivery instructions and communicate with delivery drivers",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
} 