import { useEffect, useState } from 'react';
import { Footer } from '../../components/common/Footer';
import { Card } from '../../components/public/Products/Card';
import { Categories } from '../../components/public/Products/Categories';
import { Filter } from '../../components/public/Products/Filter';
import { ProductsHeroPortion } from '../../components/public/Products/HeroPortion';
import { fetchAllProducts } from '../../services/productsService';
import { Helmet } from 'react-helmet-async';

export function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({ totalPages: 1, totalProducts: 0 });

    const [filters, setFilters] = useState({
        search: '',
        category: [],
        filter: [],
        limited: undefined,
        portal: 'ALL_PUBLIC',
        page: 1,
        limit: 12
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const queryFilters = { ...filters };
                if (filters.portal === 'ALL_PUBLIC') {
                    delete queryFilters.portal;
                }

                const data = await fetchAllProducts(queryFilters);

                let rawProducts = data.products || data;
                const filteredProducts = Array.isArray(rawProducts)
                    ? rawProducts.filter(p => p.portal === "PUBLIC" || p.portal === "PUBLIC BY INVESTED")
                    : [];

                setProducts(filteredProducts);

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

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    return (
        <>
            <Helmet>
                <title>Shop Natural Gemstones | Khaki Gemstone Collection</title>
                <meta name="description" content="Browse our exclusive collection of 100% natural gemstones. From rare sapphires to authentic emeralds, find the perfect stone for your collection or investment." />
                <meta name="keywords" content="gemstone shop, buy natural stones, emeralds for sale, sapphire collection, authentic gems" />
                <link rel="canonical" href="https://khakigemstone.com/shop" />
            </Helmet>
            
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
        </>
    );
}