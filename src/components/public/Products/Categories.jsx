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
    const [selectedId, setSelectedId] = useState(1);
    const [selectedDiscountId, setSelectedDiscountId] = useState(null);

    const handleCheck = (id) => {
        setSelectedId(prevId => prevId === id ? null : id);
    };

    const handleDiscountCheck = (id) => {
        setSelectedDiscountId(prevId => prevId === id ? null : id);
    };

    return (
        <section className='flex flex-col flex-1 pl-12 pb-10 border-r border-gray-300'>
            {/* Category Section */}
            <div>
                <h2 className='text-[22px] font-bold mb-4'>Categories</h2>
                <div className='flex flex-col gap-4'>
                    {CategoriesData.map((category) => (
                        <div className='flex gap-3 items-center' key={category.id}>
                            <input
                                type="checkbox"
                                // Prefixing the ID to prevent collisions
                                id={`cat-${category.id}`} 
                                checked={selectedId === category.id}
                                onChange={() => handleCheck(category.id)}
                                className='accent-[#272727] cursor-pointer w-4 h-4'
                            />
                            <label 
                                className={`${selectedId === category.id ? 'font-bold' : 'font-normal'} text-[18px] cursor-pointer`} 
                                htmlFor={`cat-${category.id}`}
                            >
                                {category.CategoryName}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Discount Section */}
            <div className='mt-8'> {/* Increased margin for better spacing */}
                <h2 className='text-[22px] font-bold mb-4'>Discount</h2>
                <div className='flex flex-col gap-4'>
                    {DiscountData.map((discount) => (
                        <div className='flex gap-3 items-center' key={discount.id}>
                            <input
                                type="checkbox"
                                // Prefixing the ID to prevent collisions
                                id={`disc-${discount.id}`} 
                                checked={selectedDiscountId === discount.id}
                                // Updated to use your toggle function
                                onChange={() => handleDiscountCheck(discount.id)} 
                                className='accent-[#272727] cursor-pointer w-4 h-4'
                            />
                            <label 
                                className={`${selectedDiscountId === discount.id ? 'font-bold' : 'font-normal'} text-[18px] cursor-pointer`} 
                                htmlFor={`disc-${discount.id}`}
                            >
                                {discount.DiscountName}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}