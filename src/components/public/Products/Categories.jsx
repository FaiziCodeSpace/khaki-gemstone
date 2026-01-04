import { useState } from 'react';

const CategoriesData = [
    { id: 1, CategoryName: 'Rough Stones' },
    { id: 2, CategoryName: 'Cut Stones' },
    { id: 3, CategoryName: 'Jewelry' },
    { id: 4, CategoryName: 'Pearls' },
    { id: 5, CategoryName: 'Rings' },
    { id: 6, CategoryName: 'Necklaces' },
    { id: 7, CategoryName: 'Braclets' }
];

const DiscountData = [
    { id: 1, DiscountName: '50%' },
    { id: 2, DiscountName: '40%' },
    { id: 3, DiscountName: '30%' },
    { id: 4, DiscountName: '20%' },
];

export function Categories() {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedDiscounts, setSelectedDiscounts] = useState([]);
    const [otherFilters, setOtherFilters] = useState({ liked: false, newArrival: false });
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = (id, setState) => {
        setState(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const handleOtherToggle = (field) => {
        setOtherFilters(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                className="md:hidden fixed bottom-6 right-6 z-50 bg-black text-white px-6 py-3 rounded-full shadow-xl font-medium"
            >
                {isOpen ? 'Close' : 'Filter Products'}
            </button>

            <aside className={`
                fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0 md:flex md:flex-col md:w-64 md:h-auto 
                md:bg-[#F5F5F5] md:border-r md:border-gray-200
                overflow-y-auto p-8 md:p-10
            `}>
                
                <nav aria-label="Product Filters">
                    <section className='mb-12'>
                        <h2 className='text-xl font-bold mb-6 text-gray-900'>Categories</h2>
                        <div className='flex flex-col gap-4'>
                            {CategoriesData.map((category) => (
                                <div className='flex gap-3 items-center' key={category.id}>
                                    <input
                                        type="checkbox"
                                        id={`cat-${category.id}`} 
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={() => handleToggle(category.id, setSelectedCategories)}
                                        className='accent-black cursor-pointer w-5 h-5 md:w-4 md:h-4'
                                    />
                                    <label 
                                        className={`${selectedCategories.includes(category.id) ? 'font-bold' : 'font-normal'} text-lg cursor-pointer`} 
                                        htmlFor={`cat-${category.id}`}
                                    >
                                        {category.CategoryName}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className='mb-12'> 
                        <h2 className='text-xl font-bold mb-6 text-gray-900'>Discount</h2>
                        <div className='flex flex-col gap-4'>
                            {DiscountData.map((discount) => (
                                <div className='flex gap-3 items-center' key={discount.id}>
                                    <input
                                        type="checkbox"
                                        id={`disc-${discount.id}`} 
                                        checked={selectedDiscounts.includes(discount.id)}
                                        onChange={() => handleToggle(discount.id, setSelectedDiscounts)} 
                                        className='accent-black cursor-pointer w-5 h-5 md:w-4 md:h-4'
                                    />
                                    <label 
                                        className={`${selectedDiscounts.includes(discount.id) ? 'font-bold' : 'font-normal'} text-lg cursor-pointer`} 
                                        htmlFor={`disc-${discount.id}`}
                                    >
                                        {discount.DiscountName} Off
                                    </label>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className='mb-8'> 
                        <h2 className='text-xl font-bold mb-6 text-gray-900'>Availability</h2>
                        <div className='flex flex-col gap-4'>
                            <div className='flex gap-3 items-center'>
                                <input
                                    type="checkbox"
                                    id="liked" 
                                    checked={otherFilters.liked}
                                    onChange={() => handleOtherToggle('liked')} 
                                    className='accent-black cursor-pointer w-5 h-5'
                                />
                                <label className={`${otherFilters.liked ? 'font-bold' : 'font-normal'} text-lg cursor-pointer`} htmlFor="liked">
                                    Saved Items
                                </label>
                            </div>

                            <div className='flex gap-3 items-center'>
                                <input
                                    type="checkbox"
                                    id="new-arrival" 
                                    checked={otherFilters.newArrival}
                                    onChange={() => handleOtherToggle('newArrival')} 
                                    className='accent-black cursor-pointer w-5 h-5'
                                />
                                <label className={`${otherFilters.newArrival ? 'font-bold' : 'font-normal'} text-lg cursor-pointer`} htmlFor="new-arrival">
                                    New Arrivals
                                </label>
                            </div>
                        </div>
                    </section>
                </nav>

                <button 
                    onClick={() => setIsOpen(false)}
                    className="md:hidden w-full bg-black text-white py-4 rounded-xl font-bold mt-8"
                >
                    View Results
                </button>
            </aside>
        </>
    );
}