import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { addCompany, getCompanyById } from '../../utils/ApiFunctions';

const AddCompany = () => {
  const { idCompany } = useParams(); 
  const [company, setCompany] = useState({
    name: '',
    location: '',
    images: '',
    description: '',
    website: '',
    industry: '',
    companySize: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log("IDD",idCompany)
  useEffect(() => {
    if (idCompany) {
      const fetchCompany = async () => {
        try {
          const response = await getCompanyById(idCompany); 
          setCompany(response.data); 
        } catch (err) {
          setError('Không thể tải dữ liệu công ty');
          console.error(err);
        }
      };
      fetchCompany();
    }
  }, [idCompany]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const { data, error } = await addCompany(company);

    if (error) {
      setError('Thêm công ty thất bại');
      console.error(error);
      setIsSubmitting(false);
      return;
    }

    console.log('Công ty đã được thêm thành công:', data);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Công ty của tôi</h2>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        {/* Các trường dữ liệu */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tên Công Ty</label>
          <input
            type="text"
            name="name"
            value={company.name}
            onChange={handleInputChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
          <input
            type="text"
            name="location"
            value={company.location}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Ảnh (URL)</label>
          <input
            type="text"
            name="images"
            value={company.images}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Mô tả</label>
          <textarea
            name="description"
            value={company.description}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Website</label>
          <input
            type="url"
            name="website"
            value={company.website}
            onChange={handleInputChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Ngành nghề</label>
          <input
            type="text"
            name="industry"
            value={company.industry}
            onChange={handleInputChange}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Quy mô công ty</label>
          <input
            type="number"
            name="companySize"
            value={company.companySize}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4 text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Đang tạo...' : 'Thêm Công Ty'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCompany;
