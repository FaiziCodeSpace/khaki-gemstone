import { Footer } from '../../components/layout/Footer';
import { Card } from '../../components/public/Products/Card';
import { Categories } from '../../components/public/Products/Categories';
import { Filter } from '../../components/public/Products/Filter';
import { ProductsHeroPortion } from '../../components/public/Products/HeroPortion';

export function ProductsPage() {
    return (<>
        <ProductsHeroPortion />
        <Filter />
        <div className='flex'>
            <Categories />
            <Card />
        </div>
        <Footer />

    </>
    )
}
