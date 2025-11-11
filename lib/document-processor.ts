/**
 * Document Processor - Converts various formats to Markdown
 *
 * Supports:
 * - PDF files (via @opendocsg/pdf2md)
 * - URLs (fetch + HTML → Markdown via turndown)
 * - Plaintext (passthrough with validation)
 */

import pdf2md from '@opendocsg/pdf2md';
import TurndownService from 'turndown';

export type DocumentInput =
  | { type: 'file'; file: File }
  | { type: 'url'; url: string }
  | { type: 'text'; text: string };

export interface ProcessedDocument {
  markdown: string;
  metadata: {
    source: 'pdf' | 'url' | 'text';
    length: number;
    truncated: boolean;
  };
}

const MAX_CHARS = 15000; // ~3,750 tokens for GPT-5

export class DocumentProcessor {
  private turndown: TurndownService;

  constructor() {
    this.turndown = new TurndownService({
      headingStyle: 'atx',        // # Heading
      codeBlockStyle: 'fenced',   // ``` code ```
      bulletListMarker: '-',      // - item
    });
  }

  /**
   * Process document to markdown
   */
  async process(input: DocumentInput): Promise<ProcessedDocument> {
    let markdown: string;
    let source: 'pdf' | 'url' | 'text';

    switch (input.type) {
      case 'file':
        markdown = await this.processPDF(input.file);
        source = 'pdf';
        break;
      case 'url':
        markdown = await this.processURL(input.url);
        source = 'url';
        break;
      case 'text':
        markdown = input.text;
        source = 'text';
        break;
    }

    // Truncate if exceeds GPT-5 context
    const truncated = markdown.length > MAX_CHARS;
    if (truncated) {
      markdown = markdown.slice(0, MAX_CHARS) + '\n\n[...truncated to fit context]';
    }

    return {
      markdown,
      metadata: {
        source,
        length: markdown.length,
        truncated,
      },
    };
  }

  /**
   * Convert PDF to markdown
   */
  private async processPDF(file: File): Promise<string> {
    try {
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // pdf2md extracts text and converts to markdown
      const markdown = await pdf2md(buffer);

      if (!markdown || markdown.trim().length === 0) {
        throw new Error('PDF contains no extractable text');
      }

      return markdown;
    } catch (error: any) {
      throw new Error(`PDF processing failed: ${error.message}`);
    }
  }

  /**
   * Fetch URL and convert HTML to markdown
   */
  private async processURL(url: string): Promise<string> {
    try {
      // Validate URL format
      const parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Only HTTP/HTTPS URLs are supported');
      }

      // Fetch HTML with timeout
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'FlashcardApp/1.0 (Educational)',
        },
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('text/html')) {
        throw new Error('URL must return HTML content');
      }

      const html = await response.text();

      // Convert HTML to Markdown
      const markdown = this.turndown.turndown(html);

      if (!markdown || markdown.trim().length === 0) {
        throw new Error('URL contains no extractable text');
      }

      return markdown;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('URL fetch timeout (10 seconds exceeded)');
      }
      throw new Error(`URL processing failed: ${error.message}`);
    }
  }
}

/**
 * Validate document input before processing
 */
export function validateDocumentInput(input: DocumentInput): {
  valid: boolean;
  error?: string;
} {
  switch (input.type) {
    case 'file':
      // Check file type
      if (!input.file.name.toLowerCase().endsWith('.pdf')) {
        return { valid: false, error: 'Only PDF files are supported' };
      }
      // Check file size (max 10MB)
      if (input.file.size > 10 * 1024 * 1024) {
        return { valid: false, error: 'File too large (maximum 10MB)' };
      }
      break;

    case 'url':
      // Validate URL format
      try {
        new URL(input.url);
      } catch {
        return { valid: false, error: 'Invalid URL format' };
      }
      // Check length
      if (input.url.length > 2000) {
        return { valid: false, error: 'URL too long' };
      }
      break;

    case 'text':
      // Check minimum length
      if (input.text.length < 50) {
        return { valid: false, error: 'Text too short (minimum 50 characters)' };
      }
      // Check maximum length
      if (input.text.length > MAX_CHARS) {
        return {
          valid: false,
          error: `Text too long (maximum ${MAX_CHARS} characters)`,
        };
      }
      break;
  }

  return { valid: true };
}
