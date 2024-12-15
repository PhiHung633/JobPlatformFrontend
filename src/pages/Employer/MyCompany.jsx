import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { addCompany, fetchUserById, getCompanyById, updateCompany, uploadImage } from '../../utils/ApiFunctions';

const MyCompany = () => {
  const [company, setCompany] = useState({
    name: '',
    location: '',
    images: '',
    description: '',
    website: '',
    industry: '',
    companySize: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCompanyData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Token không tồn tại');
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.user_id;

      const userResult = await fetchUserById(userId);
      if (!userResult || !userResult.data) {
        throw new Error('Không thể tải thông tin người dùng');
      }

      const companyId = userResult.data.companyId;
      if (!companyId) {
        throw new Error('Người dùng chưa liên kết với công ty');
      }

      const companyResult = await getCompanyById(companyId);
      if (!companyResult || !companyResult.data) {
        throw new Error('Không thể tải thông tin công ty');
      }

      setCompany(companyResult.data);
      setImagePreview(companyResult.data.images);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  useEffect(() => {
    loadCompanyData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      try {
        const result = await uploadImage(file);
        if (result.error) {
          throw new Error(result.error);
        }

        setCompany((prev) => ({
          ...prev,
          images: result.data,
        }));
        console.log("Upload ảnh thành công:", result.data);
      } catch (err) {
        setError(`Lỗi tải ảnh: ${err.message}`);
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Token không tồn tại');
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.user_id;

      const userResult = await fetchUserById(userId);
      if (!userResult || !userResult.data) {
        throw new Error('Không thể lấy thông tin người dùng');
      }

      const companyId = userResult.data.companyId;
      if (!companyId) {
        throw new Error('Người dùng chưa liên kết với công ty');
      }

      const result = await updateCompany(companyId, company);
      if (result.error) {
        throw new Error('Cập nhật công ty thất bại: ' + result.error);
      }

      console.log('Công ty đã được cập nhật thành công:', result.data);
      alert('Cập nhật công ty thành công!');
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="p-8 mt-5 bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Thông Tin Công Ty</h2>
      {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">

        <div className='flex justify-center'>
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => document.getElementById('hiddenFileInput').click()}
          >
            <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center shadow-md">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <span className="text-gray-400">Chọn ảnh</span>
              )}
            </div>
          </div>
          <input
            type="file"
            id="hiddenFileInput"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên Công Ty</label>
            <input
              type="text"
              name="name"
              value={company.name}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
            <input
              type="text"
              name="location"
              value={company.location}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea
            name="description"
            value={company.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input
            type="url"
            name="website"
            value={company.website}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngành nghề</label>
            <input
              type="text"
              name="industry"
              value={company.industry}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quy mô công ty</label>
            <input
              type="number"
              name="companySize"
              value={company.companySize}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white text-lg rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Cập Nhật Công Ty'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyCompany;
