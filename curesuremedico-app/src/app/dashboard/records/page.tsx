"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

interface PatientDocument {
  id: string;
  file_name: string;
  storage_path: string;
  category: string;
  uploaded_at: string;
}

export default function MedicalRecordsPage() {
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('patient_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to upload documents.");

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('patient-documents')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Storage Error (Did you create the bucket?): ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('patient-documents')
        .getPublicUrl(filePath);

      // Insert into database
      const { error: dbError } = await supabase
        .from('patient_documents')
        .insert({
          user_id: user.id,
          file_name: file.name,
          storage_path: publicUrl,
          category: file.type.includes('pdf') ? 'Report' : 'Imaging'
        });

      if (dbError) throw dbError;

      alert("Document uploaded successfully!");
      fetchDocuments(); // refresh list
    } catch (err: any) {
      alert(err.message || "An error occurred during upload.");
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const getFileIcon = (category: string, filename: string) => {
    if (filename.toLowerCase().endsWith('.pdf')) return 'picture_as_pdf';
    if (filename.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) return 'image';
    return 'description';
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 pt-24">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Medical Records</h1>
          <p className="text-on-surface-variant max-w-lg">Secure access to your clinical history, diagnostic imaging, and physician prescriptions.</p>
        </div>
        <label className="bg-primary text-on-primary px-6 py-3 rounded-full flex items-center gap-2 font-semibold shadow-lg hover:bg-primary-container hover:text-white transition-all active:scale-95 group cursor-pointer">
          <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">upload</span>
          {uploading ? "Uploading..." : "Upload New Record"}
          <input type="file" className="hidden" disabled={uploading} onChange={handleUpload} accept=".pdf,.jpg,.jpeg,.png" />
        </label>
      </header>

      {/* Bento Grid - Folder System - Static Visually */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        {/* Folder Card: Reports */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">description</span>
            </div>
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">Lab</span>
          </div>
          <h3 className="font-bold text-lg mb-1">Laboratory Reports</h3>
          <p className="text-xs text-on-surface-variant">Blood work, biopsies, urinalysis</p>
        </div>
        
        {/* Folder Card: Prescriptions */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow group cursor-pointer border-l-4 border-l-secondary">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-3xl">prescriptions</span>
            </div>
            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">Meds</span>
          </div>
          <h3 className="font-bold text-lg mb-1">Prescriptions</h3>
          <p className="text-xs text-on-surface-variant">Medication history, dosage guides</p>
        </div>

        {/* Folder Card: Imaging */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <span className="material-symbols-outlined text-3xl">radiology</span>
            </div>
            <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded">Scans</span>
          </div>
          <h3 className="font-bold text-lg mb-1">Diagnostic Imaging</h3>
          <p className="text-xs text-on-surface-variant">MRI, CT Scans, X-Rays, Ultrasound</p>
        </div>

        {/* Folder Card: Visa Docs */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
              <span className="material-symbols-outlined text-3xl">id_card</span>
            </div>
            <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded">Travel</span>
          </div>
          <h3 className="font-bold text-lg mb-1">Visa Documents</h3>
          <p className="text-xs text-on-surface-variant">Medical certificates, travel clearances</p>
        </div>
      </section>

      {/* Recent Activity / List View Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Recent Records</h2>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-dim transition-colors">
            <span className="material-symbols-outlined">grid_view</span>
          </button>
          <button className="p-2 rounded-lg bg-primary text-on-primary">
            <span className="material-symbols-outlined">list</span>
          </button>
        </div>
      </div>

      {/* List View Table */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/10 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/20">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">File Name</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Type</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Date Uploaded</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant">Loading records...</td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant">No medical records uploaded yet.</td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">{getFileIcon(doc.category, doc.file_name)}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-on-surface truncate max-w-xs" title={doc.file_name}>{doc.file_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-on-surface-variant">{doc.category}</span>
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant">
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5 text-right space-x-2">
                    <a href={doc.storage_path} target="_blank" rel="noreferrer" className="text-primary hover:bg-primary/5 px-3 py-1 rounded-full text-sm font-bold transition-colors inline-block">View</a>
                    <a href={doc.storage_path} download className="text-on-surface-variant hover:text-primary transition-colors inline-block">
                      <span className="material-symbols-outlined align-middle">download</span>
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Security Notice Banner */}
      <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-4xl">verified_user</span>
        </div>
        <div>
          <h4 className="text-xl font-bold mb-1">Your data is secured with AES-256 encryption.</h4>
          <p className="opacity-90 text-sm max-w-2xl">All medical records are strictly confidential and shared only with authorized healthcare providers on your care team. You can revoke access or delete documents at any time.</p>
        </div>
        <div className="md:ml-auto">
          <button className="bg-white text-primary px-6 py-2 rounded-full font-bold whitespace-nowrap hover:bg-slate-100 transition-colors">Manage Access</button>
        </div>
      </div>
    </div>
  );
}
