"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabaseClient";

export default function AdminPatientStories() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('patient_stories').select('*').order('id', { ascending: false });
    if (data) setStories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this patient story?")) {
      await supabase.from('patient_stories').delete().eq('id', id);
      fetchStories();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Patient Stories</h1>
          <p className="text-slate-600">Manage patient testimonial videos shown on the homepage.</p>
        </div>
        <Link href="/admin/patient-stories/new" className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center shadow-sm">
          <span className="material-symbols-outlined mr-2">add</span>
          Add Story
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading stories...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                  <th className="p-4">Thumbnail</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Country</th>
                  <th className="p-4">YouTube ID</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stories.map((story) => {
                  const thumb = story.thumbnail_url || `https://img.youtube.com/vi/${story.youtube_id}/mqdefault.jpg`;
                  return (
                  <tr key={story.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="w-24 h-16 rounded-lg overflow-hidden bg-slate-200">
                        <img src={thumb} alt={story.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{story.title}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-slate-900">{story.country}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-600">{story.youtube_id}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        story.status === 'published' ? 'bg-green-100 text-green-800' : 
                        story.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {story.status || 'draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/patient-stories/${story.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </Link>
                        <button onClick={() => handleDelete(story.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
                {stories.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">No stories found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
