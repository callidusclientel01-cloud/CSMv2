"use client";
import React from "react";
import BlogForm from "../BlogForm";
import Link from "next/link";

export default function AddBlogPostPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <Link href="/admin/blog" className="mr-4 text-slate-400 hover:text-slate-600 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Write New Post</h1>
          <p className="text-slate-600">Create a new article for the blog.</p>
        </div>
      </div>

      <BlogForm />
    </div>
  );
}
