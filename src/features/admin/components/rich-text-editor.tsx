"use client";

import { cn } from "@/lib/utils";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImageIcon,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Minus,
  Quote,
  RotateCcw,
  RotateCw,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Type,
  UnderlineIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

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

function ToolbarButton({ active, disabled, onClick, title, children }: ToolbarButtonProps) {
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
        active ? "bg-primary-100 text-primary-700" : "hover:bg-zinc-100 hover:text-zinc-900",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-4 w-px bg-zinc-200" />;
}

// ── Inline popover for link input ─────────────────────────────────────────────

interface LinkPopoverProps {
  onSubmit: (url: string) => void;
  onClose: () => void;
  initialUrl?: string;
}

function LinkPopover({ onSubmit, onClose, initialUrl = "" }: LinkPopoverProps) {
  const [url, setUrl] = useState(initialUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (url.trim()) onSubmit(url.trim());
    else onClose();
  };

  return (
    <div className="absolute left-0 top-full z-50 mt-1 flex w-72 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-2 shadow-md">
      <Link2 size={14} className="shrink-0 text-zinc-400" />
      <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-1.5">
        <input
          ref={inputRef}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="flex-1 rounded border border-zinc-200 px-2 py-1 text-xs outline-none focus:border-primary-500"
        />
        <button
          type="submit"
          className="rounded bg-primary-600 px-2 py-1 text-xs font-medium text-white hover:bg-primary-700"
        >
          Terapkan
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded px-1.5 py-1 text-xs text-zinc-500 hover:bg-zinc-100"
        >
          Batal
        </button>
      </form>
    </div>
  );
}

// ── Inline popover for image input ────────────────────────────────────────────

interface ImagePopoverProps {
  onSubmit: (src: string, alt: string) => void;
  onClose: () => void;
}

