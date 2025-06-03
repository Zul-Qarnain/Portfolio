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
  placeholder = "Start writing your blog post..." 
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
      <div className="editor-loading">
        <div className="loading-spinner"></div>
        <p>Loading editor...</p>
        <style jsx>{`
          .editor-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            color: #6272a4;
          }
          .loading-spinner {
            width: 30px;
            height: 30px;
            border: 3px solid #44475a;
            border-top: 3px solid #bd93f9;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="editor-container">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'active' : ''}
            title="Bold"
            disabled={!editor.can().chain().focus().toggleBold().run()}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'active' : ''}
            title="Italic"
            disabled={!editor.can().chain().focus().toggleItalic().run()}
          >
            <em>I</em>
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}
            title="Heading 3"
          >
            H3
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'active' : ''}
            title="Bullet List"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'active' : ''}
            title="Numbered List"
          >
            1. List
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => setIsImageModalOpen(true)}
            title="Add Image"
          >
            🖼️ Image
          </button>
          <button
            type="button"
            onClick={addYouTubeVideo}
            title="Add YouTube Video"
          >
            ▶️ YouTube
          </button>
          <button
            type="button"
            onClick={addLink}
            title="Add Link"
          >
            🔗 Link
          </button>
        </div>
      </div>

      {/* Editor */}
      <EditorContent 
        editor={editor} 
        className="editor-content"
      />

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="image-modal" onClick={() => setIsImageModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Image</h3>
            <input
              type="url"
              placeholder="Enter image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="image-url-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addImage();
                } else if (e.key === 'Escape') {
                  setIsImageModalOpen(false);
                }
              }}
              autoFocus
            />
            <div className="modal-actions">
              <button 
                type="button"
                onClick={addImage} 
                className="add-btn"
                disabled={!imageUrl.trim()}
              >
                Add Image
              </button>
              <button 
                type="button"
                onClick={() => setIsImageModalOpen(false)} 
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .editor-container {
          border: 2px solid #44475a;
          border-radius: 12px;
          background: #282a36;
          overflow: hidden;
        }

        .editor-toolbar {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #1e1f29;
          border-bottom: 1px solid #44475a;
          flex-wrap: wrap;
        }

        .toolbar-group {
          display: flex;
          gap: 0.5rem;
        }

        .editor-toolbar button {
          background: #44475a;
          color: #f8f8f2;
          border: none;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          font-family: inherit;
        }

        .editor-toolbar button:hover:not(:disabled) {
          background: #6272a4;
        }

        .editor-toolbar button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .editor-toolbar button.active {
          background: #bd93f9;
          color: #282a36;
        }

        :global(.rich-text-editor) {
          min-height: 400px;
          padding: 1.5rem;
          color: #f8f8f2;
          font-size: 1.1rem;
          line-height: 1.6;
          outline: none;
        }

        :global(.rich-text-editor h1) {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 1rem 0;
          color: #bd93f9;
        }

        :global(.rich-text-editor h2) {
          font-size: 2rem;
          font-weight: 600;
          margin: 1rem 0;
          color: #8be9fd;
        }

        :global(.rich-text-editor h3) {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1rem 0;
          color: #50fa7b;
        }

        :global(.rich-text-editor p) {
          margin: 1rem 0;
        }

        :global(.rich-text-editor ul, .rich-text-editor ol) {
          margin: 1rem 0;
          padding-left: 2rem;
        }

        :global(.rich-text-editor li) {
          margin: 0.5rem 0;
        }

        :global(.blog-image) {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1rem 0;
        }

        :global(.blog-link) {
          color: #8be9fd;
          text-decoration: underline;
        }

        .image-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: #282a36;
          padding: 2rem;
          border-radius: 12px;
          border: 2px solid #bd93f9;
          min-width: 400px;
          max-width: 90vw;
        }

        .modal-content h3 {
          margin: 0 0 1rem 0;
          color: #bd93f9;
        }

        .image-url-input {
          width: 100%;
          padding: 0.75rem;
          background: #1e1f29;
          border: 1px solid #44475a;
          border-radius: 6px;
          color: #f8f8f2;
          margin-bottom: 1rem;
          box-sizing: border-box;
          font-family: inherit;
        }

        .image-url-input:focus {
          outline: none;
          border-color: #bd93f9;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .add-btn {
          background: #50fa7b;
          color: #282a36;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-family: inherit;
        }

        .add-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cancel-btn {
          background: #6272a4;
          color: #f8f8f2;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-family: inherit;
        }

        .add-btn:hover:not(:disabled) {
          background: #8be9fd;
        }

        .cancel-btn:hover {
          background: #44475a;
        }
      `}</style>
    </div>
  );
}