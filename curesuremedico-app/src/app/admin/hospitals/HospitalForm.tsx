"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function HospitalForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    city: initialData?.city || "",
    country: initialData?.country || "",
    rating: initialData?.rating || 5.0,
    reviews_count: initialData?.reviews_count || 0,
    accreditations: initialData?.accreditations?.join(", ") || "",
    description: initialData?.description || "",
    image_url: initialData?.image_url || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      city: formData.city,
      country: formData.country,
      rating: parseFloat(formData.rating.toString()),
      reviews_count: parseInt(formData.reviews_count.toString(), 10),
      accreditations: formData.accreditations.split(',').map((a: string) => a.trim()).filter((a: string) => a),
      description: formData.description,
      image_url: formData.image_url
    };

    if (initialData?.id) {
      // Update
      await supabase.from('hospitals').update(payload).eq('id', initialData.id);
    } else {
      // Insert
      await supabase.from('hospitals').insert(payload);
    }

    setLoading(false);
    router.push("/admin/hospitals");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Hospital Name</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Apollo Hospitals" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
          <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Chennai" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Country</label>
          <input required type="text" name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="India" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Accreditations (comma separated)</label>
          <input type="text" name="accreditations" value={formData.accreditations} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="JCI, NABH" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Rating</label>
          <input required type="number" step="0.1" max="5" min="0" name="rating" value={formData.rating} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Reviews Count</label>
          <input required type="number" name="reviews_count" value={formData.reviews_count} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Image URL</label>
        <input type="url" name="image_url" value={formData.image_url} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
        <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Description of the hospital..."></textarea>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
        <button type="button" onClick={() => router.push('/admin/hospitals')} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
        <button type="submit" disabled={loading} className="px-6 py-3 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50">
          {loading ? "Saving..." : "Save Hospital"}
        </button>
      </div>
    </form>
  );
}