function ImagePopover({ onSubmit, onClose }: ImagePopoverProps) {
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (src.trim()) onSubmit(src.trim(), alt.trim());
    else onClose();
  };

  return (
    <div className="absolute left-0 top-full z-50 mt-1 w-80 rounded-lg border border-zinc-200 bg-white px-3 py-3 shadow-md">
      <p className="mb-2 text-xs font-semibold text-zinc-600">Sisipkan Gambar</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <ImageIcon size={13} className="shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            value={src}
            onChange={(e) => setSrc(e.target.value)}
            placeholder="URL gambar (https://...)"
            className="flex-1 rounded border border-zinc-200 px-2 py-1 text-xs outline-none focus:border-primary-500"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Type size={13} className="shrink-0 text-zinc-400" />
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Teks alt (opsional)"
            className="flex-1 rounded border border-zinc-200 px-2 py-1 text-xs outline-none focus:border-primary-500"
          />
        </div>
        <div className="flex justify-end gap-1.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100"
          >
            Batal
          </button>
          <button
            type="submit"
            className="rounded bg-primary-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-primary-700"
          >
            Sisipkan
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Main editor ───────────────────────────────────────────────────────────────

export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const linkWrapperRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Image.configure({ inline: false, allowBase64: true }),
      Subscript,
      Superscript,
      Placeholder.configure({ placeholder: placeholder ?? "Tulis deskripsi..." }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[160px] px-4 py-3 text-zinc-800 focus:outline-none",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) editor.commands.setContent(value || "", { emitUpdate: false });
  }, [value, editor]);

  // Close popovers on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (linkWrapperRef.current && !linkWrapperRef.current.contains(e.target as Node)) setLinkOpen(false);
      if (imageWrapperRef.current && !imageWrapperRef.current.contains(e.target as Node)) setImageOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const applyLink = useCallback((url: string) => {
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    setLinkOpen(false);
  }, [editor]);

  const removeLink = useCallback(() => {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
  }, [editor]);

  const applyImage = useCallback((src: string, alt: string) => {
    editor?.chain().focus().setImage({ src, alt }).run();
    setImageOpen(false);
  }, [editor]);

  const currentLinkUrl = editor?.getAttributes("link").href ?? "";

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white transition focus-within:border-primary-700">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-zinc-100 bg-zinc-50 px-2 py-1.5">

        {/* Text formatting */}
        <ToolbarButton active={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()} title="Bold (Ctrl+B)">
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton active={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()} title="Italic (Ctrl+I)">
          <Italic size={14} />
        </ToolbarButton>
        <ToolbarButton active={editor?.isActive("underline")} onClick={() => editor?.chain().focus().toggleUnderline().run()} title="Underline (Ctrl+U)">
          <UnderlineIcon size={14} />
        </ToolbarButton>
        <ToolbarButton active={editor?.isActive("strike")} onClick={() => editor?.chain().focus().toggleStrike().run()} title="Strikethrough">
          <Strikethrough size={14} />
        </ToolbarButton>
        <ToolbarButton active={editor?.isActive("code")} onClick={() => editor?.chain().focus().toggleCode().run()} title="Inline code">
          <Code size={14} />
        </ToolbarButton>
        <ToolbarButton active={editor?.isActive("subscript")} onClick={() => editor?.chain().focus().toggleSubscript().run()} title="Subscript">
          <SubscriptIcon size={14} />
        </ToolbarButton>
        <ToolbarButton active={editor?.isActive("superscript")} onClick={() => editor?.chain().focus().toggleSuperscript().run()} title="Superscript">
          <SuperscriptIcon size={14} />
        </ToolbarButton>

        <Divider />

        {/* Headings */}
        <ToolbarButton active={editor?.isActive("heading", { level: 1 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading 1">
          <Heading1 size={14} />
        </ToolbarButton>
        <ToolbarButton active={editor?.isActive("heading", { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
          <Heading2 size={14} />
        </ToolbarButton>
        <ToolbarButton active={editor?.isActive("heading", { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">
          <Heading3 size={14} />
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton active={editor?.isActive({ textAlign: "left" })} onClick={() => editor?.chain().focus().setTextAlign("left").run()} title="Rata kiri">
          <AlignLeft size={14} />
        </ToolbarButton>
        <ToolbarButton active={editor?.isActive({ textAlign: "center" })} onClick={() => editor?.chain().focus().setTextAlign("center").run()} title="Tengah">
          <AlignCenter size={14} />
        </ToolbarButton>
        <ToolbarButton active={editor?.isActive({ textAlign: "right" })} onClick={() => editor?.chain().focus().setTextAlign("right").run()} title="Rata kanan">
          <AlignRight size={14} />
        </ToolbarButton>
        <ToolbarButton active={editor?.isActive({ textAlign: "justify" })} onClick={() => editor?.chain().focus().setTextAlign("justify").run()} title="Justify">
          <AlignJustify size={14} />
        </ToolbarButton>

        <Divider />

        {/* Lists & blocks */}
        <ToolbarButton active={editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()} title="Bullet list">
          <List size={14} />
        </ToolbarButton>
        <ToolbarButton active={editor?.isActive("orderedList")} onClick={() => editor?.chain().focus().toggleOrderedList().run()} title="Numbered list">
          <ListOrdered size={14} />
        </ToolbarButton>
        <ToolbarButton active={editor?.isActive("blockquote")} onClick={() => editor?.chain().focus().toggleBlockquote().run()} title="Blockquote">
          <Quote size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor?.chain().focus().setHorizontalRule().run()} title="Garis pemisah">
          <Minus size={14} />
        </ToolbarButton>

        <Divider />

        {/* Color */}
        <label title="Warna teks" className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100">
          <div className="relative">
            <Type size={14} />
            <input
              type="color"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              value={editor?.getAttributes("textStyle").color ?? "#000000"}
              onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
            />
          </div>
        </label>
        <ToolbarButton active={editor?.isActive("highlight")} onClick={() => editor?.chain().focus().toggleHighlight({ color: "#fef08a" }).run()} title="Highlight teks">
          <Highlighter size={14} />
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <div ref={linkWrapperRef} className="relative">
          <ToolbarButton
            active={editor?.isActive("link")}
            onClick={() => { setImageOpen(false); setLinkOpen((v) => !v); }}
            title="Sisipkan / edit link"
          >
            <Link2 size={14} />
          </ToolbarButton>
          {linkOpen && (
            <LinkPopover
              initialUrl={currentLinkUrl}
              onSubmit={applyLink}
              onClose={() => setLinkOpen(false)}
            />
          )}
        </div>
        <ToolbarButton
          active={false}
          disabled={!editor?.isActive("link")}
          onClick={removeLink}
          title="Hapus link"
        >
          <Link2Off size={14} />
        </ToolbarButton>

        {/* Image */}
        <div ref={imageWrapperRef} className="relative">
          <ToolbarButton
            onClick={() => { setLinkOpen(false); setImageOpen((v) => !v); }}
            title="Sisipkan gambar"
          >
            <ImageIcon size={14} />
          </ToolbarButton>
          {imageOpen && (
            <ImagePopover
              onSubmit={applyImage}
              onClose={() => setImageOpen(false)}
            />
          )}
        </div>

        <Divider />

        {/* Undo / Redo */}
        <ToolbarButton disabled={!editor?.can().undo()} onClick={() => editor?.chain().focus().undo().run()} title="Undo (Ctrl+Z)">
          <RotateCcw size={14} />
        </ToolbarButton>
        <ToolbarButton disabled={!editor?.can().redo()} onClick={() => editor?.chain().focus().redo().run()} title="Redo (Ctrl+Y)">
          <RotateCw size={14} />
        </ToolbarButton>
      </div>

      {/* Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
