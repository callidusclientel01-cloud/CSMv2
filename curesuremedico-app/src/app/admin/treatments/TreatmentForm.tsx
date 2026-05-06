"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import ImageUploadField from "@/components/admin/ImageUploadField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { useAdmin } from "@/components/admin/AdminContext";
import toast from "react-hot-toast";

export default function TreatmentForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const session = useAdmin();
  const isSuperadmin = session?.role === "superadmin";

  const [loading, setLoading] = useState(false);
  const [isPreviewAction, setIsPreviewAction] = useState(false);
  const [activeTab, setActiveTab] = useState("en");
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    name_fr: initialData?.name_fr || "",
    name_ar: initialData?.name_ar || "",
    slug: initialData?.slug || "",
    icon_name: initialData?.icon_name || "medical_services",
    short_description: initialData?.short_description || "",
    short_description_fr: initialData?.short_description_fr || "",
    short_description_ar: initialData?.short_description_ar || "",
    starting_price: initialData?.starting_price || "",
    hero_image_url: initialData?.hero_image_url || "",
    overview_title: initialData?.overview_title || "",
    overview_title_fr: initialData?.overview_title_fr || "",
    overview_title_ar: initialData?.overview_title_ar || "",
    overview_description: initialData?.overview_description || "",
    overview_description_fr: initialData?.overview_description_fr || "",
    overview_description_ar: initialData?.overview_description_ar || "",
    success_rate: initialData?.success_rate || "15k+",
    quick_response_time: initialData?.quick_response_time || "24h",
    cost_saving: initialData?.cost_saving || "80%",
    procedures: initialData?.procedures ? JSON.stringify(initialData.procedures, null, 2) : "[]",
    procedures_fr: initialData?.procedures_fr ? JSON.stringify(initialData.procedures_fr, null, 2) : "[]",
    procedures_ar: initialData?.procedures_ar ? JSON.stringify(initialData.procedures_ar, null, 2) : "[]",
    status: initialData?.status || "draft"
  });

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    if (activeTab === "en") {
      if (!initialData?.id) {
        setFormData({ ...formData, name: newName, slug: generateSlug(newName) });
      } else {
        setFormData({ ...formData, name: newName });
      }
    } else if (activeTab === "fr") {
      setFormData({ ...formData, name_fr: newName });
    } else if (activeTab === "ar") {
      setFormData({ ...formData, name_ar: newName });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Force 'draft' status if the user is not a superadmin
    const finalStatus = isSuperadmin ? formData.status : "draft";

    const payload = { 
      name: formData.name,
      name_fr: formData.name_fr,
      name_ar: formData.name_ar,
      slug: formData.slug,
      icon_name: formData.icon_name,
      short_description: formData.short_description,
      short_description_fr: formData.short_description_fr,
      short_description_ar: formData.short_description_ar,
      starting_price: formData.starting_price,
      hero_image_url: formData.hero_image_url,
      overview_title: formData.overview_title,
      overview_title_fr: formData.overview_title_fr,
      overview_title_ar: formData.overview_title_ar,
      overview_description: formData.overview_description,
      overview_description_fr: formData.overview_description_fr,
      overview_description_ar: formData.overview_description_ar,
      success_rate: formData.success_rate,
      quick_response_time: formData.quick_response_time,
      cost_saving: formData.cost_saving,
      procedures: (() => { try { return JSON.parse(formData.procedures) } catch(e) { return [] } })(),
      procedures_fr: (() => { try { return JSON.parse(formData.procedures_fr) } catch(e) { return [] } })(),
      procedures_ar: (() => { try { return JSON.parse(formData.procedures_ar) } catch(e) { return [] } })(),
      status: finalStatus
    };

    try {
      if (initialData?.id) {
        const { error } = await supabase.from('treatments').update(payload).eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('treatments').insert(payload);
        if (error) throw error;
      }
      toast.success("Treatment saved successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save treatment.");
      setLoading(false);
      return;
    }

    setLoading(false);

    if (isPreviewAction) {
      window.open(`/treatments/${formData.slug}?preview=true`, "_blank");
      setIsPreviewAction(false);
    } else {
      router.push("/admin/treatments");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
      <div className="flex border-b border-slate-200 mb-6 space-x-2">
        <button type="button" onClick={() => setActiveTab("en")} className={`px-4 py-2 font-bold ${activeTab === "en" ? "text-teal-600 border-b-2 border-teal-600" : "text-slate-500 hover:text-slate-700"}`}>English (Default)</button>
        <button type="button" onClick={() => setActiveTab("fr")} className={`px-4 py-2 font-bold ${activeTab === "fr" ? "text-teal-600 border-b-2 border-teal-600" : "text-slate-500 hover:text-slate-700"}`}>Français</button>
        <button type="button" onClick={() => setActiveTab("ar")} className={`px-4 py-2 font-bold ${activeTab === "ar" ? "text-teal-600 border-b-2 border-teal-600" : "text-slate-500 hover:text-slate-700"}`}>العربية</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Treatment Name ({activeTab.toUpperCase()})</label>
          <input required type="text" name="name" value={activeTab === 'en' ? formData.name : (activeTab === 'fr' ? formData.name_fr : formData.name_ar)} onChange={handleNameChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Cardiology" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">URL Slug</label>
          <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="cardiology" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Starting Price</label>
          <input required type="text" name="starting_price" value={formData.starting_price} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="$3,500" />
        </div>
        {isSuperadmin && (
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={(e) => setFormData({ ...formData, status: e.target.value })} 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-bold"
            >
              <option value="draft">Draft</option>
              <option value="pending">Pending Approval</option>
              <option value="published">Published</option>
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Icon Name (Google Material Symbols)</label>
          <input required type="text" name="icon_name" value={formData.icon_name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="cardiology" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Short Description ({activeTab.toUpperCase()})</label>
        <textarea required name="short_description" 
          value={activeTab === 'en' ? formData.short_description : (activeTab === 'fr' ? formData.short_description_fr : formData.short_description_ar)} 
          onChange={(e) => {
            if (activeTab === 'en') setFormData({ ...formData, short_description: e.target.value });
            else if (activeTab === 'fr') setFormData({ ...formData, short_description_fr: e.target.value });
            else if (activeTab === 'ar') setFormData({ ...formData, short_description_ar: e.target.value });
          }} 
          rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Description of the treatment..." />
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
            <label className="block text-sm font-bold text-slate-700 mb-2">Overview Title ({activeTab.toUpperCase()})</label>
            <input type="text" name="overview_title" 
              value={activeTab === 'en' ? formData.overview_title : (activeTab === 'fr' ? formData.overview_title_fr : formData.overview_title_ar)} 
              onChange={(e) => {
                if (activeTab === 'en') setFormData({ ...formData, overview_title: e.target.value });
                else if (activeTab === 'fr') setFormData({ ...formData, overview_title_fr: e.target.value });
                else if (activeTab === 'ar') setFormData({ ...formData, overview_title_ar: e.target.value });
              }} 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Specialized Surgery & Global Care" />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">Overview Description ({activeTab.toUpperCase()})</label>
          <RichTextEditor 
            value={activeTab === 'en' ? formData.overview_description : (activeTab === 'fr' ? formData.overview_description_fr : formData.overview_description_ar)} 
            onChange={(value) => {
              if (activeTab === 'en') setFormData({ ...formData, overview_description: value });
              else if (activeTab === 'fr') setFormData({ ...formData, overview_description_fr: value });
              else if (activeTab === 'ar') setFormData({ ...formData, overview_description_ar: value });
            }} 
            placeholder="Detailed description for the full page..."
          />
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
          <label className="block text-sm font-bold text-slate-700 mb-2">Procedures (JSON Format) ({activeTab.toUpperCase()})</label>
          <p className="text-xs text-slate-500 mb-2">Must be a valid JSON array of objects with fields: name, description, price, icon.</p>
          <textarea name="procedures" 
            value={activeTab === 'en' ? formData.procedures : (activeTab === 'fr' ? formData.procedures_fr : formData.procedures_ar)} 
            onChange={(e) => {
              if (activeTab === 'en') setFormData({ ...formData, procedures: e.target.value });
              else if (activeTab === 'fr') setFormData({ ...formData, procedures_fr: e.target.value });
              else if (activeTab === 'ar') setFormData({ ...formData, procedures_ar: e.target.value });
            }} 
            rows={8} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-mono text-sm" placeholder="[]"></textarea>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <button type="button" onClick={() => router.push('/admin/treatments')} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
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
            className="px-6 py-3 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : (isSuperadmin ? "Save Treatment" : "Save as Draft")}
          </button>
        </div>
      </div>
    </form>
  );
}
