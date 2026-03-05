import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Footer } from '../../components/common/Footer';
import { Card } from '../../components/public/Products/Card';
import { Categories } from '../../components/public/Products/Categories';
import { Filter } from '../../components/public/Products/Filter';
import { ProductsHeroPortion } from '../../components/public/Products/HeroPortion';
import { fetchAllProducts } from '../../services/productsService';
import { Helmet } from 'react-helmet-async';

export function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({ totalPages: 1, totalProducts: 0 });

    // 1. Initialize filters from URL parameters so refresh/back-button works
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') ? searchParams.get('category').split(',') : [],
        filter: searchParams.get('filter') ? searchParams.get('filter').split(',') : [],
        portal: 'ALL_PUBLIC',
        page: parseInt(searchParams.get('page')) || 1,
        limit: 12
    });

    // 2. Sync State -> URL (This ensures the query strings change in the browser)
    useEffect(() => {
        const newParams = {};
        if (filters.search) newParams.search = filters.search;
        if (filters.category.length > 0) newParams.category = filters.category.join(',');
        if (filters.filter.length > 0) newParams.filter = filters.filter.join(',');
        if (filters.page > 1) newParams.page = filters.page;

        setSearchParams(newParams, { replace: true });
    }, [filters, setSearchParams]);

    // 3. Fetch Data whenever filters change
    useEffect(() => {
        const loadData = async () => {
            try {
                // Prepare filters for the API
                const queryFilters = { ...filters };
                if (filters.portal === 'ALL_PUBLIC') {
                    delete queryFilters.portal;
                }

                // fetchAllProducts now handles the array-to-comma-string conversion
                const data = await fetchAllProducts(queryFilters);

                // Handle both array responses and object responses
                const rawProducts = data.products || data;
                setProducts(Array.isArray(rawProducts) ? rawProducts : []);

                if (data.pagination) {
                    setPagination({
                        totalPages: data.pagination.totalPages,
                        totalProducts: data.pagination.totalProducts
                    });
                } else if (data.totalPages) {
                    // Fallback for direct object response
                    setPagination({
                        totalPages: data.totalPages,
                        totalProducts: data.totalProducts
                    });
                }
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };
        loadData();
    }, [filters]);

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Helmet>
                {/* Dynamic Title based on selection */}
                <title>
                    {filters.category.length > 0
                        ? `${filters.category.join(', ')} Gemstones | Khaki Gemstone`
                        : 'Shop Natural Gemstones | Khaki Gemstone Collection'}
                </title>

                <meta name="description" content={
                    filters.category.length > 0
                        ? `Explore our premium selection of ${filters.category.join(' and ')}. 100% natural and authentic.`
                        : "Browse our exclusive collection of 100% natural gemstones. Find rare sapphires, emeralds, and more."
                } />

                {/* Open Graph / Facebook (Visual Sharing) */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Authentic Natural Gemstones | Khaki Gemstone" />
                <meta property="og:description" content="Find the perfect investment-grade gemstone. Certified and natural." />
                <meta property="og:image" content="https://khakigemstone.com/og-shop-banner.jpg" /> {/* URL to a high-res banner of your shop */}
                <meta property="og:url" content={`https://khakigemstone.com/shop${window.location.search}`} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Shop Natural Gemstones" />
                <meta name="twitter:image" content="https://khakigemstone.com/og-shop-banner.jpg" />

                <link rel="canonical" href={`https://khakigemstone.com/shop${window.location.search}`} />
            </Helmet>

            <main className='font-[Satoshi] overflow-x-hidden'>
                <ProductsHeroPortion />
                <Filter filters={filters} setFilters={setFilters} />

                <div className='flex w-full overflow-hidden'>
                    <Categories filters={filters} setFilters={setFilters} />

                    <div className="flex-1 min-w-0 w-full">
                        <Card products={products} />

                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center gap-4 pb-10">
                                <button
                                    disabled={filters.page === 1}
                                    onClick={() => handlePageChange(filters.page - 1)}
                                    className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 cursor-pointer"
                                >
                                    Previous
                                </button>
                                <span className="flex items-center text-sm md:text-base">
                                    Page {filters.page} of {pagination.totalPages}
                                </span>
                                <button
                                    disabled={filters.page === pagination.totalPages}
                                    onClick={() => handlePageChange(filters.page + 1)}
                                    className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 cursor-pointer"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </main>
        </>
    );
}