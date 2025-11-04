'use client';

import { useState } from 'react';
import { createDeck } from '@/lib/actions';

export function CreateDeckForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await createDeck(name, description);

    if (result.success) {
      setName('');
      setDescription('');
      setIsOpen(false);
    } else {
      setError(result.error || 'Failed to create deck');
    }

    setIsSubmitting(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary"
      >
        + Create New Deck
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card mb-6">
      <h3 className="text-xl font-semibold mb-4">Create New Deck</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="label" htmlFor="name">
          Deck Name *
        </label>
        <input
          type="text"
          id="name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="mb-4">
        <label className="label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Deck'}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setError('');
            setName('');
            setDescription('');
          }}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
