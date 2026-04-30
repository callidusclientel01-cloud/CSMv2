"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import ImageUploadField from "@/components/admin/ImageUploadField";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function BlogForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "Medical Travel Tips",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    image_url: initialData?.image_url || "",
    author: initialData?.author || "CSM Editorial",
    author_role: initialData?.author_role || "Editor",
    published_date: initialData?.published_date || new Date().toISOString().split('T')[0],
    read_time: initialData?.read_time || "5 min",
    is_featured: initialData?.is_featured || false,
    youtube_video_id: initialData?.youtube_video_id || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (!initialData?.id) {
      setFormData({ ...formData, title: newTitle, slug: generateSlug(newTitle) });
    } else {
      setFormData({ ...formData, title: newTitle });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...formData };

    if (initialData?.id) {
      await supabase.from('blog_posts').update(payload).eq('id', initialData.id);
    } else {
      await supabase.from('blog_posts').insert(payload);
    }

    setLoading(false);
    router.push("/admin/blog");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <input type="checkbox" id="is_featured" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="w-5 h-5 text-purple-600 rounded border-slate-300 focus:ring-purple-500" />
        <label htmlFor="is_featured" className="text-sm font-bold text-slate-700">Set as Featured Post</label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">Post Title</label>
          <input required type="text" name="title" value={formData.title} onChange={handleTitleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Enter post title..." />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">URL Slug</label>
          <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="post-url-slug" />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
          <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none">
            <option value="Medical Travel Tips">Medical Travel Tips</option>
            <option value="Treatment Breakthroughs">Treatment Breakthroughs</option>
            <option value="Patient Success Stories">Patient Success Stories</option>
            <option value="Hospital Spotlights">Hospital Spotlights</option>
            <option value="Featured">Featured News</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Author Name</label>
          <input required type="text" name="author" value={formData.author} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Read Time</label>
            <input required type="text" name="read_time" value={formData.read_time} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="5 min" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Published Date</label>
            <input required type="date" name="published_date" value={formData.published_date} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>
        </div>
      </div>

      <div>
        <ImageUploadField
          label="Cover Image URL"
          name="image_url"
          value={formData.image_url}
          onChange={(url) => setFormData({ ...formData, image_url: url })}
          placeholder="https://..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">YouTube Video ID (Optional)</label>
        <input type="text" name="youtube_video_id" value={formData.youtube_video_id} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g. dQw4w9WgXcQ" />
        <p className="text-xs text-slate-500 mt-2">Just the ID, not the full URL. If URL is https://youtube.com/watch?v=dQw4w9WgXcQ, the ID is dQw4w9WgXcQ.</p>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Short Excerpt</label>
        <textarea required name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Brief summary of the article..."></textarea>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Full Content (HTML/Text)</label>
        <RichTextEditor 
          value={formData.content} 
          onChange={(value) => setFormData({ ...formData, content: value })} 
          placeholder="Write your article here..."
        />
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
        <button type="button" onClick={() => router.push('/admin/blog')} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
        <button type="submit" disabled={loading} className="px-6 py-3 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors disabled:opacity-50">
          {loading ? "Publishing..." : "Publish Post"}
        </button>
      </div>
    </form>
  );
}
