import { useState } from 'react';

const Images = [
    { id: 1, src: "./Images/Showcase1.png", active: true },
    { id: 2, src: "./Images/Showcase2.png", active: true },
    { id: 3, src: "./Images/Showcase3.png", active: true },
    { id: 4, src: "./Images/Showcase4.png", active: true },
    { id: 5, src: "./Images/Showcase5.png", active: true },
];

export function ProductImages() {
    const [mainImage, setMainImage] = useState(Images[0].src);
    const [zoomPos, setZoomPos] = useState('0% 0%');
    const [showZoom, setShowZoom] = useState(false);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomPos(`${x}% ${y}%`);
    };

    return (
        <section className="flex flex-col gap-5 w-[600px]">
            {/* Main Display Image with Amazon-style Zoom */}
            <div 
                className="relative overflow-hidden border border-gray-200 rounded-lg cursor-zoom-in group"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
            >
                <img 
                    src={mainImage} 
                    alt="Selected Product" 
                    className="w-full h-auto transition-opacity duration-300 group-hover:opacity-0" 
                />
                
                {/* Zoomed Background Layer */}
                {showZoom && (
                    <div 
                        className="absolute inset-0 bg-no-repeat pointer-events-none"
                        style={{
                            backgroundImage: `url(${mainImage})`,
                            backgroundPosition: zoomPos,
                            backgroundSize: '200%' // 2x Zoom level
                        }}
                    />
                )}
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {Images.map((image) => (
                    <button
                        key={image.id}
                        onClick={() => setMainImage(image.src)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                            mainImage === image.src 
                            ? 'border-[#c8107f] opacity-100' 
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                    >
                        <img
                            src={image.src}
                            alt={`Thumbnail ${image.id}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </section>
    );
}