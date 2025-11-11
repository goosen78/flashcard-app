import { describe, it, expect } from 'vitest';
import { DocumentProcessor, validateDocumentInput } from '../lib/document-processor';

describe('DocumentProcessor', () => {
  describe('process - text input', () => {
    it('should process plaintext passthrough', async () => {
      const processor = new DocumentProcessor();
      const result = await processor.process({
        type: 'text',
        text: 'Test content for flashcard generation with enough characters to pass validation',
      });

      expect(result.markdown).toBe('Test content for flashcard generation with enough characters to pass validation');
      expect(result.metadata.source).toBe('text');
      expect(result.metadata.truncated).toBe(false);
    });

    it('should truncate text longer than 15k chars', async () => {
      const longText = 'a'.repeat(20000);
      const processor = new DocumentProcessor();
      const result = await processor.process({ type: 'text', text: longText });

      expect(result.metadata.truncated).toBe(true);
      expect(result.markdown.length).toBeLessThanOrEqual(15000 + 50);
      expect(result.markdown).toContain('[...truncated');
    });
  });

  describe('validateDocumentInput', () => {
    describe('file validation', () => {
      it('should reject non-PDF files', () => {
        const file = new File(['test'], 'test.txt', { type: 'text/plain' });
        const result = validateDocumentInput({ type: 'file', file });

        expect(result.valid).toBe(false);
        expect(result.error).toContain('PDF');
      });

      it('should reject files over 10MB', () => {
        const bigFile = new File(['x'.repeat(11 * 1024 * 1024)], 'big.pdf', {
          type: 'application/pdf',
        });
        const result = validateDocumentInput({ type: 'file', file: bigFile });

        expect(result.valid).toBe(false);
        expect(result.error).toContain('too large');
      });

      it('should accept valid PDF files', () => {
        const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
        const result = validateDocumentInput({ type: 'file', file });

        expect(result.valid).toBe(true);
      });
    });

    describe('URL validation', () => {
      it('should reject invalid URL format', () => {
        const result = validateDocumentInput({ type: 'url', url: 'not-a-url' });

        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid URL');
      });

      it('should reject URLs that are too long', () => {
        const longUrl = 'https://example.com/' + 'x'.repeat(2000);
        const result = validateDocumentInput({ type: 'url', url: longUrl });

        expect(result.valid).toBe(false);
        expect(result.error).toContain('too long');
      });

      it('should accept valid URLs', () => {
        const result = validateDocumentInput({ type: 'url', url: 'https://example.com' });

        expect(result.valid).toBe(true);
      });
    });

    describe('text validation', () => {
      it('should reject text shorter than 50 characters', () => {
        const result = validateDocumentInput({ type: 'text', text: 'Short' });

        expect(result.valid).toBe(false);
        expect(result.error).toContain('too short');
      });

      it('should reject text longer than 15k characters', () => {
        const longText = 'x'.repeat(16000);
        const result = validateDocumentInput({ type: 'text', text: longText });

        expect(result.valid).toBe(false);
        expect(result.error).toContain('too long');
      });

      it('should accept text within valid range', () => {
        const validText = 'x'.repeat(100);
        const result = validateDocumentInput({ type: 'text', text: validText });

        expect(result.valid).toBe(true);
      });
    });
  });
});
