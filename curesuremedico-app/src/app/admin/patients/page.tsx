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

interface Enquiry {
  id: number;
  inquiry_type: string;
  hospital_name: string;
  status: string;
  submitted_at: string;
  notes: string;
}

interface PatientDocument {
  id: string;
  file_name: string;
  storage_path: string;
  category: string;
  uploaded_at: string;
}

type TabType = 'overview' | 'enquiries' | 'records' | 'shared';

export default function AdminPatients() {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [roadmapPhase, setRoadmapPhase] = useState<number>(1);
  
  // Data states
  const [sharedDocs, setSharedDocs] = useState<SharedDocument[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<PatientDocument[]>([]);
  
  // Action states
  const [uploading, setUploading] = useState(false);
  const [downloadingRecordId, setDownloadingRecordId] = useState<string | null>(null);
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
    setActiveTab('overview');
    
    // Fetch all related data
    fetchSharedDocs(patient.id);
    fetchEnquiries(patient.id);
    fetchMedicalRecords(patient.id);
  };

  const fetchSharedDocs = async (userId: string) => {
    const { data } = await supabase.from('shared_documents').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (data) setSharedDocs(data);
  };

  const fetchEnquiries = async (userId: string) => {
    const { data } = await supabase.from('enquiries').select('*').eq('user_id', userId).order('submitted_at', { ascending: false });
    if (data) setEnquiries(data);
  };

  const fetchMedicalRecords = async (userId: string) => {
    const { data } = await supabase.from('patient_documents').select('*').eq('user_id', userId).order('uploaded_at', { ascending: false });
    if (data) setMedicalRecords(data);
  };

  const handleSaveRoadmap = async () => {
    if (!selectedPatient) return;
    toast.loading("Saving roadmap...", { id: "roadmap" });
    const { error } = await supabase.from('profiles').update({ roadmap_phase: roadmapPhase }).eq('id', selectedPatient.id);
    
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedPatient.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('patient-documents').upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('patient-documents').getPublicUrl(fileName);

      const { error: dbError } = await supabase.from('shared_documents').insert({
        user_id: selectedPatient.id,
        file_name: file.name,
        file_url: publicUrl,
        uploaded_by: 'admin'
      });

      if (dbError) throw dbError;

      toast.success("File uploaded successfully!", { id: "upload" });
      fetchSharedDocs(selectedPatient.id);
    } catch (error: any) {
      toast.error("Upload failed: " + error.message, { id: "upload" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteSharedDoc = async (id: string, fileUrl: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      const urlParts = fileUrl.split('/patient-documents/');
      if (urlParts.length > 1) await supabase.storage.from('patient-documents').remove([urlParts[1]]);
    } catch (e) {}

    const { error } = await supabase.from('shared_documents').delete().eq('id', id);
    if (error) toast.error("Error deleting document: " + error.message);
    else {
      toast.success("Document deleted.");
      if (selectedPatient) fetchSharedDocs(selectedPatient.id);
    }
  };

  const handleDownloadRecord = async (doc: PatientDocument) => {
    setDownloadingRecordId(doc.id);
    toast.loading("Preparing secure download...", { id: `download-${doc.id}` });
    
    try {
      let path = doc.storage_path;
      if (path.includes('/patient-documents/')) {
        path = path.split('/patient-documents/')[1];
      }
      
      const { data, error } = await supabase.storage.from('patient-documents').createSignedUrl(path, 60);
      if (error) throw error;
      
      // Trigger download via signed url
      window.open(data.signedUrl, '_blank');
      toast.success("Download started", { id: `download-${doc.id}` });
    } catch (err: any) {
      toast.error("Error downloading file: " + err.message, { id: `download-${doc.id}` });
    } finally {
      setDownloadingRecordId(null);
    }
  };

  const handleUpdateEnquiryStatus = async (id: number, newStatus: string) => {
    toast.loading("Updating status...", { id: "enquiry" });
    const { error } = await supabase.from('enquiries').update({ status: newStatus }).eq('id', id);
    if (error) {
      toast.error("Error: " + error.message, { id: "enquiry" });
    } else {
      toast.success("Status updated", { id: "enquiry" });
      if (selectedPatient) fetchEnquiries(selectedPatient.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Patient Accounts</h1>
          <p className="text-slate-600">Manage registered patients, view their records, and share documents.</p>
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
                        Manage 360°
                      </button>
                    </td>
                  </tr>
                ))}
                {patients.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No registered patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manage 360 Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-10 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] sm:max-h-[85vh] max-w-5xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header - Responsive */}
            <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-start sm:items-center shrink-0 gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-lg shrink-0 uppercase">
                  {selectedPatient.full_name ? selectedPatient.full_name.charAt(0) : '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold truncate">{selectedPatient.full_name}</h2>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-slate-300 text-xs sm:text-sm gap-2 sm:gap-3">
                    <span className="flex items-center"><span className="material-symbols-outlined text-xs mr-1">mail</span> <span className="truncate">{selectedPatient.email}</span></span>
                    <span className="flex items-center"><span className="material-symbols-outlined text-xs mr-1">phone</span> {selectedPatient.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="p-2 text-slate-300 hover:bg-slate-800 rounded-full transition-colors shrink-0">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Navigation Tabs - Scrollable on mobile */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-2 sm:px-6 shrink-0 overflow-x-auto hide-scrollbar">
              {(['overview', 'enquiries', 'records', 'shared'] as TabType[]).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-bold tracking-wide transition-all whitespace-nowrap flex items-center gap-1 sm:gap-2 ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <span className="material-symbols-outlined text-base">
                    {tab === 'overview' ? 'dashboard' : tab === 'enquiries' ? 'forum' : tab === 'records' ? 'radiology' : 'folder_shared'}
                  </span>
                  <span className="hidden sm:inline">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                  {tab === 'enquiries' && enquiries.length > 0 && <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.5 rounded-full">{enquiries.length}</span>}
                  {tab === 'records' && medicalRecords.length > 0 && <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.5 rounded-full">{medicalRecords.length}</span>}
                </button>
              ))}
            </div>
            
            {/* Tab Content - Scrollable */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-white">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8 max-w-3xl">
                  <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                      <span className="material-symbols-outlined mr-2 text-indigo-600">route</span>
                      Medical Roadmap Control
                    </h3>
                    <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 flex flex-col md:flex-row items-end gap-4">
                      <div className="flex-1 w-full">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Current Journey Phase</label>
                        <select 
                          value={roadmapPhase} 
                          onChange={(e) => setRoadmapPhase(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-medium text-slate-700"
                        >
                          <option value={1}>Phase 1: Inquiry / Pending Review</option>
                          <option value={2}>Phase 2: Quote Received</option>
                          <option value={3}>Phase 3: Visa & Travel Prep</option>
                          <option value={4}>Phase 4: Active Treatment</option>
                          <option value={5}>Phase 5: Recovery & Follow-up</option>
                        </select>
                      </div>
                      <button 
                        onClick={handleSaveRoadmap}
                        className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-sm shadow-indigo-200"
                      >
                        Update Status
                      </button>
                    </div>
                    <p className="text-sm text-slate-500 mt-3 ml-2">Updating this will instantly reflect on the patient's private dashboard.</p>
                  </section>
                </div>
              )}

              {/* TAB 2: ENQUIRIES */}
              {activeTab === 'enquiries' && (
                <div className="space-y-4">
                  {enquiries.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 border-2 border-dashed border-slate-100 rounded-2xl">
                      <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">speaker_notes_off</span>
                      <p>This patient has not submitted any consultation requests.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {enquiries.map(enq => (
                        <div key={enq.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-bold text-slate-900 text-lg">{enq.inquiry_type}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                                enq.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                enq.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-200 text-slate-700'
                              }`}>
                                {enq.status}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">local_hospital</span> {enq.hospital_name || 'No specific hospital'}
                            </p>
                            <p className="text-xs text-slate-400 mt-2">Submitted on {new Date(enq.submitted_at).toLocaleString()}</p>
                            {enq.notes && <div className="mt-3 p-3 bg-white rounded-lg text-sm border border-slate-100 text-slate-700 italic">"{enq.notes}"</div>}
                          </div>
                          
                          <div className="flex md:flex-col gap-2 shrink-0">
                            <select 
                              value={enq.status}
                              onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value)}
                              className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white"
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MEDICAL RECORDS */}
              {activeTab === 'records' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined">info</span>
                      <p className="text-sm">These are documents uploaded securely by the patient from their dashboard.</p>
                    </div>
                  </div>

                  {medicalRecords.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 border-2 border-dashed border-slate-100 rounded-2xl">
                      <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">folder_off</span>
                      <p>The patient has not uploaded any medical records.</p>
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                      <ul className="divide-y divide-slate-100">
                        {medicalRecords.map((doc) => (
                          <li key={doc.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 gap-4 transition-colors">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-4 shrink-0">
                                <span className="material-symbols-outlined">
                                  {doc.category === 'Diagnostic Imaging' ? 'radiology' : doc.file_name.endsWith('.pdf') ? 'picture_as_pdf' : 'description'}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900 truncate max-w-[250px] md:max-w-md" title={doc.file_name}>{doc.file_name}</h4>
                                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-1">
                                  <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">{doc.category}</span>
                                  <span>{new Date(doc.uploaded_at).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleDownloadRecord(doc)}
                              disabled={downloadingRecordId === doc.id}
                              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center disabled:opacity-50 whitespace-nowrap"
                            >
                              {downloadingRecordId === doc.id ? (
                                <span className="flex items-center"><span className="material-symbols-outlined text-sm mr-2 animate-spin">refresh</span> Loading...</span>
                              ) : (
                                <span className="flex items-center"><span className="material-symbols-outlined text-sm mr-2">download</span> Secure Download</span>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: SHARED DOCUMENTS */}
              {activeTab === 'shared' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Files Shared with Patient</h3>
                      <p className="text-sm text-slate-500 mt-1 max-w-lg">Upload treatment plans, quotes, and visa documents here. The patient will be able to download them from their dashboard.</p>
                    </div>
                    <div>
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center disabled:opacity-50 whitespace-nowrap shadow-sm shadow-blue-200"
                      >
                        <span className="material-symbols-outlined mr-2">cloud_upload</span>
                        {uploading ? "Uploading..." : "Upload New File"}
                      </button>
                    </div>
                  </div>

                  {sharedDocs.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 border-2 border-dashed border-slate-100 rounded-2xl">
                      <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">cloud_off</span>
                      <p>You haven't shared any documents with this patient yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sharedDocs.map((doc) => (
                        <div key={doc.id} className="p-5 flex items-start justify-between bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined">description</span>
                            </div>
                            <div className="overflow-hidden">
                              <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-800 hover:text-blue-600 hover:underline truncate block">
                                {doc.file_name}
                              </a>
                              <div className="text-xs text-slate-500 flex flex-col mt-1">
                                <span>{new Date(doc.created_at).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteSharedDoc(doc.id, doc.file_url)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                            title="Delete file"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
