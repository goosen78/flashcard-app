import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateDeckForm } from '../app/CreateDeckForm';
import { CreateCardForm } from '../app/decks/[id]/CreateCardForm';

// Mock the server actions
vi.mock('@/lib/actions', () => ({
  createDeck: vi.fn(),
  createCard: vi.fn(),
}));

describe('CreateDeckForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render create button initially', () => {
    render(<CreateDeckForm />);

    const button = screen.getByText('+ Create New Deck');
    expect(button).toBeInTheDocument();
  });

  it('should show form when create button is clicked', () => {
    render(<CreateDeckForm />);

    const button = screen.getByText('+ Create New Deck');
    fireEvent.click(button);

    expect(screen.getByText('Create New Deck')).toBeInTheDocument();
    expect(screen.getByLabelText(/Deck Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
  });

  it('should handle form input changes', () => {
    render(<CreateDeckForm />);

    fireEvent.click(screen.getByText('+ Create New Deck'));

    const nameInput = screen.getByLabelText(/Deck Name/) as HTMLInputElement;
    const descInput = screen.getByLabelText(/Description/) as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: 'Test Deck' } });
    fireEvent.change(descInput, { target: { value: 'Test Description' } });

    expect(nameInput.value).toBe('Test Deck');
    expect(descInput.value).toBe('Test Description');
  });

  it('should call createDeck on form submission', async () => {
    const { createDeck } = await import('@/lib/actions');
    const createDeckMock = vi.mocked(createDeck);
    createDeckMock.mockResolvedValue({ success: true, id: 'test-id' });

    render(<CreateDeckForm />);

    fireEvent.click(screen.getByText('+ Create New Deck'));

    const nameInput = screen.getByLabelText(/Deck Name/);
    fireEvent.change(nameInput, { target: { value: 'Test Deck' } });

    const submitButton = screen.getByText('Create Deck');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createDeckMock).toHaveBeenCalledWith('Test Deck', '');
    });
  });

  it('should display error message on failure', async () => {
    const { createDeck } = await import('@/lib/actions');
    const createDeckMock = vi.mocked(createDeck);
    createDeckMock.mockResolvedValue({ success: false, error: 'Deck already exists' });

    render(<CreateDeckForm />);

    fireEvent.click(screen.getByText('+ Create New Deck'));

    const nameInput = screen.getByLabelText(/Deck Name/);
    fireEvent.change(nameInput, { target: { value: 'Duplicate' } });

    const submitButton = screen.getByText('Create Deck');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Deck already exists')).toBeInTheDocument();
    });
  });

  it('should close form and reset fields on successful submission', async () => {
    const { createDeck } = await import('@/lib/actions');
    const createDeckMock = vi.mocked(createDeck);
    createDeckMock.mockResolvedValue({ success: true, id: 'test-id' });

    render(<CreateDeckForm />);

    fireEvent.click(screen.getByText('+ Create New Deck'));

    const nameInput = screen.getByLabelText(/Deck Name/) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Test Deck' } });

    const submitButton = screen.getByText('Create Deck');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('+ Create New Deck')).toBeInTheDocument();
    });
  });

  it('should close form and reset fields on cancel', () => {
    render(<CreateDeckForm />);

    fireEvent.click(screen.getByText('+ Create New Deck'));

    const nameInput = screen.getByLabelText(/Deck Name/) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Test Deck' } });

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.getByText('+ Create New Deck')).toBeInTheDocument();

    // Open form again to verify fields are reset
    fireEvent.click(screen.getByText('+ Create New Deck'));

    const nameInputAfter = screen.getByLabelText(/Deck Name/) as HTMLInputElement;
    expect(nameInputAfter.value).toBe('');
  });

  it('should disable form during submission', async () => {
    const { createDeck } = await import('@/lib/actions');
    const createDeckMock = vi.mocked(createDeck);

    // Create a promise that we can control
    let resolveCreate: (value: any) => void;
    const createPromise = new Promise((resolve) => {
      resolveCreate = resolve;
    });
    createDeckMock.mockReturnValue(createPromise as any);

    render(<CreateDeckForm />);

    fireEvent.click(screen.getByText('+ Create New Deck'));

    const nameInput = screen.getByLabelText(/Deck Name/);
    fireEvent.change(nameInput, { target: { value: 'Test Deck' } });

    const submitButton = screen.getByText('Create Deck');
    fireEvent.click(submitButton);

    // Check that button shows "Creating..." and is disabled
    await waitFor(() => {
      const submittingButton = screen.getByText('Creating...');
      expect(submittingButton).toBeDisabled();
    });

    // Resolve the promise
    resolveCreate!({ success: true, id: 'test-id' });
  });

  it('should require deck name', () => {
    render(<CreateDeckForm />);

    fireEvent.click(screen.getByText('+ Create New Deck'));

    const nameInput = screen.getByLabelText(/Deck Name/);
    expect(nameInput).toHaveAttribute('required');
  });
});

