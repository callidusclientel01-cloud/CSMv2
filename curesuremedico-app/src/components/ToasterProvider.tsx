"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster 
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#334155',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          borderRadius: '0.75rem',
          padding: '16px',
          fontWeight: 600,
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}
