import { Truck, X } from 'lucide-react';

export function CartItems({ cartItems }) {
    return (<>
        <section className='w-full'>
            <p className='ml-2 mb-4.5'>1/{cartItems.length}Gems selected</p>
            <div className='flex flex-col gap-5'>
                {cartItems.map((item) => (
                    <div className='flex relative gap-5 w-full bg-white border-1 border-[#ECEAEB] px-2.5 py-3 rounded-[31px]'>
                        <div className='w-[126px] h-[105px] overflow-hidden rounded-3xl'>
                            <img src={item.img} alt="Item Image" />
                        </div>
                        <div className='flex flex-col justify-between py-1'>
                            <div>
                                <h2 className='text-[18px] font-medium'>{item.name}</h2>
                                <p className='flex gap-1 text-[12px] text-[#8F8F8F]'><img src="./Icons/truck.svg" alt="truck-icon" />Express Delivery in 2 Days</p>
                            </div>
                            <p className='font-medium text-[18px]'>{item.price.toLocaleString()} PKR</p>
                        </div>
                        <div className='absolute top-4 right-4 z-30 button'>
                            <X className='w-4 h-4'/>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    </>);
}