describe('CreateCardForm', () => {
  const mockDeckId = 'test-deck-id';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form with all fields', () => {
    render(<CreateCardForm deckId={mockDeckId} />);

    expect(screen.getByLabelText(/Card Type/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Question \/ Prompt/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Answer/)).toBeInTheDocument();
    expect(screen.getByText('Add Card')).toBeInTheDocument();
  });

  it('should handle input changes', () => {
    render(<CreateCardForm deckId={mockDeckId} />);

    const promptInput = screen.getByLabelText(/Question \/ Prompt/) as HTMLTextAreaElement;
    const answerInput = screen.getByLabelText(/Answer/) as HTMLTextAreaElement;

    fireEvent.change(promptInput, { target: { value: 'What is 2+2?' } });
    fireEvent.change(answerInput, { target: { value: '4' } });

    expect(promptInput.value).toBe('What is 2+2?');
    expect(answerInput.value).toBe('4');
  });

  it('should handle card type selection', () => {
    render(<CreateCardForm deckId={mockDeckId} />);

    const typeSelect = screen.getByLabelText(/Card Type/) as HTMLSelectElement;

    fireEvent.change(typeSelect, { target: { value: 'mcq' } });

    expect(typeSelect.value).toBe('mcq');
  });

  it('should call createCard on form submission', async () => {
    const { createCard } = await import('@/lib/actions');
    const createCardMock = vi.mocked(createCard);
    createCardMock.mockResolvedValue({ success: true, id: 'card-id' });

    render(<CreateCardForm deckId={mockDeckId} />);

    const promptInput = screen.getByLabelText(/Question \/ Prompt/);
    const answerInput = screen.getByLabelText(/Answer/);

    fireEvent.change(promptInput, { target: { value: 'What is 2+2?' } });
    fireEvent.change(answerInput, { target: { value: '4' } });

    const submitButton = screen.getByText('Add Card');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createCardMock).toHaveBeenCalledWith(mockDeckId, {
        prompt: 'What is 2+2?',
        answer: '4',
        type: 'basic',
      });
    });
  });

  it('should display error message on failure', async () => {
    const { createCard } = await import('@/lib/actions');
    const createCardMock = vi.mocked(createCard);
    createCardMock.mockResolvedValue({ success: false, error: 'Failed to create card' });

    render(<CreateCardForm deckId={mockDeckId} />);

    const promptInput = screen.getByLabelText(/Question \/ Prompt/);
    const answerInput = screen.getByLabelText(/Answer/);

    fireEvent.change(promptInput, { target: { value: 'Question' } });
    fireEvent.change(answerInput, { target: { value: 'Answer' } });

    const submitButton = screen.getByText('Add Card');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to create card')).toBeInTheDocument();
    });
  });

  it('should reset form fields on successful submission', async () => {
    const { createCard } = await import('@/lib/actions');
    const createCardMock = vi.mocked(createCard);
    createCardMock.mockResolvedValue({ success: true, id: 'card-id' });

    render(<CreateCardForm deckId={mockDeckId} />);

    const promptInput = screen.getByLabelText(/Question \/ Prompt/) as HTMLTextAreaElement;
    const answerInput = screen.getByLabelText(/Answer/) as HTMLTextAreaElement;
    const typeSelect = screen.getByLabelText(/Card Type/) as HTMLSelectElement;

    fireEvent.change(promptInput, { target: { value: 'Question' } });
    fireEvent.change(answerInput, { target: { value: 'Answer' } });
    fireEvent.change(typeSelect, { target: { value: 'mcq' } });

    const submitButton = screen.getByText('Add Card');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(promptInput.value).toBe('');
      expect(answerInput.value).toBe('');
      expect(typeSelect.value).toBe('basic');
    });
  });

  it('should disable form during submission', async () => {
    const { createCard } = await import('@/lib/actions');
    const createCardMock = vi.mocked(createCard);

    let resolveCreate: (value: any) => void;
    const createPromise = new Promise((resolve) => {
      resolveCreate = resolve;
    });
    createCardMock.mockReturnValue(createPromise as any);

    render(<CreateCardForm deckId={mockDeckId} />);

    const promptInput = screen.getByLabelText(/Question \/ Prompt/);
    const answerInput = screen.getByLabelText(/Answer/);

    fireEvent.change(promptInput, { target: { value: 'Question' } });
    fireEvent.change(answerInput, { target: { value: 'Answer' } });

    const submitButton = screen.getByText('Add Card');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const submittingButton = screen.getByText('Adding...');
      expect(submittingButton).toBeDisabled();
    });

    resolveCreate!({ success: true, id: 'card-id' });
  });

  it('should require prompt and answer', () => {
    render(<CreateCardForm deckId={mockDeckId} />);

    const promptInput = screen.getByLabelText(/Question \/ Prompt/);
    const answerInput = screen.getByLabelText(/Answer/);

    expect(promptInput).toHaveAttribute('required');
    expect(answerInput).toHaveAttribute('required');
  });

  it('should have all card type options', () => {
    render(<CreateCardForm deckId={mockDeckId} />);

    expect(screen.getByText('Basic')).toBeInTheDocument();
    expect(screen.getByText('Multiple Choice')).toBeInTheDocument();
    expect(screen.getByText('Cloze (Fill in the blank)')).toBeInTheDocument();
    expect(screen.getByText('Code')).toBeInTheDocument();
  });
});
