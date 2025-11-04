import Link from 'next/link';
import { getAllDecks, getDeckStats } from '@/lib/selection';
import { CreateDeckForm } from './CreateDeckForm';

export default function Home() {
  const decks = getAllDecks();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Your Decks</h2>
      </div>

      <CreateDeckForm />

      {decks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No decks yet. Create your first deck to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4 mt-8">
          {decks.map((deck) => {
            const stats = getDeckStats(deck.id);
            return (
              <div key={deck.id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{deck.name}</h3>
                    {deck.description && (
                      <p className="text-gray-600 mb-4">{deck.description}</p>
                    )}
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span className="font-medium text-blue-600">{stats.due} due</span>
                      <span>{stats.new} new</span>
                      <span>{stats.learning} learning</span>
                      <span className="text-gray-400">({stats.total} total)</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {(stats.due > 0 || stats.new > 0) && (
                      <Link
                        href={`/study/${deck.id}`}
                        className="btn btn-primary"
                      >
                        Study Now
                      </Link>
                    )}
                    <Link
                      href={`/decks/${deck.id}`}
                      className="btn btn-secondary"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
