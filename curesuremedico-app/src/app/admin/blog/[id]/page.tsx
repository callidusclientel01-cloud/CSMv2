"use client";
import React, { useEffect, useState, use } from "react";
import BlogForm from "../BlogForm";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase.from('blog_posts').select('*').eq('id', unwrappedParams.id).single();
      setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [unwrappedParams.id]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <Link href="/admin/blog" className="mr-4 text-slate-400 hover:text-slate-600 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Edit Post</h1>
          <p className="text-slate-600">Update the article content and settings.</p>
        </div>
      </div>

      {loading ? (
        <div className="p-10 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">Loading post data...</div>
      ) : post ? (
        <BlogForm initialData={post} />
      ) : (
        <div className="bg-rose-50 text-rose-600 p-6 rounded-2xl font-medium border border-rose-100">Post not found in the database.</div>
      )}
    </div>
  );
}
