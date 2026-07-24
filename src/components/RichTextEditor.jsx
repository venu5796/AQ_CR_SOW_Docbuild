import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';

function Btn({ cmd, active, label, title }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={e => { e.preventDefault(); cmd(); }}
      className={'rte-btn' + (active ? ' rte-btn-active' : '')}
    >{label}</button>
  );
}

// Rich-text editor for the CR "Details of Change" block. Emits HTML via onChange;
// docx.js htmlToOOXML() serializes that HTML into Word paragraphs at generation time.
export function RichTextEditor({ value, onChange, placeholder }) {
  const lastEmitted = useRef('');

  const editor = useEditor({
    extensions: [StarterKit.configure({ link: { openOnClick: false, autolink: true } })],
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastEmitted.current = html;
      onChange(html);
    },
  });

  // Keep editor in sync when value is replaced externally (sample mode, draft restore).
  useEffect(() => {
    if (editor && (value || '') !== lastEmitted.current) {
      lastEmitted.current = value || '';
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes('link').href;
    const url = window.prompt('Link URL', prev || 'https://');
    if (url === null) return;
    if (url === '') { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const c = () => editor.chain().focus();
  return (
    <div className="rte">
      <div className="rte-toolbar">
        <Btn title="Bold" label={<b>B</b>} active={editor.isActive('bold')} cmd={() => c().toggleBold().run()} />
        <Btn title="Italic" label={<i>I</i>} active={editor.isActive('italic')} cmd={() => c().toggleItalic().run()} />
        <Btn title="Underline" label={<u>U</u>} active={editor.isActive('underline')} cmd={() => c().toggleUnderline().run()} />
        <Btn title="Strikethrough" label={<s>S</s>} active={editor.isActive('strike')} cmd={() => c().toggleStrike().run()} />
        <span className="rte-sep" />
        <Btn title="Heading 1" label="H1" active={editor.isActive('heading', { level: 1 })} cmd={() => c().toggleHeading({ level: 1 }).run()} />
        <Btn title="Heading 2" label="H2" active={editor.isActive('heading', { level: 2 })} cmd={() => c().toggleHeading({ level: 2 }).run()} />
        <Btn title="Heading 3" label="H3" active={editor.isActive('heading', { level: 3 })} cmd={() => c().toggleHeading({ level: 3 }).run()} />
        <span className="rte-sep" />
        <Btn title="Bullet list" label="• List" active={editor.isActive('bulletList')} cmd={() => c().toggleBulletList().run()} />
        <Btn title="Numbered list" label="1. List" active={editor.isActive('orderedList')} cmd={() => c().toggleOrderedList().run()} />
        <span className="rte-sep" />
        <Btn title="Link" label="🔗" active={editor.isActive('link')} cmd={setLink} />
        <span className="rte-sep" />
        <Btn title="Undo" label="↶" cmd={() => c().undo().run()} />
        <Btn title="Redo" label="↷" cmd={() => c().redo().run()} />
      </div>
      <EditorContent editor={editor} className="rte-content" data-placeholder={placeholder} />
    </div>
  );
}
