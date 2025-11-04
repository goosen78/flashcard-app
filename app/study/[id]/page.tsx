import { getDeck } from '@/lib/selection';
import { notFound } from 'next/navigation';
import { StudySession } from './StudySession';

export default function StudyPage({ params }: { params: { id: string } }) {
  const deck = getDeck(params.id);

  if (!deck) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <StudySession deckId={params.id} deckName={deck.name} />
    </div>
  );
}
