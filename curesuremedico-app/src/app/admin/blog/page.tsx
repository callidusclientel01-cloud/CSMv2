"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('blog_posts').select('*').order('id', { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      await supabase.from('blog_posts').delete().eq('id', id);
      fetchPosts();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Blog Posts</h1>
          <p className="text-slate-600">Manage articles, success stories, and news.</p>
        </div>
        <Link href="/admin/blog/new" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center shadow-sm">
          <span className="material-symbols-outlined mr-2">add</span>
          Write Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading posts...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                  <th className="p-4">Post Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Author & Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 mr-3 flex-shrink-0">
                          {post.image_url ? (
                            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-slate-400">image</span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 max-w-xs truncate">{post.title}</div>
                          {post.is_featured && <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-md mt-1 inline-block">Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{post.category}</span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-slate-900">{post.author}</div>
                      <div className="text-xs text-slate-500">{new Date(post.published_date).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/blog/${post.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </Link>
                        <button onClick={() => handleDelete(post.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">No blog posts found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
