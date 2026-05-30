"use client";

import { cn } from "@/lib/utils";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Minus,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { useEffect } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

type ToolbarButtonProps = {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
};

function ToolbarButton({
  active,
  disabled,
  onClick,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      title={title}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 transition",
        active
          ? "bg-primary-100 text-primary-700"
          : "hover:bg-zinc-100 hover:text-zinc-900",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder ?? "Tulis deskripsi...",
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[140px] px-4 py-3 text-zinc-800 focus:outline-none",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Sync external value changes (e.g. form reset)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white focus-within:border-primary-700 transition">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-zinc-100 bg-zinc-50 px-2 py-1.5">
        <ToolbarButton
          active={editor?.isActive("bold")}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <Bold size={14} />
        </ToolbarButton>

        <ToolbarButton
          active={editor?.isActive("italic")}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <Italic size={14} />
        </ToolbarButton>

        <div className="mx-1 h-4 w-px bg-zinc-200" />

        <ToolbarButton
          active={editor?.isActive("heading", { level: 2 })}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Heading 2"
        >
          <Heading2 size={14} />
        </ToolbarButton>

        <ToolbarButton
          active={editor?.isActive("heading", { level: 3 })}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
          title="Heading 3"
        >
          <Heading3 size={14} />
        </ToolbarButton>

        <div className="mx-1 h-4 w-px bg-zinc-200" />

        <ToolbarButton
          active={editor?.isActive("bulletList")}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          title="Bullet list"
        >
          <List size={14} />
        </ToolbarButton>

        <ToolbarButton
          active={editor?.isActive("orderedList")}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          title="Numbered list"
        >
          <ListOrdered size={14} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          title="Garis pemisah"
        >
          <Minus size={14} />
        </ToolbarButton>

        <div className="mx-1 h-4 w-px bg-zinc-200" />

        <ToolbarButton
          disabled={!editor?.can().undo()}
          onClick={() => editor?.chain().focus().undo().run()}
          title="Undo"
        >
          <RotateCcw size={14} />
        </ToolbarButton>

        <ToolbarButton
          disabled={!editor?.can().redo()}
          onClick={() => editor?.chain().focus().redo().run()}
          title="Redo"
        >
          <RotateCw size={14} />
        </ToolbarButton>
      </div>

      {/* Content area */}
      <EditorContent editor={editor} />
    </div>
  );
}
