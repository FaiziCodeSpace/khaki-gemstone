import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import taxonomyService from '../../../services/taxanonmyService'; 

export function Filter({ filters, setFilters }) {
  const [dbFilters, setDbFilters] = useState([]);

  // Fetch filters from database
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await taxonomyService.getMetadata();
        // Find the document where taxonomy is "Filter"
        const filterDoc = data.find(item => item.taxonomy === "Filter");
        
        if (filterDoc && filterDoc.Filters) {
          // Map strings to the object format the UI expects
          const formattedFilters = filterDoc.Filters.map((name, index) => ({
            id: index + 2, // Start after the "All" ID
            name: name,
            slug: name.toLowerCase().replace(/\s+/g, '-')
          }));
          
          setDbFilters(formattedFilters);
        }
      } catch (error) {
        console.error("Error fetching gemstone filters:", error);
      }
    };
    fetchFilters();
  }, []);

  // Combine static "All" with dynamic filters from DB
  const GEMSTONE_FILTERS = [
    { id: 1, name: "All Gemstones", slug: "all" },
    ...dbFilters
  ];

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleFilterClick = (filter) => {
    setFilters(prev => ({
      ...prev,
      filter: filter.slug === 'all' ? [] : [filter.name],
      page: 1
    }));
  };

  return (
    <section className='my-10' aria-label="Gemstone Filters">
      <div className="flex w-full px-6 md:px-10 items-center justify-center md:justify-between">
        <h2 className="hidden md:block text-2xl font-medium text-gray-800">Gemstone Catalog</h2>

        <div className="flex items-center w-full md:w-[321px] relative">
          <label htmlFor="gemstone-search" className="sr-only">Search Gemstones</label>
          <div className="absolute left-3 text-gray-400">
            <SocialIcon Icon={Search} />
          </div>
          <input
            id="gemstone-search"
            type="text"
            value={filters.search}
            onChange={handleSearch}
            placeholder="Search Gemstone..."
            className="w-full pl-10 pr-10 py-2 bg-white border border-transparent rounded-full focus:bg-white focus:border-[#CA0A7F] focus:outline-none transition-all"
          />
        </div>
      </div>

      <nav className='overflow-x-auto px-6 md:px-10 mt-12 h-11.5 flex gap-9 scrollbar-hide' aria-label="Gemstone categories">
        {GEMSTONE_FILTERS.map((filter) => {
          const isActive = (filter.slug === 'all' && filters.filter.length === 0) || filters.filter.includes(filter.name);
          return (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter)}
              className={`text-nowrap text-sm md:text-base transition-all duration-200 cursor-pointer ${
                isActive ? "bg-white rounded-full px-6 py-3 font-medium text-black" : "bg-none text-[#545454] font-normal hover:text-[#CA0A7F]"
              }`}
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
  return <div className="flex items-center justify-center transition-colors"><Icon size={18} /></div>;
}