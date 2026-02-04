import { Truck, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL_IMG || "http://localhost:8080";

export function CartItems({ cartItems, onRemove }) {
  if (cartItems.length === 0) {
    return (
      <section className="w-full py-10 font-satoshi">
        <p className="text-gray-500 text-lg">Your cart is currently empty.</p>
      </section>
    );
  }

  return (
    <section className="w-full font-satoshi">
      <div className="flex flex-col gap-5">
        {cartItems.map((item) => {
          const displayPrice = item.publicPrice ?? item.price ?? 0;

          return (
            <div
              key={item._id}
              className="flex relative gap-5 w-full bg-white p-4 rounded-[31px] border border-[#ECEAEB] shadow-sm"
            >
              {/* Image */}
              <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] overflow-hidden rounded-2xl shrink-0">
                <img
                  src={`${API_URL}${item.imgs_src?.[0]}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col justify-between py-1 flex-1">
                <div>
                  <h2 className="text-[18px] font-medium text-[#282930]">{item.name}</h2>
                  <p className="flex items-center gap-1 text-[12px] text-[#8F8F8F] mt-1">
                    <Truck className="w-3 h-3" />
                    Express Delivery in 2 Days
                  </p>
                </div>
                <p className="font-bold text-[20px] text-[#282930]">
                  {displayPrice.toLocaleString()} PKR
                </p>
              </div>

              {/* Remove Action */}
              <button
                onClick={() => onRemove(item._id)}
                className="absolute top-4 right-4 p-2 hover:bg-red-50 rounded-full transition-colors group"
                aria-label="Remove item"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}