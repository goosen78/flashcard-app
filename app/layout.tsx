import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flashcard App',
  description: 'Minimal flashcard app with spaced repetition',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
