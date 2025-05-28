import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { marked } from 'marked';

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true
});

@Component({
  selector: 'app-markdown-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="markdown-editor">
      <div class="editor-toolbar">
        <div class="toolbar-buttons">
          <button type="button" (click)="insertMarkdown('bold')" class="toolbar-btn" title="Bold">
            <strong>B</strong>
          </button>
          <button type="button" (click)="insertMarkdown('italic')" class="toolbar-btn" title="Italic">
            <em>I</em>
          </button>
          <button type="button" (click)="insertMarkdown('heading')" class="toolbar-btn" title="Heading">
            H
          </button>
          <button type="button" (click)="insertMarkdown('link')" class="toolbar-btn" title="Link">
            🔗
          </button>
          <button type="button" (click)="insertMarkdown('image')" class="toolbar-btn" title="Image">
            🖼️
          </button>
          <button type="button" (click)="insertMarkdown('code')" class="toolbar-btn" title="Code">
            &lt;/&gt;
          </button>
          <button type="button" (click)="insertMarkdown('list')" class="toolbar-btn" title="List">
            • List
          </button>
          <button type="button" (click)="insertMarkdown('quote')" class="toolbar-btn" title="Quote">
            ❝
          </button>
        </div>
        <button (click)="togglePreview()" class="preview-btn">
          {{ showPreview ? 'Hide Preview' : 'Show Preview' }}
        </button>
      </div>
      <div class="editor-container" [class.show-preview]="showPreview">
        <div class="editor">
          <textarea
            #editor
            [value]="value"
            (input)="onInput($event)"
            class="form-control"
            rows="10"
            placeholder="Write your markdown here..."
          ></textarea>
        </div>
        <div *ngIf="showPreview" class="preview markdown-content" [innerHTML]="getMarkdownHtml(value)"></div>
      </div>
    </div>
  `,
  styles: [`
    .markdown-editor {
      @apply border rounded-lg overflow-hidden;
    }
    .editor-toolbar {
      @apply p-2 bg-gray-50 border-b flex justify-between items-center;
    }
    .toolbar-buttons {
      @apply flex gap-1;
    }
    .toolbar-btn {
      @apply px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500;
    }
    .preview-btn {
      @apply px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500;
    }
    .editor-container {
      @apply flex;
    }
    .editor {
      @apply flex-1;
    }
    .editor textarea {
      @apply w-full h-full min-h-[300px] p-4 border-0 focus:ring-0;
    }
    .preview {
      @apply flex-1 p-4 border-l bg-gray-50 overflow-auto;
    }
    .show-preview .editor {
      @apply w-1/2;
    }
    .show-preview .preview {
      @apply w-1/2;
    }
    .markdown-content {
      @apply text-gray-700 leading-relaxed;
    }
    .markdown-content h1 {
      @apply text-3xl font-bold mb-4;
    }
    .markdown-content h2 {
      @apply text-2xl font-bold mb-3;
    }
    .markdown-content h3 {
      @apply text-xl font-bold mb-2;
    }
    .markdown-content p {
      @apply mb-4;
    }
    .markdown-content ul, .markdown-content ol {
      @apply mb-4 ml-6;
    }
    .markdown-content li {
      @apply mb-2;
    }
    .markdown-content code {
      @apply bg-gray-100 px-1 py-0.5 rounded text-sm;
    }
    .markdown-content pre {
      @apply bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto;
    }
    .markdown-content blockquote {
      @apply border-l-4 border-gray-300 pl-4 italic my-4;
    }
    .markdown-content a {
      @apply text-blue-600 hover:text-blue-800 underline;
    }
    .markdown-content img {
      @apply max-w-full h-auto rounded-lg my-4;
    }
  `]
})
export class MarkdownEditorComponent {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
  @ViewChild('editor') editor!: ElementRef<HTMLTextAreaElement>;
  showPreview = true;

  togglePreview() {
    this.showPreview = !this.showPreview;
  }

  onInput(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.valueChange.emit(value);
  }

  getMarkdownHtml(markdown: string): string {
    if (!markdown) return '';
    return marked.parse(markdown, { async: false }) as string;
  }

  insertMarkdown(type: string) {
    if (!this.editor) return;
    const textarea = this.editor.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = this.value.substring(start, end);
    let insertText = '';

    switch (type) {
      case 'bold':
        insertText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        insertText = `*${selectedText || 'italic text'}*`;
        break;
      case 'heading':
        insertText = `## ${selectedText || 'Heading'}`;
        break;
      case 'link':
        insertText = `[${selectedText || 'link text'}](url)`;
        break;
      case 'image':
        insertText = `![${selectedText || 'alt text'}](image-url)`;
        break;
      case 'code':
        insertText = selectedText.includes('\n') 
          ? `\`\`\`\n${selectedText}\n\`\`\`` 
          : `\`${selectedText || 'code'}\``;
        break;
      case 'list':
        insertText = selectedText 
          ? selectedText.split('\n').map(line => `- ${line}`).join('\n')
          : '- List item';
        break;
      case 'quote':
        insertText = selectedText 
          ? selectedText.split('\n').map(line => `> ${line}`).join('\n')
          : '> Quote';
        break;
    }

    const newValue = this.value.substring(0, start) + insertText + this.value.substring(end);
    this.valueChange.emit(newValue);
    
    // Set focus back to textarea and place cursor at the end of inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + insertText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }
} 