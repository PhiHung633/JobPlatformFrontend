import { useState, useEffect } from 'react';
import Sidebar from './Sidebar/Sidebar';
import InputField from './InputField/InputField';
import { useNavigate } from 'react-router-dom';
import ImageUploader from './ImageUploader/ImageUploader';

const CVBuilder = () => {
    const navigate = useNavigate();

    const [selectedImage, setSelectedImage] = useState(null);
    const [isCropped, setIsCropped] = useState(false);  // Trạng thái để hiển thị các nút Lưu/Hủy
    const [formData, setFormData] = useState({
        firstName: '',
        surname: '',
        profession: '',
        city: '',
        country: '',
        postalCode: '',
        phone: '',
        email: '',
    });

    // Tải dữ liệu từ localStorage khi component được mount
    useEffect(() => {
        const storedData = localStorage.getItem('cvFormData');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setFormData(parsedData.formData);
            setSelectedImage(parsedData.selectedImage); // Lấy ảnh từ localStorage
        }
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Image = reader.result;
                setSelectedImage(base64Image);
                setIsCropped(false);  // Đặt lại trạng thái isCropped khi tải ảnh mới
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleNext = () => {
        // Lưu formData và selectedImage vào localStorage
        localStorage.setItem('cvFormData', JSON.stringify({ formData, selectedImage }));
        navigate('/education');
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar currentStep={1} />

            {/* Nội dung chính */}
            <main className="flex-1 p-10">
                <h2 className="text-3xl font-semibold mb-2">Cách tốt nhất để nhà tuyển dụng liên hệ với bạn là gì?</h2>
                <p className="text-gray-600 mb-6">Chúng tôi đề xuất bạn nên cung cấp email và số điện thoại.</p>

                <div className="flex mb-8">
                    <div className="w-1/4">
                        {/* Placeholder cho Tải ảnh */}
                        {!selectedImage && (
                            <div className="w-48 h-48 mb-5 overflow-hidden bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-500">Ảnh Placeholder</span>
                            </div>
                        )}

                        {selectedImage && (
                            <ImageUploader
                                selectedImage={selectedImage}
                                setSelectedImage={setSelectedImage}
                                setIsCropped={setIsCropped} // Truyền hàm setIsCropped
                            />
                        )}

                        {/* Input ẩn để chọn file ảnh */}
                        <input
                            type="file"
                            id="upload-photo"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <label
                            htmlFor="upload-photo"
                            className="border border-gray-400 text-gray-600 mt-4 py-2 px-12 rounded-xl cursor-pointer inline-block text-center ml-5"
                        >
                            Tải ảnh lên
                        </label>
                    </div>

                    {/* Form thông tin liên hệ */}
                    <div className="flex-1 grid grid-cols-2 gap-6">
                        <InputField label="Tên" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                        <InputField label="Họ" name="surname" value={formData.surname} onChange={handleInputChange} required />
                        <InputField label="Nghề nghiệp (Tùy chọn)" name="profession" value={formData.profession} onChange={handleInputChange} />
                        <InputField label="Thành phố/Địa phương" name="city" value={formData.city} onChange={handleInputChange} required />
                        {/* <InputField label="Quốc gia" name="country" value={formData.country} onChange={handleInputChange} required />
                        <InputField label="Mã bưu điện" name="postalCode" placeholder="Ví dụ: 6000" value={formData.postalCode} onChange={handleInputChange} /> */}
                        <InputField label="Số điện thoại" name="phone" value={formData.phone} onChange={handleInputChange} required />
                        <InputField label="Email" name="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        className="bg-yellow-400 text-white py-2 px-8 rounded"
                        onClick={handleNext}
                    >
                        Tiếp theo: Học vấn
                    </button>
                </div>
            </main>
        </div>
    );
};

export default CVBuilder;
