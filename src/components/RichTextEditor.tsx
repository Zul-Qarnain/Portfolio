"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import { useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ 
  content, 
  onChange, 
}: RichTextEditorProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'blog-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'blog-link',
        },
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'rich-text-editor',
      },
    },
  });

  const addImage = (): void => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setIsImageModalOpen(false);
    }
  };

  const addYouTubeVideo = (): void => {
    const url = prompt('Enter YouTube URL:');
    if (url && editor) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      });
    }
  };

  const addLink = (): void => {
    const url = prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
        <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin mb-4"></div>
        <p>Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 border-b border-border bg-secondary/20">
        <div className="flex gap-1 border-r border-border pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-secondary transition-colors ${editor.isActive('bold') ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}
            title="Bold"
            disabled={!editor.can().chain().focus().toggleBold().run()}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-secondary transition-colors ${editor.isActive('italic') ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}
            title="Italic"
            disabled={!editor.can().chain().focus().toggleItalic().run()}
          >
            <em>I</em>
          </button>
        </div>

        <div className="flex gap-1 border-r border-border pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-secondary transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-secondary transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-secondary transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}
            title="Heading 3"
          >
            H3
          </button>
        </div>

        <div className="flex gap-1 border-r border-border pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-secondary transition-colors ${editor.isActive('bulletList') ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}
            title="Bullet List"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-secondary transition-colors ${editor.isActive('orderedList') ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}
            title="Numbered List"
          >
            1. List
          </button>
        </div>

        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setIsImageModalOpen(true)}
            className="p-2 rounded hover:bg-secondary transition-colors text-foreground"
            title="Add Image"
          >
            🖼️ Image
          </button>
          <button
            type="button"
            onClick={addYouTubeVideo}
            className="p-2 rounded hover:bg-secondary transition-colors text-foreground"
            title="Add YouTube Video"
          >
            ▶️ YouTube
          </button>
          <button
            type="button"
            onClick={addLink}
            className={`p-2 rounded hover:bg-secondary transition-colors ${editor.isActive('link') ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}
            title="Add Link"
          >
            🔗 Link
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-foreground">Add Image</h3>
            <input
              type="text"
              placeholder="Enter image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-3 bg-background border border-input rounded-md text-foreground mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addImage}
                disabled={!imageUrl}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Image
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .rich-text-editor {
          min-height: 400px;
          padding: 1.5rem;
          color: var(--foreground);
          font-size: 1.1rem;
          line-height: 1.6;
          outline: none;
        }

        .rich-text-editor h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 1rem 0;
          color: hsl(var(--primary));
        }

        .rich-text-editor h2 {
          font-size: 2rem;
          font-weight: 600;
          margin: 1rem 0;
          color: hsl(var(--accent));
        }

        .rich-text-editor h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1rem 0;
          color: hsl(var(--secondary-foreground));
        }

        .rich-text-editor p {
          margin: 1rem 0;
        }

        .rich-text-editor ul, .rich-text-editor ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        
        .rich-text-editor ul {
          list-style-type: disc;
        }

        .rich-text-editor ol {
          list-style-type: decimal;
        }

        .rich-text-editor li {
          margin: 0.5rem 0;
        }

        .blog-image {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1rem 0;
          display: block;
        }

        .blog-link {
          color: hsl(var(--primary));
          text-decoration: underline;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
