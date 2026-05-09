"use client";

import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/utils/supabaseClient";
import toast from "react-hot-toast";

interface PatientProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  roadmap_phase: number;
  created_at: string;
}

interface SharedDocument {
  id: string;
  file_name: string;
  file_url: string;
  uploaded_by: string;
  created_at: string;
}

export default function AdminPatients() {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [roadmapPhase, setRoadmapPhase] = useState<number>(1);
  const [documents, setDocuments] = useState<SharedDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPatients = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setPatients(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const openManageModal = async (patient: PatientProfile) => {
    setSelectedPatient(patient);
    setRoadmapPhase(patient.roadmap_phase || 1);
    fetchDocuments(patient.id);
  };

  const fetchDocuments = async (userId: string) => {
    const { data } = await supabase
      .from('shared_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (data) setDocuments(data);
  };

  const handleSaveRoadmap = async () => {
    if (!selectedPatient) return;
    toast.loading("Saving roadmap...", { id: "roadmap" });
    const { error } = await supabase
      .from('profiles')
      .update({ roadmap_phase: roadmapPhase })
      .eq('id', selectedPatient.id);
    
    if (error) {
      toast.error("Error saving roadmap: " + error.message, { id: "roadmap" });
    } else {
      toast.success("Roadmap updated!", { id: "roadmap" });
      fetchPatients();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedPatient) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    toast.loading("Uploading file...", { id: "upload" });

    try {
      // Create a unique file path: user_id/timestamp_filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedPatient.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('patient-documents')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('patient-documents')
        .getPublicUrl(fileName);

      // Insert into shared_documents table
      const { error: dbError } = await supabase.from('shared_documents').insert({
        user_id: selectedPatient.id,
        file_name: file.name,
        file_url: publicUrl,
        uploaded_by: 'admin'
      });

      if (dbError) throw dbError;

      toast.success("File uploaded successfully!", { id: "upload" });
      fetchDocuments(selectedPatient.id);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Upload failed: " + error.message, { id: "upload" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteDocument = async (id: string, fileUrl: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    
    // Attempt to extract the file path from the public URL to delete from storage
    try {
      const urlParts = fileUrl.split('/patient-documents/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from('patient-documents').remove([filePath]);
      }
    } catch (e) {
      console.error("Could not delete from storage:", e);
    }

    // Delete from database
    const { error } = await supabase.from('shared_documents').delete().eq('id', id);
    if (error) {
      toast.error("Error deleting document: " + error.message);
    } else {
      toast.success("Document deleted.");
      if (selectedPatient) fetchDocuments(selectedPatient.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Patient Accounts</h1>
          <p className="text-slate-600">Manage registered patients, their medical roadmap, and shared documents.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading patients...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Roadmap Phase</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center mr-3 uppercase">
                          {patient.full_name ? patient.full_name.charAt(0) : '?'}
                        </div>
                        <div className="font-bold text-slate-900">{patient.full_name || 'No Name'}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-900">{patient.email}</div>
                      <div className="text-xs text-slate-500">{patient.phone || 'No phone'}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        Phase {patient.roadmap_phase || 1}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {new Date(patient.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => openManageModal(patient)} 
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
                {patients.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No registered patients found. Note: Ensure you have run the SQL script to sync profiles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manage Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedPatient.full_name}</h2>
                <p className="text-sm text-slate-500">{selectedPatient.email}</p>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-8">
              
              {/* Roadmap Section */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                  <span className="material-symbols-outlined mr-2 text-indigo-600">route</span>
                  Medical Roadmap
                </h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Current Phase</label>
                    <select 
                      value={roadmapPhase} 
                      onChange={(e) => setRoadmapPhase(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value={1}>1. Inquiry / Pending Review</option>
                      <option value={2}>2. Quote Received</option>
                      <option value={3}>3. Visa & Travel Prep</option>
                      <option value={4}>4. Active Treatment</option>
                      <option value={5}>5. Recovery & Follow-up</option>
                    </select>
                  </div>
                  <button 
                    onClick={handleSaveRoadmap}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors"
                  >
                    Save Status
                  </button>
                </div>
              </section>

              {/* Documents Section */}
              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center">
                    <span className="material-symbols-outlined mr-2 text-blue-600">folder_shared</span>
                    Shared Documents
                  </h3>
                  <div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-semibold text-sm transition-colors flex items-center disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm mr-2">upload</span>
                      {uploading ? "Uploading..." : "Upload File"}
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  {documents.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-sm">
                      No documents shared with this patient yet.
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {documents.map((doc) => (
                        <li key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3">
                              <span className="material-symbols-outlined">description</span>
                            </div>
                            <div>
                              <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                                {doc.file_name}
                              </a>
                              <div className="text-xs text-slate-500 flex items-center mt-0.5">
                                <span className="mr-2">By: {doc.uploaded_by === 'admin' ? 'You (Admin)' : 'Patient'}</span>
                                <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteDocument(doc.id, doc.file_url)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete file"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
