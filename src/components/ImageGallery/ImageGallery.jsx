import { useState } from "react";
import ImageSlider from "../ImageSlider/ImageSlider";

const images = [
    { src: 'empty.webp', alt: 'Image 1' },
    { src: 'logo-cong-ty-dat-xanh-mien-nam.jpg', alt: 'Image 2' },
    { src: 'register.webp', alt: 'Image 3' },
    { src: 'register.webp', alt: 'Image 4' },
    { src: 'register.webp', alt: 'Image 5' }
];

const ImageGallery = () => {
    const displayCount = 2;
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const openModal = (index) => {
        setCurrentSlide(index); // Set initial slide to the clicked image
        setModalOpen(true);
    };
    const closeModal = () => setModalOpen(false);

    return (
        <div>
            <div className="flex gap-4">
                {images.slice(0, displayCount).map((image, index) => (
                    <img key={index} src={image.src} alt={image.alt} className="w-1/3 rounded-lg" onClick={() => openModal(index)} />
                ))}

                {images.length > displayCount && (
                    <div onClick={() => openModal(displayCount)} className="relative w-1/3 rounded-lg overflow-hidden cursor-pointer">
                        <img
                            src={images[displayCount].src}
                            alt={images[displayCount].alt}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold">
                            +{images.length - displayCount}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal with Image Slider */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg max-w-3xl w-full mx-4 relative">
                        {/* Close Button Positioned Outside the Image */}
                        <button
                            onClick={closeModal}
                            className="absolute -top-6 -right-3 text-white bg-red-500 px-4 py-3 rounded-full focus:outline-none z-50"
                        >
                            X
                        </button>

                        {/* Use ImageSlider in the Modal */}
                        <ImageSlider images={images} initialSlide={currentSlide} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
