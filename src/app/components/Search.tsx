"use client"; // Ensure this component is client-side rendered

import React from "react";
import { LucideSearch, ListFilter } from "lucide-react";

interface LoanRequestActionsProps {
  onSearchClick?: () => void;
  onFilterClick?: () => void;
  onSeeAllClick?: () => void;
  showSeeAll?: boolean; // Optional prop to control visibility of the "See All" link
}

const Search: React.FC<LoanRequestActionsProps> = ({
  onSearchClick,
  onFilterClick,
  onSeeAllClick,
  showSeeAll = true, // Default value is true
}) => {
  return (
    <div className=" justify-between items-center mt-6 mb-3 bg-[#FAFAFA] hidden md:flex lg:flex">
      <div className="flex gap-4">
        <button
          onClick={onSearchClick}
          className="flex items-center gap-2 pr-[46px] pl-[17px] py-3 border rounded-lg bg-white text-[#8A8B9F] font-bold text-xs"
        >
          <LucideSearch size={16} color="#8A8B9F" />
          Search Request
        </button>
        <button
          onClick={onFilterClick}
          className="flex items-center gap-2 pr-[49px]  pl-[17px]  py-2 border rounded-lg bg-white text-[#8A8B9F] font-bold text-xs"
        >
          <ListFilter size={16} color="#8A8B9F" />
          Filter
        </button>
      </div>

      {/* Conditionally render the "See All" link */}
      {showSeeAll && (
        <a
          href="#"
          onClick={onSeeAllClick}
          className="text-[#156064] font-bold text-sm"
        >
          See All
        </a>
      )}
    </div>
  );
};

export default Search;