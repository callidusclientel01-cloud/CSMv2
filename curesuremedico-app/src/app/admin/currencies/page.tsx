"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminContext";

export default function CurrenciesPage() {
  const session = useAdmin();
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      const { data, error } = await supabase
        .from("currencies")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setCurrencies(data || []);
    } catch (error) {
      console.error("Error fetching currencies:", error);
      alert("Failed to load currencies.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (confirm(`Are you sure you want to delete ${code}?`)) {
      try {
        const { error } = await supabase.from("currencies").delete().eq("id", id);
        if (error) throw error;
        setCurrencies(currencies.filter((c) => c.id !== id));
      } catch (error) {
        console.error("Error deleting currency:", error);
        alert("Failed to delete currency.");
      }
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("currencies")
        .update({ is_active: !currentStatus })
        .eq("id", id);
      
      if (error) throw error;
      setCurrencies(currencies.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  if (session?.role !== "superadmin") {
    return <div className="text-red-500 font-bold p-8">Access Denied. Superadmin only.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Currencies</h1>
        <Link
          href="/admin/currencies/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
        >
          <span className="material-symbols-outlined mr-2 text-sm">add</span>
          Add Currency
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading currencies...</div>
        ) : currencies.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No currencies found. Add one to get started.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="p-4 font-medium">Code</th>
                <th className="p-4 font-medium">Symbol</th>
                <th className="p-4 font-medium">Exchange Rate (vs USD)</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Default</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currencies.map((currency) => (
                <tr key={currency.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">{currency.code}</td>
                  <td className="p-4 text-slate-600">{currency.symbol}</td>
                  <td className="p-4 font-mono text-slate-600">{currency.exchange_rate}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(currency.id, currency.is_active)}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        currency.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {currency.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-4">
                    {currency.is_default && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">Default</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={`/admin/currencies/${currency.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(currency.id, currency.code)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm ml-4"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
