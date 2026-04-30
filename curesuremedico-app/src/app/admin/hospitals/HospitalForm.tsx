"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import ImageUploadField from "@/components/admin/ImageUploadField";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function HospitalForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    city: initialData?.city || "",
    country: initialData?.country || "",
    rating: initialData?.rating || 5.0,
    reviews_count: initialData?.reviews_count || 0,
    accreditations: initialData?.accreditations?.join(", ") || "",
    description: initialData?.description || "",
    image_url: initialData?.image_url || "",
    logo_url: initialData?.logo_url || "",
    short_location: initialData?.short_location || "",
    established_year: initialData?.established_year || new Date().getFullYear(),
    beds_count: initialData?.beds_count || "",
    ots_count: initialData?.ots_count || "",
    contact_number: initialData?.contact_number || "",
    facilities: initialData?.facilities ? JSON.stringify(initialData.facilities, null, 2) : "[\n  {\n    \"icon\": \"precision_manufacturing\",\n    \"title\": \"Robotic Surgery Suite\",\n    \"description\": \"Equipped with the latest Da Vinci® Xi Robotic System.\"\n  }\n]",
    specialties: initialData?.specialties || "",
    gallery_image_1: initialData?.gallery_image_1 || "",
    gallery_image_2: initialData?.gallery_image_2 || "",
    gallery_image_3: initialData?.gallery_image_3 || "",
    gallery_image_4: initialData?.gallery_image_4 || ""
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
      city: formData.city,
      country: formData.country,
      rating: parseFloat(formData.rating.toString()),
      reviews_count: parseInt(formData.reviews_count.toString(), 10),
      accreditations: formData.accreditations.split(',').map((a: string) => a.trim()).filter((a: string) => a),
      description: formData.description,
      image_url: formData.image_url,
      logo_url: formData.logo_url,
      short_location: formData.short_location,
      established_year: parseInt(formData.established_year.toString(), 10),
      beds_count: formData.beds_count,
      ots_count: formData.ots_count,
      contact_number: formData.contact_number,
      specialties: formData.specialties,
      gallery_image_1: formData.gallery_image_1,
      gallery_image_2: formData.gallery_image_2,
      gallery_image_3: formData.gallery_image_3,
      gallery_image_4: formData.gallery_image_4,
      facilities: []
    };

    try {
      payload.facilities = JSON.parse(formData.facilities);
    } catch (e) {
      alert("Invalid JSON format in Facilities field.");
      setLoading(false);
      return;
    }

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
          <input required type="text" name="name" value={formData.name} onChange={handleNameChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Apollo Hospitals" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">URL Slug</label>
          <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="apollo-hospitals" />
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
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Short Location (Subtitle)</label>
          <input type="text" name="short_location" value={formData.short_location} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Greams Road" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Established Year</label>
          <input type="number" name="established_year" value={formData.established_year} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="1983" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Beds Count</label>
          <input type="text" name="beds_count" value={formData.beds_count} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="600+" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">OTs Count</label>
          <input type="text" name="ots_count" value={formData.ots_count} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="15+" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Contact Number</label>
          <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 44 2829 0203" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">Specialties (comma separated)</label>
          <input type="text" name="specialties" value={formData.specialties} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Cardiology, Oncology, Orthopedics, Robotic Surgery" />
        </div>
      </div>

      <ImageUploadField
        label="Image URL"
        name="image_url"
        value={formData.image_url}
        onChange={(url) => setFormData({ ...formData, image_url: url })}
        placeholder="https://..."
      />

      <ImageUploadField
        label="Logo URL"
        name="logo_url"
        value={formData.logo_url}
        onChange={(url) => setFormData({ ...formData, logo_url: url })}
        placeholder="https://..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200">
        <div className="md:col-span-2">
          <h3 className="font-bold text-slate-800 mb-4 text-lg">Image Gallery</h3>
        </div>
        <ImageUploadField
          label="Gallery Image 1"
          name="gallery_image_1"
          value={formData.gallery_image_1}
          onChange={(url) => setFormData({ ...formData, gallery_image_1: url })}
          placeholder="https://..."
        />
        <ImageUploadField
          label="Gallery Image 2"
          name="gallery_image_2"
          value={formData.gallery_image_2}
          onChange={(url) => setFormData({ ...formData, gallery_image_2: url })}
          placeholder="https://..."
        />
        <ImageUploadField
          label="Gallery Image 3"
          name="gallery_image_3"
          value={formData.gallery_image_3}
          onChange={(url) => setFormData({ ...formData, gallery_image_3: url })}
          placeholder="https://..."
        />
        <ImageUploadField
          label="Gallery Image 4"
          name="gallery_image_4"
          value={formData.gallery_image_4}
          onChange={(url) => setFormData({ ...formData, gallery_image_4: url })}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Facilities (JSON)</label>
        <p className="text-xs text-slate-500 mb-2">Must be a valid JSON array of objects with &quot;icon&quot;, &quot;title&quot;, and &quot;description&quot;.</p>
        <textarea name="facilities" value={formData.facilities} onChange={handleChange} rows={6} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" placeholder="[ { ... } ]"></textarea>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
        <RichTextEditor 
          value={formData.description} 
          onChange={(value) => setFormData({ ...formData, description: value })} 
          placeholder="Description of the hospital..."
        />
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
