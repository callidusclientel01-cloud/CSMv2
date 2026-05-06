"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export type Currency = {
  id: string;
  code: string;
  symbol: string;
  exchange_rate: number;
  is_default: boolean;
};

type CurrencyContextType = {
  currencies: Currency[];
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  formatPrice: (basePriceInUSD: number) => string;
  formatStringPrice: (priceStr: string) => string;
  isLoaded: boolean;
};

const defaultCurrency: Currency = {
  id: "0",
  code: "USD",
  symbol: "$",
  exchange_rate: 1,
  is_default: true,
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currencies, setCurrencies] = useState<Currency[]>([defaultCurrency]);
  const [selectedCurrency, setSelectedCurrencyState] = useState<Currency>(defaultCurrency);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadCurrencies() {
      try {
        const { data, error } = await supabase
          .from("currencies")
          .select("id, code, symbol, exchange_rate, is_default")
          .eq("is_active", true)
          .order("code");

        if (error) throw error;

        if (data && data.length > 0) {
          setCurrencies(data);

          // Try to load from localStorage first
          const savedCode = localStorage.getItem("csm_currency");
          let initialCurrency = data.find((c) => c.code === savedCode);

          // If no saved preference, look for the default
          if (!initialCurrency) {
            initialCurrency = data.find((c) => c.is_default);
          }

          // If still no default, use the first one
          if (!initialCurrency) {
            initialCurrency = data[0];
          }

          setSelectedCurrencyState(initialCurrency);
        }
      } catch (err) {
        console.error("Failed to load currencies:", err);
      } finally {
        setIsLoaded(true);
      }
    }

    loadCurrencies();
  }, []);

  const setSelectedCurrency = (currency: Currency) => {
    setSelectedCurrencyState(currency);
    localStorage.setItem("csm_currency", currency.code);
  };

  const formatPrice = (basePriceInUSD: number) => {
    // If not loaded yet, we can return empty or a skeleton, but returning the base helps avoid layout shifts
    if (!basePriceInUSD) return `${selectedCurrency.symbol}0`;
    const converted = basePriceInUSD * selectedCurrency.exchange_rate;
    // Format to 0 decimal places if whole number, else 2
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: selectedCurrency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(converted);
  };

  const formatStringPrice = (priceStr: string) => {
    if (!priceStr) return priceStr;
    // If it's something like "Ask for quote", return it
    const numMatch = priceStr.match(/[\d,.]+/);
    if (!numMatch) return priceStr;
    
    // Parse the number
    const numValue = parseFloat(numMatch[0].replace(/,/g, ''));
    if (isNaN(numValue)) return priceStr;

    // Replace the number and currency symbol in the original string
    const formattedNum = formatPrice(numValue);
    // Remove the $ or £ or € from the original string if it exists
    return priceStr.replace(/[$€£₹¥]|[\d,.]+/g, '').trim() + " " + formattedNum;
  };

  return (
    <CurrencyContext.Provider value={{ currencies, selectedCurrency, setSelectedCurrency, formatPrice, formatStringPrice, isLoaded }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
