import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flashcard App - AI Capstone',
  description: 'A minimal flashcard application for learning with spaced repetition',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <header className="bg-blue-600 text-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">
              <a href="/">Flashcard App</a>
            </h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="mt-16 border-t border-gray-200 py-6 text-center text-sm text-gray-600">
          <p>AI Capstone (Summer 2026) - Flashcard Learning App</p>
        </footer>
      </body>
    </html>
  )
}