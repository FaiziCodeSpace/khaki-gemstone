import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Footer } from "../../components/common/Footer";
import { ProductDetails } from "../../components/public/ProductDetail/ProductDetails";
import { ProductImages } from "../../components/public/ProductDetail/ProductImages";
import { fetchProduct } from "../../services/productsService";

const API_URL = import.meta.env.VITE_API_URL_IMG || "http://localhost:8080";

export function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const containerStyles = "px-6 md:px-8 lg:px-14 lgx:px-22 pt-36 md:pt-42";
  const flexStyles = "flex flex-col lg:flex-row gap-8 lg:gap-12 lgx:gap-15";

  useEffect(() => {
    const getProductData = async () => {
      try {
        setLoading(true);
        const data = await fetchProduct(id);
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };
    getProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-[#CA0A7F]" size={48} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-40">
        <h2 className="text-2xl font-bold">Product not found.</h2>
      </div>
    );
  }

  // Define main image for SEO
  const seoImage = product.imgs_src?.[0] ? `${API_URL}${product.imgs_src[0]}` : "";
  const shareUrl = `https://khakigemstone.com/product/${id}`;
  const displayPrice = product.publicPrice?.toLocaleString() ?? "Contact for price";

  return (
    <>
      <Helmet>
        <title>{`${product.name} | Khaki Gemstone`}</title>
        <meta name="description" content={product.description || `Buy ${product.name} at Khaki Gemstone.`} />
        <link rel="canonical" href={shareUrl} />

        {/* --- Open Graph / Facebook / WhatsApp --- */}
        <meta property="og:type" content="product" />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:title" content={`${product.name} | Natural Gemstone`} />
        <meta property="og:description" content={`Price: ${displayPrice} PKR. ${product.description?.substring(0, 150)}...`} />
        <meta property="og:image" content={seoImage} />
        <meta property="og:image:secure_url" content={seoImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Khaki Gemstone" />

        {/* --- Twitter --- */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:description" content={product.description} />
        <meta name="twitter:image" content={seoImage} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": seoImage,
            "description": product.description,
            "brand": { "@type": "Brand", "name": "Khaki Gemstone" },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "PKR",
              "price": product.publicPrice,
              "availability": "https://schema.org/InStock",
              "url": shareUrl,

              "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingDestination": {
                  "@type": "DefinedRegion",
                  "addressCountry": "PK"
                }
              },

              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "merchantReturnDays": 7
              }
            },
            "additionalProperty": [
              {
                "@type": "PropertyValue",
                "name": "Origin",
                "value": product.more_information?.origin
              },
              {
                "@type": "PropertyValue",
                "name": "Weight",
                "value": product.more_information?.weight
              },
              {
                "@type": "PropertyValue",
                "name": "Clarity",
                "value": product.details?.clarity
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="font-satoshi min-h-screen flex flex-col">
        <main className={`${containerStyles} ${flexStyles} flex-grow`}>
          <ProductImages product={product} />
          <ProductDetails product={product} />
        </main>
        <Footer />
      </div>
    </>
  );
}