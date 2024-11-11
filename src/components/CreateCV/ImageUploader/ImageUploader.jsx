import { useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './cropImageHelper';

const ImageUploader = ({ selectedImage, setSelectedImage, setIsCropped }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCroppedInternal, setIsCroppedInternal] = useState(false);  // Local state for crop status

    useEffect(() => {
        // Reset internal crop status when a new image is selected
        setIsCroppedInternal(false);
    }, [selectedImage]);

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCrop = async () => {
        try {
            if (!isCroppedInternal) {
                const croppedImage = await getCroppedImg(selectedImage, croppedAreaPixels);
                setSelectedImage(croppedImage);
                setIsCropped(true);  // Update parent state to hide buttons
                setIsCroppedInternal(true);  // Update internal state to hide buttons
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="relative flex flex-col items-center">
            <div
                className="relative w-48 h-48 mb-5 overflow-hidden bg-gray-200 rounded-full flex items-center justify-center border mr-12"
                style={{ marginLeft: '-10px' }} // Adjust image when cropping
            >
                <Cropper
                    image={selectedImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>

            {/* Render Save and Cancel buttons only if image is not cropped */}
            {!isCroppedInternal && (
                <div className="flex gap-4 mt-2 mr-12">
                    <button onClick={handleCrop} className="bg-green-500 text-white px-4 py-2 rounded">
                        Save
                    </button>
                    <button onClick={() => setSelectedImage(null)} className="bg-red-500 text-white px-4 py-2 rounded">
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
