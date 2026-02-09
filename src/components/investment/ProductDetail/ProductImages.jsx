import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProduct } from '../../../services/productsService';

const API_URL = import.meta.env.VITE_API_URL_IMG || "http://localhost:8080";

export function ProductImages() {
    const { id } = useParams();
    const [images, setImages] = useState([]);
    const [mainImage, setMainImage] = useState('');
    const [zoomPos, setZoomPos] = useState('0% 0%');
    const [showZoom, setShowZoom] = useState(false);

    useEffect(() => {
        const getProductImages = async () => {
            try {
                const data = await fetchProduct(id);
                if (data && data.imgs_src) {
                    setImages(data.imgs_src.map(img => `${API_URL}${img}`));
                    setMainImage(`${API_URL}${data.imgs_src[0]}`);

                }
            } catch (err) {
                console.error("Failed to load product images", err);
            }
        };
        getProductImages();
    }, [id]);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPos(`${x}% ${y}%`);
    };

    if (!mainImage) return <div className="w-full lg:w-[600px] aspect-square bg-gray-50 animate-pulse rounded-lg" />;

    return (
        <section className="flex flex-col gap-5 w-full lg:w-[600px]">
            {/* Main Display Image with Amazon-style Zoom */}
            <div
                className="relative overflow-hidden border border-gray-200 rounded-lg cursor-zoom-in group aspect-square bg-white"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
            >
                <img
                    src={mainImage}
                    alt="Selected Product"
                    className={`w-full h-full object-cover transition-opacity duration-300 ${showZoom ? 'opacity-0' : 'opacity-100'}`}
                />

                {/* Zoomed Background Layer */}
                {showZoom && (
                    <div
                        className="absolute inset-0 bg-no-repeat pointer-events-none"
                        style={{
                            backgroundImage: `url(${mainImage})`,
                            backgroundPosition: zoomPos,
                            backgroundSize: '250%'
                        }}
                    />
                )}
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((imagePath, index) => (
                    <button
                        key={index}
                        onClick={() => setMainImage(imagePath)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${mainImage === imagePath
                                ? 'border-[#c8107f] opacity-100'
                                : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                    >
                        <img
                            src={imagePath}
                            alt={`Thumbnail ${index}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>

            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </section>
    );
}
