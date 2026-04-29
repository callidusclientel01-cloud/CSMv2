"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default function DestinationForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    country_name: initialData?.country_name || "",
    tagline: initialData?.tagline || "",
    description: initialData?.description || "",
    image_url: initialData?.image_url || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...formData };

    if (initialData?.id) {
      await supabase.from('destinations').update(payload).eq('id', initialData.id);
    } else {
      await supabase.from('destinations').insert(payload);
    }

    setLoading(false);
    router.push("/admin/destinations");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Country / Destination Name</label>
          <input required type="text" name="country_name" value={formData.country_name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="India" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Tagline</label>
          <input required type="text" name="tagline" value={formData.tagline} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="The Value Hub" />
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
        <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Detailed description of the medical destination..."></textarea>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
        <button type="button" onClick={() => router.push('/admin/destinations')} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
        <button type="submit" disabled={loading} className="px-6 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50">
          {loading ? "Saving..." : "Save Destination"}
        </button>
      </div>
    </form>
  );
}
