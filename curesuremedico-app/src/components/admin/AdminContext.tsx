"use client";

import React, { createContext, useContext } from 'react';

type AdminSession = {
  role: "admin" | "superadmin";
  permissions: string[];
} | null;

const AdminContext = createContext<AdminSession>(null);

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ session, children }: { session: AdminSession, children: React.ReactNode }) => {
  return (
    <AdminContext.Provider value={session}>
      {children}
    </AdminContext.Provider>
  );
};
