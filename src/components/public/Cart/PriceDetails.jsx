import { useState } from "react";
import { CheckoutModal } from "../UI/CheckoutModal";

export function PriceDetails({ cartItems = [] }) {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const getItemPrice = (item) => item?.publicPrice ?? item?.price ?? 0;
    const subtotal = cartItems?.reduce((total, item) => total + getItemPrice(item), 0) || 0;
    const totalPrice = subtotal;

    return (
        <section className="w-full lg:sticky lg:top-60">
            <p className="text-[22px] font-medium mb-4 font-satoshi">Order Summary</p>
            <div className="w-full bg-white p-6 rounded-[24px] text-[18px] border border-[#ECEAEB] shadow-sm">
                <ul className="flex flex-col gap-4">
                    {cartItems?.map((item) => (
                        <li key={item?._id} className="flex justify-between font-satoshi text-[16px]">
                            <p className="font-normal text-[#737272] line-clamp-1 pr-4">
                                {item?.name || "Product"}
                            </p>
                            <p className="font-medium text-[#282930] shrink-0">
                                {getItemPrice(item).toLocaleString()}
                            </p>
                        </li>
                    ))}

                    <div className="h-[1px] w-full bg-[#ECEAEB] my-2" />

                    <li className="flex justify-between font-satoshi">
                        <p className="font-normal text-[#737272]">Subtotal</p>
                        <p className="font-medium text-[#282930]">{subtotal.toLocaleString()} PKR</p>
                    </li>

                    <li className="flex justify-between font-satoshi">
                        <p className="font-normal text-[#737272]">Delivery</p>
                        <p className="font-medium text-green-600 uppercase text-sm tracking-wide">Free</p>
                    </li>

                    <hr className="my-2 border-[#ECEAEB]" />

                    <li className="flex justify-between font-satoshi">
                        <p className="font-bold text-[#282930] text-xl">Total</p>
                        <p className="font-bold text-[#CA0A7F] text-xl">{totalPrice.toLocaleString()} PKR</p>
                    </li>
                </ul>
            </div>

            <button
                onClick={() => setIsCheckoutOpen(true)}
                disabled={!cartItems || cartItems.length === 0}
                className="w-full py-4 rounded-xl mt-6 bg-[#282930] text-[18px] font-bold text-white hover:bg-black transition-all font-satoshi disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Proceed to Checkout
            </button>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                items={cartItems}
                totalAmount={totalPrice}
                source="cart"
            />
        </section>
    );
}