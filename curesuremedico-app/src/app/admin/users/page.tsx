"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";

interface AdminUser {
  id: string;
  name: string;
  auth_key: string;
  permissions: string[];
  created_at: string;
}

const PERMISSIONS_LIST = [
  { id: "/admin/hospitals", label: "Hospitals" },
  { id: "/admin/treatments", label: "Treatments" },
  { id: "/admin/destinations", label: "Destinations" },
  { id: "/admin/packages", label: "Packages" },
  { id: "/admin/patient-stories", label: "Patient Stories" },
  { id: "/admin/blog", label: "Blog" },
  { id: "/admin/leads", label: "Leads/Inquiries" }
];

export default function UsersManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [authKey, setAuthKey] = useState("");
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (data && !error) {
      setUsers(data);
    }
    setLoading(false);
  };

  const handleTogglePermission = (permId: string) => {
    if (selectedPerms.includes(permId)) {
      setSelectedPerms(selectedPerms.filter(p => p !== permId));
    } else {
      setSelectedPerms([...selectedPerms, permId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const { error } = await supabase.from("admin_users").insert([
      { name, auth_key: authKey, permissions: selectedPerms }
    ]);
    
    setSubmitting(false);
    
    if (!error) {
      setIsFormOpen(false);
      setName("");
      setAuthKey("");
      setSelectedPerms([]);
      fetchUsers();
    } else {
      alert("Error creating user: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    const { error } = await supabase.from("admin_users").delete().eq("id", id);
    if (!error) {
      fetchUsers();
    } else {
      alert("Error deleting user: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Team & Users</h1>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center transition-colors font-medium"
        >
          <span className="material-symbols-outlined mr-2">
            {isFormOpen ? "close" : "add"}
          </span>
          {isFormOpen ? "Cancel" : "Add New User"}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Create Sub-Administrator</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Access Key (Password)</label>
                <input 
                  type="text" 
                  required
                  value={authKey}
                  onChange={(e) => setAuthKey(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Unique secure key"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Permissions (Allowed Tabs)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {PERMISSIONS_LIST.map((perm) => (
                  <label key={perm.id} className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedPerms.includes(perm.id)}
                      onChange={() => handleTogglePermission(perm.id)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700 font-medium">{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save User"}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No additional users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-sm font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Access Key</th>
                  <th className="px-6 py-4">Permissions</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800">{user.name}</td>
                    <td className="px-6 py-4">
                      <code className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{user.auth_key}</code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.map((p, i) => (
                          <span key={i} className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded border border-blue-100">
                            {PERMISSIONS_LIST.find(pl => pl.id === p)?.label || p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
