"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 pt-10">
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-container-high transition-colors"
        aria-label="Previous page"
      >
        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
            currentPage === page 
              ? 'bg-primary text-on-primary' 
              : 'bg-surface-container hover:bg-surface-dim text-on-surface-variant'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-container-high transition-colors"
        aria-label="Next page"
      >
        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
      </button>
    </div>
  );
}
