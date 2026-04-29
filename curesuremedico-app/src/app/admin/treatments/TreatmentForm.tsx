"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default function TreatmentForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    icon_name: initialData?.icon_name || "medical_services",
    short_description: initialData?.short_description || "",
    starting_price: initialData?.starting_price || "",
    hero_image_url: initialData?.hero_image_url || "",
    overview_title: initialData?.overview_title || "",
    overview_description: initialData?.overview_description || "",
    success_rate: initialData?.success_rate || "15k+",
    quick_response_time: initialData?.quick_response_time || "24h",
    cost_saving: initialData?.cost_saving || "80%",
    procedures: initialData?.procedures ? JSON.stringify(initialData.procedures, null, 2) : "[\n  {\n    \"name\": \"Procedure Name\",\n    \"description\": \"Description...\",\n    \"price\": \"$5,000\",\n    \"icon\": \"medical_services\"\n  }\n]"
  });

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    if (!initialData?.id) {
      setFormData({ ...formData, name: newName, slug: generateSlug(newName) });
    } else {
      setFormData({ ...formData, name: newName });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = { 
      name: formData.name,
      slug: formData.slug,
      icon_name: formData.icon_name,
      short_description: formData.short_description,
      starting_price: formData.starting_price,
      hero_image_url: formData.hero_image_url,
      overview_title: formData.overview_title,
      overview_description: formData.overview_description,
      success_rate: formData.success_rate,
      quick_response_time: formData.quick_response_time,
      cost_saving: formData.cost_saving,
      procedures: (() => { try { return JSON.parse(formData.procedures) } catch(e) { return [] } })()
    };

    if (initialData?.id) {
      await supabase.from('treatments').update(payload).eq('id', initialData.id);
    } else {
      await supabase.from('treatments').insert(payload);
    }

    setLoading(false);
    router.push("/admin/treatments");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Treatment Name</label>
          <input required type="text" name="name" value={formData.name} onChange={handleNameChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Cardiology" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">URL Slug</label>
          <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="cardiology" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Starting Price</label>
          <input required type="text" name="starting_price" value={formData.starting_price} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="$3,500" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Icon Name (Google Material Symbols)</label>
          <input required type="text" name="icon_name" value={formData.icon_name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="cardiology" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Short Description</label>
        <textarea required name="short_description" value={formData.short_description} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Description of the treatment..."></textarea>
      </div>

      <div className="pt-6 border-t border-slate-200 mt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Full Page Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <ImageUploadField
              label="Hero Image URL"
              name="hero_image_url"
              value={formData.hero_image_url}
              onChange={(url) => setFormData({ ...formData, hero_image_url: url })}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Overview Title</label>
            <input type="text" name="overview_title" value={formData.overview_title} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Specialized Surgery & Global Care" />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">Overview Description</label>
          <textarea name="overview_description" value={formData.overview_description} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Detailed description for the full page..."></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Success Rate</label>
            <input type="text" name="success_rate" value={formData.success_rate} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="15k+" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Quick Response Time</label>
            <input type="text" name="quick_response_time" value={formData.quick_response_time} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="24h" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Cost Saving</label>
            <input type="text" name="cost_saving" value={formData.cost_saving} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="80%" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Procedures (JSON Format)</label>
          <p className="text-xs text-slate-500 mb-2">Must be a valid JSON array of objects with fields: name, description, price, icon.</p>
          <textarea name="procedures" value={formData.procedures} onChange={handleChange} rows={8} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-mono text-sm" placeholder="[]"></textarea>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
        <button type="button" onClick={() => router.push('/admin/treatments')} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
        <button type="submit" disabled={loading} className="px-6 py-3 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors disabled:opacity-50">
          {loading ? "Saving..." : "Save Treatment"}
        </button>
      </div>
    </form>
  );
}
