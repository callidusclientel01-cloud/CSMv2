"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";

export default function PatientStoryForm() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    country: "",
    youtube_id: "",
    thumbnail_url: "",
  });

  useEffect(() => {
    if (!isNew) {
      fetchStory();
    }
  }, [params.id]);

  const fetchStory = async () => {
    const { data, error } = await supabase.from('patient_stories').select('*').eq('id', params.id).single();
    if (data) {
      setFormData({
        title: data.title || "",
        country: data.country || "",
        youtube_id: data.youtube_id || "",
        thumbnail_url: data.thumbnail_url || "",
      });
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let error;

    if (isNew) {
      const { error: insertError } = await supabase.from('patient_stories').insert([formData]);
      error = insertError;
    } else {
      const { error: updateError } = await supabase.from('patient_stories').update(formData).eq('id', params.id);
      error = updateError;
    }

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Error saving story");
    } else {
      router.push("/admin/patient-stories");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/patient-stories" className="p-2 bg-white rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <span className="material-symbols-outlined text-slate-600">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{isNew ? "Add Patient Story" : "Edit Patient Story"}</h1>
          <p className="text-slate-600">Enter the video details below.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Video Title *</label>
          <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="e.g. Nigeria | Cardiac Surgery"/>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Patient Country *</label>
          <input required type="text" name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="e.g. Nigeria"/>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">YouTube Video ID *</label>
          <input required type="text" name="youtube_id" value={formData.youtube_id} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="e.g. dQw4w9WgXcQ"/>
          <p className="text-xs text-slate-500 mt-2">Just the ID, not the full URL. If URL is https://youtube.com/watch?v=dQw4w9WgXcQ, the ID is dQw4w9WgXcQ.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Custom Thumbnail URL (Optional)</label>
          <input type="text" name="thumbnail_url" value={formData.thumbnail_url} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="Leave empty to auto-fetch from YouTube"/>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
          <Link href="/admin/patient-stories" className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            Cancel
          </Link>
          <button disabled={saving} type="submit" className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Save Story"}
          </button>
        </div>
      </form>
    </div>
  );
}
