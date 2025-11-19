import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2 } from 'lucide-react';

interface TextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Začni psát své myšlenky...'
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4'
      }
    }
  });

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      type="button"
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-[var(--accent-fire)] text-white' 
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-[var(--bg-tertiary)] rounded-lg overflow-hidden bg-[var(--bg-secondary)]">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-[var(--bg-tertiary)] bg-[var(--bg-primary)]">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Tučné (Ctrl+B)"
        >
          <Bold className="w-5 h-5" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Kurzíva (Ctrl+I)"
        >
          <Italic className="w-5 h-5" />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-[var(--bg-tertiary)] mx-2" />
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Nadpis 1"
        >
          <Heading1 className="w-5 h-5" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Nadpis 2"
        >
          <Heading2 className="w-5 h-5" />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-[var(--bg-tertiary)] mx-2" />
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Odrážkový seznam"
        >
          <List className="w-5 h-5" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Číslovaný seznam"
        >
          <ListOrdered className="w-5 h-5" />
        </ToolbarButton>
      </div>
      
      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="text-[var(--text-primary)]"
      />
      
      {/* Word Count */}
      <div className="px-4 py-2 text-xs text-[var(--text-muted)] bg-[var(--bg-primary)] border-t border-[var(--bg-tertiary)]">
        {editor.storage.characterCount?.words() || 0} slov
      </div>
    </div>
  );
};
