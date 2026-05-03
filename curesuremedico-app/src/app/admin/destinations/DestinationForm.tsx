"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import ImageUploadField from "@/components/admin/ImageUploadField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { useAdmin } from "@/components/admin/AdminContext";
import toast from "react-hot-toast";

export default function DestinationForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const session = useAdmin();
  const isSuperadmin = session?.role === "superadmin";

  const [loading, setLoading] = useState(false);
  const [isPreviewAction, setIsPreviewAction] = useState(false);
  const [formData, setFormData] = useState({
    country_name: initialData?.country_name || "",
    slug: initialData?.slug || "",
    tagline: initialData?.tagline || "",
    description: initialData?.description || "",
    image_url: initialData?.image_url || "",
    status: initialData?.status || "draft"
  });

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  };

  const handleCountryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    if (!initialData?.id) {
      setFormData({ ...formData, country_name: newName, slug: generateSlug(newName) });
    } else {
      setFormData({ ...formData, country_name: newName });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...formData };

    let recordId = initialData?.id;

    try {
      if (initialData?.id) {
        const { error } = await supabase.from('destinations').update(payload).eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('destinations').insert(payload).select().single();
        if (error) throw error;
        if (data) recordId = data.id;
      }
      toast.success("Destination saved successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save destination.");
      setLoading(false);
      return;
    }

    setLoading(false);
    
    if (isPreviewAction && recordId) {
      window.open(`/destinations/${recordId}?preview=true`, "_blank");
      setIsPreviewAction(false);
    } else {
      router.push("/admin/destinations");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Country / Destination Name</label>
          <input required type="text" name="country_name" value={formData.country_name} onChange={handleCountryNameChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="India" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">URL Slug</label>
          <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="india" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Tagline</label>
          <input required type="text" name="tagline" value={formData.tagline} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="The Value Hub" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={(e) => setFormData({ ...formData, status: e.target.value })} 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
          >
            <option value="draft">Draft</option>
            <option value="pending">Pending Approval</option>
            {isSuperadmin && <option value="published">Published</option>}
          </select>
        </div>
      </div>

      <div>
        <ImageUploadField
          label="Image URL"
          name="image_url"
          value={formData.image_url}
          onChange={(url) => setFormData({ ...formData, image_url: url })}
          placeholder="https://..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
        <RichTextEditor 
          value={formData.description} 
          onChange={(value) => setFormData({ ...formData, description: value })} 
          placeholder="Detailed description of the medical destination..."
        />
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <button type="button" onClick={() => router.push('/admin/destinations')} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
        <div className="flex gap-4">
          <button 
            type="submit" 
            disabled={loading} 
            onClick={() => setIsPreviewAction(true)}
            className="px-6 py-3 font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">visibility</span>
            Save & Preview
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            onClick={() => setIsPreviewAction(false)}
            className="px-6 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Destination"}
          </button>
        </div>
      </div>
    </form>
  );
}
