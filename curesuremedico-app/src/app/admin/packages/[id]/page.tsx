"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";
import ImageUploadField from "@/components/admin/ImageUploadField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { useAdmin } from "@/components/admin/AdminContext";

export default function PackageForm() {
  const params = useParams();
  const router = useRouter();
  const session = useAdmin();
  const isSuperadmin = session?.role === "superadmin";
  const isNew = params.id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [featuresInput, setFeaturesInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    badge_text: "",
    description: "",
    price: "",
    image_url: "",
    status: "draft"
  });

  useEffect(() => {
    if (!isNew) {
      fetchPackage();
    }
  }, [params.id]);

  const fetchPackage = async () => {
    const { data, error } = await supabase.from('packages').select('*').eq('id', params.id).single();
    if (data) {
      setFormData({
        title: data.title || "",
        badge_text: data.badge_text || "",
        description: data.description || "",
        price: data.price || "",
        image_url: data.image_url || "",
        status: data.status || "draft"
      });
      if (data.features && Array.isArray(data.features)) {
        setFeaturesInput(data.features.join("\n"));
      }
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Convert features back to array
    const featuresArray = featuresInput.split('\n').map(f => f.trim()).filter(f => f.length > 0);

    const payload = {
      ...formData,
      features: featuresArray,
    };

    let error;

    if (isNew) {
      const { error: insertError } = await supabase.from('packages').insert([payload]);
      error = insertError;
    } else {
      const { error: updateError } = await supabase.from('packages').update(payload).eq('id', params.id);
      error = updateError;
    }

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Error saving package");
    } else {
      router.push("/admin/packages");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/packages" className="p-2 bg-white rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <span className="material-symbols-outlined text-slate-600">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{isNew ? "Add Package" : "Edit Package"}</h1>
          <p className="text-slate-600">Enter the promotional package details below.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Package Title *</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="e.g. Full Executive Check-up"/>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Badge Text</label>
            <input type="text" name="badge_text" value={formData.badge_text} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="e.g. Most Popular"/>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Price *</label>
            <input required type="text" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="e.g. $1,200"/>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={(e) => setFormData({ ...formData, status: e.target.value })} 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-bold"
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
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Description *</label>
          <RichTextEditor 
            value={formData.description} 
            onChange={(value) => setFormData({ ...formData, description: value })} 
            placeholder="Short description of the package..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Features (One per line)</label>
          <textarea value={featuresInput} onChange={(e) => setFeaturesInput(e.target.value)} rows={5} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="e.g. 2-day hospital stay&#10;Metabolic profile..."></textarea>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
          <Link href="/admin/packages" className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            Cancel
          </Link>
          <button disabled={saving} type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Save Package"}
          </button>
        </div>
      </form>
    </div>
  );
}
