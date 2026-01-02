import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const GEMSTONE_FILTERS = [
  { id: 1, name: "All Gemstones", slug: "all" },
  { id: 2, name: "Ruby", slug: "ruby" },
  { id: 3, name: "Sapphire", slug: "sapphire" },
  { id: 4, name: "Emerald", slug: "emerald" },
  { id: 5, name: "Diamond", slug: "diamond" },
  { id: 6, name: "Amethyst", slug: "amethyst" },
  { id: 7, name: "Topaz", slug: "topaz" },
  { id: 8, name: "Aquamarine", slug: "aquamarine" },
];

export function Filter() {
  const [searchTerm, setSearchTerm] = useState('');
  // Set the first item as default active ID
  const [activeFilterId, setActiveFilterId] = useState(1);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  return (
    <section className='my-10' aria-label="Gemstone Filters">
      {/* 1. SEO: Screen reader only H1 if this is the main section, or semantic H2 */}
      <div className="flex w-full px-6 md:px-10 items-center justify-center md:justify-between">
        <h2 className="hidden md:block text-2xl font-medium text-gray-800">
          Gemstone Catalog
        </h2>

        {/* Search Bar */}
        <div className="flex items-center w-full md:w-[321px] relative">
          <label htmlFor="gemstone-search" className="sr-only">Search Gemstones</label>
          <div className="absolute left-3 text-gray-400">
            <SocialIcon Icon={Search} />
          </div>
          <input
            id="gemstone-search"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search Gemstone..."
            className="w-full pl-10 pr-10 py-2 bg-white border border-transparent rounded-full focus:bg-white focus:border-[#CA0A7F] focus:outline-none transition-all"
          />
          {/* Mobile Filter Icon */}
          <div className="block md:hidden absolute right-4 top-3 text-gray-400">
            <button aria-label="Open filters">
               <SocialIcon Icon={SlidersHorizontal} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. SEO & Logic: Horizontal Scrollbar */}
      <nav className='overflow-x-auto px-6 md:px-10 mt-12 h-11.5 flex gap-9 scrollbar-hide' aria-label="Gemstone categories">
        {GEMSTONE_FILTERS.map((filter) => {
          const isActive = activeFilterId === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilterId(filter.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`
                text-nowrap text-sm md:text-base transition-all duration-200 cursor-pointer
                ${isActive 
                  ? "bg-white rounded-full px-6 py-3 font-medium text-black" 
                  : "bg-none text-[#545454] font-normal hover:text-[#CA0A7F]"
                }
              `}
            >
              {filter.name}
            </button>
          );
        })}
      </nav>
    </section>
  );
}

function SocialIcon({ Icon }) {
  return (
    <div className="flex items-center justify-center transition-colors">
      <Icon size={18} />
    </div>
  );
}