import { useEffect, useState } from 'react';
import { Footer } from '../../components/common/Footer';
import { Card } from '../../components/public/Products/Card';
import { Categories } from '../../components/public/Products/Categories';
import { Filter } from '../../components/public/Products/Filter';
import { ProductsHeroPortion } from '../../components/public/Products/HeroPortion';
import { fetchAllProducts } from '../../services/productsService';

export function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        category: [], // For the sidebar checkboxes
        filter: [],   // For the horizontal gemstone pills
        limited: undefined 
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                // Pass the filters object to our flexible service
                const data = await fetchAllProducts(filters);
                setProducts(data);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };
        loadData();
    }, [filters]);

    return (
        <main className='font-[Satoshi]'>
            <ProductsHeroPortion />
            <Filter filters={filters} setFilters={setFilters} />
            <div className='flex'>
                <Categories filters={filters} setFilters={setFilters} />
                <Card products={products} />
            </div>
            <Footer />
        </main>
    );
}