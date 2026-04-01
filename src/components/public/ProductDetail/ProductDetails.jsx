import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Share2, ShoppingCart, Check } from 'lucide-react';
import { addToCart, fetchCart } from '../../../services/cartService';
import { getGuestCart, addToGuestCart } from '../../../utils/guestCart';
import { CheckoutModal } from '../UI/CheckoutModal';
import certificateBg from "../../../assets/images/certificate-bg.jpeg";

const API_URL = import.meta.env.VITE_API_URL_IMG || "http://localhost:8080";

export function ProductDetails({ product }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('description');
  const [isInCart, setIsInCart] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    if (!product?._id) return;

    const checkCartStatus = async () => {
      const token = localStorage.getItem("token");
      let currentCartIds = [];
      try {
        if (!token) {
          currentCartIds = (getGuestCart() ?? []).map(item => item._id);
        } else {
          const dbItems = await fetchCart();
          const items = Array.isArray(dbItems) ? dbItems : dbItems?.items || [];
          currentCartIds = items.map(item => item._id);
        }
        setIsInCart(currentCartIds.includes(product._id));
      } catch (err) {
        console.error("Cart check failed", err);
      }
    };
    checkCartStatus();
  }, [product?._id]);

  const handleAddToCartAction = async () => {
    if (!product) return;
    if (isInCart) return navigate('/cart');
    const token = localStorage.getItem("token");
    try {
      if (!token) addToGuestCart(product);
      else await addToCart(product._id);
      setIsInCart(true);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  };

  if (!product) return null;

  // Safely derive booleans for conditional rendering
  const hasProductNumber   = !!product.productNumber;
  const hasName            = !!product.name;
  const hasDescription     = !!product.description;
  const hasGemSize         = !!product.gem_size;
  const hasDetails         = product.details && Object.keys(product.details).length > 0;
  const hasMoreInfo        = product.more_information && Object.keys(product.more_information).length > 0;
  const hasLabTestImg      = !!product.lab_test_img_src;
  const hasCertificateImg  = !!product.certificate_img_src;
  const hasPrice           = product.publicPrice != null;

  // Only show certificate tab if at least one image exists
  const tabs = [
    'description',
    ...(hasLabTestImg || hasCertificateImg ? ['certificate'] : []),
  ];

  return (
    <section className="flex flex-col w-full lg:max-w-[580px] px-4 md:px-0 mx-auto mb-8 lg:mb-15">
      <div className="mb-8 md:mb-12">
        {hasProductNumber && (
          <p className="text-xs md:text-[18px] font-mono text-gray-500 tracking-widest uppercase">
            {product.productNumber}
          </p>
        )}

        {hasName && (
          <h1 className="text-[42px] lg:text-[clamp(42px,5vw,72px)] leading-tight font-bold text-gray-900 mt-3">
            {product.name}
          </h1>
        )}

        {hasDescription && (
          <p className="text-gray-600 text-sm md:text-[18px] mt-4">
            {product.description}
          </p>
        )}
      </div>

      {/* Only render tab bar if there are tabs to show */}
      {tabs.length > 1 && (
        <div className="flex bg-white px-8 py-4 justify-around rounded-full border border-gray-100 mb-6 overflow-x-auto gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap transition-colors text-sm lg:text-4.5 capitalize tracking-wider ${
                activeTab === tab
                  ? 'text-[#CA0A7F] font-bold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      <div className="min-h-[200px] mb-8">
        {activeTab === 'description' && (
          <div className="animate-fadeIn flex flex-col gap-6 mt-4 md:mt-8">
            {hasGemSize && (
              <div>
                <h2 className="list-heading text-lg font-bold">Gem Size</h2>
                <ul className="list-styling">
                  <li>{product.gem_size}</li>
                </ul>
              </div>
            )}

            {hasDetails && (() => {
              const validDetails = Object.entries(product.details).filter(
                ([, val]) => val !== null && val !== undefined && val !== ''
              );
              return validDetails.length > 0 ? (
                <div>
                  <h2 className="list-heading text-lg font-bold">Details</h2>
                  <ul className="list-styling">
                    {validDetails.map(([key, val]) => (
                      <li key={key}>
                        <span className="font-medium capitalize">
                          {key.replace('_', ' ')}:
                        </span>{' '}
                        {val}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null;
            })()}

            {hasMoreInfo && (() => {
              // Filter out entries with no meaningful value before rendering
              const validEntries = Object.entries(product.more_information).filter(
                ([, val]) => val !== null && val !== undefined && val !== ''
              );
              return validEntries.length > 0 ? (
                <div>
                  <h2 className="list-heading text-lg font-bold">More Information</h2>
                  <div className="flex flex-wrap items-center gap-x-3 md:gap-x-4 gap-y-2 text-gray-600">
                    {validEntries.map(([key, val], index) => (
                      <div key={key} className="flex items-center gap-3 md:gap-4">
                        <p className="text-xs md:text-[18px]">
                          <span className="font-medium text-gray-900 capitalize">
                            {key.replace('_', ' ')}:
                          </span>{' '}
                          {val}
                        </p>
                        {index !== validEntries.length - 1 && (
                          <span className="text-gray-300 hidden sm:block">|</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            {/* Fallback when description tab has no content at all */}
            {!hasGemSize && !hasDetails && !hasMoreInfo && (
              <p className="text-gray-400 text-sm italic">No additional details available.</p>
            )}
          </div>
        )}

        {activeTab === 'certificate' && (
          <div className="animate-fadeIn flex flex-col gap-4">
            {hasLabTestImg && (
              <img
                src={`${API_URL}${product.lab_test_img_src}`}
                alt="Laboratory Test"
                className="rounded-lg w-full h-auto md:h-[320px] object-cover border border-gray-200"
              />
            )}
            {hasCertificateImg ? (
              <img
                src={`${API_URL}${product.certificate_img_src}`}
                alt="Certificate"
                className="rounded-lg w-full h-auto md:h-[320px] object-cover border border-gray-200"
              />
            ) : (
              <img src={certificateBg} alt="certificate-background" />
            )}
          </div>
        )}
      </div>

      <div className="w-full flex flex-col bg-white p-4 md:p-6 rounded-3xl gap-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="w-full md:w-auto">
            {hasPrice && (
              <>
                <p className="text-[#111111B2] text-sm">Price</p>
                <p className="font-normal text-3xl md:text-[40px]">
                  {product.publicPrice.toLocaleString()} PKR
                </p>
              </>
            )}
          </div>
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="flex w-full md:flex-1 h-12 md:h-[64px] justify-center items-center bg-black text-white rounded-full hover:bg-gray-800 transition-all active:scale-95"
          >
            Shop Now <ArrowRight className="w-5 h-5 ml-2.5" />
          </button>
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            items={[product]}
            totalAmount={product?.publicPrice ?? 0}
            source="product"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAddToCartAction}
            className={`flex items-center justify-center w-full py-3 border-2 rounded-full transition-all gap-1.5 ${
              isInCart
                ? 'bg-[#CA0A7F] text-white border-[#CA0A7F]'
                : 'bg-[#FAFAFA] border-[#1111111A] hover:bg-gray-100'
            }`}
          >
            {isInCart ? (
              <><Check className="w-4 h-4" /> In Cart</>
            ) : (
              <><ShoppingCart className="w-4 h-4" /> Add To Cart</>
            )}
          </button>

          {/* Only show Share if the Web Share API is available */}
          {typeof navigator !== 'undefined' && !!navigator.share && (
            <button
              onClick={() =>
                navigator.share({ title: product?.name, url: window.location.href })
              }
              className="flex items-center justify-center w-full py-3 border-2 border-[#1111111A] rounded-full bg-[#FAFAFA] gap-1.5 hover:bg-gray-100"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          )}
        </div>
      </div>
    </section>
  );
}