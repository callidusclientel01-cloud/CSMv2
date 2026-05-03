"use client";

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false, loading: () => <div className="h-48 bg-slate-50 animate-pulse rounded-xl border border-slate-200"></div> });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  // Modules configuration for the toolbar
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link'],
      ['clean']
    ],
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Write your content here...'}
        className="bg-white rounded-xl overflow-hidden"
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          min-height: 200px;
          font-family: inherit;
          font-size: 1rem;
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          background-color: #f8fafc;
        }
        .rich-text-editor .ql-editor {
          min-height: 200px;
        }
      `}</style>
    </div>
  );
}
