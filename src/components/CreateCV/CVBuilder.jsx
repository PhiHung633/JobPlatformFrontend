import { useState, useEffect } from 'react';
import Sidebar from './Sidebar/Sidebar';
import InputField from './InputField/InputField';
import { useNavigate } from 'react-router-dom';
import { uploadImage } from '../../utils/ApiFunctions';

const CVBuilder = () => {
    const navigate = useNavigate();

    const [selectedImage, setSelectedImage] = useState(null);
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

    useEffect(() => {
        const storedData = localStorage.getItem('cvFormData');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                setFormData(parsedData.formData);
                setSelectedImage(parsedData.selectedImage);
            } catch (error) {
                console.error('Error parsing localStorage data:', error);
            }
        }

        const selectedData = JSON.parse(localStorage.getItem('selectedCvData'));
        if (selectedData) {
            const fullName = selectedData.fullName || '';
            const nameParts = fullName.split(' ');

            const surname = nameParts[0];
            const firstName = nameParts.slice(1).join(' ');

            setFormData((prevData) => ({
                ...prevData,
                email: selectedData.email || prevData.email,
                phone: selectedData.phone || prevData.phone,
                city: selectedData.address?.split(',')[0] || prevData.city,
                profession: selectedData.jobPosition || prevData.profession,
                surname,
                firstName,
            }));
        }
        if (selectedData?.imageCV) {
            setSelectedImage(selectedData.imageCV);
        }
    }, []);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const uploadedImageUrl = await uploadImage(file);
                console.log('Uploaded Image URL:', uploadedImageUrl.data);

                setSelectedImage(uploadedImageUrl.data);
            } catch (error) {
                console.error('Upload image failed: ', error);
            }
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
        const requiredFields = ['firstName', 'surname', 'city', 'phone', 'email'];
        for (let field of requiredFields) {
            if (!formData[field]) {
                alert(
                    `Vui lòng nhập đầy đủ thông tin ${field === 'firstName'
                        ? 'Tên'
                        : field === 'surname'
                            ? 'Họ'
                            : field === 'city'
                                ? 'Thành phố'
                                : field === 'phone'
                                    ? 'Số điện thoại'
                                    : 'Email'
                    }.`
                );
                return;
            }
        }

        localStorage.setItem(
            'cvFormData',
            JSON.stringify({ formData, selectedImage })
        );
        navigate('/education/list');
    };
    console.log("FORMDATA",formData)
    return (
        <div className="flex min-h-screen">
            <Sidebar currentStep={1} />

            <main className="flex-1 p-10">
                <h2 className="text-3xl font-semibold mb-2">
                    Cách tốt nhất để nhà tuyển dụng liên hệ với bạn là gì?
                </h2>
                <p className="text-gray-600 mb-6">
                    Chúng tôi đề xuất bạn nên cung cấp email và số điện thoại.
                </p>

                <div className="flex mb-8">
                    <div className="w-1/4">
                        <div className="w-48 h-48 mb-5 overflow-hidden bg-gray-200 rounded-full flex items-center justify-center">
                            {!selectedImage ? (
                                <span className="text-gray-500">Ảnh Placeholder</span>
                            ) : (
                                <img
                                    src={selectedImage}
                                    alt="Uploaded"
                                    className="w-48 h-48 rounded-full object-cover"
                                />
                            )}
                        </div>

                        <input
                            type="file"
                            id="upload-photo"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <label
                            htmlFor="upload-photo"
                            className="border border-gray-400 text-gray-600 mt-4 py-2 px-12 rounded-xl cursor-pointer inline-block text-center ml-3"
                        >
                            Tải ảnh lên
                        </label>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-6">
                        <InputField
                            label="Tên"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                        />
                        <InputField
                            label="Họ"
                            name="surname"
                            value={formData.surname}
                            onChange={handleInputChange}
                            required
                        />
                        <InputField
                            label="Nghề nghiệp (Tùy chọn)"
                            name="profession"
                            value={formData.profession}
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Thành phố/Địa phương"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                        />
                        <InputField
                            label="Số điện thoại"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                        <InputField
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
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
