export function PriceDetails({ selectedItems }) {
    const delivery = selectedItems.length > 0 ? 250 : 0; // Only charge delivery if items exist
    const subtotal = selectedItems.reduce((total, item) => total + item.price, 0);
    const totalPrice = subtotal + delivery;

    return (
        <section className="w-full">
            <p className="text-[22px] font-medium mb-2">Price Details</p>
            <div className="w-full bg-white p-5 rounded-[12px] text-[18px]">
                <p className="mb-4 font-medium">{selectedItems.length} Item(s) selected</p>
                <ul className="flex flex-col gap-3">
                    {selectedItems.map((item) => (
                        <li key={item._id} className="flex justify-between">
                            <p className="font-normal text-[#737272]">{item.name}</p>
                            <p className="font-medium">{item.price.toLocaleString()} PKR</p>
                        </li>
                    ))}
                    <li className="flex justify-between">
                        <p className="font-normal text-[#737272]">Delivery Charges</p>
                        <p className="font-medium">{delivery.toLocaleString()} PKR</p>
                    </li>
                    <hr className="my-4 border-[#ECEAEB]" />
                    <li className="flex justify-between">
                        <p className="font-normal text-[#737272]">Total</p>
                        <p className="font-bold text-[#CA0A7F]">{totalPrice.toLocaleString()} PKR</p>
                    </li>
                </ul>
            </div>
            <button className="w-full py-3 rounded-md mt-9 bg-black text-[18px] font-medium text-white">Place Order</button>
        </section>
    );
}