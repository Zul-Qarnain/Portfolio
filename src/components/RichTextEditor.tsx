"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Image as ImageIcon, 
  Youtube as YoutubeIcon, 
  Link as LinkIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Undo,
  Redo,
  Trash2,
  Link2Off,
  Code,
  Sparkles
} from 'lucide-react';

// Custom Image Extension to support Width and Alignment attributes natively
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        parseHTML: element => element.getAttribute('data-width') || element.style.width || '100%',
        renderHTML: attributes => {
          return {
            'data-width': attributes.width,
            style: `width: ${attributes.width}; max-width: 100%; height: auto;`,
          };
        },
      },
      alignment: {
        default: 'center',
        parseHTML: element => element.getAttribute('data-alignment') || 'center',
        renderHTML: attributes => {
          let marginStyle = 'margin: 1.5rem auto;';
          let floatStyle = 'none';
          let displayStyle = 'block';
          
          if (attributes.alignment === 'left') {
            marginStyle = 'margin: 0.5rem 1.5rem 0.5rem 0;';
            floatStyle = 'left';
            displayStyle = 'inline';
          } else if (attributes.alignment === 'right') {
            marginStyle = 'margin: 0.5rem 0 0.5rem 1.5rem;';
            floatStyle = 'right';
            displayStyle = 'inline';
          }
          
          return {
            'data-alignment': attributes.alignment,
            class: `blog-image blog-image-${attributes.alignment}`,
            style: `width: ${attributes.width}; max-width: 100%; height: auto; display: ${displayStyle}; float: ${floatStyle}; ${marginStyle}`,
          };
        },
      },
    };
  },
});

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
      CustomImage.configure({
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
        controls: true,
        nocookie: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'rich-text-editor ProseMirror focus:outline-none',
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
    const previousUrl = editor?.getAttributes('link').href;
    const url = prompt('Enter URL:', previousUrl);
    
    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  // Helper to detect if an image is currently selected
  const getSelectedImageAttrs = () => {
    if (editor && editor.state.selection) {
      const { selection } = editor.state;
      if ('node' in selection) {
        const nodeSelection = selection as unknown as { node: { type: { name: string }; attrs: { width?: string; alignment?: string } } };
        if (nodeSelection.node && nodeSelection.node.type.name === 'image') {
          return {
            width: nodeSelection.node.attrs.width || '100%',
            alignment: nodeSelection.node.attrs.alignment || 'center',
          };
        }
      }
    }
    return null;
  };

  const selectedImage = getSelectedImageAttrs();

  const updateImageAttributes = (attrs: { width?: string; alignment?: string }) => {
    if (editor && selectedImage) {
      editor.chain().focus().updateAttributes('image', attrs).run();
    }
  };

  const deleteSelectedImage = () => {
    if (editor && selectedImage) {
      editor.chain().focus().deleteSelection().run();
    }
  };

  if (!editor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#0b0f19] border border-[#1e293b] rounded-xl text-[#475569]">
        <div className="w-10 h-10 border-4 border-[#1e293b] border-t-[#3b82f6] rounded-full animate-spin mb-4"></div>
        <p className="font-semibold text-sm tracking-wide animate-pulse">Initializing editor workspace...</p>
      </div>
    );
  }

  return (
    <div className="modern-editor-wrapper border border-[#1e293b] rounded-xl overflow-hidden bg-[#0f172a] shadow-lg transition-all duration-200">
      {/* GitBook-Style Sub-Header */}
      <div className="editor-top-bar flex items-center justify-between px-4 py-2.5 bg-[#0b0f19] border-b border-[#1e293b] text-xs text-[#64748b] font-semibold tracking-wide uppercase select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
          <span className="text-[#94a3b8]">WYSIWYG Editor</span>
        </div>
        <div className="flex items-center gap-1.5 opacity-90 text-[#475569]">
          <Sparkles className="w-3.5 h-3.5 text-[#3b82f6]" /> GitBook Layout Engine
        </div>
      </div>

      {/* Editor Minimalist Toolbar */}
      <div className="editor-toolbar flex flex-wrap gap-1.5 p-2 border-b border-[#1e293b] bg-[#0b0f19] select-none">
        
        {/* History Group */}
        <div className="toolbar-group flex items-center bg-[#0f172a] border border-[#1e293b] rounded-lg p-0.5 mr-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="toolbar-btn"
            title="Undo"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="toolbar-btn"
            title="Redo"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Text Formatting Group */}
        <div className="toolbar-group flex items-center bg-[#0f172a] border border-[#1e293b] rounded-lg p-0.5 mr-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`toolbar-btn ${editor.isActive('bold') ? 'active' : ''}`}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`toolbar-btn ${editor.isActive('code') ? 'active' : ''}`}
            title="Inline Code"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Block Types / Headings Group */}
        <div className="toolbar-group flex items-center bg-[#0f172a] border border-[#1e293b] rounded-lg p-0.5 mr-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`toolbar-btn font-bold text-xs ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
            title="Heading 1"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`toolbar-btn font-bold text-xs ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`toolbar-btn font-bold text-xs ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
            title="Heading 3"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Alignments Group */}
        <div className="toolbar-group flex items-center bg-[#0f172a] border border-[#1e293b] rounded-lg p-0.5 mr-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`toolbar-btn ${editor.isActive({ textAlign: 'left' }) ? 'active' : ''}`}
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`toolbar-btn ${editor.isActive({ textAlign: 'center' }) ? 'active' : ''}`}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`toolbar-btn ${editor.isActive({ textAlign: 'right' }) ? 'active' : ''}`}
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`toolbar-btn ${editor.isActive({ textAlign: 'justify' }) ? 'active' : ''}`}
            title="Align Justify"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lists Group */}
        <div className="toolbar-group flex items-center bg-[#0f172a] border border-[#1e293b] rounded-lg p-0.5 mr-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`toolbar-btn ${editor.isActive('bulletList') ? 'active' : ''}`}
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`toolbar-btn ${editor.isActive('orderedList') ? 'active' : ''}`}
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Embeds & Media Links Group */}
        <div className="toolbar-group flex items-center bg-[#0f172a] border border-[#1e293b] rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setIsImageModalOpen(true)}
            className="toolbar-btn text-[#64748b] hover:text-[#10b981]"
            title="Add Image"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={addYouTubeVideo}
            className="toolbar-btn text-[#64748b] hover:text-[#ef4444]"
            title="Add YouTube Video"
          >
            <YoutubeIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={addLink}
            className={`toolbar-btn ${editor.isActive('link') ? 'active' : ''}`}
            title="Add Link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
          {editor.isActive('link') && (
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="toolbar-btn hover:text-[#ef4444]"
              title="Remove Link"
            >
              <Link2Off className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Reactive Image Sub-Toolbar Panel */}
      {selectedImage && (
        <div className="image-edit-panel flex flex-wrap items-center justify-between gap-4 px-4 py-2 bg-[#1e293b]/70 border-b border-[#1e293b] animate-slide-down select-none">
          <div className="flex items-center gap-2">
            <span className="text-[#3b82f6] font-bold text-[10px] tracking-widest uppercase">🖼️ Image Blocks</span>
            <div className="w-1 h-1 rounded-full bg-[#3b82f6]"></div>
            <span className="text-[11px] text-[#94a3b8] opacity-90">Customize size and block float wrappers:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Sizing presets */}
            <div className="flex items-center bg-[#0b0f19] border border-[#1e293b] rounded-lg p-0.5">
              <span className="text-[9px] text-[#475569] font-bold px-2 uppercase">Size:</span>
              <button
                type="button"
                onClick={() => updateImageAttributes({ width: '25%' })}
                className={`image-attr-btn ${selectedImage.width === '25%' ? 'active' : ''}`}
              >
                25%
              </button>
              <button
                type="button"
                onClick={() => updateImageAttributes({ width: '50%' })}
                className={`image-attr-btn ${selectedImage.width === '50%' ? 'active' : ''}`}
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => updateImageAttributes({ width: '75%' })}
                className={`image-attr-btn ${selectedImage.width === '75%' ? 'active' : ''}`}
              >
                75%
              </button>
              <button
                type="button"
                onClick={() => updateImageAttributes({ width: '100%' })}
                className={`image-attr-btn ${selectedImage.width === '100%' ? 'active' : ''}`}
              >
                100%
              </button>
            </div>

            {/* Align Float wraps */}
            <div className="flex items-center bg-[#0b0f19] border border-[#1e293b] rounded-lg p-0.5">
              <span className="text-[9px] text-[#475569] font-bold px-2 uppercase">Wrap:</span>
              <button
                type="button"
                onClick={() => updateImageAttributes({ alignment: 'left' })}
                className={`image-attr-btn ${selectedImage.alignment === 'left' ? 'active' : ''}`}
                title="Float Left (wrap text)"
              >
                Left
              </button>
              <button
                type="button"
                onClick={() => updateImageAttributes({ alignment: 'center' })}
                className={`image-attr-btn ${selectedImage.alignment === 'center' ? 'active' : ''}`}
                title="Center Block"
              >
                Center
              </button>
              <button
                type="button"
                onClick={() => updateImageAttributes({ alignment: 'right' })}
                className={`image-attr-btn ${selectedImage.alignment === 'right' ? 'active' : ''}`}
                title="Float Right (wrap text)"
              >
                Right
              </button>
            </div>

            {/* Delete Block */}
            <button
              type="button"
              onClick={deleteSelectedImage}
              className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold bg-[#ef4444]/10 hover:bg-[#ef4444] border border-[#ef4444]/20 rounded-lg text-[#f87171] hover:text-white transition-all duration-150"
              title="Delete Selected Image"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}

      {/* Editor Sheet Canvas Area */}
      <div className="editor-canvas bg-[#0f172a] text-[#e2e8f0]">
        <EditorContent editor={editor} />
      </div>

      {/* Modern Popover Image Dialog */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#030712]/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0b0f19] border border-[#1e293b] p-6 rounded-xl shadow-2xl w-full max-w-md animate-scale-up relative">
            <div className="absolute top-4 right-4 text-[#475569] hover:text-[#f8fafc] cursor-pointer" onClick={() => setIsImageModalOpen(false)}>
              ✕
            </div>
            
            <h3 className="text-base font-bold mb-1 text-[#f8fafc] flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#3b82f6]" /> Embed Image URL
            </h3>
            <p className="text-xs text-[#64748b] mb-4">Paste the link of the image you want to place in your document.</p>
            
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-3 bg-[#0f172a] border border-[#1e293b] rounded-lg text-[#e2e8f0] mb-4 focus:outline-none focus:border-[#3b82f6] text-xs font-mono"
            />
            
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="px-3.5 py-1.5 bg-[#1e293b] text-[#f8fafc] hover:bg-[#334155] rounded-lg transition-colors text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addImage}
                disabled={!imageUrl}
                className="px-3.5 py-1.5 bg-[#3b82f6] text-white rounded-lg hover:opacity-90 font-semibold transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-[#1e293b] disabled:text-[#475569] text-xs"
              >
                Add Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled JSX Rules */}
      <style jsx global>{`
        /* GitBook Styled Canvas Sheet */
        .rich-text-editor {
          min-height: 500px;
          max-width: 800px;
          margin: 0 auto;
          padding: 3.5rem 2.5rem;
          color: #cbd5e1;
          font-size: 1.1rem;
          line-height: 1.75;
          outline: none;
          background: #0f172a;
          font-family: Inter, system-ui, -apple-system, sans-serif;
        }

        .rich-text-editor h1 {
          font-size: 2.25rem;
          font-weight: 800;
          margin: 2rem 0 1.2rem 0;
          color: #f8fafc;
          letter-spacing: -0.025em;
        }

        .rich-text-editor h2 {
          font-size: 1.65rem;
          font-weight: 700;
          margin: 1.8rem 0 1rem 0;
          color: #f1f5f9;
          letter-spacing: -0.02em;
        }

        .rich-text-editor h3 {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 1.5rem 0 0.8rem 0;
          color: #e2e8f0;
        }

        .rich-text-editor p {
          margin: 0 0 1.25rem 0;
          color: #cbd5e1;
        }

        .rich-text-editor ul, .rich-text-editor ol {
          margin: 0 0 1.25rem 0;
          padding-left: 1.8rem;
        }
        
        .rich-text-editor ul {
          list-style-type: disc;
        }

        .rich-text-editor ol {
          list-style-type: decimal;
        }

        .rich-text-editor li {
          margin: 0.35rem 0;
          color: #cbd5e1;
        }

        /* Clean GitBook Blockquotes with blue bar and solid tint */
        .rich-text-editor blockquote {
          border-left: 4px solid #3b82f6;
          padding: 0.5rem 0 0.5rem 1.5rem;
          margin: 1.8rem 0;
          color: #94a3b8;
          font-style: italic;
          background: rgba(59, 130, 246, 0.05);
          border-radius: 0 8px 8px 0;
        }

        /* Elegant inline code blocks */
        .rich-text-editor code {
          background: #0b0f19;
          color: #f43f5e;
          padding: 0.2rem 0.4rem;
          border-radius: 6px;
          font-size: 0.9em;
          border: 1px solid rgba(30, 41, 59, 0.5);
          font-family: JetBrains Mono, Fira Code, SFMono-Regular, Consolas, monospace;
        }

        /* Premium styled pre block for syntax highlighting */
        .rich-text-editor pre {
          background: #0b0f19;
          border: 1px solid #1e293b;
          color: #e2e8f0;
          padding: 1.5rem;
          border-radius: 12px;
          overflow-x: auto;
          margin: 1.8rem 0;
          position: relative;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .rich-text-editor pre::before {
          content: "code block";
          position: absolute;
          top: 6px;
          right: 12px;
          font-size: 9px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .rich-text-editor pre code {
          background: transparent;
          color: inherit;
          padding: 0;
          border-radius: 0;
          font-size: inherit;
          border: 0;
        }

        /* Image styling inside workspace with tag card overlay */
        .blog-image {
          border-radius: 8px;
          border: 1px solid #1e293b;
          box-shadow: 0 4px 20px rgba(0,0,0,0.25);
          transition: all 0.15s ease-in-out;
          cursor: pointer;
        }

        /* Highlight clicked / active images with a clean blue GitBook frame */
        .rich-text-editor .ProseMirror-selectednode {
          outline: 2px solid #3b82f6 !important;
          box-shadow: 0 0 0 5px rgba(59, 130, 246, 0.25) !important;
          border-color: #3b82f6 !important;
        }

        .blog-image:hover {
          filter: brightness(1.02);
        }

        .blog-link {
          color: #3b82f6;
          text-decoration: underline;
          transition: color 0.1s ease;
        }

        .blog-link:hover {
          color: #60a5fa;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #475569;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
          font-style: italic;
        }

        /* Minimalist toolbar styling */
        .toolbar-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          color: #64748b;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .toolbar-btn:hover:not(:disabled) {
          background: #1e293b;
          color: #f8fafc;
        }

        .toolbar-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .toolbar-btn.active {
          background: #3b82f6;
          color: white;
        }

        /* Image settings attribute selection */
        .image-attr-btn {
          padding: 2.5px 7px;
          font-size: 10px;
          font-weight: 700;
          border: none;
          background: transparent;
          color: #64748b;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.1s ease;
        }

        .image-attr-btn:hover {
          color: #f8fafc;
          background: #1e293b;
        }

        .image-attr-btn.active {
          background: #3b82f6;
          color: white;
        }

        /* Standard slide / fade animations */
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-slide-down {
          animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in {
          animation: fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-scale-up {
          animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
