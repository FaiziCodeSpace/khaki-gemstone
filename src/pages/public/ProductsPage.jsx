import { useEffect, useState } from 'react';
import { Footer } from '../../components/common/Footer';
import { Card } from '../../components/public/Products/Card';
import { Categories } from '../../components/public/Products/Categories';
import { Filter } from '../../components/public/Products/Filter';
import { ProductsHeroPortion } from '../../components/public/Products/HeroPortion';
import { fetchAllProducts } from '../../services/productsService';

export function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({ totalPages: 1, totalProducts: 0 }); // To store metadata
    
    const [filters, setFilters] = useState({
        search: '',
        category: [], 
        filter: [],   
        limited: undefined,
        portal: 'PUBLIC',
        page: 1,      
        limit: 12  
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                // This calls the service with { ..., page: 1, limit: 12 }
                const data = await fetchAllProducts(filters);
                setProducts(data);

                // Capture pagination metadata from the array property we added in the service
                if (data.pagination) {
                    setPagination({
                        totalPages: data.pagination.totalPages,
                        totalProducts: data.pagination.totalProducts
                    });
                }
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };
        loadData();
    }, [filters]);

    // Helper to change page
    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    return (
        <main className='font-[Satoshi]'>
            <ProductsHeroPortion />
            <Filter filters={filters} setFilters={setFilters} />
            <div className='flex'>
                <Categories filters={filters} setFilters={setFilters} />
                <div className="flex-1">
                    <Card products={products} />
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center gap-4 pb-10">
                            <button 
                                disabled={filters.page === 1}
                                onClick={() => handlePageChange(filters.page - 1)}
                                className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="flex items-center">
                                Page {filters.page} of {pagination.totalPages}
                            </span>
                            <button 
                                disabled={filters.page === pagination.totalPages}
                                onClick={() => handlePageChange(filters.page + 1)}
                                className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}