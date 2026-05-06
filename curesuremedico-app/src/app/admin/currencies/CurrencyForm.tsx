"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import Link from "next/link";
import { useAdmin } from "@/components/admin/AdminContext";

export default function CurrencyForm({ currencyId }: { currencyId?: string }) {
  const router = useRouter();
  const session = useAdmin();
  const isEditing = !!currencyId;

  const [formData, setFormData] = useState({
    code: "",
    symbol: "",
    exchange_rate: "1.00",
    is_default: false,
    is_active: true,
  });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchCurrency();
    }
  }, [currencyId]);

  const fetchCurrency = async () => {
    try {
      const { data, error } = await supabase
        .from("currencies")
        .select("*")
        .eq("id", currencyId)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          code: data.code,
          symbol: data.symbol,
          exchange_rate: data.exchange_rate.toString(),
          is_default: data.is_default,
          is_active: data.is_active,
        });
      }
    } catch (error) {
      console.error("Error fetching currency:", error);
      alert("Failed to load currency.");
      router.push("/admin/currencies");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // If setting this as default, we should unset others first
      if (formData.is_default) {
        await supabase.from("currencies").update({ is_default: false }).neq("id", "00000000-0000-0000-0000-000000000000"); // trick to update all
      }

      const payload = {
        ...formData,
        exchange_rate: parseFloat(formData.exchange_rate),
        updated_at: new Date().toISOString(),
      };

      let error;
      if (isEditing) {
        const { error: updateError } = await supabase
          .from("currencies")
          .update(payload)
          .eq("id", currencyId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("currencies")
          .insert([payload]);
        error = insertError;
      }

      if (error) throw error;
      
      router.push("/admin/currencies");
      router.refresh();
    } catch (error: any) {
      console.error("Error saving currency:", error);
      alert(`Failed to save currency: ${error.message}`);
      setSaving(false);
    }
  };

  if (session?.role !== "superadmin") {
    return <div className="text-red-500 font-bold p-8">Access Denied. Superadmin only.</div>;
  }

  if (loading) {
    return <div className="p-8 text-slate-500">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <div className="flex items-center mb-6">
        <Link href="/admin/currencies" className="mr-4 text-slate-400 hover:text-slate-600 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">
          {isEditing ? `Edit Currency: ${formData.code}` : "Add New Currency"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Currency Code (e.g., USD)</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono"
              placeholder="EUR"
              maxLength={3}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Symbol (e.g., €)</label>
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="€"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Exchange Rate <span className="text-slate-400 font-normal">(Relative to base currency, usually USD)</span>
          </label>
          <input
            type="number"
            step="0.000001"
            min="0.000001"
            name="exchange_rate"
            value={formData.exchange_rate}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
            placeholder="0.92"
          />
          <p className="text-xs text-slate-500 mt-2">
            If Base = USD (1.00), and 1 USD = 0.92 EUR, then EUR rate is 0.92.
          </p>
        </div>

        <div className="flex items-center space-x-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm font-bold text-slate-700">Active (Visible on site)</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_default"
              checked={formData.is_default}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm font-bold text-slate-700">Set as Default</span>
          </label>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="button"
            onClick={() => router.push("/admin/currencies")}
            className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors mr-4"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {saving ? (
              <span className="material-symbols-outlined animate-spin mr-2">autorenew</span>
            ) : (
              <span className="material-symbols-outlined mr-2">save</span>
            )}
            {saving ? "Saving..." : "Save Currency"}
          </button>
        </div>
      </form>
    </div>
  );
}
