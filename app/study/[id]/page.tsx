import { getDeck } from '@/lib/selection';
import { notFound } from 'next/navigation';
import { StudySession } from './StudySession';

export default async function StudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deck = getDeck(id);

  if (!deck) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <StudySession deckId={id} deckName={deck.name} />
    </div>
  );
}
