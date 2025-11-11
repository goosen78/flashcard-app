'use client';

import { useState } from 'react';
import { createCard } from '@/lib/actions';

export function CreateCardForm({ deckId }: { deckId: string }) {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [type, setType] = useState<'basic' | 'mcq' | 'cloze' | 'code'>('basic');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await createCard(deckId, { prompt, answer, type });

    if (result.success) {
      setPrompt('');
      setAnswer('');
      setType('basic');
    } else {
      setError(result.error || 'Failed to create card');
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="label" htmlFor="type">
          Card Type
        </label>
        <select
          id="type"
          className="input"
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          disabled={isSubmitting}
        >
          <option value="basic">Basic</option>
          <option value="mcq">Multiple Choice</option>
          <option value="cloze">Cloze (Fill in the blank)</option>
          <option value="code">Code</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="label" htmlFor="prompt">
          Question / Prompt *
        </label>
        <textarea
          id="prompt"
          className="textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
          disabled={isSubmitting}
          placeholder="Enter the question or prompt..."
        />
      </div>

      <div className="mb-4">
        <label className="label" htmlFor="answer">
          Answer *
        </label>
        <textarea
          id="answer"
          className="textarea"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
          disabled={isSubmitting}
          placeholder="Enter the answer..."
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add Card'}
      </button>
    </form>
  );
}
