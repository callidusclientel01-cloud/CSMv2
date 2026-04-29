"use client";
import React, { useState } from "react";
import { supabase } from "@/utils/supabaseClient";

interface ImageUploadFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function ImageUploadField({ label, name, value, onChange, placeholder = "https://...", required = false }: ImageUploadFieldProps) {
  const [uploadMode, setUploadMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('curesuremedico-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('curesuremedico-media')
        .getPublicUrl(filePath);

      onChange(publicUrlData.publicUrl);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end mb-2">
        <label className="block text-sm font-bold text-slate-700">{label}</label>
        <div className="flex bg-slate-100 rounded-lg p-1 text-xs font-semibold">
          <button
            type="button"
            className={`px-3 py-1 rounded-md transition-colors ${uploadMode === 'url' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setUploadMode('url')}
          >
            URL Link
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded-md transition-colors ${uploadMode === 'upload' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setUploadMode('upload')}
          >
            Upload File
          </button>
        </div>
      </div>

      {uploadMode === 'url' ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder={placeholder}
          required={required && !value}
        />
      ) : (
        <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 hover:bg-slate-50 transition-colors text-center">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
            required={required && !value}
          />
          <div className="space-y-2">
            <span className="material-symbols-outlined text-4xl text-slate-400">cloud_upload</span>
            <div className="text-sm font-medium text-slate-700">
              {uploading ? (
                <span className="text-blue-500 animate-pulse">Uploading...</span>
              ) : (
                <span>Click to upload or drag and drop</span>
              )}
            </div>
            <p className="text-xs text-slate-500">SVG, PNG, JPG, GIF or MP4 (max. 10MB)</p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-xs font-medium mt-1">{error}</p>
      )}

      {value && (
        <div className="mt-3 relative inline-block border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
          <img src={value} alt="Preview" className="max-h-32 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
        </div>
      )}
    </div>
  );
}
