"use client";

import React from "react";
import { LucideSearch, ListFilter } from "lucide-react";

interface LoanRequestActionsProps {
  onSearchClick?: () => void;
  onFilterClick?: () => void;
  onSeeAllClick?: () => void;
}

const LoanRequestActions: React.FC<LoanRequestActionsProps> = ({
  onSearchClick,
  onFilterClick,
  onSeeAllClick,
}) => {
  return (
    <div className="flex justify-between items-center mt-6 bg-white">
      <div className="flex gap-4">
        <button
          onClick={onSearchClick}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white text-[#8A8B9F] font-semibold text-xs"
        >
          <LucideSearch size={16} color="#8A8B9F" />
          Search Request
        </button>
        <button
          onClick={onFilterClick}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white text-[#8A8B9F] font-semibold text-xs"
        >
          <ListFilter size={16} color="#8A8B9F" />
          Filter
        </button>
      </div>
      <a
        href="#"
        onClick={onSeeAllClick}
        className="text-[#156064] font-bold text-sm"
      >
        See All
      </a>
    </div>
  );
};

export default LoanRequestActions;