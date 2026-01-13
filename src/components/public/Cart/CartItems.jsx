import { Truck, X } from "lucide-react";

export function CartItems({ cartItems, selectedIds, onToggle, onRemove }) {
  // Count how many gems are currently selected
  const cardCount = Object.values(selectedIds).filter(Boolean).length;

  if (cartItems.length === 0) {
    return (
      <section className="w-full py-20 text-center">
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
      </section>
    );
  }

  return (
    <section className="w-full">
      <p className="ml-5 mb-4.5 font-medium">
        {cardCount}/{cartItems.length} Gems selected
      </p>

      <div className="flex flex-col gap-5">
        {cartItems.map((item) => (
          <div
            key={item._id}
            onClick={() => onToggle(item._id)}
            className={`flex relative gap-5 w-full bg-white p-3 rounded-[31px] cursor-pointer transition-all
            ${selectedIds[item._id]
              ? "border border-[#CA0A7F]"
              : "border border-[#ECEAEB]"}`}
          >
            {/* Image */}
            <div className="w-[105px] h-[105px] md:w-[126px] overflow-hidden rounded-3xl shrink-0">
              <img
                src={item.primary_imgSrc}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between py-1">
              <div>
                <h2 className="text-[18px] font-medium">{item.name}</h2>
                <p className="flex items-center gap-1 text-[12px] text-[#8F8F8F]">
                  <Truck className="w-3 h-3" />
                  Express Delivery in 2 Days
                </p>
              </div>
              <p className="font-medium text-[18px]">
                {item.price?.toLocaleString()} PKR
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevents toggling selection when clicking delete
                onRemove(item._id);
              }}
              className="absolute top-4 right-4 z-30 p-2 hover:bg-red-50 rounded-full transition-colors group"
              aria-label="Remove item"
            >
              <X className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}