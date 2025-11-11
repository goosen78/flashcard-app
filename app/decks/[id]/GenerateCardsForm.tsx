'use client';

import { useState } from 'react';
import { generateCardsFromDocument } from '@/lib/actions';
import { createCard } from '@/lib/actions';
import { CandidateCard } from '@/providers/llm';

interface Props {
  deckId: string;
}

type InputMode = 'file' | 'url' | 'text';

export function GenerateCardsForm({ deckId }: Props) {
  // Input state
  const [mode, setMode] = useState<InputMode>('text');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [processing, setProcessing] = useState<string>('');
  const [candidates, setCandidates] = useState<CandidateCard[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string>('');
  const [metadata, setMetadata] = useState<any>(null);

  /**
   * Handle generate button click
   */
  async function handleGenerate() {
    setGenerating(true);
    setError('');
    setProcessing('Processing document...');

    // Build FormData
    const formData = new FormData();
    formData.append('inputType', mode);
    formData.append('max_cards', '10');
    formData.append('difficulty', 'medium');

    // Add input based on mode
    switch (mode) {
      case 'file':
        if (!fileInput) {
          setError('Please select a PDF file');
          setGenerating(false);
          return;
        }
        formData.append('file', fileInput);
        break;
      case 'url':
        if (!urlInput || urlInput.trim().length === 0) {
          setError('Please enter a URL');
          setGenerating(false);
          return;
        }
        formData.append('url', urlInput);
        break;
      case 'text':
        if (!textInput || textInput.length < 50) {
          setError('Please enter at least 50 characters');
          setGenerating(false);
          return;
        }
        formData.append('text', textInput);
        break;
    }

    setProcessing('Generating flashcards with GPT-4o...');

    // Call server action
    const result = await generateCardsFromDocument(formData);

    if (result.success && result.cards) {
      setCandidates(result.cards);
      setMetadata(result.metadata);
      // Select all by default
      setSelected(new Set(result.cards.map((_, i) => i)));
      setProcessing('');
    } else {
      setError(result.error || 'Failed to generate cards');
      setProcessing('');
    }

    setGenerating(false);
  }

  /**
   * Add selected cards to deck
   */
  async function handleAddSelected() {
    const toAdd = candidates.filter((_, i) => selected.has(i));

    for (const card of toAdd) {
      await createCard(deckId, {
        type: card.type,
        prompt: card.prompt,
        answer: card.answer,
        source: 'generated',
      });
    }

    // Reset form
    setTextInput('');
    setUrlInput('');
    setFileInput(null);
    setCandidates([]);
    setSelected(new Set());
    setMetadata(null);
  }

  /**
   * Toggle card selection
   */
  function toggleSelection(index: number) {
    const newSelected = new Set(selected);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelected(newSelected);
  }

  /**
   * Extract Bloom's level from prompt
   */
  function extractBloomLevel(prompt: string): string | null {
    const match = prompt.match(/\[(REMEMBER|UNDERSTAND|APPLY|ANALYZE|EVALUATE|CREATE)\]/);
    return match ? match[1].toLowerCase() : null;
  }

  // Bloom's level badge colors
  const bloomColors: Record<string, string> = {
    remember: 'bg-gray-100 text-gray-800',
    understand: 'bg-blue-100 text-blue-800',
    apply: 'bg-green-100 text-green-800',
    analyze: 'bg-yellow-100 text-yellow-800',
    evaluate: 'bg-orange-100 text-orange-800',
    create: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="card">
      <h4 className="font-medium mb-4">Generate Cards from Document</h4>

      {/* Input Mode Tabs */}
      <div className="flex gap-2 mb-4 border-b">
        <button
          onClick={() => setMode('text')}
          className={`px-4 py-2 ${
            mode === 'text'
              ? 'border-b-2 border-blue-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Paste Text
        </button>
        <button
          onClick={() => setMode('url')}
          className={`px-4 py-2 ${
            mode === 'url'
              ? 'border-b-2 border-blue-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          URL
        </button>
        <button
          onClick={() => setMode('file')}
          className={`px-4 py-2 ${
            mode === 'file'
              ? 'border-b-2 border-blue-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Upload PDF
        </button>
      </div>

      {/* Input Fields */}
      {mode === 'text' && (
        <div className="mb-3">
          <textarea
            className="w-full border rounded p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={8}
            placeholder="Paste your document text here (50-15,000 characters)..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={generating}
          />
          <p className="text-sm text-gray-500 mt-1">
            {textInput.length} / 15,000 characters
          </p>
        </div>
      )}

      {mode === 'url' && (
        <div className="mb-3">
          <input
            type="url"
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/article"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            disabled={generating}
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter a URL to an article, blog post, or documentation page
          </p>
        </div>
      )}

      {mode === 'file' && (
        <div className="mb-3">
          <input
            type="file"
            accept=".pdf"
            className="w-full border rounded p-3 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={(e) => setFileInput(e.target.files?.[0] || null)}
            disabled={generating}
          />
          {fileInput && (
            <p className="text-sm text-gray-500 mt-1">
              {fileInput.name} ({(fileInput.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={generating}
        className={`btn-primary mb-4 ${generating ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {generating ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {processing || 'Generating...'}
          </span>
        ) : (
          'Generate Flashcards with GPT-4o'
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Metadata Info */}
      {metadata && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded mb-4 text-sm">
          <strong>Source:</strong> {metadata.source.toUpperCase()} •
          <strong> Length:</strong> {metadata.length} chars
          {metadata.truncated && ' • ⚠️ (truncated to fit GPT-4o context)'}
        </div>
      )}

      {/* Generated Cards Preview */}
      {candidates.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h5 className="font-medium">
              Generated Cards ({selected.size} of {candidates.length} selected)
            </h5>
            <button
              onClick={handleAddSelected}
              disabled={selected.size === 0}
              className="btn-primary text-sm"
            >
              Add {selected.size} to Deck
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto border rounded p-2">
            {candidates.map((card, idx) => {
              const bloomLevel = extractBloomLevel(card.prompt);
              const isSelected = selected.has(idx);
              const cleanPrompt = card.prompt.replace(
                /\[(REMEMBER|UNDERSTAND|APPLY|ANALYZE|EVALUATE|CREATE)\]\s*/i,
                ''
              );

              return (
                <div
                  key={idx}
                  className={`border rounded p-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => toggleSelection(idx)}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(idx)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      {/* Metadata badges */}
                      <div className="flex items-center gap-2 mb-2">
                        {bloomLevel && (
                          <span
                            className={`text-xs px-2 py-1 rounded font-medium ${
                              bloomColors[bloomLevel] || 'bg-gray-100'
                            }`}
                          >
                            {bloomLevel.toUpperCase()}
                          </span>
                        )}
                        <span className="text-xs text-gray-500 capitalize">
                          {card.type}
                        </span>
                        <span className="text-xs text-gray-400">
                          Confidence: {((card.confidence || 0) * 100).toFixed(0)}%
                        </span>
                      </div>

                      {/* Question */}
                      <p className="text-sm font-medium mb-1">{cleanPrompt}</p>

                      {/* Answer preview */}
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {card.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
