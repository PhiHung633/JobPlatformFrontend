import { useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './cropImageHelper';

const ImageUploader = ({ selectedImage, setSelectedImage, setIsCropped }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCrop = async () => {
        try {
            console.log("VAOROI")
            const croppedImg = await getCroppedImg(selectedImage, croppedAreaPixels);
            setCroppedImage(croppedImg); // Lưu ảnh đã crop
            setIsCropped(true); // Báo hiệu rằng đã crop xong
        } catch (e) {
            console.error(e);
        }
    };

    const handleCancel = () => {
        setSelectedImage(null); // Hủy chọn ảnh
        setCroppedImage(null); // Xóa ảnh đã crop
        setIsCropped(false); // Reset trạng thái
    };

    return (
        <div className="relative flex flex-col items-center">
            {croppedImage ? (
                // Hiển thị ảnh đã được crop
                <img
                    src={croppedImage}
                    alt="Cropped"
                    className="w-48 h-48 rounded-full object-cover"
                />
            ) : (
                // Hiển thị Cropper nếu chưa crop
                <div
                    className="relative w-48 h-48 mb-5 overflow-hidden bg-gray-200 rounded-full flex items-center justify-center border mr-12"
                    style={{ marginLeft: '-10px' }}
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
            )}

            {!croppedImage && (
                <div className="flex gap-4 mt-2 mr-12">
                    <button onClick={handleCrop} className="bg-green-500 text-white px-4 py-2 rounded">
                        Save
                    </button>
                    <button onClick={handleCancel} className="bg-red-500 text-white px-4 py-2 rounded">
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
